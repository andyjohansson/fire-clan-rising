import './style.css';
import { Game } from './game/Game';

const container = document.getElementById('game')!;
const selectionBox = document.getElementById('selection-box')!;

new Game(container, selectionBox).start();
