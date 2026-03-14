import GameManager from '../core/GameManager.js';
import UpgradeManager from '../core/UpgradeManager.js';

export default class UpgradeUI {
    static draw(ctx, width, height) {
        const upgradeManager = GameManager.upgradeManager;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('UPGRADES', width / 2, 40);

        // Player resources
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f0';
        ctx.fillText(`ORE: ${Math.floor(GameManager.player.inventory.ore)}`, 20, 80);

        // List upgrades
        const upgrades = upgradeManager.getAllUpgrades();
        let y = 120;
        const itemHeight = 60;

        for (let i = 0; i < upgrades.length; i++) {
            const upgrade = upgrades[i];
            const x = 20;

            // Background
            ctx.fillStyle = upgrade.level >= upgrade.maxLevel ? '#333' : '#1a1a2a';
            ctx.fillRect(x, y - 40, width - 40, itemHeight);

            // Border highlight if affordable
            const cost = upgradeManager.upgrades[upgrade.key].cost(upgrade.level);
            const affordable = GameManager.player.inventory.ore >= cost && upgrade.level < upgrade.maxLevel;
            ctx.strokeStyle = affordable ? '#0f0' : '#666';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y - 40, width - 40, itemHeight);

            // Upgrade name and level
            ctx.fillStyle = upgrade.level >= upgrade.maxLevel ? '#888' : '#fff';
            ctx.font = 'bold 14px "Press Start 2P"';
            ctx.textAlign = 'left';
            ctx.fillText(`${upgrade.name} [${upgrade.level}/${upgrade.maxLevel}]`, x + 10, y - 20);

            // Cost
            ctx.fillStyle = affordable ? '#0f0' : '#f00';
            ctx.font = '12px "Press Start 2P"';
            ctx.fillText(`Cost: ${upgrade.nextCost}`, x + 10, y);

            // Controls hint
            if (affordable) {
                ctx.fillStyle = '#0f0';
                ctx.fillText('Press KEY [' + (i + 1) + '] to upgrade', x + 10, y + 20);
            }

            y += itemHeight + 10;

            if (y > height - 50) break;
        }

        // Instructions
        ctx.fillStyle = '#888';
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Press ESC or E to close upgrades', width / 2, height - 20);
    }
}
