// Terrain shape. All heights come from analytic functions, so the terrain mesh,
// the walkability grid and unit placement always agree with each other.

import { clamp, lerp, smoothstep } from '../utils/math';

export const MAP_SIZE = 96;

export const NINJA_VALLEY = { x: 16, z: 80 };
export const DRAGON_MOUNTAIN = { x: 80, z: 16 };

const PLATEAU_HEIGHT = 10;
const PLATEAU_RADIUS = 10;
const CLIFF_RADIUS = 14;
const RAMP_LENGTH = 20;
const RAMP_HALF_WIDTH = 3.5;

// The mountain path points from the summit towards the map centre
const RAMP_DIR = (() => {
	const dx = MAP_SIZE / 2 - DRAGON_MOUNTAIN.x;
	const dz = MAP_SIZE / 2 - DRAGON_MOUNTAIN.z;
	const length = Math.hypot(dx, dz);
	return { x: dx / length, z: dz / length };
})();

const RIVER_HALF_WIDTH = 3;
const RIVER_BED = -0.8;
export const WATER_LEVEL = -0.25;

export const BRIDGE_DECK = 0.45;
export const BRIDGE_HALF_LENGTH = 5.5;
export const BRIDGE_HALF_WIDTH = 1.5;
// Bridge positions measured along the river
const BRIDGE_POSITIONS = [40, 96];

// The river runs along the diagonal x = z with a gentle wiggle.
// t = distance along the river, u = signed distance across it.
function toRiverSpace(x: number, z: number) {
	return { t: (x + z) * Math.SQRT1_2, u: (x - z) * Math.SQRT1_2 };
}

function fromRiverSpace(t: number, u: number) {
	return { x: (t + u) * Math.SQRT1_2, z: (t - u) * Math.SQRT1_2 };
}

function riverWiggle(t: number): number {
	return 3 * Math.sin(t * 0.08);
}

export function riverDistance(x: number, z: number): number {
	const { t, u } = toRiverSpace(x, z);
	return Math.abs(u + riverWiggle(t));
}

export function isRiver(x: number, z: number): boolean {
	return riverDistance(x, z) < RIVER_HALF_WIDTH + 0.3;
}

export function bridgeCenters(): { x: number; z: number }[] {
	return BRIDGE_POSITIONS.map((t) => fromRiverSpace(t, -riverWiggle(t)));
}

export function isOnBridge(x: number, z: number): boolean {
	const { t, u } = toRiverSpace(x, z);
	return BRIDGE_POSITIONS.some((t0) => {
		const u0 = -riverWiggle(t0);
		return Math.abs(t - t0) < BRIDGE_HALF_WIDTH && Math.abs(u - u0) < BRIDGE_HALF_LENGTH;
	});
}

function mountainHeight(x: number, z: number): number {
	const dx = x - DRAGON_MOUNTAIN.x;
	const dz = z - DRAGON_MOUNTAIN.z;
	const distance = Math.hypot(dx, dz);
	const cliff = PLATEAU_HEIGHT * (1 - smoothstep(PLATEAU_RADIUS, CLIFF_RADIUS, distance));

	// Narrow ramp leading up to the plateau
	const along = dx * RAMP_DIR.x + dz * RAMP_DIR.z;
	const lateral = Math.abs(dx * RAMP_DIR.z - dz * RAMP_DIR.x);
	let ramp = 0;
	if (along > 0 && lateral < RAMP_HALF_WIDTH) {
		ramp = PLATEAU_HEIGHT * clamp(1 - (along - PLATEAU_RADIUS) / RAMP_LENGTH, 0, 1);
	}
	return Math.max(cliff, ramp);
}

// Gentle rolling hills, never below the water level
function rollingHills(x: number, z: number): number {
	return 0.25 * (1 + Math.sin(x * 0.13) * Math.cos(z * 0.11)) + 0.1 * (1 + Math.sin((x + z) * 0.31));
}

export function terrainHeight(x: number, z: number): number {
	const height = mountainHeight(x, z) + rollingHills(x, z);
	const riverAmount = 1 - smoothstep(RIVER_HALF_WIDTH - 0.5, RIVER_HALF_WIDTH + 1.5, riverDistance(x, z));
	return lerp(height, RIVER_BED, riverAmount);
}

// Height a unit stands on (bridges included)
export function walkHeight(x: number, z: number): number {
	const ground = terrainHeight(x, z);
	return isOnBridge(x, z) ? Math.max(ground, BRIDGE_DECK) : ground;
}
