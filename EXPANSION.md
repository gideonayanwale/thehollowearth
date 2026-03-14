# HOLLOW EARTH - Game Expansion Guide

## NEW CONTENT ADDED

### 1. NEW ENEMY TYPES

#### CrystallineSlug (entities/enemies/CrystallineSlug.js)
- **HP**: 40
- **Speed**: 80
- **Mechanic**: Hard shell that bounces attacks, temporarily vulnerable after being hit
- **Loot**: Iron ore, glowstone shards
- **Strategy**: Hit from behind or wait for shell to drop

#### ShadowSpider (entities/enemies/ShadowSpider.js)
- **HP**: 35
- **Speed**: 120
- **Mechanic**: Spins around player when close, creates web effect
- **Loot**: Ancient coins, silk thread
- **Strategy**: Keep distance, use speed boosts to outrun

#### MagmaBat (entities/enemies/MagmaBat.js)
- **HP**: 30
- **Speed**: 110
- **Mechanic**: Flies with heat trail, bobs through the air
- **Loot**: Explosive powder, lantern oil
- **Strategy**: Avoid the heat trail, use terrain for cover

### 2. BOSS BATTLES

#### DepthTitan (entities/bosses/DepthTitan.js)
- **Max HP**: 400
- **Location**: Deep layers (layer 5+)
- **Phases**: 4 phases with increasing difficulty
  - Phase 1: Basic charging pattern
  - Phase 2: Spinning charges
  - Phase 3: Rapid attacks
  - Phase 4: Chaotic movement
- **Rewards**: 500 score, depth key fragment

#### CrystalColossus (entities/bosses/CrystalColossus.js)
- **Max HP**: 350
- **Location**: Crystal caverns (layer 7+)
- **Phases**: 4 phases
  - Spawns protective crystal shards
  - Gains reflection mode in later phases
  - Increases crystal count per phase
- **Rewards**: 450 score, gravity shard

### 3. SYSTEMS

#### PowerUpSystem (systems/PowerUpSystem.js)
Available power-ups:
- **Shielded** (8s): Temporary shield
- **Invincible** (5s): No damage taken
- **Speed Boost** (6s): 2x movement speed
- **Light Boost** (4s): Extended lantern radius
- **Damage Boost** (6s): Double damage output

#### AchievementSystem (systems/AchievementSystem.js)
9 achievements with point system:
- First Blood: Defeat first enemy (10 pts)
- Deep Explorer: Reach layer 5 (50 pts)
- Abyssal Conqueror: Reach layer 10 (100 pts)
- Resource Gatherer: Collect 50 iron ore (25 pts)
- High Roller: Earn 10000 score (75 pts)
- Survivor: Complete layer without damage (40 pts)
- Gravity Master: Flip gravity 20 times (35 pts)
- Boss Slayer: Defeat a boss (60 pts)
- Unstoppable: Get 5x score multiplier (90 pts)

#### CraftingSystem (systems/CraftingSystem.js)
5 craftable recipes:
1. **Healing Potion** → Restore 25 HP
2. **Light Amplifier** → Boost lantern radius
3. **Explosive Charge** → Deal 50 damage in radius
4. **Reinforced Armor** → +25 HP shield
5. **Depth Key** → Unlock deeper areas

#### ParticleSystem (systems/ParticleSystem.js)
6 particle types:
- Sparks (yellow)
- Smoke (gray)
- Blood (red)
- Crystals (cyan)
- Healing (green)
- Explosions (orange)

### 4. INTERACTIVE TILES

6 new interactive tile types:
- **Spike Trap**: Deals 25 damage on contact
- **Healing Spring**: Restores 10 HP
- **Speed Pad**: Doubles horizontal velocity
- **Bounce Pad**: Strong upward jump
- **Teleport Tile**: Portal to another location
- **Lava Pit**: Deals 40 damage on contact

### 5. NEW PICKUPS
- health_crystal
- glowstone_shard
- ancient_coin
- rope_coil
- lantern_oil
- gravity_shard
- depth_map_fragment

### 6. NEW UI SCREENS

#### AchievementUI (ui/AchievementUI.js)
- Displays all achievements in grid
- Shows unlock status
- Tracks total points
- Mini version for HUD

#### InventoryUI (ui/InventoryUI.js)
- View all inventory items
- Display available recipes
- Show craft requirements
- Craft items with keyboard shortcuts

## INTEGRATION INSTRUCTIONS

### To use these in GameManager:

```javascript
import PowerUpSystem from '../systems/PowerUpSystem.js';
import AchievementSystem from '../systems/AchievementSystem.js';
import CraftingSystem from '../systems/CraftingSystem.js';
import ParticleSystem from '../systems/ParticleSystem.js';

// In GameManager constructor:
this.powerUpSystem = new PowerUpSystem();
this.achievementSystem = new AchievementSystem();
this.craftingSystem = new CraftingSystem();
this.particleSystem = new ParticleSystem();

// In update():
this.powerUpSystem.update(dt, this.player);
this.craftingSystem.update(dt);
this.particleSystem.update(dt);

// In triggerGameOver():
this.achievementSystem.setStat('highScore', 
  Math.max(this.achievementSystem.stats.highScore, 
  this.scoreManager.total));
```

### To add new enemies to Generator:

```javascript
import CrystallineSlug from '../entities/enemies/CrystallineSlug.js';
import ShadowSpider from '../entities/enemies/ShadowSpider.js';
import MagmaBat from '../entities/enemies/MagmaBat.js';
import DepthTitan from '../entities/bosses/DepthTitan.js';

// In generate() method, add to appropriate layer:
if (layerIndex >= 3) {
  layer.entities.push(new CrystallineSlug(x, y));
}
if (layerIndex >= 4) {
  layer.entities.push(new ShadowSpider(x, y));
}
if (layerIndex >= 5) {
  layer.entities.push(new MagmaBat(x, y));
  // Boss in deepest layer
  layer.entities.push(new DepthTitan(centerX, centerY));
}
```

### To draw UI elements in Renderer:

```javascript
import AchievementUI from '../ui/AchievementUI.js';
import InventoryUI from '../ui/InventoryUI.js';

// In draw():
if (showAchievements) {
  AchievementUI.draw(ctx, width, height);
}
if (showInventory) {
  InventoryUI.draw(ctx, width, height);
}
AchievementUI.drawMini(ctx, width, height); // Always show
```

## GAMEPLAY ENHANCEMENTS

1. **Multiple Enemy Types**: Each layer has unique enemy roster
2. **Boss Battles**: Epic multi-phase encounters every few layers
3. **Crafting System**: Strategic resource management
4. **Achievement Tracking**: Long-term progression goals
5. **Visual Feedback**: Particle effects for all impacts
6. **Environmental Hazards**: Interactive tiles add challenge
7. **Power-ups**: Risk/reward gameplay mechanics

## DIFFICULTY SCALING

- Layer 1-2: Basic enemies only
- Layer 3-4: New enemy types introduced
- Layer 5-7: Mixed enemy encounters
- Layer 8+: Boss battles, rare enemies
- Difficulty multiplier increases enemy stats by 50% per layer

## RECOMMENDED CONTROLS ADDITIONS

- **I**: Toggle inventory
- **A**: Toggle achievements
- **C + Arrows**: Craft items
- **E**: Interact with NPCs
- **R**: Restart level

---

**The Hollow Earth is ready for deep exploration!** ⛏️
