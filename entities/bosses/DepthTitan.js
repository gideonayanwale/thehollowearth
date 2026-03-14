import BossBase from './BossBase.js';
import GameManager from '../../core/GameManager.js';

export default class DepthTitan extends BossBase {
    constructor(x, y) {
        super(x, y, 80, 100);
        this.maxHp = 400;
        this.hp = this.maxHp;
        this.attackPattern = 'charge';
        this.chargeDirection = 1;
        this.chargePower = 0;
    }

    onPhaseChange() {
        if (this.phase === 2) {
            this.speed = 150;
            this.attackPattern = 'charge_spin';
        } else if (this.phase === 3) {
            this.speed = 180;
            this.attackPattern = 'rapid_attacks';
        } else if (this.phase === 4) {
            this.speed = 200;
            this.attackPattern = 'chaos';
        }
    }

    updateAI(dt, player) {
        if (!player) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.actionTimer -= dt;

        switch (this.attackPattern) {
            case 'charge':
                if (this.actionTimer <= 0) {
                    this.chargeDirection = dx > 0 ? 1 : -1;
                    this.chargePower = 1;
                    this.actionTimer = 2000;
                }
                this.vx = this.chargeDirection * this.speed * this.chargePower;
                break;

            case 'charge_spin':
                if (this.actionTimer <= 0) {
                    this.chargeDirection *= -1;
                    this.actionTimer = 1500;
                }
                this.vx = this.chargeDirection * this.speed * 1.5;
                this.vy = Math.sin(Date.now() / 300) * 100;
                break;

            case 'rapid_attacks':
                this.vx = (dx / dist) * this.speed * 1.2;
                this.vy = (dy / dist > 0 ? 1 : -1) * 80;
                break;

            case 'chaos':
                this.vx = Math.sin(Date.now() / 200) * this.speed;
                this.vy = Math.cos(Date.now() / 250) * this.speed * 0.8;
                break;
        }

        if (this.isColliding(player)) {
            const damage = this.phase === 4 ? 60 : this.phase === 3 ? 45 : this.phase === 2 ? 35 : 30;
            player.hp -= damage * (dt / 1000);
        }
    }

    draw(ctx) {
        ctx.save();

        if (this.staggered) {
            ctx.globalAlpha = 0.7;
        }

        // Body
        ctx.fillStyle = '#5a3a1a';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Eyes (glowing)
        ctx.fillStyle = '#ff0';
        ctx.fillRect(this.x + 20, this.y + 15, 12, 12);
        ctx.fillRect(this.x + 48, this.y + 15, 12, 12);

        // Charge aura (if charging)
        if (this.chargePower > 0.5) {
            ctx.strokeStyle = `rgba(255, 150, 0, ${this.chargePower})`;
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
        }

        ctx.restore();

        // Health bar
        this.drawHealthBar(ctx, this.width);
    }
}
