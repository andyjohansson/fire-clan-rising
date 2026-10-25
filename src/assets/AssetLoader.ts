import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { ASSETS, AssetDefinition, AssetKey } from './registry';

const ASSET_ROOT = `${import.meta.env.BASE_URL}assets/`;

interface LoadedVariant {
	scene: THREE.Object3D;
	animations: THREE.AnimationClip[];
}

// A mesh part of a static model, ready to be drawn with an InstancedMesh
export interface MeshPart {
	geometry: THREE.BufferGeometry;
	material: THREE.Material | THREE.Material[];
	// Transform of the part relative to the model root, including the registry scale
	matrix: THREE.Matrix4;
}

// Loads every model in the registry up front and hands out copies to the game
export class AssetLoader {
	private readonly variants = new Map<AssetKey, LoadedVariant[]>();
	private readonly partsCache = new Map<string, MeshPart[]>();

	async loadAll(onProgress?: (loaded: number, total: number) => void): Promise<void> {
		const loader = new GLTFLoader();
		loader.setMeshoptDecoder(MeshoptDecoder);

		const entries = Object.entries(ASSETS) as [AssetKey, AssetDefinition][];
		const total = entries.reduce((sum, [, definition]) => sum + definition.files.length, 0);
		let loaded = 0;
		onProgress?.(0, total);

		await Promise.all(entries.map(async ([key, definition]) => {
			const results = await Promise.all(definition.files.map(async (file) => {
				const gltf = await loader.loadAsync(ASSET_ROOT + file);
				prepareShadows(gltf.scene);
				onProgress?.(++loaded, total);
				return { scene: gltf.scene, animations: gltf.animations };
			}));
			this.variants.set(key, results);
		}));
	}

	variantCount(key: AssetKey): number {
		return this.get(key).length;
	}

	// A new, independent copy of the model (scaled), e.g. for a unit
	create(key: AssetKey, variant = 0): THREE.Object3D {
		const source = this.get(key)[variant].scene;
		const definition: AssetDefinition = ASSETS[key];
		const copy = definition.animated ? cloneSkinned(source) : source.clone();
		const root = new THREE.Group();
		copy.scale.multiplyScalar(definition.scale);
		root.add(copy);
		return root;
	}

	animations(key: AssetKey, variant = 0): THREE.AnimationClip[] {
		return this.get(key)[variant].animations;
	}

	// Geometry and materials of a static model, for drawing many copies with instancing
	meshParts(key: AssetKey, variant = 0): MeshPart[] {
		const cacheKey = `${key}#${variant}`;
		const cached = this.partsCache.get(cacheKey);
		if (cached) return cached;

		const definition: AssetDefinition = ASSETS[key];
		const scale = new THREE.Matrix4().makeScale(definition.scale, definition.scale, definition.scale);
		const scene = this.get(key)[variant].scene;
		scene.updateMatrixWorld(true);

		const parts: MeshPart[] = [];
		scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				parts.push({
					geometry: child.geometry,
					material: child.material,
					matrix: scale.clone().multiply(child.matrixWorld),
				});
			}
		});
		this.partsCache.set(cacheKey, parts);
		return parts;
	}

	private get(key: AssetKey): LoadedVariant[] {
		const variants = this.variants.get(key);
		if (!variants) throw new Error(`Asset "${key}" has not been loaded`);
		return variants;
	}
}

function prepareShadows(scene: THREE.Object3D): void {
	scene.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
}
