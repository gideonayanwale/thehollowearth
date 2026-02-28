# agents.md — Antigravity

## Project Overview

**Antigravity** is a 2D side-scrolling survival/exploration game built in JavaScript using the **HTML5 Canvas API** (or Phaser 3). The player controls a lone explorer descending into a dangerous subterranean realm where gravity behaves unpredictably. The deeper you go, the more hostile and physics-defying the world becomes. The game ends on death, at which point a score breakdown is displayed and the player can restart.

---

## Agent Instructions

When working on this codebase, always follow these rules:

- Write all game logic in **vanilla ES6+ JavaScript** unless the project has already adopted Phaser 3, in which case continue using Phaser 3 conventions consistently.
- Use a **class-based architecture**. Never write loose procedural game logic outside of designated bootstrap files (`main.js`, `index.js`).
- All game state must flow through the `GameManager` singleton. Never store mutable game state in the global scope directly.
- The game loop must use `requestAnimationFrame` with **delta-time** for all movement, timers, and animations. Never use `setInterval` for gameplay logic.
- Use `localStorage` only for persisting high scores. Never store active game state there.
- When adding a new entity type, always extend the base `Entity` class. Never create standalone objects with ad-hoc update/draw methods.
- Canvas rendering must follow a strict **layer order**: background tiles → entities → pickups → UI overlays → lighting surface. Do not deviate from this order.
- The lighting/darkness effect is implemented using a black overlay canvas with `globalCompositeOperation = "destination-out"` and a radial gradient at the player's lantern position. Do not reimplement this using a different approach without explicit instruction.
- All difficulty scaling must go through the global `difficultyMultiplier` derived from `GameManager.currentLayer`. Never hardcode per-enemy stats.
- Score events must always be routed through `scoreManager.add(type, value)`. Never mutate the score directly.

---

## Project Structure

```
antigravity/
├── index.html
├── main.js                  # Entry point, bootstraps GameManager and starts loop
├── core/
│   ├── GameManager.js       # Singleton: game state, layer transitions, difficulty
│   ├── ScoreManager.js      # Tracks and calculates score, exposes add() method
│   ├── InputManager.js      # keydown/keyup listeners, exposes isDown(key) method
│   ├── AudioManager.js      # Web Audio API wrapper, per-layer ambient tracks
│   └── Renderer.js          # Canvas context setup, layer-order draw calls
├── entities/
│   ├── Entity.js            # Base class: position, velocity, hp, update(), draw()
│   ├── Player.js            # Extends Entity: lantern, inventory, gravity state
│   ├── enemies/
│   │   ├── TunnelRat.js
│   │   ├── StoneGolem.js
│   │   ├── CaveWraith.js
│   │   └── AbyssalWarden.js # Boss: multi-phase via this.phase property
│   └── npcs/
│       ├── MoleMerchant.js
│       └── TrappedMiner.js
├── pickups/
│   └── Pickup.js            # Generic pickup class, type-driven behavior
├── world/
│   ├── Layer.js             # Represents one underground zone, owns its rooms
│   ├── Room.js              # Tile grid, entity spawn list, hidden room flag
│   ├── Tile.js              # Individual tile: solid, breakable, hazard types
│   └── Generator.js         # Procedural layout via cellular automata or BSP
├── ui/
│   ├── HUD.js               # HP bar, depth indicator, lantern fuel gauge
│   ├── GameOverScreen.js    # Score breakdown, Play Again / Main Menu buttons
│   ├── MainMenu.js
│   └── MerchantUI.js        # Trade overlay rendered on canvas
├── effects/
│   ├── LightingEngine.js    # Dark overlay + radial gradient cutout
│   ├── Explosion.js         # AoE damage object, removes breakable tiles
│   └── ScreenShake.js       # Offsets canvas translate() temporarily
└── assets/
    ├── sprites/             # Spritesheets (32x32 px)
    ├── audio/               # Ambient loops, SFX
    └── tilemaps/            # Optional static tilemaps per layer
```

---

## Class Hierarchy

```
Entity
├── Player
├── Enemy
│   ├── TunnelRat
│   ├── StoneGolem
│   ├── CaveWraith
│   └── AbyssalWarden
└── NPC
    ├── MoleMerchant
    └── TrappedMiner

Pickup (standalone, not Entity)
Tile (standalone, not Entity)
```

---

## Core Systems

### Game Loop (`main.js`)
Bootstrap via `requestAnimationFrame`. Pass delta-time to `GameManager.update(dt)` each frame, then call `Renderer.draw()`. Nothing else lives in the loop.

### GameManager (`core/GameManager.js`)
The central singleton. Owns `currentLayer` (0–4), `difficultyMultiplier` (scales linearly with layer), references to the active `Layer`, `Player`, `ScoreManager`, `InputManager`, and `AudioManager`. Exposes `loadLayer(index)`, `resetGame()`, and `triggerGameOver()`.

### ScoreManager (`core/ScoreManager.js`)
Tracks score across layer transitions. Exposes `add(type, value)` for all score events. Score types: `"depth"`, `"kill"`, `"pickup"`, `"time"`, `"secret"`, `"rescue"`. Exposes `getBreakdown()` returning a structured object consumed by `GameOverScreen`.

### InputManager (`core/InputManager.js`)
Maintains a `keysDown` Set updated by `keydown` / `keyup` events. Exposes `isDown(key)` and `wasJustPressed(key)` (clears after read). Mouse position and button state tracked separately.

### LightingEngine (`effects/LightingEngine.js`)
Draws a full black rectangle over an offscreen canvas, then punches a radial gradient hole at the player's lantern position using `globalCompositeOperation = "destination-out"`. The result is composited onto the main canvas after all world/entity draws. Light radius is driven by `player.lanternRadius`, which is affected by `lanternFuel` and `lightBoost`.

### Layer Transitions
Reaching a descent tile calls `GameManager.loadLayer(currentLayer + 1)`. This re-seeds `Generator` with a new layout, escalates `difficultyMultiplier`, shifts the `AudioManager` to the next ambient track, and reduces the default `lanternRadius`. `ScoreManager` adds a depth bonus.

---

## Entities

### Player
- Properties: `hp` (starts 100), `speed`, `lanternRadius`, `lanternFuel` (degrades each tick), `lightBoost` (timed), `inventory` (object of resource counts), `gravityState` (normal | inverted | zero — core Antigravity mechanic).
- `gravityState` is toggled by environmental triggers or collected items and directly affects the vertical component of `velocity` each update tick.
- Attack: spawns a short-range `PickaxeSwing` hitbox on input.

### Enemies
All enemies extend `Entity` and implement `updateAI(dt, player)` called by their parent `update()`.

| Class | Layer | Behavior |
|---|---|---|
| TunnelRat | Shallow Caves | Erratic random-direction movement, low HP |
| StoneGolem | Mid-Depths | Direct player chase, no knockback response |
| CaveWraith | Deep Caverns | Ignores wall collision, repelled by light radius (distance check), unkillable |
| AbyssalWarden | Abyssal Core | Multi-phase boss, phase driven by HP thresholds |

### NPCs
- `MoleMerchant`: Opens `MerchantUI` overlay on E press within range. Consumes `iron_ore` from inventory.
- `TrappedMiner`: Rescue interaction via E press. Calls `scoreManager.add("rescue", 500)` and spawns a random `Pickup`.

---

## Resources / Pickups

All pickups are instances of `Pickup` with a `type` string driving behavior in `onCollect(player)`.

| Type | Effect |
|---|---|
| `health_crystal` | `player.hp += 25` |
| `glowstone_shard` | Sets timed `player.lightBoost`, expanding `lanternRadius` |
| `iron_ore` | `player.inventory.iron_ore++` |
| `ancient_coin` | `scoreManager.add("pickup", 250)` |
| `rope_coil` | Single use — calls `GameManager.loadLayer(currentLayer - 1)` |
| `explosive_powder` | Added to inventory, spawns `Explosion` on use |
| `depth_map_fragment` | Tracked per layer — collecting all calls `layer.revealHiddenRooms()` |
| `lantern_oil` | Restores `player.lanternFuel` to max |

---

## World Generation

`Generator.js` produces a `Layer` using **cellular automata** for organic cave shapes or **BSP** for more structured room layouts. Each generated layer includes a guaranteed descent tile, at least one rest point for NPC spawns, hidden rooms flagged `visible: false` until `revealHiddenRooms()` is called, and scaled enemy spawn counts based on `GameManager.difficultyMultiplier`.

---

## Layers / Zones

| Index | Name | Darkness | New Threats | Notes |
|---|---|---|---|---|
| 0 | Surface Ruins | None | None | Tutorial zone, mechanics introduction |
| 1 | Shallow Caves | Mild | Tunnel Rats, basic traps | |
| 2 | Mid-Depths | Dark | Stone Golems, cave-ins | Falling tile hazard objects introduced |
| 3 | Deep Caverns | Very dark | Cave Wraiths | Lantern fuel becomes critical |
| 4 | Abyssal Core | Near-black | Abyssal Warden (boss) | Max difficulty, gravity heavily distorted |

---

## UI & Screens

- **HUD** (`ui/HUD.js`): Rendered last before lighting. Shows HP bar, depth/layer label, lantern fuel gauge, and inventory count for key items.
- **GameOverScreen** (`ui/GameOverScreen.js`): Rendered as a full canvas overlay state. Consumes `scoreManager.getBreakdown()`. Buttons call `GameManager.resetGame()` or `GameManager.goToMainMenu()`.
- **MerchantUI** (`ui/MerchantUI.js`): Canvas-drawn trade panel. Pauses game update loop while open.

---

## Audio

`AudioManager` wraps the **Web Audio API**. Each layer has a corresponding ambient loop loaded and crossfaded on `loadLayer()`. SFX (attack, pickup, damage, cave-in) are short one-shot buffers triggered by entity and world events. Screen shake on impacts is handled by `ScreenShake.apply(intensity, duration)`, which offsets `ctx.translate()` for the given duration.

---

## Antigravity — Core Mechanic Notes

The defining mechanic is `player.gravityState`, which can be `"normal"`, `"inverted"`, or `"zero"`. This is toggled by:
- Stepping on gravity-flip tiles (generated in layers 2+).
- Collecting a **Gravity Shard** pickup (not listed in base resources — add to `Pickup` types).
- Environmental zones in the Abyssal Core where gravity is continuously unstable.

All physics-affected entities (Player, TunnelRat, falling cave-in tiles) must read from a shared `PhysicsManager.getGravity(entity)` method rather than hardcoding a gravity constant, so that per-entity gravity state overrides are handled cleanly.

---

## High Score Persistence

On `triggerGameOver()`, if `scoreManager.total > localStorage.getItem("antigravity_highscore")`, write the new value. `MainMenu` reads and displays this value on load.

---

## Out of Scope (Do Not Implement Unless Instructed)

- Multiplayer or networked features.
- Backend/server-side score submission.
- Mobile touch controls (desktop keyboard/mouse only for now).
- Save/load mid-run state.
- Any canvas rendering library beyond Phaser 3 if already adopted.