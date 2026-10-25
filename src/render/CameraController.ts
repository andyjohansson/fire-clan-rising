import * as THREE from 'three';
import { clamp } from '../utils/math';

const PITCH = THREE.MathUtils.degToRad(55);
// Looking from the ninja corner towards the dragon mountain
const YAW = Math.PI / 4;
const MIN_DISTANCE = 15;
const MAX_DISTANCE = 75;
const EDGE_SCROLL_MARGIN = 12;

// RTS camera: fixed angle, pans with keys or screen edges, zooms with the wheel
export class CameraController {
	readonly camera: THREE.PerspectiveCamera;
	private readonly target = new THREE.Vector3();
	private distance = 40;
	private readonly keys = new Set<string>();
	private mouse: { x: number; y: number } | null = null;

	// Screen-aligned pan directions on the ground plane
	private readonly forward = new THREE.Vector3(Math.sin(YAW), 0, -Math.cos(YAW));
	private readonly right = new THREE.Vector3(Math.cos(YAW), 0, Math.sin(YAW));

	constructor(
		private readonly element: HTMLElement,
		private readonly mapSize: number,
		start: { x: number; z: number },
	) {
		this.camera = new THREE.PerspectiveCamera(45, 1, 0.5, 500);
		this.target.set(start.x, 0, start.z);

		window.addEventListener('keydown', (event) => this.keys.add(event.key.toLowerCase()));
		window.addEventListener('keyup', (event) => this.keys.delete(event.key.toLowerCase()));
		window.addEventListener('blur', () => this.keys.clear());
		element.addEventListener('mousemove', (event) => (this.mouse = { x: event.clientX, y: event.clientY }));
		element.addEventListener('mouseleave', () => (this.mouse = null));
		element.addEventListener('wheel', (event) => {
			event.preventDefault();
			this.distance = clamp(this.distance * (1 + Math.sign(event.deltaY) * 0.1), MIN_DISTANCE, MAX_DISTANCE);
		}, { passive: false });

		this.applyTransform();
	}

	// Distance from the camera to the point it looks at
	get zoomDistance(): number {
		return this.distance;
	}

	resize(width: number, height: number): void {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
	}

	update(dt: number): void {
		let moveForward = 0;
		let moveRight = 0;
		if (this.keys.has('w') || this.keys.has('arrowup')) moveForward += 1;
		if (this.keys.has('s') || this.keys.has('arrowdown')) moveForward -= 1;
		if (this.keys.has('d') || this.keys.has('arrowright')) moveRight += 1;
		if (this.keys.has('a') || this.keys.has('arrowleft')) moveRight -= 1;

		if (this.mouse) {
			const { clientWidth, clientHeight } = this.element;
			if (this.mouse.y < EDGE_SCROLL_MARGIN) moveForward += 1;
			if (this.mouse.y > clientHeight - EDGE_SCROLL_MARGIN) moveForward -= 1;
			if (this.mouse.x > clientWidth - EDGE_SCROLL_MARGIN) moveRight += 1;
			if (this.mouse.x < EDGE_SCROLL_MARGIN) moveRight -= 1;
		}

		// Pan faster when zoomed out
		const speed = this.distance * 0.9 * dt;
		this.target.addScaledVector(this.forward, clamp(moveForward, -1, 1) * speed);
		this.target.addScaledVector(this.right, clamp(moveRight, -1, 1) * speed);
		this.target.x = clamp(this.target.x, 0, this.mapSize);
		this.target.z = clamp(this.target.z, 0, this.mapSize);

		this.applyTransform();
	}

	private applyTransform(): void {
		const horizontal = Math.cos(PITCH) * this.distance;
		this.camera.position.set(
			this.target.x - this.forward.x * horizontal,
			this.target.y + Math.sin(PITCH) * this.distance,
			this.target.z - this.forward.z * horizontal,
		);
		this.camera.lookAt(this.target);
	}
}
