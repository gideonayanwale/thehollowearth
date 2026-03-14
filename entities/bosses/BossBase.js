import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class BossBase extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.maxHp = 300;
        this.hp = this.maxHp;
        this.phase = 1;
        this.actionTimer = 0;
        this.isBoss = true;
        this.speed = 100;
        this.staggered = false;
        this.staggerDuration = 0;
    }

    takeDamage(amount) {
        this.hp -= amount;
        this.staggered = true;
        this.staggerDuration = 300;
    }

    getPhaseThreshold() {
        const phaseThresholds = [1, 0.75, 0.5, 0.25];
        return phaseThresholds[this.phase - 1] || 0;
    }

    updatePhase() {
        const hpPercent = this.hp / this.maxHp;
        const targetPhase = Math.max(1, 4 - Math.floor(hpPercent * 4));
        if (targetPhase > this.phase) {
            this.phase = targetPhase;
            this.onPhaseChange();
        }
    }

    onPhaseChange() {
        // Override in subclasses
    }

    updateStagger(dt) {
        if (this.staggered) {
            this.staggerDuration -= dt;
            if (this.staggerDuration <= 0) {
                this.staggered = false;
            }
        }
    }

    update(dt) {
        this.updatePhase();
        this.updateStagger(dt);
        this.actionTimer -= dt;

        if (!this.staggered) {
            this.updateAI(dt, GameManager.player);
        }

        super.update(dt);
    }

    updateAI(dt, player) {
        // Override in subclasses
    }

    isColliding(other) {
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
    }

    drawHealthBar(ctx, width) {
        const barWidth = this.width;
        const barHeight = 8;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x, this.y - 15, barWidth, barHeight);
        
        ctx.fillStyle = this.hp > this.maxHp * 0.33 ? '#0f0' : '#f00';
        ctx.fillRect(this.x, this.y - 15, (this.hp / this.maxHp) * barWidth, barHeight);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y - 15, barWidth, barHeight);

        // Phase indicator
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.fillText(`PH${this.phase}`, this.x + 5, this.y - 18);
    }
}
