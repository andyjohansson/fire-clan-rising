# Credits

Fire Clan Rising's own code is released under the [MIT License](LICENSE). The third-party assets and libraries below keep their own licenses.

## 3D models

All models are by **[Quaternius](https://quaternius.com)** and released under **[CC0 1.0 Universal (public domain)](https://creativecommons.org/publicdomain/zero/1.0/)**. No attribution is required, but we credit the author with thanks.

| Asset | Source | License | Files |
|-------|--------|---------|-------|
| Stylized Nature MegaKit (Standard, free version) | [quaternius.com](https://quaternius.com/packs/stylizednaturemegakit.html) / [itch.io](https://quaternius.itch.io/stylized-nature-megakit) | CC0 1.0 | `public/assets/nature/*.glb` |
| Ninja | [Poly Pizza](https://poly.pizza/m/xGYmeDpfTu) | CC0 1.0 | `public/assets/units/ninja.glb` |
| Dragon | [Poly Pizza](https://poly.pizza/m/3rUm1cN3yp) | CC0 1.0 | `public/assets/units/dragon.glb` |
| Dragon Evolved | [Poly Pizza](https://poly.pizza/m/LlwD0QNUPj) | CC0 1.0 | `public/assets/units/dragon_evolved.glb` |

The nature models were converted from glTF to GLB with [glTF Transform](https://gltf-transform.dev) (meshopt compression, WebP textures resized to max 1024 px). The models themselves are unchanged.

## Libraries shipped with the game

| Library | License |
|---------|---------|
| [three.js](https://threejs.org) | MIT – Copyright © 2010–2026 three.js authors |
| [meshoptimizer decoder](https://github.com/zeux/meshoptimizer) (bundled with three.js) | MIT – Copyright © 2016–2026 Arseny Kapoulkine |

## Development tools (not shipped with the game)

| Tool | License |
|------|---------|
| [Vite](https://vite.dev) | MIT |
| [TypeScript](https://www.typescriptlang.org) | Apache-2.0 |
| [glTF Transform](https://gltf-transform.dev) | MIT (uses [sharp](https://sharp.pixelplumbing.com), Apache-2.0 / LGPL-3.0 for libvips, only when converting models) |
