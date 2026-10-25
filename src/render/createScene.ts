import * as THREE from 'three';

export function createRenderer(container: HTMLElement): THREE.WebGLRenderer {
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	container.appendChild(renderer.domElement);
	return renderer;
}

export function createScene(mapSize: number): THREE.Scene {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x9fd3f0);
	scene.fog = new THREE.Fog(0x9fd3f0, 90, 180);

	scene.add(new THREE.HemisphereLight(0xdff1ff, 0x4a5a3a, 1.2));

	// Sun with shadows covering the whole map
	const sun = new THREE.DirectionalLight(0xfff2d9, 2.2);
	const centre = mapSize / 2;
	sun.position.set(centre - 30, 60, centre + 40);
	sun.target.position.set(centre, 0, centre);
	sun.castShadow = true;
	sun.shadow.mapSize.set(4096, 4096);
	const extent = mapSize * 0.75;
	sun.shadow.camera.left = -extent;
	sun.shadow.camera.right = extent;
	sun.shadow.camera.top = extent;
	sun.shadow.camera.bottom = -extent;
	sun.shadow.camera.near = 1;
	sun.shadow.camera.far = 200;
	sun.shadow.bias = -0.0005;
	scene.add(sun, sun.target);

	return scene;
}
