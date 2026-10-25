import * as THREE from 'three';
import { Mood } from './moods';

// Alpha cutoff for leaf cards; the models' own 0.2 lets the pale texture edges show as a halo
const LEAF_ALPHA_CUTOFF = 0.5;

// Shared by every leaf material, updated when the mood changes
const uniforms = {
	foliageSunDirection: { value: new THREE.Vector3(0, 1, 0) },
	foliageSunColor: { value: new THREE.Color() },
	foliageTint: { value: new THREE.Color(1, 1, 1) },
	foliageRim: { value: 0 },
	foliageGradient: { value: 0 },
	foliageVariation: { value: 0 },
};

const prepared = new WeakSet<THREE.Material>();

const vertexPars = /* glsl */ `
varying vec3 vFoliageWorld;
// Tree centre and half its height, from the instance matrix (tree models are centred on their bounds)
varying vec4 vFoliageCentre;
`;

const vertexMain = /* glsl */ `
	mat4 foliageMatrix = modelMatrix;
	#ifdef USE_INSTANCING
		foliageMatrix = modelMatrix * instanceMatrix;
	#endif
	vFoliageWorld = (foliageMatrix * vec4(transformed, 1.0)).xyz;
	vFoliageCentre = vec4(foliageMatrix[3].xyz, length(foliageMatrix[1].xyz));
`;

const fragmentPars = /* glsl */ `
uniform vec3 foliageSunDirection;
uniform vec3 foliageSunColor;
uniform vec3 foliageTint;
uniform float foliageRim;
uniform float foliageGradient;
uniform float foliageVariation;
varying vec3 vFoliageWorld;
varying vec4 vFoliageCentre;
`;

const fragmentMain = /* glsl */ `
	{
		// Brighter crown tops, darker undersides, so crowns read as round
		float height = clamp((vFoliageWorld.y - vFoliageCentre.y) / vFoliageCentre.w, -1.0, 1.0);
		outgoingLight *= 1.0 + foliageGradient * height;
		// Each tree slightly lighter or darker than its neighbours
		float seed = fract(sin(dot(vFoliageCentre.xz, vec2(12.9898, 78.233))) * 43758.5453);
		outgoingLight *= foliageTint * (1.0 + foliageVariation * (seed * 2.0 - 1.0));
		// Sunlit rim on the crown's silhouette, strongest on the side facing the sun
		vec3 sunView = normalize((viewMatrix * vec4(foliageSunDirection, 0.0)).xyz);
		float edge = pow(1.0 - clamp(abs(dot(normal, geometryViewDir)), 0.0, 1.0), 3.0);
		float sunSide = clamp(dot(normal, sunView) * 0.5 + 0.5, 0.0, 1.0);
		outgoingLight += foliageSunColor * diffuseColor.rgb * edge * sunSide * foliageRim;
	}
	#include <opaque_fragment>
`;

// Gives leaf materials crisp edges and the extra shading that makes tree crowns stand out
export function prepareFoliage(material: THREE.Material): void {
	if (prepared.has(material) || !(material instanceof THREE.MeshStandardMaterial)) return;
	if (!material.name.startsWith('Leaves_')) return;
	prepared.add(material);

	material.alphaTest = LEAF_ALPHA_CUTOFF;
	material.onBeforeCompile = (shader) => {
		Object.assign(shader.uniforms, uniforms);
		shader.vertexShader = shader.vertexShader
			.replace('#include <common>', `#include <common>\n${vertexPars}`)
			.replace('#include <project_vertex>', `#include <project_vertex>\n${vertexMain}`);
		shader.fragmentShader = shader.fragmentShader
			.replace('#include <common>', `#include <common>\n${fragmentPars}`)
			.replace('#include <opaque_fragment>', fragmentMain);
	};
	material.needsUpdate = true;
}

export function setFoliageMood(mood: Mood, sunDirection: THREE.Vector3): void {
	uniforms.foliageSunDirection.value.copy(sunDirection);
	uniforms.foliageSunColor.value.set(mood.sun.color).multiplyScalar(mood.sun.intensity);
	uniforms.foliageTint.value.set(mood.foliage.tint);
	uniforms.foliageRim.value = mood.foliage.rim;
	uniforms.foliageGradient.value = mood.foliage.gradient;
	uniforms.foliageVariation.value = mood.foliage.variation;
}
