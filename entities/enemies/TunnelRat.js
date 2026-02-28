import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class TunnelRat extends Entity {
    constructor(x, y) {
        super(x, y, 20, 16);
        this.hp = 20;
        this.speed = 100;
        this.vx = this.speed;
        this.changeDirectionTimer = 0;
    }

    updateAI(dt, player) {
        this.changeDirectionTimer -= dt;
        if (this.changeDirectionTimer <= 0) {
            this.vx = Math.random() > 0.5 ? this.speed : -this.speed;
            this.changeDirectionTimer = 1000 + Math.random() * 2000;
        }
        if (player && this.isColliding(player)) {
            player.hp -= 10 * (dt / 1000);
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
        ctx.fillStyle = '#654';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
