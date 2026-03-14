import GameManager from '../core/GameManager.js';
import Pickup from '../pickups/Pickup.js';

export default class NPCDialogue {
    static dialogs = {
        mole_merchant: {
            greeting: "Welcome, traveler! Need supplies?",
            trades: [
                { wants: 'iron_ore', quantity: 3, offers: 'lantern_oil', price: 1 },
                { wants: 'ancient_coin', quantity: 1, offers: 'health_crystal', price: 1 },
                { wants: 'explosive_powder', quantity: 2, offers: 'glowstone_shard', price: 1 }
            ],
            goodbye: "Safe travels in the depths!"
        },
        trapped_miner: {
            greeting: "Please! Help me escape this darkness!",
            rescue_reward: 500,
            reward_item: 'depth_map_fragment',
            goodbye: "Thank you! You've given me hope!"
        },
        ancient_oracle: {
            greeting: "I sense great power within you...",
            predictions: [
                "Your path leads deeper still",
                "The titan awaits the worthy",
                "Three shards shall grant passage",
                "Darkness feeds on your fear"
            ],
            goodbye: "May the depths guide you"
        },
        shadow_keeper: {
            greeting: "Turn back while you still can...",
            role: "Guardian of deep places",
            goodbye: "Only the bold survive here"
        }
    };

    static getDialogue(npcType, context = 'greeting') {
        const dialog = this.dialogs[npcType];
        if (!dialog) return "...";

        if (context === 'greeting') {
            return dialog.greeting;
        } else if (context === 'goodbye') {
            return dialog.goodbye;
        } else if (context === 'prediction' && dialog.predictions) {
            return dialog.predictions[Math.floor(Math.random() * dialog.predictions.length)];
        }

        return dialog.greeting;
    }

    static attemptTrade(npcType, playerInventory, itemIndex) {
        const dialog = this.dialogs[npcType];
        if (!dialog || !dialog.trades) return false;

        const trade = dialog.trades[itemIndex];
        if (!trade) return false;

        // Check if player has required items
        const hasItem = (playerInventory[trade.wants] || 0) >= trade.quantity;
        if (!hasItem) return false;

        // Execute trade
        playerInventory[trade.wants] -= trade.quantity;
        playerInventory[trade.offers] = (playerInventory[trade.offers] || 0) + trade.price;

        GameManager.scoreManager.add("trade", 50);
        return true;
    }

    static drawDialogBox(ctx, text, x, y, width = 300, height = 80) {
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(x, y, width, height);

        // Border
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Text
        ctx.fillStyle = '#0f0';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';

        // Word wrap
        const lines = this.wrapText(ctx, text, width - 20, 60);
        let lineY = y + 20;
        for (let line of lines) {
            ctx.fillText(line, x + 10, lineY);
            lineY += 15;
        }

        // Continue indicator
        ctx.fillText("Press E to continue", x + 10, y + height - 10);
    }

    static wrapText(ctx, text, maxWidth, maxHeight) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (let word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.slice(0, 3); // Max 3 lines
    }

    static createMerchantUI(ctx, width, height) {
        const npc = 'mole_merchant';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fff';
        ctx.font = '24px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('MERCHANT', width / 2, 40);

        const dialog = this.dialogs[npc];
        let yOffset = 100;

        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f0';

        for (let i = 0; i < dialog.trades.length; i++) {
            const trade = dialog.trades[i];
            ctx.fillText(
                `${i + 1}. ${trade.quantity} ${trade.wants} → ${trade.price} ${trade.offers}`,
                50,
                yOffset + i * 40
            );
        }

        ctx.fillStyle = '#fff';
        ctx.fillText("Press number to trade, ESC to close", 50, yOffset + 160);
    }
}
