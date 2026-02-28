import GameManager from '../core/GameManager.js';

export default class HUD {
    static draw(ctx, width, height) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, 50);

        ctx.fillStyle = '#fff';
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'left';

        ctx.fillText(`LAYER:${GameManager.currentLayerIndex}`, 10, 20);
        ctx.fillText(`SCORE:${Math.floor(GameManager.scoreManager.total)}`, 10, 40);

        if (GameManager.player) {
            const p = GameManager.player;

            // HP Bar
            ctx.fillText('HP', 150, 20);
            ctx.fillStyle = '#333';
            ctx.fillRect(180, 8, 100, 14);
            ctx.fillStyle = '#f22';
            ctx.fillRect(182, 10, Math.max(0, p.hp / 100) * 96, 10);

            // Fuel Bar
            ctx.fillStyle = '#fff';
            ctx.fillText('FUEL', 150, 40);
            ctx.fillStyle = '#333';
            ctx.fillRect(205, 28, 100, 14);
            ctx.fillStyle = '#fa0';
            ctx.fillRect(207, 30, Math.max(0, p.lanternFuel / 100) * 96, 10);

            // Item counts
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'right';
            ctx.fillText(`IRON:${p.inventory.iron_ore}`, width - 20, 20);
            ctx.fillText(`POWDER:${p.inventory.explosive_powder}`, width - 20, 40);

            // Gravity state centered
            ctx.textAlign = 'center';
            ctx.fillStyle = p.gravityState === 'normal' ? '#aaa' : '#0ff';
            ctx.fillText(`GRAVITY:${p.gravityState.toUpperCase()}`, width / 2, 30);
        }
    }
}
