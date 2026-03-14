export default class PowerUpSystem {
    constructor() {
        this.activePowerUps = new Map();
        this.powerUpDurations = {
            shielded: 8000,
            invincible: 5000,
            speed_boost: 6000,
            light_boost: 4000,
            damage_boost: 6000
        };
    }

    activatePowerUp(type, duration = null) {
        if (!this.activePowerUps.has(type)) {
            const actualDuration = duration || this.powerUpDurations[type] || 5000;
            this.activePowerUps.set(type, actualDuration);
            return true;
        }
        return false;
    }

    update(dt, player) {
        const keysToRemove = [];

        for (let [type, duration] of this.activePowerUps) {
            duration -= dt;

            if (duration <= 0) {
                keysToRemove.push(type);
                this.deactivatePowerUp(type, player);
            } else {
                this.activePowerUps.set(type, duration);
                this.applyPowerUpEffect(type, player, dt);
            }
        }

        keysToRemove.forEach(type => this.activePowerUps.delete(type));
    }

    applyPowerUpEffect(type, player, dt) {
        switch (type) {
            case 'speed_boost':
                player.speed = Math.min(400, player.speed + (100 - player.speed) * 0.3);
                break;
            case 'light_boost':
                player.lightBoost = Math.max(1000, player.lightBoost - dt);
                break;
            case 'invincible':
                // Player cannot take damage
                break;
            case 'damage_boost':
                // Store in player for enemy damage calculations
                if (!player.damageBoost) player.damageBoost = 1;
                player.damageBoost = 2;
                break;
        }
    }

    deactivatePowerUp(type, player) {
        switch (type) {
            case 'speed_boost':
                player.speed = 200;
                break;
            case 'damage_boost':
                player.damageBoost = 1;
                break;
        }
    }

    isPowerUpActive(type) {
        return this.activePowerUps.has(type);
    }

    getRemainingDuration(type) {
        return this.activePowerUps.get(type) || 0;
    }

    drawPowerUpIndicators(ctx, width, height) {
        const indicators = Array.from(this.activePowerUps.entries());
        let yOffset = 60;

        indicators.forEach(([type, duration], index) => {
            const percent = (duration / (this.powerUpDurations[type] || 5000)) * 100;
            
            ctx.fillStyle = this.getPowerUpColor(type);
            ctx.fillRect(width - 150, yOffset, 140, 12);

            ctx.fillStyle = '#000';
            ctx.fillRect(width - 150, yOffset, (140 * percent / 100), 12);

            ctx.fillStyle = '#fff';
            ctx.font = '10px monospace';
            ctx.fillText(type.toUpperCase(), width - 140, yOffset + 9);

            yOffset += 18;
        });
    }

    getPowerUpColor(type) {
        const colors = {
            shielded: '#0f0',
            invincible: '#f0f',
            speed_boost: '#0ff',
            light_boost: '#ff0',
            damage_boost: '#f00'
        };
        return colors[type] || '#fff';
    }
}
