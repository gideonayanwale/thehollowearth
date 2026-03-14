import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class LavaSpitter extends Entity {
    constructor(x, y) {
        super(x, y, 28, 28);
        this.hp = 40;
        this.speed = 30;
        this.direction = 1;
        this.shootTimer = 0;
        this.shootInterval = 2000; // ms between shots
        this.projectiles = [];
    }

    updateAI(dt, player) {
        this.shootTimer += dt;

        // Simple movement
        if (Math.random() < 0.02) {
            this.direction *= -1;
        }
        this.vx = this.direction * this.speed;

        // Shoot at player
        if (player && this.shootTimer > this.shootInterval) {
            this.shootFireball(player);
            this.shootTimer = 0;
        }
    }

    shootFireball(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            const vx = (dx / dist) * 150;
            const vy = (dy / dist) * 150;
            
            if (GameManager.layer) {
                const fireball = {
                    x: this.x + this.width / 2,
                    y: this.y + this.height / 2,
                    vx: vx,
                    vy: vy,
                    width: 8,
                    height: 8,
                    lifetime: 3000,
                    damage: 25
                };
                GameManager.layer.projectiles.push(fireball);
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
        ctx.fillStyle = '#f40';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw mouth
        ctx.fillStyle = '#f80';
        ctx.fillRect(this.x + 8, this.y + 12, 12, 4);
    }
}
