import GameManager from '../core/GameManager.js';

export default class InventoryUI {
    static draw(ctx, width, height) {
        const crafting = GameManager.craftingSystem;
        const startY = 100;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fff';
        ctx.font = '24px "Press Start 2P"';
        ctx.textAlign = 'left';
        ctx.fillText('INVENTORY', 20, 40);

        ctx.font = '12px monospace';
        ctx.fillText(`Total Items: ${crafting.getTotalInventorySize()}`, 20, 70);

        // Display inventory items
        let yOffset = startY;
        const itemsPerRow = 3;
        let itemIndex = 0;

        for (let itemName in crafting.inventory) {
            if (crafting.inventory[itemName] > 0) {
                const col = itemIndex % itemsPerRow;
                const row = Math.floor(itemIndex / itemsPerRow);

                const x = 20 + col * 250;
                const y = startY + row * 40;

                ctx.fillStyle = '#0f0';
                ctx.fillText(`${itemName}: ${crafting.inventory[itemName]}`, x, y);

                itemIndex++;
            }
        }

        // Display crafting recipes
        const recipeStartY = startY + 180;
        ctx.fillStyle = '#fff';
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText('RECIPES', 20, recipeStartY - 20);

        ctx.font = '10px monospace';
        let recipeIndex = 0;
        for (let recipeName in crafting.recipes) {
            const recipe = crafting.recipes[recipeName];
            const canCraft = crafting.canCraft(recipeName);
            const y = recipeStartY + recipeIndex * 50;

            ctx.fillStyle = canCraft ? '#0f0' : '#f00';
            ctx.fillText(`[${recipeName.toUpperCase()}]`, 20, y);

            ctx.fillStyle = '#fff';
            let ingText = 'Needs: ';
            for (let ing in recipe.ingredients) {
                ingText += `${ing}(${recipe.ingredients[ing]}) `;
            }
            ctx.fillText(ingText, 20, y + 15);
            ctx.fillText(`Press C + arrow keys to craft`, 20, y + 30);

            recipeIndex++;
        }
    }
}
