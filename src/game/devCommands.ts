// Developer commands, typed in the browser console as fcr.<command>()
export interface DevCommands {
	fps(): void;
	help(): void;
}

declare global {
	interface Window {
		fcr: DevCommands;
	}
}

interface DevHooks {
	toggleFps(): boolean;
}

const HELP = [
	'Fire Clan Rising dev commands:',
	'  fcr.fps()   show / hide the performance meter (FPS, frame time, draw calls, triangles)',
	'  fcr.help()  list these commands',
].join('\n');

export function installDevCommands(hooks: DevHooks): void {
	window.fcr = {
		fps: () => console.log(`Performance meter ${hooks.toggleFps() ? 'on' : 'off'}`),
		help: () => console.log(HELP),
	};
	console.log('Dev commands: fcr.help()');
}
