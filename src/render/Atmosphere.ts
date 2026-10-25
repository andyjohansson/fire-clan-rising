import * as THREE from 'three';
import { setFoliageMood } from './foliage';
import { Mood } from './moods';
import { SkyDome } from './SkyDome';

const SHADOW_MAP_SIZE = 2048;
// How far the sun sits from the area it lights; the shadow camera's depth range is twice this
const SUN_DISTANCE = 120;
// Extra shadow coverage around the visible ground, for tall objects at the screen edges
const SHADOW_MARGIN = 6;
// The shadow area grows in steps, so the texel size only changes now and then while zooming
const SHADOW_RADIUS_STEP = 4;

const NDC_CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];

// Sun, ambient light, sky and haze for the game world, driven by the active mood
export class Atmosphere {
	private readonly sun: THREE.DirectionalLight;
	private readonly hemisphere: THREE.HemisphereLight;
	private readonly sky = new SkyDome();
	private readonly fog = new THREE.Fog(0x000000);
	// Unit vector pointing from the ground towards the sun
	private readonly sunDirection = new THREE.Vector3();
	private mood!: Mood;

	// Scratch objects reused every frame
	private readonly corner = new THREE.Vector3();
	private readonly centre = new THREE.Vector3();
	private readonly groundPoints = [0, 1, 2, 3].map(() => new THREE.Vector3());
	private readonly lightRight = new THREE.Vector3();
	private readonly lightUp = new THREE.Vector3();
	private readonly lightForward = new THREE.Vector3();

	constructor(scene: THREE.Scene, mood: Mood) {
		this.hemisphere = new THREE.HemisphereLight();
		this.sun = new THREE.DirectionalLight();
		this.sun.castShadow = true;
		this.sun.shadow.mapSize.set(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
		this.sun.shadow.camera.near = 1;
		this.sun.shadow.camera.far = SUN_DISTANCE * 2;
		this.sun.shadow.bias = -0.0004;
		this.sun.shadow.normalBias = 0.03;
		this.sun.shadow.radius = 3;

		scene.fog = this.fog;
		scene.add(this.hemisphere, this.sun, this.sun.target, this.sky.mesh);
		this.setMood(mood);
	}

	get currentMood(): Mood {
		return this.mood;
	}

	// Exposure, saturation and vignette are applied by the renderer and post-processing
	setMood(mood: Mood): void {
		this.mood = mood;
		const elevation = THREE.MathUtils.degToRad(mood.sun.elevation);
		const azimuth = THREE.MathUtils.degToRad(mood.sun.azimuth);
		this.sunDirection.set(
			Math.cos(elevation) * Math.cos(azimuth),
			Math.sin(elevation),
			Math.cos(elevation) * Math.sin(azimuth),
		);
		this.sun.color.set(mood.sun.color);
		this.sun.intensity = mood.sun.intensity;
		this.hemisphere.color.set(mood.hemisphere.sky);
		this.hemisphere.groundColor.set(mood.hemisphere.ground);
		this.hemisphere.intensity = mood.hemisphere.intensity;
		this.fog.color.set(mood.sky.horizon);
		this.sky.setMood(mood, this.sunDirection);
		setFoliageMood(mood, this.sunDirection);

		// Light-space axes, used to snap the shadow camera to whole shadow-map texels
		this.lightForward.copy(this.sunDirection).negate();
		this.lightRight.crossVectors(this.lightForward, THREE.Object3D.DEFAULT_UP).normalize();
		this.lightUp.crossVectors(this.lightRight, this.lightForward);
	}

	// Call every frame after the camera has moved. `distance` is the camera's distance to its target.
	update(camera: THREE.PerspectiveCamera, distance: number): void {
		this.sky.follow(camera);
		this.fog.near = distance * this.mood.haze.near;
		this.fog.far = distance * this.mood.haze.far;
		this.fitShadowToView(camera);
	}

	// Shadows only cover what the camera sees, so they stay sharp however large the map is
	private fitShadowToView(camera: THREE.PerspectiveCamera): void {
		// Where the corners of the screen hit the ground
		this.centre.set(0, 0, 0);
		NDC_CORNERS.forEach(([x, y], index) => {
			this.corner.set(x, y, 1).unproject(camera).sub(camera.position);
			// Rays that miss the ground, or hit it far away, are cut off at the haze distance
			const hazeLimit = this.fog.far / this.corner.length();
			const t = this.corner.y < 0 ? Math.min(-camera.position.y / this.corner.y, hazeLimit) : hazeLimit;
			const point = this.groundPoints[index].copy(camera.position).addScaledVector(this.corner, t);
			this.centre.add(point);
		});
		this.centre.multiplyScalar(0.25);

		let radius = 0;
		for (const point of this.groundPoints) radius = Math.max(radius, point.distanceTo(this.centre));
		radius = Math.ceil((radius + SHADOW_MARGIN) / SHADOW_RADIUS_STEP) * SHADOW_RADIUS_STEP;

		// Snap the centre to whole texels, so shadow edges do not shimmer while panning
		const texel = (radius * 2) / SHADOW_MAP_SIZE;
		const right = Math.round(this.centre.dot(this.lightRight) / texel) * texel;
		const up = Math.round(this.centre.dot(this.lightUp) / texel) * texel;
		const forward = this.centre.dot(this.lightForward);
		this.centre
			.copy(this.lightRight).multiplyScalar(right)
			.addScaledVector(this.lightUp, up)
			.addScaledVector(this.lightForward, forward);

		this.sun.target.position.copy(this.centre);
		this.sun.position.copy(this.centre).addScaledVector(this.sunDirection, SUN_DISTANCE);
		this.sun.target.updateMatrixWorld();

		const shadowCamera = this.sun.shadow.camera;
		if (shadowCamera.right !== radius) {
			shadowCamera.left = -radius;
			shadowCamera.right = radius;
			shadowCamera.top = radius;
			shadowCamera.bottom = -radius;
			shadowCamera.updateProjectionMatrix();
		}
	}
}
