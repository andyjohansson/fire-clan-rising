import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createRandom, lerp } from '../utils/math';

const EMBER_COUNT = 260;
const GLOW_COLOR = new THREE.Color(0xff7a1a);

// The loading screen's 3D scene: the Dragon King Egg cracking open as the game loads,
// with embers drifting up around it.
export class EggScene {
	private readonly renderer: THREE.WebGLRenderer;
	private readonly composer: EffectComposer;
	private readonly bloom: UnrealBloomPass;
	private readonly scene = new THREE.Scene();
	private readonly camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
	private readonly egg: THREE.Mesh;
	private readonly innerLight: THREE.PointLight;
	private readonly crackUniforms = { uProgress: { value: 0 }, uPulse: { value: 0 } };
	private readonly embers: THREE.Points;
	private readonly emberVelocities: Float32Array;
	private readonly emberPhases: Float32Array;
	private readonly random = createRandom(42);

	private progress = 0;
	private flare = 0;
	private time = 0;
	private lastFrame = performance.now();
	private running = true;

	constructor(private readonly container: HTMLElement) {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		container.appendChild(this.renderer.domElement);
		this.scene.background = createSkyTexture();

		this.camera.position.set(0, 0.4, 7);
		this.camera.lookAt(0, 0.2, 0);

		this.scene.add(new THREE.AmbientLight(0x6a5a8a, 0.6));
		const rim = new THREE.DirectionalLight(0x8fa8ff, 1.6);
		rim.position.set(-4, 3, -3);
		this.scene.add(rim);
		const key = new THREE.DirectionalLight(0xffc89a, 0.8);
		key.position.set(3, 2, 4);
		this.scene.add(key);

		this.egg = this.createEgg();
		this.scene.add(this.egg);

		this.innerLight = new THREE.PointLight(GLOW_COLOR, 0, 8, 1.5);
		this.innerLight.position.set(0, 0.2, 1.6);
		this.scene.add(this.innerLight);

		this.emberVelocities = new Float32Array(EMBER_COUNT);
		this.emberPhases = new Float32Array(EMBER_COUNT);
		this.embers = this.createEmbers();
		this.scene.add(this.embers);

		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.scene, this.camera));
		this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.1, 0.6, 0.15);
		this.composer.addPass(this.bloom);
		this.composer.addPass(new OutputPass());

		window.addEventListener('resize', this.resize);
		this.resize();
		this.renderer.setAnimationLoop(() => this.tick());
	}

	// Loading progress from 0 to 1; more cracks glow as it grows
	setProgress(progress: number): void {
		this.progress = progress;
	}

	// The egg flares up when everything has loaded
	flareUp(): void {
		this.flare = 1;
	}

	dispose(): void {
		this.running = false;
		this.renderer.setAnimationLoop(null);
		window.removeEventListener('resize', this.resize);
		this.scene.traverse((child) => {
			if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
				child.geometry.dispose();
				const materials = Array.isArray(child.material) ? child.material : [child.material];
				for (const material of materials) {
					for (const value of Object.values(material)) {
						if (value instanceof THREE.Texture) value.dispose();
					}
					material.dispose();
				}
			}
		});
		this.composer.dispose();
		this.renderer.dispose();
		this.renderer.domElement.remove();
	}

	private createEgg(): THREE.Mesh {
		// Egg profile: wider at the bottom, pointed at the top
		const points: THREE.Vector2[] = [];
		const segments = 48;
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const angle = t * Math.PI;
			const radius = Math.sin(angle) * (1 - 0.18 * t) * 1.15;
			points.push(new THREE.Vector2(Math.max(radius, 0.0001), -Math.cos(angle) * 1.55));
		}
		const geometry = new THREE.LatheGeometry(points, 96);

		const material = new THREE.MeshStandardMaterial({
			color: 0x2b1b2e,
			roughness: 0.45,
			metalness: 0.25,
			emissive: GLOW_COLOR,
			emissiveIntensity: 4,
			emissiveMap: createCrackTexture(),
		});

		// Only cracks whose "order" is below the loading progress glow
		material.onBeforeCompile = (shader) => {
			shader.uniforms.uProgress = this.crackUniforms.uProgress;
			shader.uniforms.uPulse = this.crackUniforms.uPulse;
			shader.fragmentShader = shader.fragmentShader
				.replace('#include <common>', '#include <common>\nuniform float uProgress;\nuniform float uPulse;')
				.replace(
					'#include <emissivemap_fragment>',
					`float crackOrder = texture2D( emissiveMap, vEmissiveMapUv ).r;
					float crackLit = crackOrder > 0.02 ? smoothstep( 1.0 - uProgress, 1.0 - uProgress + 0.08, crackOrder ) : 0.0;
					totalEmissiveRadiance *= crackLit * ( 0.8 + uPulse );`,
				);
		};

		const egg = new THREE.Mesh(geometry, material);
		egg.position.y = 0.2;
		return egg;
	}

	private createEmbers(): THREE.Points {
		const positions = new Float32Array(EMBER_COUNT * 3);
		for (let i = 0; i < EMBER_COUNT; i++) {
			this.resetEmber(positions, i, true);
		}
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const material = new THREE.PointsMaterial({
			color: 0xffa040,
			size: 0.09,
			map: createGlowSprite(),
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		});
		return new THREE.Points(geometry, material);
	}

	private resetEmber(positions: Float32Array, index: number, anywhere: boolean): void {
		positions[index * 3] = (this.random() - 0.5) * 12;
		positions[index * 3 + 1] = anywhere ? (this.random() - 0.5) * 8 : -4.5;
		positions[index * 3 + 2] = (this.random() - 0.5) * 6 - 1;
		this.emberVelocities[index] = 0.3 + this.random() * 0.7;
		this.emberPhases[index] = this.random() * Math.PI * 2;
	}

	private tick(): void {
		if (!this.running) return;
		const now = performance.now();
		const dt = Math.min((now - this.lastFrame) / 1000, 0.05);
		this.lastFrame = now;
		this.time += dt;

		// Ease the visible progress so cracks spread smoothly
		const target = this.progress;
		this.crackUniforms.uProgress.value = lerp(this.crackUniforms.uProgress.value, target, Math.min(1, dt * 3));
		this.flare = Math.max(0, this.flare - dt * 0.6);
		const glow = this.crackUniforms.uProgress.value;
		this.crackUniforms.uPulse.value = 0.25 * Math.sin(this.time * 3) * glow + this.flare * 2.5;

		this.egg.rotation.y += dt * 0.35;
		this.egg.position.y = 0.2 + Math.sin(this.time * 1.2) * 0.06;
		this.innerLight.intensity = glow * 6 + this.flare * 30;
		this.bloom.strength = 0.8 + glow * 0.6 + this.flare * 1.5;

		// Embers drift upwards with a gentle sway, faster as the egg awakens
		const positions = this.embers.geometry.attributes.position as THREE.BufferAttribute;
		const speedBoost = 1 + glow * 1.5 + this.flare * 4;
		for (let i = 0; i < EMBER_COUNT; i++) {
			positions.array[i * 3 + 1] += this.emberVelocities[i] * dt * speedBoost;
			positions.array[i * 3] += Math.sin(this.time * 1.5 + this.emberPhases[i]) * dt * 0.15;
			if (positions.array[i * 3 + 1] > 4.5) this.resetEmber(positions.array as Float32Array, i, false);
		}
		positions.needsUpdate = true;

		this.composer.render(dt);
	}

	private resize = (): void => {
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;
		this.renderer.setSize(width, height);
		this.composer.setSize(width, height);
		this.camera.aspect = width / height;
		// Keep the egg comfortably in view on narrow screens
		this.camera.position.z = width < height ? 12 : 8.8;
		this.camera.updateProjectionMatrix();
	};
}

// Draws branching cracks. Brightness encodes the order in which cracks light up:
// bright cracks appear first, dim ones last.
function createCrackTexture(): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = 1024;
	canvas.height = 512;
	const context = canvas.getContext('2d')!;
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.lineCap = 'round';
	context.lineJoin = 'round';

	const random = createRandom(7);
	const cracks = 26;
	for (let crack = 0; crack < cracks; crack++) {
		const order = crack / cracks;
		const brightness = Math.round(255 * (1 - order * 0.95));
		drawCrack(context, random, random() * canvas.width, canvas.height * (0.3 + random() * 0.45), brightness, 7 - order * 3, 3);
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.NoColorSpace;
	texture.wrapS = THREE.RepeatWrapping;
	return texture;
}

function drawCrack(
	context: CanvasRenderingContext2D,
	random: () => number,
	x: number,
	y: number,
	brightness: number,
	width: number,
	depth: number,
): void {
	let angle = random() * Math.PI * 2;
	const steps = 6 + Math.floor(random() * 8);
	context.strokeStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
	context.lineWidth = width;
	context.beginPath();
	context.moveTo(x, y);
	for (let step = 0; step < steps; step++) {
		angle += (random() - 0.5) * 1.2;
		x += Math.cos(angle) * 22;
		y += Math.sin(angle) * 14;
		context.lineTo(x, y);
		// Occasionally split into a thinner branch
		if (depth > 0 && random() < 0.25) {
			context.stroke();
			drawCrack(context, random, x, y, brightness, width * 0.6, depth - 1);
			context.strokeStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
			context.lineWidth = width;
			context.beginPath();
			context.moveTo(x, y);
		}
	}
	context.stroke();
}

// Night sky fading into a red glow at the bottom
function createSkyTexture(): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = 2;
	canvas.height = 512;
	const context = canvas.getContext('2d')!;
	const gradient = context.createLinearGradient(0, 0, 0, 512);
	gradient.addColorStop(0, '#07081a');
	gradient.addColorStop(0.55, '#1a1030');
	gradient.addColorStop(0.85, '#4a1414');
	gradient.addColorStop(1, '#8a2a0e');
	context.fillStyle = gradient;
	context.fillRect(0, 0, 2, 512);
	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	return texture;
}

function createGlowSprite(): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = 64;
	const context = canvas.getContext('2d')!;
	const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
	gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
	gradient.addColorStop(0.3, 'rgba(255, 200, 120, 0.8)');
	gradient.addColorStop(1, 'rgba(255, 120, 40, 0)');
	context.fillStyle = gradient;
	context.fillRect(0, 0, 64, 64);
	return new THREE.CanvasTexture(canvas);
}
