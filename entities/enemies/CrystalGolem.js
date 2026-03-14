import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class CrystalGolem extends Entity {
    constructor(x, y) {
        super(x, y, 56, 56);
        this.hp = 300;
        this.maxHp = 300;
        this.phase = 1;
        this.speed = 60;
        this.actionTimer = 0;
        this.actionInterval = 3000;
        this.crystalShards = [];
    }

    updateAI(dt, player) {
        this.actionTimer += dt;

        // Phase transition
        if (this.hp < this.maxHp * 0.66 && this.phase === 1) {
            this.phase = 2;
            this.speed = 80;
        }
        if (this.hp < this.maxHp * 0.33 && this.phase === 2) {
            this.phase = 3;
            this.speed = 100;
            this.gravityState = 'zero';
        }

        if (player) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Chase player
            if (dist > 0) {
                this.vx = (dx / dist) * this.speed;
                if (this.phase >= 3) {
                    this.vy = (dy / dist) * this.speed;
                }
            }

            // Special attacks
            if (this.actionTimer > this.actionInterval) {
                if (this.phase === 1) {
                    this.thrustAttack(player);
                } else if (this.phase === 2) {
                    this.spawnCrystals();
                } else {
                    this.orbitalAttack();
                }
                this.actionTimer = 0;
            }

            if (this.isColliding(player)) {
                player.hp -= 40 * (dt / 1000);
            }
        }
    }

    thrustAttack(player) {
        // Rapid dash towards player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
            this.vx = (dx / dist) * (this.speed * 2);
        }
    }

    spawnCrystals() {
        if (GameManager.layer) {
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const shard = {
                    x: this.x + this.width / 2,
                    y: this.y + this.height / 2,
                    vx: Math.cos(angle) * 200,
                    vy: Math.sin(angle) * 200,
                    width: 6,
                    height: 6,
                    lifetime: 2000,
                    damage: 20
                };
                GameManager.layer.projectiles.push(shard);
            }
        }
    }

    orbitalAttack() {
        // Become invulnerable and orbit
        this.speed = 0;
        if (GameManager.layer) {
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const projectile = {
                    x: this.x + this.width / 2 + Math.cos(angle) * 40,
                    y: this.y + this.height / 2 + Math.sin(angle) * 40,
                    vx: Math.cos(angle) * 150,
                    vy: Math.sin(angle) * 150,
                    width: 8,
                    height: 8,
                    lifetime: 2500,
                    damage: 15
                };
                GameManager.layer.projectiles.push(projectile);
            }
        }
    }

    update(dt) {
        if (GameManager.player) {
            this.updateAI(dt, GameManager.player);
        }
        super.update(dt);
    }

    isColliding(other) {
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
    }

    draw(ctx) {
        ctx.fillStyle = '#0dd';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw crystal shards
        ctx.fillStyle = '#0ff';
        for (let i = 0; i < 4; i++) {
            const offsetX = Math.cos((i / 4) * Math.PI * 2) * 15;
            const offsetY = Math.sin((i / 4) * Math.PI * 2) * 15;
            ctx.fillRect(this.x + this.width / 2 - 4 + offsetX, this.y + this.height / 2 - 4 + offsetY, 8, 8);
        }

        // Health indicator
        const healthPercent = this.hp / this.maxHp;
        ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : healthPercent > 0.25 ? '#ff0' : '#f00';
        ctx.fillRect(this.x, this.y - 8, this.width * healthPercent, 4);
    }
}
