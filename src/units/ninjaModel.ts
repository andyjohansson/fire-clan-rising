import * as THREE from 'three';

const COLORS = {
	suit: 0x22222e,
	skin: 0xf1c27d,
	headband: 0xd23a2a,
};

// Builds a simple low-poly ninja. The model faces +Z.
export function createNinjaModel(): THREE.Group {
	const ninja = new THREE.Group();
	const suit = new THREE.MeshStandardMaterial({ color: COLORS.suit, flatShading: true });

	const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.4, 3, 8), suit);
	body.position.y = 0.45;
	ninja.add(body);

	const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), suit);
	head.position.y = 0.98;
	ninja.add(head);

	// Eye slit in the mask
	const eyes = new THREE.Mesh(
		new THREE.BoxGeometry(0.22, 0.06, 0.05),
		new THREE.MeshStandardMaterial({ color: COLORS.skin }),
	);
	eyes.position.set(0, 1.0, 0.18);
	ninja.add(eyes);

	const headband = new THREE.Mesh(
		new THREE.TorusGeometry(0.2, 0.035, 6, 16),
		new THREE.MeshStandardMaterial({ color: COLORS.headband, flatShading: true }),
	);
	headband.rotation.x = Math.PI / 2;
	headband.position.y = 1.08;
	ninja.add(headband);

	// Sword on the back
	const sword = new THREE.Mesh(
		new THREE.BoxGeometry(0.05, 0.7, 0.05),
		new THREE.MeshStandardMaterial({ color: 0xb8bcc4 }),
	);
	sword.position.set(0, 0.65, -0.24);
	sword.rotation.z = 0.6;
	ninja.add(sword);

	ninja.traverse((child) => (child.castShadow = true));
	return ninja;
}
