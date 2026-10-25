import * as THREE from 'three';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';

type BaseHooks = { _overrideVisibility(): void; _restoreVisibility(): void };
const base = GTAOPass.prototype as unknown as BaseHooks;

// GTAOPass draws every mesh with one normal material, so alpha-cut leaf cards would count as
// solid squares and smear dark halos around trees. This pass gives alpha-tested materials a
// normal material of their own that cuts out the same pixels.
// Alpha-tested materials are in practice the leaf cards from the nature pack.
export class AlphaAwareGTAOPass extends GTAOPass {
	private readonly cutoutMaterials = new Map<THREE.Material, THREE.MeshNormalMaterial>();
	private readonly swapped: { mesh: THREE.Mesh; material: THREE.Material }[] = [];

	// Called by GTAOPass right before it renders the normal and depth buffer
	_overrideVisibility(): void {
		base._overrideVisibility.call(this);
		this.scene.traverse((object) => {
			if (!(object instanceof THREE.Mesh) || !object.visible || Array.isArray(object.material)) return;
			const material = object.material as THREE.Material & { map?: THREE.Texture | null };
			if (material.alphaTest <= 0 || !material.map) return;
			this.swapped.push({ mesh: object, material });
			object.material = this.cutoutMaterial(material);
		});
	}

	_restoreVisibility(): void {
		base._restoreVisibility.call(this);
		for (const { mesh, material } of this.swapped) mesh.material = material;
		this.swapped.length = 0;
	}

	private cutoutMaterial(source: THREE.Material & { map?: THREE.Texture | null }): THREE.MeshNormalMaterial {
		let material = this.cutoutMaterials.get(source);
		if (!material) {
			material = new THREE.MeshNormalMaterial({ side: source.side, alphaTest: source.alphaTest });
			// Not in MeshNormalMaterial's typings, but the renderer picks it up like on any material
			(material as THREE.MeshNormalMaterial & { map: THREE.Texture | null }).map = source.map ?? null;
			// Keep this material while the pass overrides all others with its own normal material
			material.allowOverride = false;
			material.onBeforeCompile = (shader) => {
				shader.fragmentShader = shader.fragmentShader
					.replace('#include <uv_pars_fragment>', '#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphatest_pars_fragment>')
					.replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif (texture2D(map, vMapUv).a < alphaTest) discard;')
					// Leaf cards face every way, which reads as deep occlusion and turns crowns black.
					// Facing the camera instead, they still shade the ground but not themselves.
					.replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nnormal = vec3(0.0, 0.0, 1.0);');
			};
			this.cutoutMaterials.set(source, material);
		}
		return material;
	}
}
