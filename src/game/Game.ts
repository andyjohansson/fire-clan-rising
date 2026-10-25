import * as THREE from 'three';
import { CameraController } from '../render/CameraController';
import { createRenderer, createScene } from '../render/createScene';
import { SelectionController } from '../input/SelectionController';
import { Unit } from '../units/Unit';
import { createNinjaModel } from '../units/ninjaModel';
import { GameMap } from '../world/GameMap';
import { createMapMeshes } from '../world/mapMeshes';
import { Point, findPath } from '../world/pathfinding';
import { NINJA_VALLEY, walkHeight } from '../world/terrain';

const STARTING_NINJAS = 5;
const FORMATION_SPACING = 1.0;

export class Game {
	private readonly renderer: THREE.WebGLRenderer;
	private readonly scene: THREE.Scene;
	private readonly cameraController: CameraController;
	private readonly map = new GameMap();
	private readonly units: Unit[] = [];
	private readonly moveMarker: THREE.Mesh;
	private markerTime = Infinity;
	private lastTime = performance.now();

	constructor(container: HTMLElement, selectionBox: HTMLElement) {
		this.renderer = createRenderer(container);
		this.scene = createScene(this.map.size);
		this.cameraController = new CameraController(this.renderer.domElement, this.map.size, NINJA_VALLEY);

		const mapMeshes = createMapMeshes(this.map);
		this.scene.add(mapMeshes.group);

		for (let n = 0; n < STARTING_NINJAS; n++) {
			const angle = (n / STARTING_NINJAS) * Math.PI * 2;
			this.addUnit(new Unit(createNinjaModel(), {
				x: NINJA_VALLEY.x + Math.cos(angle) * 2,
				z: NINJA_VALLEY.z + Math.sin(angle) * 2,
			}));
		}

		this.moveMarker = new THREE.Mesh(
			new THREE.RingGeometry(0.3, 0.45, 24),
			new THREE.MeshBasicMaterial({ color: 0x5dff7a, transparent: true, depthWrite: false }),
		);
		this.moveMarker.rotation.x = -Math.PI / 2;
		this.moveMarker.visible = false;
		this.scene.add(this.moveMarker);

		new SelectionController({
			element: this.renderer.domElement,
			camera: this.cameraController.camera,
			units: () => this.units,
			ground: mapMeshes.terrain,
			selectionBox,
			onMove: (units, target) => this.moveUnits(units, target),
		});

		window.addEventListener('resize', () => this.resize());
		this.resize();
	}

	start(): void {
		this.renderer.setAnimationLoop(() => this.tick());
	}

	private addUnit(unit: Unit): void {
		this.units.push(unit);
		this.scene.add(unit.object);
	}

	// Sends units to a target, spreading them out in a loose formation around it
	private moveUnits(units: Unit[], target: Point): void {
		const slots = this.formationSlots(target, units.length);
		const remaining = [...units];
		for (const slot of slots) {
			// Give each slot to the closest unit still without one
			let bestIndex = 0;
			let bestDistance = Infinity;
			remaining.forEach((unit, index) => {
				const distance = Math.hypot(unit.position.x - slot.x, unit.position.z - slot.z);
				if (distance < bestDistance) {
					bestDistance = distance;
					bestIndex = index;
				}
			});
			const [unit] = remaining.splice(bestIndex, 1);
			unit.followPath(findPath(this.map, unit.position, slot));
		}

		this.moveMarker.position.set(target.x, walkHeight(target.x, target.z) + 0.05, target.z);
		this.markerTime = 0;
	}

	private formationSlots(target: Point, count: number): Point[] {
		if (count === 1) return [target];
		const slots: Point[] = [];
		const taken = new Set<number>();
		const centre = this.map.worldToCell(target.x, target.z);
		const start = this.map.nearestWalkableCell(centre.i, centre.j);
		if (!start) return Array(count).fill(target);

		// Grow outwards from the target, picking free walkable cells
		const side = Math.ceil(Math.sqrt(count)) + 4;
		const candidates: { x: number; z: number; distance: number }[] = [];
		for (let dj = -side; dj <= side; dj++) {
			for (let di = -side; di <= side; di++) {
				const x = target.x + di * FORMATION_SPACING;
				const z = target.z + dj * FORMATION_SPACING;
				candidates.push({ x, z, distance: di * di + dj * dj });
			}
		}
		candidates.sort((a, b) => a.distance - b.distance);
		for (const candidate of candidates) {
			if (slots.length === count) break;
			if (!this.map.isWalkableAt(candidate.x, candidate.z)) continue;
			const cell = this.map.worldToCell(candidate.x, candidate.z);
			const key = this.map.index(cell.i, cell.j);
			if (taken.has(key)) continue;
			taken.add(key);
			slots.push({ x: candidate.x, z: candidate.z });
		}
		while (slots.length < count) slots.push(target);
		return slots;
	}

	// Keeps units from standing inside each other
	private separateUnits(): void {
		for (let a = 0; a < this.units.length; a++) {
			for (let b = a + 1; b < this.units.length; b++) {
				const first = this.units[a];
				const second = this.units[b];
				const dx = second.position.x - first.position.x;
				const dz = second.position.z - first.position.z;
				const distance = Math.hypot(dx, dz) || 0.001;
				const overlap = first.radius + second.radius - distance;
				if (overlap <= 0) continue;
				const push = (overlap / 2) * 0.5;
				first.nudge((-dx / distance) * push, (-dz / distance) * push, this.map);
				second.nudge((dx / distance) * push, (dz / distance) * push, this.map);
			}
		}
	}

	private tick(): void {
		const now = performance.now();
		const dt = Math.min((now - this.lastTime) / 1000, 0.05);
		this.lastTime = now;

		this.cameraController.update(dt);
		for (const unit of this.units) unit.update(dt);
		this.separateUnits();
		this.updateMoveMarker(dt);

		this.renderer.render(this.scene, this.cameraController.camera);
	}

	private updateMoveMarker(dt: number): void {
		this.markerTime += dt;
		const duration = 0.6;
		this.moveMarker.visible = this.markerTime < duration;
		if (!this.moveMarker.visible) return;
		const progress = this.markerTime / duration;
		this.moveMarker.scale.setScalar(1.4 - progress * 0.8);
		(this.moveMarker.material as THREE.MeshBasicMaterial).opacity = 1 - progress;
	}

	private resize(): void {
		const width = window.innerWidth;
		const height = window.innerHeight;
		this.renderer.setSize(width, height);
		this.cameraController.resize(width, height);
	}
}
