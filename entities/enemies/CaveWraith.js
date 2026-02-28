import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class CaveWraith extends Entity {
    constructor(x, y) {
        super(x, y, 24, 32);
        this.hp = Infinity; // unkillable
        this.speed = 70;
        this.gravityState = 'zero';
    }

    updateAI(dt, player) {
        if (player) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const effectiveRadius = player.lanternFuel > 0 ? player.lanternRadius + (player.lightBoost > 0 ? 50 : 0) : 0;

            if (dist < effectiveRadius) {
                this.vx = -Math.sign(dx) * this.speed;
                this.vy = -Math.sign(dy) * this.speed;
            } else {
                this.vx = Math.sign(dx) * this.speed;
                this.vy = Math.sign(dy) * this.speed;
            }

            if (this.isColliding(player)) {
                player.hp -= 30 * (dt / 1000);
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
        ctx.fillStyle = 'rgba(150, 50, 200, 0.7)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
