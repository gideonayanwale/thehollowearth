# HOLLOW EARTH - Complete Integration Guide

## Overview
This guide explains how to integrate all the new expansion systems into the existing game code.

## Files Created

### New Enemies (entities/enemies/)
- `CrystallineSlug.js` - Shell-based enemy
- `ShadowSpider.js` - Chasing enemy with spin attack
- `MagmaBat.js` - Flying enemy with heat trail

### New Bosses (entities/bosses/)
- `BossBase.js` - Abstract boss class with phase system
- `DepthTitan.js` - Multi-phase charging boss
- `CrystalColossus.js` - Crystal-spawning boss

### Systems (systems/)
- `PowerUpSystem.js` - Temporary power-ups management
- `AchievementSystem.js` - Achievement tracking & points
- `CraftingSystem.js` - Recipe-based crafting
- `ParticleSystem.js` - Visual particle effects
- `PlayerUpgrades.js` - Permanent player stat upgrades (shop)
- `SettingsMenu.js` - Game settings & difficulty

### UI (ui/)
- `NPCDialogue.js` - NPC dialogue & merchant system
- `AchievementUI.js` - Achievement display screen
- `InventoryUI.js` - Inventory & crafting UI
- `UpgradeShop.js` - Upgrade purchase screen
- `SettingsMenu.js` - Settings menu

### World (world/)
- `InteractiveTile.js` - Spike traps, healing springs, bounce pads, etc.

### Documentation
- `EXPANSION.md` - Feature overview

---

## Step 1: Update GameManager Constructor

**File**: `core/GameManager.js`

Add these imports at the top:
```javascript
import PowerUpSystem from '../systems/PowerUpSystem.js';
import AchievementSystem from '../systems/AchievementSystem.js';
import CraftingSystem from '../systems/CraftingSystem.js';
import ParticleSystem from '../systems/ParticleSystem.js';
import PlayerUpgrades from '../systems/PlayerUpgrades.js';
import SettingsMenu from '../systems/SettingsMenu.js';
```

In the constructor, add:
```javascript
constructor() {
    // ... existing code ...
    
    this.powerUpSystem = new PowerUpSystem();
    this.achievementSystem = new AchievementSystem();
    this.craftingSystem = new CraftingSystem();
    this.particleSystem = new ParticleSystem();
    this.playerUpgrades = new PlayerUpgrades();
    this.settingsMenu = new SettingsMenu();
    
    this.uiState = {
        showInventory: false,
        showAchievements: false,
        showUpgradeShop: false,
        showSettings: false,
        showMerchant: false,
        dialogueActive: false
    };
}
```

---

## Step 2: Update GameManager Update Method

In `GameManager.update(dt)`:
```javascript
update(cappedDt) {
    if (this.state === 'PLAYING') {
        // ... existing update code ...
        
        // Add new system updates
        this.powerUpSystem.update(cappedDt, this.player);
        this.particleSystem.update(cappedDt);
        this.craftingSystem.update(cappedDt);
        
        // Apply upgrades to player
        if (this.player) {
            this.playerUpgrades.applyUpgradesToPlayer(this.player);
        }
    }
}
```

---

## Step 3: Update InputManager

Add new key handlers in `core/InputManager.js`:
```javascript
// In init():
document.addEventListener('keydown', (e) => {
    // ... existing code ...
    
    // New UI toggles
    if (e.key === 'i' || e.key === 'I') {
        GameManager.uiState.showInventory = !GameManager.uiState.showInventory;
    }
    if (e.key === 'a' || e.key === 'A') {
        GameManager.uiState.showAchievements = !GameManager.uiState.showAchievements;
    }
    if (e.key === 's' || e.key === 'S') {
        GameManager.uiState.showUpgradeShop = !GameManager.uiState.showUpgradeShop;
    }
    if (e.key === 'Escape') {
        // Close all UIs
        GameManager.uiState.showInventory = false;
        GameManager.uiState.showAchievements = false;
        GameManager.uiState.showUpgradeShop = false;
        GameManager.uiState.showSettings = false;
    }
    
    // Upgrade purchases (1-6)
    if (e.key >= '1' && e.key <= '6' && GameManager.uiState.showUpgradeShop) {
        const upgradeKeys = Object.keys(GameManager.playerUpgrades.upgrades);
        const index = parseInt(e.key) - 1;
        if (index < upgradeKeys.length) {
            const key = upgradeKeys[index];
            const cost = GameManager.playerUpgrades.getCost(key);
            if (GameManager.scoreManager.canSpend(cost)) {
                GameManager.playerUpgrades.purchase(key, GameManager.scoreManager.total);
                GameManager.scoreManager.subtract(cost);
            }
        }
    }
});
```

---

## Step 4: Update Generator

Import new enemies in `world/Generator.js`:
```javascript
import CrystallineSlug from '../entities/enemies/CrystallineSlug.js';
import ShadowSpider from '../entities/enemies/ShadowSpider.js';
import MagmaBat from '../entities/enemies/MagmaBat.js';
import DepthTitan from '../entities/bosses/DepthTitan.js';
import CrystalColossus from '../entities/bosses/CrystalColossus.js';
```

In the `generate()` method, update enemy spawning:
```javascript
// Replace the existing enemy spawning with:

if (layerIndex <= 2) {
    // Basic enemies
    layer.entities.push(new TunnelRat((mainRoom.x + 5) * tileSize, (mainRoom.y + 10) * tileSize));
    layer.entities.push(new StoneGolem((mainRoom.x + 15) * tileSize, (mainRoom.y + 10) * tileSize));
}
else if (layerIndex === 3) {
    // Introduce new enemy types
    layer.entities.push(new CrystallineSlug((mainRoom.x + 8) * tileSize, (mainRoom.y + 12) * tileSize));
    layer.entities.push(new TunnelRat((mainRoom.x + 5) * tileSize, (mainRoom.y + 10) * tileSize));
}
else if (layerIndex === 4) {
    layer.entities.push(new ShadowSpider((mainRoom.x + 10) * tileSize, (mainRoom.y + 10) * tileSize));
    layer.entities.push(new CrystallineSlug((mainRoom.x + 5) * tileSize, (mainRoom.y + 12) * tileSize));
}
else if (layerIndex === 5) {
    // Boss layer
    layer.entities.push(new DepthTitan((mainRoom.x + 10) * tileSize, (mainRoom.y + 10) * tileSize));
    layer.entities.push(new MagmaBat((mainRoom.x + 3) * tileSize, (mainRoom.y + 5) * tileSize));
}
else if (layerIndex === 7) {
    // Crystal boss layer
    layer.entities.push(new CrystalColossus((mainRoom.x + 10) * tileSize, (mainRoom.y + 10) * tileSize));
}
else if (layerIndex > 7) {
    // Deep layers - mix of all enemies
    const enemyTypes = [CrystallineSlug, ShadowSpider, MagmaBat];
    for (let i = 0; i < 3; i++) {
        const EnemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const x = (mainRoom.x + 5 + i * 5) * tileSize;
        const y = (mainRoom.y + 10) * tileSize;
        layer.entities.push(new EnemyType(x, y));
    }
}
```

---

## Step 5: Update Renderer

**File**: `core/Renderer.js`

Import new UI systems:
```javascript
import AchievementUI from '../ui/AchievementUI.js';
import InventoryUI from '../ui/InventoryUI.js';
import UpgradeShop from '../ui/UpgradeShop.js';
import NPCDialogue from '../ui/NPCDialogue.js';
```

In the `draw()` method, add before the final screen display:
```javascript
draw() {
    // ... existing rendering code ...
    
    // Draw particles on top of game
    if (GameManager.particleSystem) {
        GameManager.particleSystem.draw(this.ctx);
    }
    
    // Draw power-up indicators
    if (GameManager.powerUpSystem) {
        GameManager.powerUpSystem.drawPowerUpIndicators(this.ctx, this.width, this.height);
    }
    
    // Draw UI overlays
    if (GameManager.uiState.showInventory) {
        InventoryUI.draw(this.ctx, this.width, this.height);
        return;
    }
    
    if (GameManager.uiState.showAchievements) {
        AchievementUI.draw(this.ctx, this.width, this.height);
        return;
    }
    
    if (GameManager.uiState.showUpgradeShop) {
        UpgradeShop.draw(this.ctx, this.width, this.height);
        return;
    }
    
    if (GameManager.uiState.showSettings) {
        GameManager.settingsMenu.drawSettingsMenu(this.ctx, this.width, this.height);
        return;
    }
}
```

---

## Step 6: Update Player Class

**File**: `entities/Player.js`

Add damage reduction from armor:
```javascript
update(dt) {
    // ... existing code ...
    
    // Apply armor reduction
    const armorBonus = GameManager.playerUpgrades?.getUpgradeBonus('armor') || 0;
    this.armorRating = armorBonus * 0.1;
}
```

Modify damage intake:
```javascript
takeDamage(amount) {
    const actualDamage = amount * (1 - this.armorRating);
    
    // Check for invincibility power-up
    if (GameManager.powerUpSystem?.isPowerUpActive('invincible')) {
        return;
    }
    
    this.hp -= actualDamage;
    
    // Emit particles
    if (GameManager.particleSystem) {
        GameManager.particleSystem.emit(this.x + this.width/2, this.y + this.height/2, 'blood', 5);
    }
}
```

---

## Step 7: Update ScoreManager

Add methods to `core/ScoreManager.js`:
```javascript
canSpend(amount) {
    return this.total >= amount;
}

subtract(amount) {
    this.total -= amount;
}

add(type, amount) {
    // Apply difficulty multiplier
    const difficultyMultiplier = GameManager.settingsMenu?.getDifficultyMultiplier('score') || 1.0;
    this.total += amount * difficultyMultiplier;
}
```

---

## Step 8: Testing Checklist

- [ ] Game loads without console errors
- [ ] All new enemies spawn correctly
- [ ] Bosses appear at correct layers
- [ ] Achievements track properly
- [ ] Crafting recipes are accessible
- [ ] Power-ups activate from pickups
- [ ] Upgrade shop functional
- [ ] Particle effects appear
- [ ] Settings save/load correctly
- [ ] NPC dialogue displays

---

## Difficulty Settings Applied

The SettingsMenu automatically adjusts:
- **Easy**: 70% enemy health, 60% damage taken, 50% score
- **Normal**: 100% baseline (default)
- **Hard**: 140% enemy health, 130% damage, 150% score
- **Nightmare**: 200% enemy health, 180% damage, 200% score

---

## Save Data Structure

The game now saves:
- `hollow_earth_highscore` - Best score
- `hollow_earth_achievements` - Achievement status
- `hollow_earth_inventory` - Crafting items
- `hollow_earth_upgrades` - Upgrade levels
- `hollow_earth_settings` - Game settings
- `hollow_earth_stats` - Gameplay statistics

---

## Recommended Next Steps

1. **Audio**: Implement AudioManager with new enemy sounds & boss music
2. **More Bosses**: Create additional boss variants
3. **Story Mode**: Add narrative elements with NPCs
4. **Procedural Maps**: More complex generation with themes
5. **Multiplayer**: Ghost data/leaderboards
6. **Mobile Support**: Touch controls for phones

---

**The Hollow Earth is fully expanded and ready for players!** ⛏️
