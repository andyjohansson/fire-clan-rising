import { EggScene } from './eggScene';

// Shown for at least this long, so the screen can be enjoyed even when loading is instant
const MIN_DURATION = 5000;
const STORY_INTERVAL = 2600;
const FADE_DURATION = 900;

const STORY_LINES = [
	'The great Dragon King is dead…',
	'Only one egg remains.',
	'From it, the next Dragon King will hatch.',
	'The Ninja Lord wants the egg for himself.',
	'The fire clan is rising.',
];

// The loading screen: title, story lines and the Dragon King Egg cracking open as models load
export class LoadingScreen {
	private readonly eggScene: EggScene;
	private readonly started = performance.now();
	private loadedFraction = 0;
	private storyIndex = 0;
	private readonly storyTimer: number;
	private readonly progressTimer: number;

	private readonly status: HTMLElement;
	private readonly story: HTMLElement;
	private readonly startButton: HTMLButtonElement;

	constructor(private readonly root: HTMLElement) {
		this.status = root.querySelector('#loading-status')!;
		this.story = root.querySelector('#loading-story')!;
		this.startButton = root.querySelector('#loading-start')!;
		this.eggScene = new EggScene(root.querySelector('#loading-scene')!);

		this.showStoryLine();
		this.storyTimer = window.setInterval(() => this.showStoryLine(), STORY_INTERVAL);
		this.progressTimer = window.setInterval(() => this.updateProgress(), 50);
	}

	setProgress(loaded: number, total: number): void {
		this.loadedFraction = total > 0 ? loaded / total : 1;
	}

	// Waits for the minimum display time, then lets the player start the game
	async finish(): Promise<void> {
		this.loadedFraction = 1;
		const remaining = MIN_DURATION - (performance.now() - this.started);
		if (remaining > 0) await wait(remaining);

		window.clearInterval(this.progressTimer);
		this.updateProgress();
		this.eggScene.flareUp();
		this.status.textContent = 'The egg is awake';
		this.root.classList.add('ready');
		this.startButton.focus();

		await new Promise<void>((resolve) => {
			const start = () => {
				window.removeEventListener('keydown', onKey);
				resolve();
			};
			const onKey = (event: KeyboardEvent) => {
				if (event.key === 'Enter' || event.key === ' ') start();
			};
			this.startButton.addEventListener('click', start, { once: true });
			window.addEventListener('keydown', onKey);
		});

		window.clearInterval(this.storyTimer);
		this.root.classList.add('leaving');
		await wait(FADE_DURATION);
		this.eggScene.dispose();
		this.root.remove();
	}

	showError(message: string): void {
		window.clearInterval(this.progressTimer);
		window.clearInterval(this.storyTimer);
		this.status.textContent = message;
		this.root.classList.add('error');
	}

	// The visible progress never runs ahead of the minimum display time
	private updateProgress(): void {
		const timeFraction = (performance.now() - this.started) / MIN_DURATION;
		const progress = Math.min(this.loadedFraction, timeFraction, 1);
		this.eggScene.setProgress(progress);
		if (!this.root.classList.contains('ready')) {
			this.status.textContent = `Waking the egg… ${Math.floor(progress * 100)}%`;
		}
	}

	private showStoryLine(): void {
		this.story.classList.remove('visible');
		window.setTimeout(() => {
			this.story.textContent = STORY_LINES[this.storyIndex % STORY_LINES.length];
			this.story.classList.add('visible');
			this.storyIndex++;
		}, 400);
	}
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}
