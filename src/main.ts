import './style.css';
import { AssetLoader } from './assets/AssetLoader';
import { Game } from './game/Game';
import { LoadingScreen } from './ui/LoadingScreen';

const container = document.getElementById('game')!;
const selectionBox = document.getElementById('selection-box')!;
const loadingScreen = new LoadingScreen(document.getElementById('loading')!);

const assets = new AssetLoader();

assets.loadAll((loaded, total) => loadingScreen.setProgress(loaded, total))
	.then(async () => {
		const game = new Game(container, selectionBox, assets);
		await game.prepare();
		await loadingScreen.finish();
		game.start();
	})
	.catch((error) => {
		loadingScreen.showError('Could not load the game models. See the console for details.');
		console.error(error);
	});
