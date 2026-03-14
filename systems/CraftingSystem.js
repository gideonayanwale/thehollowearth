export default class CraftingSystem {
        update(dt) {
            // No periodic logic yet, but required for GameManager compatibility
        }
    constructor() {
        this.recipes = {
            healing_potion: {
                name: 'Healing Potion',
                ingredients: { health_crystal: 2, lantern_oil: 1 },
                result: { health_crystal: 1, healing_effect: true },
                duration: 10000
            },
            light_amplifier: {
                name: 'Light Amplifier',
                ingredients: { glowstone_shard: 3, lantern_oil: 2 },
                result: { light_boost: true },
                duration: 8000
            },
            explosive_charge: {
                name: 'Explosive Charge',
                ingredients: { explosive_powder: 3, iron_ore: 2 },
                result: { damage: 50, radius: 100 },
                duration: 0
            },
            reinforced_armor: {
                name: 'Reinforced Armor',
                ingredients: { iron_ore: 5, ancient_coin: 1 },
                result: { shield: true, hp_bonus: 25 },
                duration: 12000
            },
            depth_key: {
                name: 'Depth Key',
                ingredients: { depth_map_fragment: 3, ancient_coin: 2 },
                result: { unlock_deep: true },
                duration: 0
            }
        };

        this.inventory = {};
        this.loadInventory();
    }

    canCraft(recipeName) {
        const recipe = this.recipes[recipeName];
        if (!recipe) return false;

        for (let ingredient in recipe.ingredients) {
            if ((this.inventory[ingredient] || 0) < recipe.ingredients[ingredient]) {
                return false;
            }
        }
        return true;
    }

    craft(recipeName) {
        if (!this.canCraft(recipeName)) return false;

        const recipe = this.recipes[recipeName];
        
        // Consume ingredients
        for (let ingredient in recipe.ingredients) {
            this.inventory[ingredient] -= recipe.ingredients[ingredient];
        }

        // Give result
        for (let item in recipe.result) {
            this.inventory[item] = (this.inventory[item] || 0) + 1;
        }

        this.saveInventory();
        return true;
    }

    addItem(itemName, quantity = 1) {
        this.inventory[itemName] = (this.inventory[itemName] || 0) + quantity;
        this.saveInventory();
    }

    removeItem(itemName, quantity = 1) {
        if (this.inventory[itemName]) {
            this.inventory[itemName] = Math.max(0, this.inventory[itemName] - quantity);
            this.saveInventory();
        }
    }

    getItemCount(itemName) {
        return this.inventory[itemName] || 0;
    }

    getTotalInventorySize() {
        let total = 0;
        for (let item in this.inventory) {
            total += this.inventory[item];
        }
        return total;
    }

    saveInventory() {
        localStorage.setItem('hollow_earth_inventory', JSON.stringify(this.inventory));
    }

    loadInventory() {
        const saved = localStorage.getItem('hollow_earth_inventory');
        if (saved) {
            this.inventory = JSON.parse(saved);
        }
    }

    resetInventory() {
        this.inventory = {};
        this.saveInventory();
    }

    getRecipeDescription(recipeName) {
        const recipe = this.recipes[recipeName];
        if (!recipe) return '';

        let desc = `${recipe.name}\nNeeds: `;
        for (let ingredient in recipe.ingredients) {
            desc += `${ingredient}(${recipe.ingredients[ingredient]}) `;
        }
        return desc;
    }
}
