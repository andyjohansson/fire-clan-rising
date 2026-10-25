export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
	const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
	return t * t * (3 - 2 * t);
}

// Small deterministic random generator (mulberry32), so the map looks the same every time
export function createRandom(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
