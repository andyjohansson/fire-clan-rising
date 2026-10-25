import * as THREE from 'three';

export function createRenderer(container: HTMLElement): THREE.WebGLRenderer {
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	// Filmic tone mapping, applied by the output pass of the post-processing chain
	renderer.toneMapping = THREE.AgXToneMapping;
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	// Post-processing renders the scene several times per frame; the FPS meter wants the whole frame
	renderer.info.autoReset = false;
	container.appendChild(renderer.domElement);
	return renderer;
}
