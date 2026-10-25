import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { AlphaAwareGTAOPass } from './AlphaAwareGTAOPass';
import { Mood } from './moods';

// Saturation and vignette, applied in linear colour before tone mapping
const GradeShader = {
	uniforms: {
		tDiffuse: { value: null },
		saturation: { value: 1 },
		vignette: { value: 0 },
	},
	vertexShader: /* glsl */ `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,
	fragmentShader: /* glsl */ `
		uniform sampler2D tDiffuse;
		uniform float saturation;
		uniform float vignette;
		varying vec2 vUv;
		void main() {
			vec4 texel = texture2D(tDiffuse, vUv);
			float luminance = dot(texel.rgb, vec3(0.2126, 0.7152, 0.0722));
			vec3 color = mix(vec3(luminance), texel.rgb, saturation);
			vec2 offset = vUv - 0.5;
			color *= 1.0 - vignette * smoothstep(0.3, 0.8, length(offset));
			gl_FragColor = vec4(color, texel.a);
		}
	`,
};

// Renders the scene through ambient occlusion and colour grading, then tone maps to the screen
export class PostProcessing {
	private readonly composer: EffectComposer;
	private readonly aoPass: AlphaAwareGTAOPass;
	private readonly gradePass: ShaderPass;

	constructor(private readonly renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
		this.composer = new EffectComposer(renderer);
		this.composer.addPass(new RenderPass(scene, camera));

		this.aoPass = new AlphaAwareGTAOPass(scene, camera);
		// Radius in world units: wide enough to darken the ground under trees and units
		this.aoPass.updateGtaoMaterial({ radius: 2.5, distanceExponent: 1.5, thickness: 3, scale: 1.2, samples: 16 });
		this.aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
		this.aoPass.blendIntensity = 1;
		this.composer.addPass(this.aoPass);

		this.gradePass = new ShaderPass(GradeShader);
		this.composer.addPass(this.gradePass);
		this.composer.addPass(new OutputPass());
	}

	get aoEnabled(): boolean {
		return this.aoPass.enabled;
	}

	set aoEnabled(enabled: boolean) {
		this.aoPass.enabled = enabled;
	}

	setMood(mood: Mood): void {
		this.renderer.toneMappingExposure = mood.exposure;
		this.gradePass.uniforms.saturation.value = mood.saturation;
		this.gradePass.uniforms.vignette.value = mood.vignette;
	}

	setSize(width: number, height: number): void {
		this.composer.setPixelRatio(this.renderer.getPixelRatio());
		this.composer.setSize(width, height);
	}

	render(): void {
		this.composer.render();
	}
}
