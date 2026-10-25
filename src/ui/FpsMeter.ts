import * as THREE from 'three';

// How often the numbers are refreshed, so they stay readable instead of flickering
const REFRESH_INTERVAL = 500;
// Common display refresh rates; the measured rate is snapped to the closest one
const DISPLAY_RATES = [30, 50, 60, 72, 75, 90, 100, 120, 144, 165, 240];
// A frame "lands on" a rate when its interval is this close to the rate's period
const RATE_TOLERANCE = 0.1;
// Share of frames that must land on a rate before it is trusted
const MIN_ON_RATE = 0.25;
// Share of the display's refresh rate needed for each rating
const SMOOTH_SHARE = 0.9;
const OK_SHARE = 0.5;

// Performance overlay: FPS, frame time, draw calls and triangles. Hidden by default.
export class FpsMeter {
	private visible = false;
	private frames = 0;
	private windowStart = performance.now();
	private lastFrame = performance.now();
	private intervals: number[] = [];
	// The browser never draws faster than the display, so FPS is rated against this
	private displayHz = 0;

	private readonly fps: HTMLElement;
	private readonly rating: HTMLElement;
	private readonly frameTime: HTMLElement;
	private readonly drawCalls: HTMLElement;
	private readonly triangles: HTMLElement;

	constructor(private readonly root: HTMLElement) {
		this.fps = root.querySelector('#fps-value')!;
		this.rating = root.querySelector('#fps-rating')!;
		this.frameTime = root.querySelector('#fps-frame')!;
		this.drawCalls = root.querySelector('#fps-calls')!;
		this.triangles = root.querySelector('#fps-triangles')!;
	}

	toggle(): boolean {
		this.visible = !this.visible;
		this.root.style.display = this.visible ? 'block' : 'none';
		// Start fresh so the first numbers are not skewed by the hidden time (or a display change)
		this.frames = 0;
		this.intervals = [];
		this.displayHz = 0;
		this.windowStart = this.lastFrame = performance.now();
		return this.visible;
	}

	// Called once per frame, after rendering, so renderer.info holds this frame's numbers
	update(info: THREE.WebGLInfo): void {
		if (!this.visible) return;
		const now = performance.now();
		this.intervals.push(now - this.lastFrame);
		this.lastFrame = now;
		this.frames++;

		const elapsed = now - this.windowStart;
		if (elapsed < REFRESH_INTERVAL) return;

		this.displayHz = Math.max(this.displayHz, this.estimateDisplayHz());
		const fps = Math.round((this.frames * 1000) / elapsed);
		// Until the display rate is known there is nothing to rate against
		const share = this.displayHz ? fps / this.displayHz : NaN;
		const [label, color] = share >= SMOOTH_SHARE ? ['smooth', '#5dff7a']
			: share >= OK_SHARE ? ['ok', '#ffd84a']
			: share < OK_SHARE ? ['slow', '#ff6b5a']
			: ['', '#fff'];

		this.fps.textContent = `${fps} / ${this.displayHz || '?'} Hz`;
		this.rating.textContent = label;
		this.fps.style.color = this.rating.style.color = color;
		this.frameTime.textContent = `${(elapsed / this.frames).toFixed(1)} ms (worst ${Math.max(...this.intervals).toFixed(1)})`;
		this.drawCalls.textContent = info.render.calls.toLocaleString('en-US');
		this.triangles.textContent = info.render.triangles.toLocaleString('en-US');

		this.frames = 0;
		this.intervals = [];
		this.windowStart = now;
	}

	// The fastest frames show how often the display refreshes. A rate only counts if enough
	// frames land on it, so a short burst of catch-up frames after a hitch is ignored.
	private estimateDisplayHz(): number {
		const sorted = [...this.intervals].sort((a, b) => a - b);
		const measured = 1000 / sorted[Math.floor(sorted.length * 0.1)];
		const rate = DISPLAY_RATES.reduce((best, r) => Math.abs(r - measured) < Math.abs(best - measured) ? r : best);
		const period = 1000 / rate;
		const onRate = this.intervals.filter((interval) => Math.abs(interval - period) < period * RATE_TOLERANCE).length;
		return onRate >= this.intervals.length * MIN_ON_RATE ? rate : 0;
	}
}
