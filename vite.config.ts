import { defineConfig } from 'vite';

export default defineConfig({
	// Relative paths, so the same build works at any URL
	// (local dev, the dev site and PR previews in sub-folders on GitHub Pages)
	base: './',
});
