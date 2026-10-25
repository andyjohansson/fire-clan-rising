import * as THREE from 'three';
import { Unit } from '../units/Unit';
import { Point } from '../world/pathfinding';

const DRAG_THRESHOLD = 5;
const CLICK_RADIUS = 28;

interface Options {
	element: HTMLElement;
	camera: THREE.Camera;
	units: () => Unit[];
	ground: THREE.Object3D;
	selectionBox: HTMLElement;
	onMove: (units: Unit[], target: Point) => void;
}

// StarCraft-style controls: left click / drag to select, right click to move
export class SelectionController {
	private dragStart: { x: number; y: number } | null = null;
	private dragging = false;
	private readonly raycaster = new THREE.Raycaster();

	constructor(private readonly options: Options) {
		const { element } = options;
		element.addEventListener('contextmenu', (event) => event.preventDefault());
		element.addEventListener('mousedown', (event) => this.onMouseDown(event));
		window.addEventListener('mousemove', (event) => this.onMouseMove(event));
		window.addEventListener('mouseup', (event) => this.onMouseUp(event));
	}

	get selected(): Unit[] {
		return this.options.units().filter((unit) => unit.selected);
	}

	private onMouseDown(event: MouseEvent): void {
		if (event.button === 0) {
			this.dragStart = { x: event.clientX, y: event.clientY };
			this.dragging = false;
		} else if (event.button === 2) {
			const selected = this.selected;
			const target = this.pickGround(event.clientX, event.clientY);
			if (selected.length > 0 && target) this.options.onMove(selected, target);
		}
	}

	private onMouseMove(event: MouseEvent): void {
		if (!this.dragStart) return;
		const dx = event.clientX - this.dragStart.x;
		const dy = event.clientY - this.dragStart.y;
		if (!this.dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) this.dragging = true;
		if (this.dragging) this.updateBox(this.dragStart, { x: event.clientX, y: event.clientY });
	}

	private onMouseUp(event: MouseEvent): void {
		if (event.button !== 0 || !this.dragStart) return;
		const additive = event.shiftKey;
		const units = this.options.units();
		if (!additive) units.forEach((unit) => unit.setSelected(false));

		if (this.dragging) {
			const rect = toRect(this.dragStart, { x: event.clientX, y: event.clientY });
			for (const unit of units) {
				const screen = this.toScreen(unit);
				if (screen.x >= rect.left && screen.x <= rect.right && screen.y >= rect.top && screen.y <= rect.bottom) {
					unit.setSelected(true);
				}
			}
		} else {
			const clicked = this.unitAt(event.clientX, event.clientY);
			if (clicked) clicked.setSelected(additive ? !clicked.selected : true);
		}

		this.dragStart = null;
		this.dragging = false;
		this.options.selectionBox.style.display = 'none';
	}

	private unitAt(x: number, y: number): Unit | null {
		let best: Unit | null = null;
		let bestDistance = CLICK_RADIUS;
		for (const unit of this.options.units()) {
			const screen = this.toScreen(unit);
			const distance = Math.hypot(screen.x - x, screen.y - y);
			if (distance < bestDistance) {
				bestDistance = distance;
				best = unit;
			}
		}
		return best;
	}

	// Screen position of the middle of the unit's body
	private toScreen(unit: Unit): { x: number; y: number } {
		const point = unit.object.position.clone();
		point.y += 0.6;
		point.project(this.options.camera);
		const bounds = this.options.element.getBoundingClientRect();
		return {
			x: bounds.left + ((point.x + 1) / 2) * bounds.width,
			y: bounds.top + ((1 - point.y) / 2) * bounds.height,
		};
	}

	private pickGround(x: number, y: number): Point | null {
		const bounds = this.options.element.getBoundingClientRect();
		const ndc = new THREE.Vector2(
			((x - bounds.left) / bounds.width) * 2 - 1,
			-((y - bounds.top) / bounds.height) * 2 + 1,
		);
		this.raycaster.setFromCamera(ndc, this.options.camera);
		const hit = this.raycaster.intersectObject(this.options.ground, false)[0];
		return hit ? { x: hit.point.x, z: hit.point.z } : null;
	}

	private updateBox(a: { x: number; y: number }, b: { x: number; y: number }): void {
		const rect = toRect(a, b);
		const box = this.options.selectionBox;
		box.style.display = 'block';
		box.style.left = `${rect.left}px`;
		box.style.top = `${rect.top}px`;
		box.style.width = `${rect.right - rect.left}px`;
		box.style.height = `${rect.bottom - rect.top}px`;
	}
}

function toRect(a: { x: number; y: number }, b: { x: number; y: number }) {
	return {
		left: Math.min(a.x, b.x),
		right: Math.max(a.x, b.x),
		top: Math.min(a.y, b.y),
		bottom: Math.max(a.y, b.y),
	};
}
