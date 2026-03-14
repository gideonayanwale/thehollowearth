export default class SettingsMenu {
    constructor() {
        this.settings = {
            volume: 1.0,
            difficulty: 'normal',
            screenShake: true,
            particleEffects: true,
            bloodEffects: true,
            showFPS: false,
            controlScheme: 'arrows' // 'arrows', 'wasd', 'both'
        };

        this.difficulties = {
            easy: {
                enemyHealthMultiplier: 0.7,
                damageMultiplier: 0.6,
                scoreMultiplier: 0.5
            },
            normal: {
                enemyHealthMultiplier: 1.0,
                damageMultiplier: 1.0,
                scoreMultiplier: 1.0
            },
            hard: {
                enemyHealthMultiplier: 1.4,
                damageMultiplier: 1.3,
                scoreMultiplier: 1.5
            },
            nightmare: {
                enemyHealthMultiplier: 2.0,
                damageMultiplier: 1.8,
                scoreMultiplier: 2.0
            }
        };

        this.loadSettings();
    }

    getSetting(key) {
        return this.settings[key] || null;
    }

    setSetting(key, value) {
        if (this.settings.hasOwnProperty(key)) {
            this.settings[key] = value;
            this.saveSettings();
            return true;
        }
        return false;
    }

    getDifficultyMultiplier(stat) {
        const difficulty = this.difficulties[this.settings.difficulty];
        if (!difficulty) return 1.0;

        const multipliers = {
            enemyHealth: difficulty.enemyHealthMultiplier,
            damage: difficulty.damageMultiplier,
            score: difficulty.scoreMultiplier
        };

        return multipliers[stat] || 1.0;
    }

    saveSettings() {
        localStorage.setItem('hollow_earth_settings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('hollow_earth_settings');
        if (saved) {
            const loaded = JSON.parse(saved);
            Object.assign(this.settings, loaded);
        }
    }

    resetSettings() {
        this.settings = {
            volume: 1.0,
            difficulty: 'normal',
            screenShake: true,
            particleEffects: true,
            bloodEffects: true,
            showFPS: false,
            controlScheme: 'arrows'
        };
        this.saveSettings();
    }

    drawSettingsMenu(ctx, width, height) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fff';
        ctx.font = '28px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('SETTINGS', width / 2, 40);

        ctx.font = '14px monospace';
        ctx.textAlign = 'left';

        const options = [
            { key: 'difficulty', label: 'Difficulty', value: this.settings.difficulty },
            { key: 'volume', label: 'Volume', value: Math.round(this.settings.volume * 100) + '%' },
            { key: 'screenShake', label: 'Screen Shake', value: this.settings.screenShake ? 'ON' : 'OFF' },
            { key: 'particleEffects', label: 'Particles', value: this.settings.particleEffects ? 'ON' : 'OFF' },
            { key: 'showFPS', label: 'Show FPS', value: this.settings.showFPS ? 'ON' : 'OFF' },
            { key: 'controlScheme', label: 'Controls', value: this.settings.controlScheme.toUpperCase() }
        ];

        let yOffset = 100;
        options.forEach((opt, idx) => {
            ctx.fillStyle = '#fff';
            ctx.fillText(`${idx + 1}. ${opt.label}: ${opt.value}`, 50, yOffset);
            yOffset += 40;
        });

        ctx.fillText('Press keys 1-6 to toggle, ESC to close', 50, yOffset + 60);
        ctx.fillText('U for Upgrades, A for Achievements', 50, yOffset + 90);
    }
}
