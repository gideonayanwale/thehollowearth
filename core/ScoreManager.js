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
        if (this.breakdown[type] !== undefined) {
            this.breakdown[type] += value;
            this.total += value;
        } else {
            console.warn(`Unknown score type: ${type}`);
        }
    }

    getBreakdown() {
        return {
            total: this.total,
            details: { ...this.breakdown }
        };
    }
}

export default new ScoreManager();
