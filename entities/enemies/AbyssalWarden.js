import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class AbyssalWarden extends Entity {
    constructor(x, y) {
        super(x, y, 64, 64);
        this.hp = 500;
        this.maxHp = 500;
        this.phase = 1;
        this.speed = 80;
    }

    updateAI(dt, player) {
        if (this.hp < this.maxHp * 0.5 && this.phase === 1) {
            this.phase = 2;
            this.speed = 120;
            this.gravityState = 'zero';
        }

        if (player) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;

            this.vx = Math.sign(dx) * this.speed;
            if (this.phase === 2) {
                this.vy = Math.sign(dy) * this.speed;
            }

            if (this.isColliding(player)) {
                player.hp -= 50 * (dt / 1000);
            }
        }
    }

    update(dt) {
        if (GameManager.player) {
            this.updateAI(dt, GameManager.player);
        }
        if (this.phase === 2) {
            const dtSec = dt / 1000;
            this.x += this.vx * dtSec;
            this.y += this.vy * dtSec;
        } else {
            super.update(dt);
        }
    }

    isColliding(other) {
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
    }

    draw(ctx) {
        ctx.fillStyle = this.phase === 1 ? '#200' : '#f00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
