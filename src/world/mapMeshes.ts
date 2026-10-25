import * as THREE from 'three';
import { AssetLoader } from '../assets/AssetLoader';
import { AssetKey } from '../assets/registry';
import { prepareFoliage } from '../render/foliage';
import { createRandom } from '../utils/math';
import { GameMap, Tree, TreeKind } from './GameMap';
import {
	BRIDGE_DECK,
	BRIDGE_HALF_LENGTH,
	BRIDGE_HALF_WIDTH,
	WATER_LEVEL,
	bridgeCenters,
	riverDistance,
	terrainHeight,
} from './terrain';

const COLORS = {
	grass: new THREE.Color(0x5f9e48),
	sand: new THREE.Color(0xcdb87d),
	riverBed: new THREE.Color(0x6d5a3c),
	rock: new THREE.Color(0x7d7872),
	stone: new THREE.Color(0xa29a8e),
	water: 0x3a86d4,
	wood: 0x8b5a2b,
};

export interface MapMeshes {
	group: THREE.Group;
	// The ground surface, used for mouse picking
	terrain: THREE.Mesh;
}

export function createMapMeshes(map: GameMap, assets: AssetLoader): MapMeshes {
	const group = new THREE.Group();
	const terrain = createTerrain(map.size);
	group.add(terrain);
	group.add(createWater(map.size));
	for (const bridge of createBridges()) group.add(bridge);
	for (const trees of createTrees(map, assets)) group.add(trees);
	return { group, terrain };
}

function terrainColor(x: number, z: number, height: number): THREE.Color {
	const slope = Math.max(
		Math.abs(terrainHeight(x + 0.5, z) - terrainHeight(x - 0.5, z)),
		Math.abs(terrainHeight(x, z + 0.5) - terrainHeight(x, z - 0.5)),
	);
	if (slope > 0.9) return COLORS.rock;
	if (height > 1.5) return COLORS.stone;
	const river = riverDistance(x, z);
	if (river < 3) return COLORS.riverBed;
	if (river < 5) return COLORS.sand;
	return COLORS.grass;
}

function createTerrain(size: number): THREE.Mesh {
	const geometry = new THREE.PlaneGeometry(size, size, size, size);
	geometry.rotateX(-Math.PI / 2);
	geometry.translate(size / 2, 0, size / 2);

	const random = createRandom(7);
	const positions = geometry.attributes.position;
	const colors = new Float32Array(positions.count * 3);
	const color = new THREE.Color();
	for (let v = 0; v < positions.count; v++) {
		const x = positions.getX(v);
		const z = positions.getZ(v);
		const height = terrainHeight(x, z);
		positions.setY(v, height);
		// Slight brightness variation for a low-poly look
		color.copy(terrainColor(x, z, height)).multiplyScalar(0.92 + random() * 0.16);
		color.toArray(colors, v * 3);
	}
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
	geometry.computeVertexNormals();

	const material = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.receiveShadow = true;
	return mesh;
}

function createWater(size: number): THREE.Mesh {
	const geometry = new THREE.PlaneGeometry(size, size);
	geometry.rotateX(-Math.PI / 2);
	geometry.translate(size / 2, WATER_LEVEL, size / 2);
	const material = new THREE.MeshStandardMaterial({
		color: COLORS.water,
		transparent: true,
		opacity: 0.85,
		roughness: 0.3,
	});
	return new THREE.Mesh(geometry, material);
}

function createBridges(): THREE.Group[] {
	const material = new THREE.MeshStandardMaterial({ color: COLORS.wood, flatShading: true });
	const length = BRIDGE_HALF_LENGTH * 2;
	const width = BRIDGE_HALF_WIDTH * 2;

	return bridgeCenters().map(({ x, z }) => {
		const bridge = new THREE.Group();
		const deck = new THREE.Mesh(new THREE.BoxGeometry(length, 0.2, width), material);
		deck.position.y = BRIDGE_DECK - 0.1;
		bridge.add(deck);

		// Railings with posts on both sides
		for (const side of [-1, 1]) {
			const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.1, 0.1), material);
			rail.position.set(0, BRIDGE_DECK + 0.6, side * (width / 2 - 0.05));
			bridge.add(rail);
			for (let p = -2; p <= 2; p++) {
				const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 0.12), material);
				post.position.set(p * (length / 4.4), BRIDGE_DECK + 0.3, side * (width / 2 - 0.05));
				bridge.add(post);
			}
		}

		bridge.traverse((child) => {
			child.castShadow = true;
			child.receiveShadow = true;
		});
		bridge.position.set(x, 0, z);
		// Bridge runs across the diagonal river
		bridge.rotation.y = Math.PI / 4;
		return bridge;
	});
}

const TREE_ASSETS: Record<TreeKind, AssetKey> = {
	pine: 'tree.pine',
	common: 'tree.common',
};

// Draws all trees with one InstancedMesh per model part, grouped by model variant
function createTrees(map: GameMap, assets: AssetLoader): THREE.InstancedMesh[] {
	const groups = new Map<string, { key: AssetKey; variant: number; trees: Tree[] }>();
	for (const tree of map.trees) {
		const key = TREE_ASSETS[tree.kind];
		const variant = tree.variantSeed % assets.variantCount(key);
		const groupKey = `${key}#${variant}`;
		let group = groups.get(groupKey);
		if (!group) {
			group = { key, variant, trees: [] };
			groups.set(groupKey, group);
		}
		group.trees.push(tree);
	}

	const meshes: THREE.InstancedMesh[] = [];
	const placement = new THREE.Matrix4();
	const rotation = new THREE.Quaternion();
	const up = new THREE.Vector3(0, 1, 0);
	const instance = new THREE.Matrix4();

	for (const { key, variant, trees } of groups.values()) {
		for (const part of assets.meshParts(key, variant)) {
			for (const material of [part.material].flat()) prepareFoliage(material);
			const mesh = new THREE.InstancedMesh(part.geometry, part.material, trees.length);
			trees.forEach((tree, index) => {
				rotation.setFromAxisAngle(up, tree.rotation);
				placement.compose(
					new THREE.Vector3(tree.x, terrainHeight(tree.x, tree.z), tree.z),
					rotation,
					new THREE.Vector3(tree.scale, tree.scale, tree.scale),
				);
				instance.multiplyMatrices(placement, part.matrix);
				mesh.setMatrixAt(index, instance);
			});
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			meshes.push(mesh);
		}
	}
	return meshes;
}
