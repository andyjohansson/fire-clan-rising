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
2. Train different types of ninjas in their base (unit types to be designed).
3. Goal: infiltrate the dragon territory and steal the Dragon King Egg.

### 4.2 Dragons

1. Build bases in their own way – caves, and nests high up on mountains.
2. Have **male and female dragons**. Only females can lay eggs, and they need a nest to do it.
3. Eggs hatch into **dragon babies**, which grow up into **adult dragons**.
4. Come in different elemental types, e.g. **fire** and **ice** (more to be designed).
5. Attack by breathing fire (or other elements) and tearing down ninja structures.

### 4.3 Core tension

The eggs are both what the dragons must protect **and** how they grow their army. Every egg the ninjas destroy is a dragon that will never be born.

## 5. Game Modes

1. **Single player vs. computer** – first priority. Requires a computer opponent (AI) for both factions.
2. **Multiplayer** – planned for later.

## 6. Visual Style

1. **3D world with a fixed camera** at an oblique angle from above. It looks like a classic isometric RTS, but is real 3D under the hood.
2. **Simple shapes (low-poly)** – units and buildings are built in code from basic primitives (spheres, cones, boxes). No hand-drawn sprites needed.
3. Height matters: mountains, cliffs and flying dragons are shown naturally in 3D.
4. Possible later upgrades: a rotatable camera, and swapping in nicer models (e.g. free low-poly asset packs).

## 7. Open Questions

1. Technology / game engine.
2. Resources and economy – what do the factions gather and spend?
3. Ninja unit types.
4. Dragon types beyond fire and ice, and what makes each one different.
5. Ninja buildings and dragon structures (caves, nests, etc.).
6. How dragon breeding works in practice (pairing, egg timers, growth time).
7. Maps and terrain – mountains, height and flying.
