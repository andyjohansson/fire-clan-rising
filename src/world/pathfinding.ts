import { GameMap } from './GameMap';

export interface Point {
	x: number;
	z: number;
}

const DIRECTIONS = [
	[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
	[1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2],
];

// Finds a walkable path from start to goal using A* on the cell grid.
// Returns world-space waypoints (excluding the start), or an empty array if unreachable.
export function findPath(map: GameMap, start: Point, goal: Point): Point[] {
	const startCell = map.nearestWalkableCell(Math.floor(start.x), Math.floor(start.z));
	const goalCell = map.nearestWalkableCell(Math.floor(goal.x), Math.floor(goal.z));
	if (!startCell || !goalCell) return [];

	const size = map.size;
	const startIndex = map.index(startCell.i, startCell.j);
	const goalIndex = map.index(goalCell.i, goalCell.j);

	const cost = new Float32Array(size * size).fill(Infinity);
	const cameFrom = new Int32Array(size * size).fill(-1);
	const closed = new Uint8Array(size * size);
	const open = new MinHeap();

	const heuristic = (i: number, j: number) => {
		// Octile distance
		const dx = Math.abs(i - goalCell.i);
		const dz = Math.abs(j - goalCell.j);
		return dx + dz + (Math.SQRT2 - 2) * Math.min(dx, dz);
	};

	cost[startIndex] = 0;
	open.push(startIndex, heuristic(startCell.i, startCell.j));

	while (open.size > 0) {
		const current = open.pop();
		if (current === goalIndex) break;
		if (closed[current]) continue;
		closed[current] = 1;

		const ci = current % size;
		const cj = Math.floor(current / size);
		for (const [di, dj, stepCost] of DIRECTIONS) {
			const ni = ci + di;
			const nj = cj + dj;
			if (!map.isWalkableCell(ni, nj)) continue;
			// No cutting corners past blocked cells
			if (di !== 0 && dj !== 0 && (!map.isWalkableCell(ci + di, cj) || !map.isWalkableCell(ci, cj + dj))) continue;

			const neighbour = map.index(ni, nj);
			const newCost = cost[current] + stepCost;
			if (newCost < cost[neighbour]) {
				cost[neighbour] = newCost;
				cameFrom[neighbour] = current;
				open.push(neighbour, newCost + heuristic(ni, nj));
			}
		}
	}

	if (startIndex !== goalIndex && cameFrom[goalIndex] === -1) return [];

	// Walk back from the goal to build the cell path
	const cells: number[] = [];
	for (let index = goalIndex; index !== -1; index = cameFrom[index]) {
		cells.push(index);
		if (index === startIndex) break;
	}
	cells.reverse();

	const points = cells.map((index) => map.cellCenter(index % size, Math.floor(index / size)));
	// Use the exact goal position if it is walkable
	if (map.isWalkableAt(goal.x, goal.z)) points[points.length - 1] = { x: goal.x, z: goal.z };

	return smoothPath(map, start, points);
}

// Removes unnecessary zig-zag waypoints by skipping ahead while there is a clear line of sight
function smoothPath(map: GameMap, start: Point, points: Point[]): Point[] {
	const result: Point[] = [];
	let from = start;
	let index = 0;
	while (index < points.length) {
		let furthest = index;
		for (let next = points.length - 1; next > index; next--) {
			if (hasLineOfSight(map, from, points[next])) {
				furthest = next;
				break;
			}
		}
		result.push(points[furthest]);
		from = points[furthest];
		index = furthest + 1;
	}
	return result;
}

function hasLineOfSight(map: GameMap, a: Point, b: Point): boolean {
	const distance = Math.hypot(b.x - a.x, b.z - a.z);
	const steps = Math.ceil(distance / 0.2);
	for (let s = 1; s <= steps; s++) {
		const t = s / steps;
		if (!map.isWalkableAt(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t)) return false;
	}
	return true;
}

// Binary min-heap of cell indices ordered by priority
class MinHeap {
	private readonly items: number[] = [];
	private readonly priorities: number[] = [];

	get size(): number {
		return this.items.length;
	}

	push(item: number, priority: number): void {
		this.items.push(item);
		this.priorities.push(priority);
		let index = this.items.length - 1;
		while (index > 0) {
			const parent = (index - 1) >> 1;
			if (this.priorities[parent] <= this.priorities[index]) break;
			this.swap(index, parent);
			index = parent;
		}
	}

	pop(): number {
		const top = this.items[0];
		const lastItem = this.items.pop()!;
		const lastPriority = this.priorities.pop()!;
		if (this.items.length > 0) {
			this.items[0] = lastItem;
			this.priorities[0] = lastPriority;
			let index = 0;
			for (;;) {
				const left = index * 2 + 1;
				const right = left + 1;
				let smallest = index;
				if (left < this.items.length && this.priorities[left] < this.priorities[smallest]) smallest = left;
				if (right < this.items.length && this.priorities[right] < this.priorities[smallest]) smallest = right;
				if (smallest === index) break;
				this.swap(index, smallest);
				index = smallest;
			}
		}
		return top;
	}

	private swap(a: number, b: number): void {
		[this.items[a], this.items[b]] = [this.items[b], this.items[a]];
		[this.priorities[a], this.priorities[b]] = [this.priorities[b], this.priorities[a]];
	}
}
