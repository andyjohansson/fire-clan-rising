# Fire Clan Rising – Game Design Document

> Status: Early draft. Designed together by Andy and Benjamin.

## 1. Overview

Fire Clan Rising is a real-time strategy (RTS) game where ninjas and dragons fight each other. The feel is inspired by classics like StarCraft, Red Alert and Command & Conquer.

The player chooses to play as either the **Ninjas** or the **Dragons**. The two factions are deliberately asymmetric: the ninjas are the attackers and infiltrators, the dragons are the defenders.

## 2. Story – "The Last Egg"

1. The great Dragon King is dead. All that remains of him is the **Dragon King Egg**.
2. To the dragons, the egg is everything – the next Dragon King will hatch from it.
3. An evil **Ninja Lord** wants the egg, believing it will let him control all dragons.
4. **Playing as the dragons**, you fight to save your people's future.
5. **Playing as the ninjas**, you follow the Ninja Lord's orders. This opens up a possible twist later on: perhaps some ninjas begin to doubt whether he is right.

## 3. Win Conditions

| Faction | Wins by |
|---------|---------|
| Ninjas  | Stealing the Dragon King Egg and carrying it back to their base |
| Dragons | Killing all ninjas |

Secondary objective for the ninjas: destroying regular dragon eggs to prevent the dragons from growing in numbers.

## 4. Factions

### 4.1 Ninjas

1. Build bases, in the classic RTS style.
2. Train different types of ninjas in their base (see unit types below).
3. Goal: infiltrate the dragon territory and steal the Dragon King Egg.

#### Ninja unit types

| Unit | Role |
|------|------|
| Worker Ninja | Gathers resources and constructs buildings |
| Sword Ninja | Basic melee fighter – cheap and quick to train |
| Shuriken Ninja | Ranged attacker – throws stars and can hit flying dragons |
| Shadow Ninja | Can sneak around invisible – ideal for stealing the egg |
| Master Ninja | The strongest ninja – costs magic crystals |
| Trapper | Places nets and traps that hold dragons in place for a while |

**Cost tiers:** More advanced ninjas cost more resources to train. The Worker Ninja and Sword Ninja are cheap, while the Master Ninja is the most expensive.

#### Ninja buildings

Each ninja type is trained in its own building, mirroring how each dragon type has its own nest.

| Building | Purpose |
|----------|---------|
| Main Fortress | Trains Worker Ninjas and receives gathered resources. The Dragon King Egg must be carried here to win |
| Dojo | Trains Sword Ninjas |
| Shooting Range | Trains Shuriken Ninjas |
| Shadow Temple | Trains Shadow Ninjas |
| Trap Workshop | Trains Trappers |
| Temple of Masters | Trains Master Ninjas – the most expensive building |
| Rice Barn | Grows and stores rice |
| Watchtower | Shoots at dragons that come close to the base |

### 4.2 Dragons

1. Build bases in their own way – caves, and nests high up on mountains.
2. Have **male and female dragons**. Only females can lay eggs, and they need a nest to do it.
3. Eggs hatch into **dragon babies**, which grow up into **adult dragons**.
4. **Dragon babies are the workers** – they gather wood, stone and meat, and build caves and nests until they grow up.
5. Come in different types (see dragon types below). **The nest decides the type**: each dragon type has its own kind of nest (fire nest, ice nest, etc.), and eggs laid there hatch into that type.
6. Attack by breathing fire (or other elements) and tearing down ninja structures.

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
| Dragon King's Cave | Main base, high up on a mountain. Holds the Dragon King Egg and the gold hoard, and receives gathered resources |
| Hunting Ground | Where dragon babies hunt for meat – placed out in the forest |
| Treasure Chamber | Buys upgrades with gold (hotter fire, tougher scales, faster wings) |
| Crystal Altar | Spends magic crystals on the egg shield |
| Nursery Cave | Where dragon babies grow up into adults. More caves let more babies grow up at the same time |
| Lookout Cliff | Adult dragons perch here to spot ninjas from far away, including sneaking Shadow Ninjas |

### 4.3 Core tension

The eggs are both what the dragons must protect **and** how they grow their army. Every egg the ninjas destroy is a dragon that will never be born.

## 5. Economy

Each faction gathers its **own resources**, but both factions also compete for **shared resources** on the map (wood, stone and magic crystals). The shared resources pull the factions into contact and create more action.

| Resource | Gathered by | Used for (draft) |
|----------|-------------|------------------|
| Wood     | Both        | Buildings (ninja bases, dragon caves and nests) |
| Stone    | Both        | Buildings (ninja bases, dragon caves and nests) |
| Rice     | Ninjas      | Training ninjas |
| Meat     | Dragons     | Raising dragon babies (hunted) |
| Gold     | Dragons     | Hoarded in the caves: dragons near the hoard get stronger and heal faster; also buys upgrades (hotter fire, tougher scales, faster wings) |
| Magic crystals | Both  | Strongest units (both factions); magic shield around the Dragon King Egg (dragons) |

**Egg shield:** The dragons can spend magic crystals to put a shield around the Dragon King Egg. The shield blocks the ninjas from taking the egg until they break it by attacking it for long enough.

## 6. Game Modes

1. **Single player vs. computer** – first priority. Requires a computer opponent (AI) for both factions.
2. **Multiplayer** – planned for later.

## 7. Visual Style

1. **3D world with a fixed camera** at an oblique angle from above. It looks like a classic isometric RTS, but is real 3D under the hood.
2. **Simple shapes (low-poly)** – units and buildings are built in code from basic primitives (spheres, cones, boxes). No hand-drawn sprites needed.
3. Height matters: mountains, cliffs and flying dragons are shown naturally in 3D.
4. Possible later upgrades: a rotatable camera, and swapping in nicer models (e.g. free low-poly asset packs).

## 8. Technology

1. **Browser game** built with **[Three.js](https://threejs.org/)** for 3D rendering.
2. Runs directly in the web browser – no installation needed, and easy to share with a link.
3. All game content (units, buildings, maps) is defined in code, matching the simple low-poly style.

## 9. Open Questions

1. Project setup details (e.g. JavaScript vs. TypeScript, build tool).
2. Egg shield details (crystal cost, strength, whether it can be recast).
3. Exact costs for each nest type and ninja type (balanced through playtesting).
4. How dragon breeding works in practice (pairing, egg timers, growth time).
5. Maps and terrain – mountains, height and flying.
