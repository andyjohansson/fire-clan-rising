import * as THREE from 'three';
import { Mood } from './moods';

// Must stay inside the camera's far plane
const RADIUS = 400;

const vertexShader = /* glsl */ `
	varying vec3 vDirection;
	void main() {
		vDirection = normalize(position);
		vec4 worldPosition = modelMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * viewMatrix * worldPosition;
		gl_Position.z = gl_Position.w; // always at the far plane
	}
`;

const fragmentShader = /* glsl */ `
	uniform vec3 zenith;
	uniform vec3 horizon;
	uniform vec3 sunGlow;
	uniform vec3 sunDirection;
	varying vec3 vDirection;
	void main() {
		vec3 direction = normalize(vDirection);
		float height = direction.y;
		vec3 color = mix(horizon, zenith, pow(max(height, 0.0), 0.6));
		// Warm glow towards the sun, strongest near the horizon. Below the horizon the sky
		// stays the haze colour, so the edge of the map fades into it evenly.
		float glow = pow(max(dot(direction, sunDirection), 0.0), 6.0);
		color = mix(color, sunGlow, glow * (1.0 - height) * step(0.0, height) * 0.8);
		gl_FragColor = vec4(color, 1.0);
	}
`;

// Gradient sky around the camera: deep zenith, hazy horizon, glow towards the sun
export class SkyDome {
	readonly mesh: THREE.Mesh;
	private readonly material: THREE.ShaderMaterial;

	constructor() {
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				zenith: { value: new THREE.Color() },
				horizon: { value: new THREE.Color() },
				sunGlow: { value: new THREE.Color() },
				sunDirection: { value: new THREE.Vector3(0, 1, 0) },
			},
			vertexShader,
			fragmentShader,
			side: THREE.BackSide,
			depthWrite: false,
			fog: false,
		});
		this.mesh = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 32, 16), this.material);
		this.mesh.renderOrder = -1;
		this.mesh.frustumCulled = false;
	}

	setMood(mood: Mood, sunDirection: THREE.Vector3): void {
		const uniforms = this.material.uniforms;
		uniforms.zenith.value.set(mood.sky.zenith);
		uniforms.horizon.value.set(mood.sky.horizon);
		uniforms.sunGlow.value.set(mood.sky.sunGlow);
		uniforms.sunDirection.value.copy(sunDirection);
	}

	// Keeps the sky centred on the camera so it never comes closer
	follow(camera: THREE.Camera): void {
		this.mesh.position.copy(camera.position);
	}
}
