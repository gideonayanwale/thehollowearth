import GameManager from '../core/GameManager.js';

export default class UpgradeShop {
    static draw(ctx, width, height) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fff';
        ctx.font = '28px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('UPGRADE SHOP', width / 2, 40);

        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        const score = GameManager.scoreManager.total;
        ctx.fillText(`BALANCE: ${Math.floor(score)}`, 30, 80);

        const upgrades = GameManager.playerUpgrades.upgrades;
        let yOffset = 120;
        let index = 0;

        for (let key in upgrades) {
            const upgrade = upgrades[key];
            const cost = GameManager.playerUpgrades.getCost(key);
            const canAfford = score >= cost && upgrade.level < upgrade.maxLevel;

            // Background
            ctx.fillStyle = canAfford ? 'rgba(0, 100, 0, 0.4)' : 'rgba(100, 0, 0, 0.4)';
            ctx.fillRect(30, yOffset, width - 60, 70);

            // Border
            ctx.strokeStyle = canAfford ? '#0f0' : '#f00';
            ctx.lineWidth = 2;
            ctx.strokeRect(30, yOffset, width - 60, 70);

            // Title and level
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px monospace';
            ctx.fillText(`${index + 1}. ${upgrade.name} (${upgrade.level}/${upgrade.maxLevel})`, 45, yOffset + 20);

            // Description
            ctx.font = '10px monospace';
            ctx.fillStyle = '#aaa';
            ctx.fillText(upgrade.effect, 45, yOffset + 38);

            // Cost
            ctx.fillStyle = canAfford ? '#0f0' : '#f00';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'right';
            ctx.fillText(`COST: ${cost}`, width - 45, yOffset + 55);

            ctx.textAlign = 'left';
            yOffset += 80;
            index++;
        }

        // Instructions
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Press 1-6 to upgrade, ESC to close', width / 2, height - 30);
    }

    static drawMiniShop(ctx, width, height) {
        const upgrades = GameManager.playerUpgrades.upgrades;
        const score = GameManager.scoreManager.total;

        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';

        let yOffset = height - 120;
        let index = 0;

        for (let key in upgrades) {
            const upgrade = upgrades[key];
            const cost = GameManager.playerUpgrades.getCost(key);
            const canAfford = score >= cost && upgrade.level < upgrade.maxLevel;

            ctx.fillStyle = canAfford ? '#0f0' : '#888';
            ctx.fillText(`${index + 1} ${upgrade.name}: ${upgrade.level}/${upgrade.maxLevel} (${cost})`, 
                        width - 20, yOffset);

            yOffset += 15;
            index++;
        }

        ctx.font = '8px monospace';
        ctx.fillStyle = '#aaa';
        ctx.fillText('Press S for shop', width - 20, yOffset + 10);
    }
}
