# Fire Clan Rising – Game Design Document

> Status: Early draft. Designed together by Andy and Benjamin.

## 1. Overview

Fire Clan Rising is a real-time strategy (RTS) game where ninjas and dragons fight each other. The feel is inspired by classics like StarCraft, Red Alert and Command & Conquer.

The player chooses to play as either the **Ninjas** or the **Dragons**. The two factions are deliberately asymmetric: the ninjas are the attackers and infiltrators, the dragons are the defenders.

## 2. Story – "The Last Egg"

1. The great Dragon King is dead. All that remains of him is the **Dragon King Egg**.
2. To the dragons, the egg is everything – the next Dragon King will hatch from it.
3. An evil **Ninja Lord** wants the egg, believing it will let him control all dragons.
4. **Playing as the dragons**, you fight to protect the egg until the new Dragon King is born.
5. **Playing as the ninjas**, you follow the Ninja Lord's orders and must steal the egg before it hatches. This opens up a possible twist later on: perhaps some ninjas begin to doubt whether he is right.

## 3. Win Conditions

| Faction | Wins by |
|---------|---------|
| Ninjas  | Stealing the Dragon King Egg and carrying it back to their Main Fortress |
| Dragons | **Either** protecting the egg until it hatches (egg timer runs out, e.g. 20 minutes) **or** destroying the ninjas' Main Fortress |

The egg timer gives the ninjas urgency and lets the dragons win by defending. The Main Fortress condition gives the dragons a reason to go on the attack, and avoids tedious hunts for the last hidden ninja.

Secondary objective for the ninjas: destroying regular dragon eggs to prevent the dragons from growing in numbers.

### 3.1 Carrying the egg

1. A ninja carrying the Dragon King Egg is **always visible** (even a Shadow Ninja) and **moves slowly**.
2. If the carrier is killed, the egg is **dropped** on the ground. Any ninja can pick it up again.
3. Dragons can **carry a dropped egg back** to the Dragon King's Cave.
4. The journey home is meant to be the most exciting part of a match.

## 4. Factions

### 4.1 Ninjas

1. Build bases, in the classic RTS style.
2. Train different types of ninjas in their base (see unit types below).
3. Goal: infiltrate the dragon territory and steal the Dragon King Egg.
4. **Many but weaker** – ninjas are cheap and quick to train compared to dragons, and win through numbers and clever tactics.

#### Ninja unit types

| Unit | Role |
|------|------|
| Worker Ninja | Gathers resources and constructs buildings |
| Sword Ninja | Basic melee fighter – cheap and quick to train. Cannot hit flying dragons; instead it smashes eggs, nests and buildings, and fights Stone Dragons and dragon babies |
| Shuriken Ninja | Ranged attacker – throws stars and can hit flying dragons |
| Shadow Ninja | Can sneak around invisible – ideal for reaching the egg (but becomes visible while carrying it) |
| Master Ninja | The strongest ninja – costs magic crystals. Can hit flying dragons |
| Trapper | Places nets and traps that hold dragons in place for a while. Nets **pull flying dragons down to the ground**, where Sword Ninjas can reach them |

**Cost tiers:** More advanced ninjas cost more resources to train. The Worker Ninja and Sword Ninja are cheap, while the Master Ninja is the most expensive.

#### Ninja buildings

Each ninja type is trained in its own building, mirroring how each dragon type has its own nest.

| Building | Purpose |
|----------|---------|
| Main Fortress | Trains Worker Ninjas and receives gathered resources. The Dragon King Egg must be carried here to win. If it is destroyed, the ninjas lose |
| Dojo | Trains Sword Ninjas |
| Shooting Range | Trains Shuriken Ninjas |
| Shadow Temple | Trains Shadow Ninjas |
| Trap Workshop | Trains Trappers |
| Temple of Masters | Trains Master Ninjas – the most expensive building |
| Rice Barn | Grows and stores rice |
| Watchtower | Shoots at dragons that come close to the base (can hit flying dragons) |

### 4.2 Dragons

1. Build bases in their own way – caves, and nests high up on mountains.
2. Have **male and female dragons**. Gender is mainly cosmetic: any adult female in a nest can lay eggs, no male required.
3. Eggs hatch into **dragon babies**, which grow up into **adult dragons**.
4. **Dragon babies are the workers** – they gather wood, stone, meat and gold, and build caves and nests until they grow up. Babies **can fly**, which makes up for their resources being spread out across the map.
5. Come in different types (see dragon types below). **The nest decides the type**: each dragon type has its own kind of nest (fire nest, ice nest, etc.), and eggs laid there hatch into that type.
6. Attack by breathing fire (or other elements) and tearing down ninja structures.
7. **Few but strong** – each dragon takes a long time to produce, so each one is much stronger than a ninja (compare Protoss vs. Zerg in StarCraft).

#### Dragon types

| Dragon | Role |
|--------|------|
| Fire Dragon | Breathes fire and sets ninja buildings ablaze |
| Ice Dragon | Freezes ninjas in place for a while |
| Lightning Dragon | Shoots lightning that chains between several ninjas |
| Stone Dragon | Slow but extremely tough. Cannot fly – guards the egg like a wall |
| Poison Dragon | Breathes a poison cloud that damages every ninja passing through |
| Shadow Dragon | Can see invisible Shadow Ninjas – the dragons' counter-move |
| Giant Dragon | The strongest dragon – costs magic crystals. Counterpart to the Master Ninja |

**Cost tiers:** Better nests cost more resources to build. A fire or ice nest is cheap, while a Giant Dragon nest is the most expensive.

#### Dragon structures

In addition to one nest per dragon type, the dragons have these structures:

| Structure | Purpose |
|-----------|---------|
| Dragon King's Cave | Main base, high up on a mountain. Holds the Dragon King Egg and the gold hoard, and receives gathered resources. **Slowly produces a reserve egg** now and then, so the dragons can never die out completely |
| Hunting Ground | Where dragon babies hunt for meat – placed out in the forest |
| Treasure Chamber | Buys upgrades with gold (hotter fire, tougher scales, faster wings) |
| Crystal Altar | Spends magic crystals on the egg shield |
| Nursery Cave | Where dragon babies grow up into adults. More caves let more babies grow up at the same time |
| Lookout Cliff | Adult dragons perch here to spot ninjas from far away, including sneaking Shadow Ninjas |

#### Breeding and growth

1. An **adult female dragon sits in a nest** and lays an egg after a while. The mating itself is never shown.
2. The egg **hatches after a while** into a dragon baby of the same type as the nest.
3. The dragon baby **works** – gathering resources and building.
4. When the player chooses, the baby is sent to a **Nursery Cave**. Growing up **costs meat**, and takes a short time during which the baby cannot work.
5. This creates a constant strategic choice: *more workers now, or more warriors?*
6. **Safety net:** the Dragon King's Cave produces a reserve egg now and then, even with no females left.

### 4.3 Core tension

The eggs are both what the dragons must protect **and** how they grow their army. Every egg the ninjas destroy is a dragon that will never be born.

The egg timer puts pressure on both sides: the ninjas must strike before the Dragon King hatches, and the dragons must survive until then – or end the game early by destroying the Main Fortress.

## 5. Economy

Each faction gathers its **own resources**, but both factions also compete for **shared resources** on the map (wood, stone and magic crystals). The shared resources pull the factions into contact and create more action.

| Resource | Gathered by | Used for (draft) |
|----------|-------------|------------------|
| Wood     | Both        | Buildings (ninja bases, dragon caves and nests) |
| Stone    | Both        | Buildings (ninja bases, dragon caves and nests) |
| Rice     | Ninjas      | Training ninjas – grown safely inside the base |
| Meat     | Dragons     | Growing dragon babies into adults in the Nursery Cave (hunted in the forest) |
| Gold     | Dragons     | Mined from gold mines and hoarded in the caves: dragons near the hoard **heal faster**; also buys upgrades (hotter fire, tougher scales, faster wings) |
| Magic crystals | Both  | Strongest units (both factions); magic shield around the Dragon King Egg (dragons) |

**Egg shield:** The dragons can spend magic crystals to put a shield around the Dragon King Egg. The shield blocks the ninjas from taking the egg until they break it by attacking it for long enough.

**Economic asymmetry:** The ninjas' rice is safe inside their base, while the dragons' meat must be hunted in the contested forest. To compensate, dragon babies can fly.

## 6. Map

The first map is **256×256 cells** – large enough that it takes roughly 1.5–2 minutes to walk between the bases, so both sides can build up and explore before they meet. The bases are in opposite corners:

1. **Dragon Mountain** – in one corner, high up. The Dragon King's Cave sits on the summit, reachable by a **narrow path that winds around the mountain**, so ninjas must fight their way up.
2. **Ninja Valley** – in the opposite corner. Flat, with plenty of room to build.
3. **Forest** – in the middle, with wood and animals to hunt.
4. **Stone quarries** – scattered across the map.
5. **Gold mines** – near Dragon Mountain.
6. **Crystal fields** – halfway between the bases, so both factions must fight over them.
7. **River** – crossed by a few bridges and fords. Dragons can fly over it, but ninjas must use the crossings, creating natural battle points.

Each side also gets a **home area** with enough resources to build up safely, and the map has **expansion sites** further out with richer resources worth taking risks for. There are **several routes** between the bases (past lakes, through ravines, over bridges and fords), and the map is filled with detail: different trees, rocks, bushes and grass.

### 6.1 Fog of war

Like the original Red Alert and Command & Conquer: areas that have never been explored are **black**. Once an area has been seen by a unit or building, it stays revealed, including enemy units there.

### 6.2 Minimap

A minimap in the corner of the screen, like in Red Alert and StarCraft:

1. Shows the terrain, units as dots, the fog of war, and a frame for what the camera sees.
2. Left click on the minimap moves the camera; right click sends the selected units there.

## 7. Balance Principles

Guidelines for keeping the game fair, based on a design review:

1. **Both sides must be able to win actively.** No faction should be forced to only wait and defend.
2. **No unstoppable tricks.** Every strong tactic needs a counter (e.g. the visible egg carrier vs. Shadow Ninjas).
3. **No dead ends.** A faction should always have a way to rebuild (e.g. the reserve egg).
4. **Don't stack defences.** The dragons have many defensive advantages (mountain, narrow paths, flying, egg shield, gold healing, Stone Dragon, Lookout Cliff). Each one should be modest on its own, and the egg timer means the dragons don't need a perfect defence.
5. **Every unit needs a clear job.** E.g. Sword Ninjas can't hit flying dragons, so their role is eggs, nests, buildings and ground targets.

## 8. Game Modes

1. **Single player vs. computer** – first priority. Requires a computer opponent (AI) for both factions. Since the factions play very differently, this means **two separate AIs** – plan for the extra work.
2. **Multiplayer** – planned for later.

## 9. Development Scope

The full design is large (6 ninja types, 7 dragon types, 8 ninja buildings, 13 dragon structures). The first playable version should include only a small subset – **2–3 units per side** – and grow step by step from there. See [roadmap.md](roadmap.md) for the plan.

## 10. Visual Style

1. **3D world with a fixed camera** at an oblique angle from above, like a classic RTS.
2. **Stylized and colourful** – think Warcraft III, Northgard or Age of Empires IV. A more realistic style (StarCraft II, C&C 3) may come later.
3. **Real 3D models** from free CC0 asset packs (animated characters, nature, buildings) instead of shapes built in code.
4. **Asset registry** – every game object (e.g. "Sword Ninja", "pine tree") points to a model file through one registry, so the art style can be swapped later without rewriting game code.
5. **Textured terrain** blending grass, dirt, rock and sand by slope and height, with visible paths.
6. **Lighting and atmosphere** – filmic tone mapping, soft shadows, ambient occlusion, sky gradient and distance haze.
7. Height matters: mountains, cliffs and flying dragons are shown naturally in 3D.

## 11. Technology

1. **Browser game** built with **[Three.js](https://threejs.org/)** for 3D rendering.
2. Written in **TypeScript**, with **[Vite](https://vite.dev/)** as dev server and build tool.
3. Runs directly in the web browser – no installation needed, and easy to share with a link.
4. Models are loaded as glTF files through the asset registry.

## 12. Open Questions

1. Egg timer length (around 20 minutes as a starting point).
2. Egg shield details (crystal cost, strength, whether it can be recast).
3. Exact costs for each nest type and ninja type (balanced through playtesting).
4. Breeding timings (egg laying, hatching, growth and reserve egg times – balanced through playtesting).
