export default class AchievementSystem {
    constructor() {
        this.achievements = {
            first_blood: { name: 'First Blood', desc: 'Defeat your first enemy', points: 10, unlocked: false },
            deep_explorer: { name: 'Deep Explorer', desc: 'Reach layer 5', points: 50, unlocked: false },
            abyssal_conqueror: { name: 'Abyssal Conqueror', desc: 'Reach layer 10', points: 100, unlocked: false },
            resource_gatherer: { name: 'Resource Gatherer', desc: 'Collect 50 iron ore', points: 25, unlocked: false },
            high_roller: { name: 'High Roller', desc: 'Earn 10000 score', points: 75, unlocked: false },
            survivor: { name: 'Survivor', desc: 'Complete a full layer without taking damage', points: 40, unlocked: false },
            gravity_master: { name: 'Gravity Master', desc: 'Flip gravity 20 times', points: 35, unlocked: false },
            boss_slayer: { name: 'Boss Slayer', desc: 'Defeat a boss', points: 60, unlocked: false },
            unstoppable: { name: 'Unstoppable', desc: 'Get a 5x score multiplier', points: 90, unlocked: false }
        };

        this.stats = {
            enemiesDefeated: 0,
            layersReached: 0,
            resourcesCollected: 0,
            gravityFlips: 0,
            bossesDefeated: 0,
            highScore: 0
        };

        this.loadAchievements();
    }

    unlock(achievementKey) {
        if (this.achievements[achievementKey] && !this.achievements[achievementKey].unlocked) {
            this.achievements[achievementKey].unlocked = true;
            this.saveAchievements();
            return true;
        }
        return false;
    }

    updateStat(stat, amount = 1) {
        if (this.stats.hasOwnProperty(stat)) {
            this.stats[stat] += amount;
            this.checkAchievementConditions();
        }
    }

    setStat(stat, value) {
        if (this.stats.hasOwnProperty(stat)) {
            this.stats[stat] = value;
            this.checkAchievementConditions();
        }
    }

    checkAchievementConditions() {
        if (this.stats.enemiesDefeated >= 1) this.unlock('first_blood');
        if (this.stats.layersReached >= 5) this.unlock('deep_explorer');
        if (this.stats.layersReached >= 10) this.unlock('abyssal_conqueror');
        if (this.stats.resourcesCollected >= 50) this.unlock('resource_gatherer');
        if (this.stats.highScore >= 10000) this.unlock('high_roller');
        if (this.stats.gravityFlips >= 20) this.unlock('gravity_master');
        if (this.stats.bossesDefeated >= 1) this.unlock('boss_slayer');
    }

    getTotalPoints() {
        let points = 0;
        for (let key in this.achievements) {
            if (this.achievements[key].unlocked) {
                points += this.achievements[key].points;
            }
        }
        return points;
    }

    getUnlockedCount() {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    }

    getTotalCount() {
        return Object.keys(this.achievements).length;
    }

    saveAchievements() {
        localStorage.setItem('hollow_earth_achievements', JSON.stringify(this.achievements));
        localStorage.setItem('hollow_earth_stats', JSON.stringify(this.stats));
    }

    loadAchievements() {
        const saved = localStorage.getItem('hollow_earth_achievements');
        const savedStats = localStorage.getItem('hollow_earth_stats');

        if (saved) {
            const loaded = JSON.parse(saved);
            Object.assign(this.achievements, loaded);
        }

        if (savedStats) {
            const loadedStats = JSON.parse(savedStats);
            Object.assign(this.stats, loadedStats);
        }
    }
}
