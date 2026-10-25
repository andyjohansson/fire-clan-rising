import * as THREE from 'three';
import { GameMap } from '../world/GameMap';
import { Point } from '../world/pathfinding';
import { walkHeight } from '../world/terrain';

const ARRIVE_DISTANCE = 0.1;
const TURN_SPEED = 12;

export class Unit {
	readonly object = new THREE.Group();
	readonly radius = 0.35;
	readonly speed = 4;
	readonly position: Point;
	selected = false;

	private path: Point[] = [];
	private readonly selectionRing: THREE.Mesh;
	private readonly model: THREE.Object3D;
	private walkTime = 0;

	constructor(model: THREE.Object3D, start: Point) {
		this.model = model;
		this.object.add(model);
		this.position = { x: start.x, z: start.z };

		this.selectionRing = new THREE.Mesh(
			new THREE.RingGeometry(0.42, 0.52, 24),
			new THREE.MeshBasicMaterial({ color: 0x5dff7a, transparent: true, opacity: 0.9, depthWrite: false }),
		);
		this.selectionRing.rotation.x = -Math.PI / 2;
		this.selectionRing.position.y = 0.05;
		this.selectionRing.visible = false;
		this.object.add(this.selectionRing);

		this.syncObject();
	}

	get isMoving(): boolean {
		return this.path.length > 0;
	}

	setSelected(selected: boolean): void {
		this.selected = selected;
		this.selectionRing.visible = selected;
	}

	followPath(path: Point[]): void {
		this.path = path;
	}

	update(dt: number): void {
		if (this.path.length > 0) {
			const target = this.path[0];
			const dx = target.x - this.position.x;
			const dz = target.z - this.position.z;
			const distance = Math.hypot(dx, dz);
			const step = this.speed * dt;

			if (distance <= Math.max(step, ARRIVE_DISTANCE)) {
				this.position.x = target.x;
				this.position.z = target.z;
				this.path.shift();
			} else {
				this.position.x += (dx / distance) * step;
				this.position.z += (dz / distance) * step;
			}
			this.turnTowards(Math.atan2(dx, dz), dt);
			this.walkTime += dt;
		} else {
			this.walkTime = 0;
		}
		this.syncObject();
	}

	// Pushes the unit aside (used to keep units from standing inside each other)
	nudge(dx: number, dz: number, map: GameMap): void {
		const x = this.position.x + dx;
		const z = this.position.z + dz;
		if (map.isWalkableAt(x, z)) {
			this.position.x = x;
			this.position.z = z;
		}
	}

	private turnTowards(angle: number, dt: number): void {
		let delta = angle - this.object.rotation.y;
		delta = Math.atan2(Math.sin(delta), Math.cos(delta));
		this.object.rotation.y += delta * Math.min(1, TURN_SPEED * dt);
	}

	private syncObject(): void {
		this.object.position.set(this.position.x, walkHeight(this.position.x, this.position.z), this.position.z);
		// Small hop while walking
		this.model.position.y = Math.abs(Math.sin(this.walkTime * 12)) * 0.08;
	}
}
