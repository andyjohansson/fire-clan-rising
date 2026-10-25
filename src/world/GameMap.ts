import { createRandom } from '../utils/math';
import {
	MAP_SIZE,
	NINJA_VALLEY,
	DRAGON_MOUNTAIN,
	bridgeCenters,
	isOnBridge,
	isRiver,
	walkHeight,
} from './terrain';

// Maximum height difference between neighbouring cells that a unit can walk
const MAX_STEP = 0.7;

export type TreeKind = 'pine' | 'common';

export interface Tree {
	x: number;
	z: number;
	kind: TreeKind;
	// Picks one of the model variants for this kind of tree
	variantSeed: number;
	scale: number;
	rotation: number;
}

export interface Cell {
	i: number;
	j: number;
}

// The map is divided into 1x1 cells. Each cell is either walkable or blocked.
export class GameMap {
	readonly size = MAP_SIZE;
	readonly walkable: Uint8Array;
	readonly trees: Tree[] = [];

	constructor(seed = 1) {
		this.walkable = new Uint8Array(this.size * this.size);
		this.computeWalkability();
		this.placeTrees(seed);
	}

	index(i: number, j: number): number {
		return j * this.size + i;
	}

	inBounds(i: number, j: number): boolean {
		return i >= 0 && j >= 0 && i < this.size && j < this.size;
	}

	isWalkableCell(i: number, j: number): boolean {
		return this.inBounds(i, j) && this.walkable[this.index(i, j)] === 1;
	}

	isWalkableAt(x: number, z: number): boolean {
		return this.isWalkableCell(Math.floor(x), Math.floor(z));
	}

	worldToCell(x: number, z: number): Cell {
		return { i: Math.floor(x), j: Math.floor(z) };
	}

	cellCenter(i: number, j: number): { x: number; z: number } {
		return { x: i + 0.5, z: j + 0.5 };
	}

	// Finds the closest walkable cell by searching outwards in growing rings
	nearestWalkableCell(i: number, j: number): Cell | null {
		if (this.isWalkableCell(i, j)) return { i, j };
		for (let radius = 1; radius < this.size; radius++) {
			let best: Cell | null = null;
			let bestDistance = Infinity;
			for (let dj = -radius; dj <= radius; dj++) {
				for (let di = -radius; di <= radius; di++) {
					if (Math.max(Math.abs(di), Math.abs(dj)) !== radius) continue;
					const ci = i + di;
					const cj = j + dj;
					if (!this.isWalkableCell(ci, cj)) continue;
					const distance = di * di + dj * dj;
					if (distance < bestDistance) {
						bestDistance = distance;
						best = { i: ci, j: cj };
					}
				}
			}
			if (best) return best;
		}
		return null;
	}

	private computeWalkability(): void {
		const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];
		for (let j = 0; j < this.size; j++) {
			for (let i = 0; i < this.size; i++) {
				const { x, z } = this.cellCenter(i, j);
				let walkable = true;
				if (isOnBridge(x, z)) {
					walkable = true;
				} else if (isRiver(x, z)) {
					walkable = false;
				} else {
					// Too steep to walk (cliffs, ramp edges)
					const height = walkHeight(x, z);
					for (const [di, dj] of neighbours) {
						if (!this.inBounds(i + di, j + dj)) continue;
						if (Math.abs(walkHeight(x + di, z + dj) - height) > MAX_STEP) {
							walkable = false;
							break;
						}
					}
				}
				this.walkable[this.index(i, j)] = walkable ? 1 : 0;
			}
		}
	}

	private placeTrees(seed: number): void {
		const random = createRandom(seed);
		const centre = this.size / 2;
		const bridges = bridgeCenters();

		for (let attempt = 0; attempt < 2500; attempt++) {
			const i = Math.floor(random() * this.size);
			const j = Math.floor(random() * this.size);
			if (!this.isWalkableCell(i, j)) continue;
			const { x, z } = this.cellCenter(i, j);

			// Dense forest in the middle of the map, a few scattered trees elsewhere
			const distanceToCentre = Math.hypot(x - centre, z - centre);
			const density = distanceToCentre < 34 ? 0.6 * (1 - distanceToCentre / 34) + 0.05 : 0.04;
			if (random() > density) continue;

			// Keep bases, the mountain path and bridge approaches clear
			if (Math.hypot(x - NINJA_VALLEY.x, z - NINJA_VALLEY.z) < 20) continue;
			if (Math.hypot(x - DRAGON_MOUNTAIN.x, z - DRAGON_MOUNTAIN.z) < 32) continue;
			if (bridges.some((b) => Math.hypot(x - b.x, z - b.z) < 7)) continue;

			this.walkable[this.index(i, j)] = 0;
			this.trees.push({
				x,
				z,
				kind: random() < 0.6 ? 'pine' : 'common',
				variantSeed: Math.floor(random() * 1000),
				scale: 0.8 + random() * 0.4,
				rotation: random() * Math.PI * 2,
			});
		}
	}
}
