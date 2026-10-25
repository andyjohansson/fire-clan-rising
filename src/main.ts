import './style.css';
import { AssetLoader } from './assets/AssetLoader';
import { Game } from './game/Game';
import { installDevCommands } from './game/devCommands';
import { FpsMeter } from './ui/FpsMeter';
import { LoadingScreen } from './ui/LoadingScreen';

const container = document.getElementById('game')!;
const selectionBox = document.getElementById('selection-box')!;
const loadingScreen = new LoadingScreen(document.getElementById('loading')!);
const fpsMeter = new FpsMeter(document.getElementById('fps-meter')!);

const assets = new AssetLoader();

assets.loadAll((loaded, total) => loadingScreen.setProgress(loaded, total))
	.then(async () => {
		const game = new Game(container, selectionBox, assets, fpsMeter);
		await game.prepare();
		await loadingScreen.finish();
		game.start();
		installDevCommands({ toggleFps: () => fpsMeter.toggle() });
	})
	.catch((error) => {
		loadingScreen.showError('Could not load the game models. See the console for details.');
		console.error(error);
	});
