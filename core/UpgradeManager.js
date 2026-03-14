/**
 * Upgrade System for The Hollow Earth
 * Manages player upgrades and their effects
 */
export default class UpgradeManager {
    constructor() {
        this.upgrades = {
            // Health upgrades
            max_hp: {
                name: 'HP Boost',
                maxLevel: 5,
                level: 0,
                cost: (level) => 100 * (level + 1),
                description: 'Increase maximum health by 25 per level',
                effect: (player, level) => {
                    player.maxHp = 100 + (25 * level);
                }
            },

            // Speed upgrades
            movement_speed: {
                name: 'Speed Boost',
                maxLevel: 4,
                level: 0,
                cost: (level) => 150 * (level + 1),
                description: 'Increase movement speed by 25 per level',
                effect: (player, level) => {
                    player.speed = 200 + (25 * level);
                }
            },

            // Jump height upgrades
            jump_power: {
                name: 'Jump Boost',
                maxLevel: 3,
                level: 0,
                cost: (level) => 120 * (level + 1),
                description: 'Increase jump height by 30 per level',
                effect: (player, level) => {
                    player.jumpForce = 300 + (30 * level);
                }
            },

            // Lantern fuel upgrades
            lantern_capacity: {
                name: 'Lantern Tank',
                maxLevel: 5,
                level: 0,
                cost: (level) => 80 * (level + 1),
                description: 'Increase lantern fuel capacity by 20 per level',
                effect: (player, level) => {
                    player.maxLanternFuel = 100 + (20 * level);
                }
            },

            // Lantern radius
            lantern_radius: {
                name: 'Bright Beacon',
                maxLevel: 4,
                level: 0,
                cost: (level) => 110 * (level + 1),
                description: 'Increase light radius by 40 per level',
                effect: (player, level) => {
                    player.lanternRadius = 150 + (40 * level);
                }
            },

            // Damage resistance
            armor: {
                name: 'Stone Armor',
                maxLevel: 5,
                level: 0,
                cost: (level) => 140 * (level + 1),
                description: 'Reduce damage taken by 5% per level',
                effect: (player, level) => {
                    player.damageReduction = 0.05 * level;
                }
            },

            // Attack power
            attack_power: {
                name: 'Keen Blade',
                maxLevel: 4,
                level: 0,
                cost: (level) => 130 * (level + 1),
                description: 'Increase damage to enemies by 10% per level',
                effect: (player, level) => {
                    player.attackMultiplier = 1.0 + (0.1 * level);
                }
            },

            // Regeneration
            regeneration: {
                name: 'Life Force',
                maxLevel: 3,
                level: 0,
                cost: (level) => 200 * (level + 1),
                description: 'Restore 1 HP per second (scales with level)',
                effect: (player, level) => {
                    player.regenerationRate = 1 + level;
                }
            }
        };
    }

    getUpgrade(key) {
        return this.upgrades[key];
    }

    purchaseUpgrade(player, key) {
        const upgrade = this.upgrades[key];
        if (!upgrade) return false;

        if (upgrade.level >= upgrade.maxLevel) return false;

        const cost = upgrade.cost(upgrade.level);
        if (player.inventory.ore < cost) return false;

        player.inventory.ore -= cost;
        upgrade.level++;
        upgrade.effect(player, upgrade.level);
        return true;
    }

    getUpgradeInfo(key) {
        const upgrade = this.upgrades[key];
        return {
            name: upgrade.name,
            level: upgrade.level,
            maxLevel: upgrade.maxLevel,
            nextCost: upgrade.level < upgrade.maxLevel ? upgrade.cost(upgrade.level) : 'MAX',
            description: upgrade.description
        };
    }

    getAllUpgrades() {
        return Object.keys(this.upgrades).map(key => ({
            key,
            ...this.getUpgradeInfo(key)
        }));
    }

    saveUpgrades() {
        const data = {};
        Object.keys(this.upgrades).forEach(key => {
            data[key] = this.upgrades[key].level;
        });
        localStorage.setItem('hollow_earth_upgrades', JSON.stringify(data));
    }

    loadUpgrades() {
        const data = localStorage.getItem('hollow_earth_upgrades');
        if (data) {
            try {
                const saved = JSON.parse(data);
                Object.keys(saved).forEach(key => {
                    if (this.upgrades[key]) {
                        this.upgrades[key].level = saved[key];
                    }
                });
            } catch (e) {
                console.error('Failed to load upgrades:', e);
            }
        }
    }

    resetUpgrades() {
        Object.keys(this.upgrades).forEach(key => {
            this.upgrades[key].level = 0;
        });
        localStorage.removeItem('hollow_earth_upgrades');
    }
}
