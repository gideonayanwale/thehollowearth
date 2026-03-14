export default class PlayerUpgrades {
    constructor() {
        this.upgrades = {
            max_health: {
                name: 'Max Health',
                level: 1,
                maxLevel: 5,
                baseCost: 100,
                costPerLevel: 50,
                effect: 'Increases max HP by 20 per level',
                stat: 'max_health'
            },
            speed: {
                name: 'Speed Boost',
                level: 1,
                maxLevel: 5,
                baseCost: 80,
                costPerLevel: 40,
                effect: 'Increases movement speed by 50 per level',
                stat: 'speed'
            },
            lantern_radius: {
                name: 'Lantern Radius',
                level: 1,
                maxLevel: 4,
                baseCost: 120,
                costPerLevel: 60,
                effect: 'Extends lantern visibility radius',
                stat: 'lantern_radius'
            },
            lantern_fuel: {
                name: 'Fuel Efficiency',
                level: 1,
                maxLevel: 5,
                baseCost: 90,
                costPerLevel: 45,
                effect: 'Lantern fuel depletes slower',
                stat: 'fuel_efficiency'
            },
            jump_height: {
                name: 'Jump Height',
                level: 1,
                maxLevel: 4,
                baseCost: 70,
                costPerLevel: 35,
                effect: 'Increases jump power',
                stat: 'jump_height'
            },
            armor: {
                name: 'Armor Rating',
                level: 1,
                maxLevel: 3,
                baseCost: 150,
                costPerLevel: 75,
                effect: 'Reduces damage taken by 10%',
                stat: 'armor'
            }
        };

        this.totalSpent = 0;
        this.loadUpgrades();
    }

    canAfford(upgradeKey, score) {
        const upgrade = this.upgrades[upgradeKey];
        if (!upgrade) return false;
        if (upgrade.level >= upgrade.maxLevel) return false;

        const cost = this.getCost(upgradeKey);
        return score >= cost;
    }

    getCost(upgradeKey) {
        const upgrade = this.upgrades[upgradeKey];
        if (!upgrade) return 0;
        
        return upgrade.baseCost + (upgrade.level - 1) * upgrade.costPerLevel;
    }

    purchase(upgradeKey, score) {
        if (!this.canAfford(upgradeKey, score)) return false;

        const upgrade = this.upgrades[upgradeKey];
        const cost = this.getCost(upgradeKey);

        upgrade.level++;
        this.totalSpent += cost;
        this.saveUpgrades();

        return cost;
    }

    getUpgradeBonus(stat) {
        for (let key in this.upgrades) {
            const upgrade = this.upgrades[key];
            if (upgrade.stat === stat) {
                return upgrade.level;
            }
        }
        return 0;
    }

    getUpgradeDescription(upgradeKey) {
        const upgrade = this.upgrades[upgradeKey];
        if (!upgrade) return '';

        return `${upgrade.name} Lvl${upgrade.level}/${upgrade.maxLevel}
Cost: ${this.getCost(upgradeKey)}
${upgrade.effect}`;
    }

    saveUpgrades() {
        const data = {};
        for (let key in this.upgrades) {
            const upgrade = this.upgrades[key];
            data[key] = upgrade.level;
        }
        localStorage.setItem('hollow_earth_upgrades', JSON.stringify(data));
        localStorage.setItem('hollow_earth_upgrade_spent', this.totalSpent);
    }

    loadUpgrades() {
        const saved = localStorage.getItem('hollow_earth_upgrades');
        const spentSaved = localStorage.getItem('hollow_earth_upgrade_spent');

        if (saved) {
            const data = JSON.parse(saved);
            for (let key in data) {
                if (this.upgrades[key]) {
                    this.upgrades[key].level = Math.min(data[key], this.upgrades[key].maxLevel);
                }
            }
        }

        if (spentSaved) {
            this.totalSpent = parseInt(spentSaved, 10);
        }
    }

    resetUpgrades() {
        for (let key in this.upgrades) {
            this.upgrades[key].level = 1;
        }
        this.totalSpent = 0;
        this.saveUpgrades();
    }

    applyUpgradesToPlayer(player) {
        // Max health
        const healthBonus = this.getUpgradeBonus('max_health') * 20;
        player.maxHp = 100 + healthBonus;

        // Speed
        const speedBonus = this.getUpgradeBonus('speed') * 50;
        player.baseSpeed = (player.baseSpeed || 200) + speedBonus;
        player.speed = player.baseSpeed;

        // Lantern
        const lanternBonus = this.getUpgradeBonus('lantern_radius') * 30;
        player.lanternRadius = 150 + lanternBonus;

        // Fuel efficiency
        const fuelEfficiency = this.getUpgradeBonus('lantern_fuel') * 0.1;
        player.fuelEfficiency = fuelEfficiency;

        // Jump power
        const jumpBonus = this.getUpgradeBonus('jump_height') * 50;
        player.jumpPower = 300 + jumpBonus;

        // Armor
        const armorLevel = this.getUpgradeBonus('armor');
        player.armorRating = armorLevel * 0.1;
    }
}
