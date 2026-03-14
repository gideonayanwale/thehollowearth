import Entity from './Entity.js';
import GameManager from '../core/GameManager.js';

export default class Player extends Entity {
    constructor(x, y) {
        super(x, y, 24, 24);
        this.speed = 200;
        this.maxHp = 100;
        this.hp = 100;
        this.lanternRadius = 150;
        this.maxLanternFuel = 100;
        this.lanternFuel = 100;
        this.lightBoost = 0;
        this.inventory = { ore: 0, explosive_powder: 0, iron_ore: 0 };
        
        // Upgrade attributes
        this.jumpForce = 300;
        this.damageReduction = 0;
        this.attackMultiplier = 1.0;
        this.regenerationRate = 0;
        this.lastRegenTime = 0;
    }

    update(dt) {
        if (GameManager.inputManager.isDown('ArrowLeft')) {
            this.vx = -this.jumpForce;
        } else if (GameManager.inputManager.isDown('ArrowRight')) {
            this.vx = this.jumpForce;
        } else {
            this.vx = 0;
        }
        }

        this.lanternFuel = Math.max(0, this.lanternFuel - (dt / 3000));

        // Regeneration
        if (this.regenerationRate > 0) {
            this.lastRegenTime += dt;
            if (this.lastRegenTime >= 1000) {
                this.hp = Math.min(this.maxHp, this.hp + this.regenerationRate);
                this.lastRegenTime = 0;
            }
        }
        } else {
            this.vx = 0;
        }

        const onGround = this.vy === 0;
        if ((GameManager.inputManager.isDown('ArrowUp') || GameManager.inputManager.isDown('KeyW') || GameManager.inputManager.isDown('Space')) && onGround) {
            this.vy = this.gravityState === "inverted" ? 300 : -300;
        }

        this.lanternFuel = Math.max(0, this.lanternFuel - (dt / 3000));

        if (this.lightBoost > 0) {
            this.lightBoost -= dt;
        }

        // Expansion: Apply armor reduction
        const armorBonus = GameManager.playerUpgrades?.getUpgradeBonus('armor') || 0;
        this.armorRating = armorBonus * 0.1;

        super.update(dt);

        this.checkTileInteractions();
    }

    takeDamage(amount) {
        // Expansion: Invincibility power-up
        if (GameManager.powerUpSystem?.isPowerUpActive('invincible')) return;
        const actualDamage = amount * (1 - this.armorRating);
        this.hp -= actualDamage;
        // Particle feedback
        if (GameManager.particleSystem) {
            GameManager.particleSystem.emit(this.x + this.width/2, this.y + this.height/2, 'blood', 5);
        }
    }

    checkTileInteractions() {
        if (!GameManager.layer) return;

        const currentTile = GameManager.layer.getTileAt(this.x + this.width / 2, this.y + this.height / 2);

        if (currentTile) {
            if (currentTile.type === 'descent') {
                GameManager.loadLayer(GameManager.currentLayerIndex + 1);
            } else if (currentTile.type === 'gravity_flip') {
                this.gravityState = this.gravityState === 'normal' ? 'inverted' : 'normal';
                currentTile.type = 'empty';
                currentTile.color = null;
                currentTile.solid = false;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#4af';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.lanternFuel > 0) {
            ctx.fillStyle = 'rgba(255, 200, 50, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
