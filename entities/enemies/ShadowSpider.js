import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class ShadowSpider extends Entity {
    constructor(x, y) {
        super(x, y, 20, 20);
        this.hp = 35;
        this.speed = 120;
        this.seekRange = 200;
        this.isSpinning = false;
        this.spinTimer = 0;
    }

    updateAI(dt, player) {
        if (player) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.seekRange) {
                if (dist > 40) {
                    this.vx = (dx / dist) * this.speed;
                    this.vy = (dy / dist) * this.speed;
                    this.isSpinning = false;
                } else {
                    this.isSpinning = true;
                    this.spinTimer += dt;
                    this.vx = Math.cos(this.spinTimer / 100) * this.speed * 0.5;
                    this.vy = Math.sin(this.spinTimer / 100) * this.speed * 0.5;
                }
            } else {
                this.vx = 0;
                this.vy = 0;
            }

            if (this.isColliding(player)) {
                player.hp -= 18 * (dt / 1000);
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
        ctx.fillStyle = '#222';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Eyes
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.x + 3, this.y + 4, 3, 3);
        ctx.fillRect(this.x + this.width - 6, this.y + 4, 3, 3);

        // Web indicator when spinning
        if (this.isSpinning) {
            ctx.strokeStyle = 'rgba(200, 100, 255, 0.6)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 25, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}
