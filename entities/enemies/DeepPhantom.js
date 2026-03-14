import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class DeepPhantom extends Entity {
    constructor(x, y) {
        super(x, y, 20, 28);
        this.hp = 35;
        this.speed = 120;
        this.gravityState = 'zero';
        this.targetX = x;
        this.targetY = y;
        this.shootCooldown = 0;
        this.invisible = false;
        this.invisibleTimer = 0;
    }

    updateAI(dt, player) {
        this.shootCooldown = Math.max(0, this.shootCooldown - dt);
        this.invisibleTimer = Math.max(0, this.invisibleTimer - dt);

        if (this.invisibleTimer > 0) {
            this.invisible = true;
            // Move erratically while invisible
            this.targetX = player.x + (Math.random() - 0.5) * 200;
            this.targetY = player.y + (Math.random() - 0.5) * 200;
        } else {
            this.invisible = false;
            if (player) {
                // Dash towards player
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 0) {
                    this.vx = (dx / dist) * this.speed;
                    this.vy = (dy / dist) * this.speed;
                }

                if (this.isColliding(player) && this.shootCooldown === 0) {
                    player.hp -= 15 * (dt / 1000);
                    this.shootCooldown = 1500;
                    this.invisibleTimer = 1500; // Go invisible after hitting
                }
            }
        }
    }

    update(dt) {
        if (GameManager.player) {
            this.updateAI(dt, GameManager.player);
        }

        const dtSec = dt / 1000;
        this.x += this.vx * dtSec;
        this.y += this.vy * dtSec;
    }

    isColliding(other) {
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
    }

    draw(ctx) {
        if (this.invisible) {
            ctx.fillStyle = 'rgba(100, 100, 200, 0.3)';
        } else {
            ctx.fillStyle = '#66f';
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        if (!this.invisible) {
            ctx.strokeStyle = '#88f';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
