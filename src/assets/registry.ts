// Asset registry: the single place that maps game objects to model files.
// Game code only uses the keys below, so the art style can be swapped by
// changing this file (and the files in public/assets) without touching the game.

export interface AssetDefinition {
	// Model files relative to public/assets. Several files = random variants.
	files: string[];
	// Uniform scale applied to the model so it fits the game world (1 cell = 1 unit)
	scale: number;
	// Animated models are cloned with their skeleton, static ones can be instanced
	animated?: boolean;
}

const variants = (name: string, count: number) =>
	Array.from({ length: count }, (_, i) => `nature/${name}_${i + 1}.glb`);

export const ASSETS = {
	// Units
	'unit.ninja': { files: ['units/ninja.glb'], scale: 0.4, animated: true },
	'unit.dragon': { files: ['units/dragon.glb'], scale: 0.6, animated: true },
	'unit.dragonEvolved': { files: ['units/dragon_evolved.glb'], scale: 0.8, animated: true },

	// Trees
	'tree.pine': { files: variants('Pine', 5), scale: 0.5 },
	'tree.common': { files: variants('CommonTree', 5), scale: 0.5 },
	'tree.twisted': { files: variants('TwistedTree', 5), scale: 0.25 },
	'tree.dead': { files: variants('DeadTree', 5), scale: 0.4 },

	// Ground cover
	'bush': { files: ['nature/Bush_Common.glb', 'nature/Bush_Common_Flowers.glb'], scale: 0.6 },
	'rock.medium': { files: variants('Rock_Medium', 3), scale: 0.6 },
	'pebble': { files: [...variants('Pebble_Round', 5), ...variants('Pebble_Square', 6)], scale: 0.8 },
	'grass': {
		files: ['Grass_Common_Short', 'Grass_Common_Tall', 'Grass_Wispy_Short', 'Grass_Wispy_Tall'].map((n) => `nature/${n}.glb`),
		scale: 0.5,
	},
	'flower': {
		files: ['Flower_3_Group', 'Flower_3_Single', 'Flower_4_Group', 'Flower_4_Single'].map((n) => `nature/${n}.glb`),
		scale: 0.5,
	},
	'plant': {
		files: ['Plant_1', 'Plant_1_Big', 'Plant_7', 'Plant_7_Big', 'Fern_1', 'Clover_1', 'Clover_2'].map((n) => `nature/${n}.glb`),
		scale: 0.5,
	},
	'mushroom': { files: ['nature/Mushroom_Common.glb', 'nature/Mushroom_Laetiporus.glb'], scale: 0.6 },
} satisfies Record<string, AssetDefinition>;

export type AssetKey = keyof typeof ASSETS;
