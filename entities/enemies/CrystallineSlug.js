import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class CrystallineSlug extends Entity {
    constructor(x, y) {
        super(x, y, 28, 16);
        this.hp = 40;
        this.speed = 80;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.changeDirectionTimer = 2000;
        this.shellActive = true;
    }

    updateAI(dt, player) {
        this.changeDirectionTimer -= dt;
        if (this.changeDirectionTimer <= 0) {
            this.direction *= -1;
            this.changeDirectionTimer = 2000 + Math.random() * 2000;
        }

        this.vx = this.direction * this.speed;

        if (player && this.isColliding(player)) {
            if (this.shellActive) {
                // Bounce player back
                player.vx = player.x < this.x ? -200 : 200;
                this.shellActive = false;
                this.hp -= 10;
                setTimeout(() => { this.shellActive = true; }, 1000);
            } else {
                player.hp -= 15 * (dt / 1000);
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
        // Body
        ctx.fillStyle = '#080';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Shell (if active)
        if (this.shellActive) {
            ctx.fillStyle = '#0f0';
            ctx.strokeStyle = '#0f0';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x + 2, this.y - 4, this.width - 4, this.height);
        }
    }
}
