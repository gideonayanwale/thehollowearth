import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class CrystalCrawler extends Entity {
    constructor(x, y) {
        super(x, y, 16, 12);
        this.hp = 15;
        this.speed = 80;
        this.vx = this.speed;
        this.patrolDistance = 200;
        this.patrolStart = x;
        this.attackCooldown = 0;
        this.direction = 1; // 1 for right, -1 for left
    }

    updateAI(dt, player) {
        this.attackCooldown = Math.max(0, this.attackCooldown - dt);

        // Patrol behavior
        if (Math.abs(this.x - this.patrolStart) > this.patrolDistance) {
            this.direction *= -1;
            this.patrolStart = this.x;
        }

        // Chase if player is near
        if (player && Math.abs(player.x - this.x) < 150) {
            const dx = player.x - this.x;
            this.direction = dx > 0 ? 1 : -1;
        }

        this.vx = this.direction * this.speed;

        if (player && this.isColliding(player)) {
            player.hp -= 5 * (dt / 1000);
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
        ctx.fillStyle = '#0ff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#0dd';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
