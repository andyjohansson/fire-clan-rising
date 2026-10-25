import * as THREE from 'three';

// How often the numbers are refreshed, so they stay readable instead of flickering
const REFRESH_INTERVAL = 500;
const GOOD_FPS = 50;
const OK_FPS = 30;

// Performance overlay: FPS, frame time, draw calls and triangles. Hidden by default.
export class FpsMeter {
	private visible = false;
	private frames = 0;
	private windowStart = performance.now();
	private lastFrame = performance.now();
	private worstFrame = 0;

	private readonly fps: HTMLElement;
	private readonly frameTime: HTMLElement;
	private readonly drawCalls: HTMLElement;
	private readonly triangles: HTMLElement;

	constructor(private readonly root: HTMLElement) {
		this.fps = root.querySelector('#fps-value')!;
		this.frameTime = root.querySelector('#fps-frame')!;
		this.drawCalls = root.querySelector('#fps-calls')!;
		this.triangles = root.querySelector('#fps-triangles')!;
	}

	toggle(): boolean {
		this.visible = !this.visible;
		this.root.style.display = this.visible ? 'block' : 'none';
		// Start a fresh measuring window so the first numbers are not skewed by the hidden time
		this.frames = 0;
		this.worstFrame = 0;
		this.windowStart = this.lastFrame = performance.now();
		return this.visible;
	}

	// Called once per frame, after rendering, so renderer.info holds this frame's numbers
	update(info: THREE.WebGLInfo): void {
		if (!this.visible) return;
		const now = performance.now();
		this.worstFrame = Math.max(this.worstFrame, now - this.lastFrame);
		this.lastFrame = now;
		this.frames++;

		const elapsed = now - this.windowStart;
		if (elapsed < REFRESH_INTERVAL) return;

		const fps = (this.frames * 1000) / elapsed;
		this.fps.textContent = fps.toFixed(0);
		this.fps.style.color = fps >= GOOD_FPS ? '#5dff7a' : fps >= OK_FPS ? '#ffd84a' : '#ff6b5a';
		this.frameTime.textContent = `${(elapsed / this.frames).toFixed(1)} ms (worst ${this.worstFrame.toFixed(1)})`;
		this.drawCalls.textContent = info.render.calls.toLocaleString('en-US');
		this.triangles.textContent = info.render.triangles.toLocaleString('en-US');

		this.frames = 0;
		this.worstFrame = 0;
		this.windowStart = now;
	}
}
