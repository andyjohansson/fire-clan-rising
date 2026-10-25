# Fire Clan Rising – Roadmap

## Version 0.1 – First playable

Play as the **Ninjas** against a computer-controlled **Dragon** opponent.

### Scope

1. **Map:** 256×256 with Dragon Mountain (winding path), Ninja Valley, home areas, expansion sites, forests, lakes, a river with bridges and fords. Fog of war and a minimap.
2. **Ninjas:** Worker Ninja, Sword Ninja, Shuriken Ninja. Buildings: Main Fortress, Dojo, Shooting Range.
3. **Dragons:** Dragon baby (worker), Fire Dragon, Stone Dragon. Structures: Dragon King's Cave, Fire Nest, Nursery Cave.
4. **Resources:** Wood, rice and meat only. Stone, gold and magic crystals come later.
5. **Win conditions:** The full core – stealing the egg, the egg timer, and destroying the Main Fortress.
6. **Opponent:** Dragon AI only.

### Milestones

The detailed backlog lives on GitHub:

1. **Kanban board:** [Fire Clan Rising project](https://github.com/users/andyjohansson/projects/1)
2. **Milestones and progress:** [GitHub milestones](https://github.com/andyjohansson/fire-clan-rising/milestones)

The order is chosen so the core game (combat and the egg) becomes playable as early as possible, with fixed starting armies. Economy and building are added once that core is fun.

| Milestone | Summary |
|-----------|---------|
| 1. Foundation (done) | Project setup, 3D map, camera, selecting and moving units with the mouse |
| [1b. Visuals and map](https://github.com/andyjohansson/fire-clan-rising/milestone/1) | Asset registry and loading screen (done), then in order: preview links for PRs, FPS meter, lighting and atmosphere, 256×256 terrain, map layout, water, animated ninjas, fog of war, minimap, game language |
| [2. Combat](https://github.com/andyjohansson/fire-clan-rising/milestone/2) | Units attack and damage each other |
| [3. The egg](https://github.com/andyjohansson/fire-clan-rising/milestone/4) | Carrying and dropping the egg, the egg timer, winning and losing – with fixed starting armies |
| [4. Dragon AI](https://github.com/andyjohansson/fire-clan-rising/milestone/5) | The computer controls the dragons: defending the egg and counter-attacking |
| [5. Economy and building](https://github.com/andyjohansson/fire-clan-rising/milestone/3) | Gathering resources, constructing buildings, training units; the dragon AI learns to use the economy |

## Later versions

1. Dragons as a playable faction, plus a Ninja AI.
2. The remaining units, buildings and resources from the design document.
3. [Sound and music](https://github.com/andyjohansson/fire-clan-rising/issues/22).
4. Multiplayer.
