// Lighting presets. Each mood sets the sky, sun, ambient light, haze and colour grading together.
export interface Mood {
	name: string;
	sky: {
		zenith: number;
		// Also the haze colour and the colour seen past the edge of the map,
		// since the RTS camera looks down and mostly sees the sky below the horizon
		horizon: number;
		// Glow around the sun
		sunGlow: number;
	};
	sun: {
		color: number;
		intensity: number;
		// Degrees above the horizon
		elevation: number;
		// Degrees around the vertical axis, 0 = from +x, 90 = from +z
		azimuth: number;
	};
	hemisphere: {
		sky: number;
		ground: number;
		intensity: number;
	};
	// Distance haze in multiples of the camera distance, so it looks the same at every zoom level
	haze: {
		near: number;
		far: number;
	};
	exposure: number;
	// 1 = unchanged, below 1 = washed out
	saturation: number;
	// Darkening towards the screen corners, 0 = none
	vignette: number;
}

// Overcast and heavy, Lord of the Rings feel: a low pale sun breaking through cloud, cold haze
export const GLOOMY: Mood = {
	name: 'gloomy',
	sky: {
		zenith: 0x2a2f38,
		horizon: 0x5c6168,
		sunGlow: 0xc9a77a,
	},
	sun: {
		color: 0xffd9a8,
		intensity: 2.0,
		elevation: 24,
		azimuth: 200,
	},
	hemisphere: {
		sky: 0x8a96a8,
		ground: 0x2c2a24,
		intensity: 0.9,
	},
	haze: {
		near: 0.8,
		far: 2.4,
	},
	exposure: 0.9,
	saturation: 0.7,
	vignette: 0.45,
};

// Warm, bright daytime in the stylized RTS look
export const SUNNY: Mood = {
	name: 'sunny',
	sky: {
		zenith: 0x3d7fd6,
		horizon: 0xbcd3e0,
		sunGlow: 0xfff0c8,
	},
	sun: {
		color: 0xffeacc,
		intensity: 3.0,
		elevation: 48,
		azimuth: 210,
	},
	hemisphere: {
		sky: 0xdff1ff,
		ground: 0x4a5a3a,
		intensity: 1.3,
	},
	haze: {
		near: 1.4,
		far: 4.0,
	},
	exposure: 1.0,
	saturation: 1.1,
	vignette: 0.2,
};

export const MOODS: Mood[] = [GLOOMY, SUNNY];
