# Assets

How 3D models, fonts and other third-party files get into the game, and what we already have.

## Principles

1. **Style:** stylized and colourful, low-poly (design doc §10). Prefer **Quaternius** packs so everything matches.
2. **License:** CC0 preferred. Anything else must be compatible with the project's MIT license and be credited.
3. **Asset registry:** game code never references model files directly – only keys in `src/assets/registry.ts` (so the art style can be swapped later).
4. **No photo textures:** realistic texture packs (e.g. Poly Haven) were rejected because they clash with the style. Terrain and water are drawn with custom shaders in code.

## Intake procedure

Follow these steps for every new asset (model pack, font, sound):

1. **Ask Andy first.** Give the name, source URL, license and download size. Never download without approval.
2. **Download outside the project**, into Claude's scratchpad (a new, empty folder per download).
3. **Safety checks before opening anything:**
	1. `file` on every download – only expected types (glTF/GLB, FBX/OBJ, PNG/JPG/WebP, TTF/OTF, audio, text).
	2. For zips: `unzip -t` (integrity), `zipinfo` – no executables or scripts, no symlinks, no absolute or `../` paths, sensible uncompressed size.
	3. glTF/GLB: no external or remote URIs (models must not fetch anything from the internet); image files have valid headers.
	4. Read the license file in the download and confirm it.
4. **Convert static models** to compact GLB (meshopt geometry, WebP textures, max 1024 px):

	```bash
	npx gltf-transform optimize <input.gltf> public/assets/<category>/<Name>.glb \
		--texture-compress webp --texture-size 1024 --simplify false --instance false --compress meshopt
	```

	Animated characters are copied as-is (they are already small).
5. **Add to the registry** (`src/assets/registry.ts`) with a scale that fits the world (1 cell = 1 unit; a ninja is about 1.2 units tall, a pine about 3.5).
6. **Credit it** in [CREDITS.md](../CREDITS.md) (source, author, license, files).
7. **Log it on the issue:** what was downloaded, from where, checks done, and what was rejected and why.

## Inventory

| What | Source | License | In the project | Registry keys |
|------|--------|---------|----------------|---------------|
| Stylized Nature MegaKit (Standard, free) – 68 models | [quaternius.itch.io](https://quaternius.itch.io/stylized-nature-megakit) ("No thanks, just take me to the downloads") | CC0 | `public/assets/nature/` | `tree.pine`, `tree.common`, `tree.twisted`, `tree.dead`, `bush`, `rock.medium`, `pebble`, `grass`, `flower`, `plant`, `mushroom` |
| Ninja (animated) | [Poly Pizza](https://poly.pizza/m/xGYmeDpfTu) | CC0 | `public/assets/units/ninja.glb` | `unit.ninja` |
| Dragon (animated, flying) | [Poly Pizza](https://poly.pizza/m/3rUm1cN3yp) | CC0 | `public/assets/units/dragon.glb` | `unit.dragon` |
| Dragon Evolved (animated, flying) | [Poly Pizza](https://poly.pizza/m/LlwD0QNUPj) | CC0 | `public/assets/units/dragon_evolved.glb` | `unit.dragonEvolved` |
| Shojumaru font (supports å, ä, ö) | [Google Fonts](https://fonts.google.com/specimen/Shojumaru) | SIL OFL 1.1 | `public/assets/fonts/` | – (CSS `@font-face`) |

**In `public/assets/nature/` but not yet in the registry:** `RockPath_*` (stepping-stone paths) and `Petal_*`.

**Rejected:** a second Poly Pizza ninja (`mCNoqcqpvC`) – its animations (Bite, Dance) do not fit a ninja. KayKit's ninja (Series 4) costs money.

## Known gaps

No models yet for: buildings (Main Fortress, Dojo, Shooting Range, Dragon King's Cave, nests), the in-game Dragon King Egg, Stone Dragon (non-flying) and dragon baby, resource sites (gold mines, crystals, quarries). Use simple placeholders until a pack has been approved.
