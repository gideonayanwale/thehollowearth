import BossBase from './BossBase.js';
import GameManager from '../../core/GameManager.js';

export default class CrystalColossus extends BossBase {
    constructor(x, y) {
        super(x, y, 70, 90);
        this.maxHp = 350;
        this.hp = this.maxHp;
        this.crystalCount = 4;
        this.crystalShards = [];
        this.reflectMode = false;
        this.reflectTimer = 0;
    }

    onPhaseChange() {
        if (this.phase === 2) {
            this.crystalCount = 6;
            this.speed = 120;
        } else if (this.phase === 3) {
            this.crystalCount = 8;
            this.speed = 140;
            this.reflectMode = true;
        } else if (this.phase === 4) {
            this.crystalCount = 10;
            this.speed = 160;
        }
    }

    updateAI(dt, player) {
        if (!player) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Move toward player
        if (dist > 100) {
            this.vx = (dx / dist) * this.speed * (this.phase / 2);
            this.vy = (dy / dist) * this.speed * 0.5;
        } else {
            this.vx = 0;
            this.vy = -100;
        }

        // Reflect incoming attacks
        if (this.reflectMode) {
            this.reflectTimer -= dt;
        }

        if (this.isColliding(player)) {
            player.hp -= (25 + this.phase * 10) * (dt / 1000);
        }
    }

    draw(ctx) {
        ctx.save();

        if (this.staggered) {
            ctx.globalAlpha = 0.6;
        }

        // Main body
        ctx.fillStyle = '#4af';
        ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, this.height - 20);

        // Crystal shards around body
        ctx.fillStyle = '#7df';
        for (let i = 0; i < this.crystalCount; i++) {
            const angle = (i / this.crystalCount) * Math.PI * 2 + Date.now() / 1000;
            const px = this.x + this.width / 2 + Math.cos(angle) * (this.width / 2 + 15);
            const py = this.y + this.height / 2 + Math.sin(angle) * (this.height / 2 + 15);
            ctx.fillRect(px - 5, py - 5, 10, 10);
        }

        // Reflection aura
        if (this.reflectMode) {
            ctx.strokeStyle = `rgba(170, 255, 255, ${0.3 + Math.sin(Date.now() / 300) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - 10, this.y - 10, this.width + 20, this.height + 20);
        }

        ctx.restore();

        // Health bar
        this.drawHealthBar(ctx, this.width);
    }
}
