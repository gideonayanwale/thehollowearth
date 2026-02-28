import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class StoneGolem extends Entity {
    constructor(x, y) {
        super(x, y, 32, 40);
        this.hp = 100;
        this.speed = 50;
    }

    updateAI(dt, player) {
        if (player) {
            const dx = player.x - this.x;
            if (Math.abs(dx) > 10) {
                this.vx = dx > 0 ? this.speed : -this.speed;
            } else {
                this.vx = 0;
            }

            if (this.isColliding(player)) {
                player.hp -= 20 * (dt / 1000);
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
        ctx.fillStyle = '#888';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
