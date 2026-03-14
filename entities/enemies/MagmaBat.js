import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class MagmaBat extends Entity {
    constructor(x, y) {
        super(x, y, 18, 14);
        this.hp = 30;
        this.speed = 110;
        this.gravityState = 'zero';
        this.floatHeight = y;
        this.bob = 0;
        this.bobSpeed = 2;
        this.heatTrail = [];
    }

    updateAI(dt, player) {
        if (player) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 250) {
                this.vx = (dx / dist) * this.speed;
                this.bob += this.bobSpeed;
                this.vy = Math.sin(this.bob / 50) * 50;
            } else {
                this.vx = 0;
                this.bob += this.bobSpeed;
                this.vy = Math.sin(this.bob / 40) * 40;
            }

            if (this.isColliding(player)) {
                player.hp -= 22 * (dt / 1000);
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

        // Add heat trail
        this.heatTrail.push({ x: this.x, y: this.y, age: 0 });
        if (this.heatTrail.length > 8) {
            this.heatTrail.shift();
        }

        // Age heat trail
        for (let t of this.heatTrail) {
            t.age++;
        }
    }

    isColliding(other) {
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
    }

    draw(ctx) {
        // Heat trail
        for (let t of this.heatTrail) {
            const alpha = 1 - (t.age / 8);
            ctx.fillStyle = `rgba(255, ${100 + t.age * 10}, 0, ${alpha * 0.5})`;
            ctx.fillRect(t.x, t.y, this.width / 2, this.height / 2);
        }

        // Body
        ctx.fillStyle = '#f50';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, 
                    this.width / 3, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wings
        ctx.fillStyle = '#d30';
        ctx.fillRect(this.x - 6, this.y + 4, 6, 6);
        ctx.fillRect(this.x + this.width, this.y + 4, 6, 6);
    }
}
