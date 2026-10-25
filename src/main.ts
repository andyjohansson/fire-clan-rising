import './style.css';
import { AssetLoader } from './assets/AssetLoader';
import { Game } from './game/Game';

const container = document.getElementById('game')!;
const selectionBox = document.getElementById('selection-box')!;
const loadingScreen = document.getElementById('loading')!;
const loadingBar = document.getElementById('loading-bar')!;
const loadingText = document.getElementById('loading-text')!;

const assets = new AssetLoader();

assets.loadAll((loaded, total) => {
	loadingBar.style.width = `${(loaded / total) * 100}%`;
	loadingText.textContent = `Loading models… ${loaded} / ${total}`;
}).then(() => {
	loadingScreen.remove();
	new Game(container, selectionBox, assets).start();
}).catch((error) => {
	loadingText.textContent = 'Could not load the game models. See the console for details.';
	console.error(error);
});
