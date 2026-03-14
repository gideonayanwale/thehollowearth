class ScoreManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.total = 0;
        this.breakdown = {
            depth: 0,
            kill: 0,
            pickup: 0,
            time: 0,
            secret: 0,
            rescue: 0
        };
    }

    add(type, value) {
        // Expansion: Apply difficulty multiplier
        let multiplier = 1.0;
        if (window.GameManager && window.GameManager.settingsMenu) {
            multiplier = window.GameManager.settingsMenu.getDifficultyMultiplier('score');
        }
        const scaledValue = value * multiplier;
        if (this.breakdown[type] !== undefined) {
            this.breakdown[type] += scaledValue;
            this.total += scaledValue;
        } else {
            console.warn(`Unknown score type: ${type}`);
        }
    }

    canSpend(amount) {
        return this.total >= amount;
    }

    subtract(amount) {
        this.total -= amount;
    }

    getBreakdown() {
        return {
            total: this.total,
            details: { ...this.breakdown }
        };
    }
}

export default new ScoreManager();
