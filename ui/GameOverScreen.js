import GameManager from '../core/GameManager.js';

export default class GameOverScreen {
    static draw(ctx, width, height) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#f00';
        ctx.font = '50px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#f00';
        ctx.shadowBlur = 15;
        ctx.fillText('GAME OVER', width / 2, height / 2 - 100);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.font = '12px "Press Start 2P"';

        const bd = GameManager.scoreManager.getBreakdown();
        let y = height / 2 - 20;
        ctx.fillText(`DEPTH BONUS: ${bd.details.depth || 0}`, width / 2, y); y += 30;
        ctx.fillText(`PICKUPS: ${bd.details.pickup || 0}`, width / 2, y); y += 30;
        ctx.fillText(`RESCUES: ${bd.details.rescue || 0}`, width / 2, y); y += 30;

        y += 30;
        ctx.font = '24px "Press Start 2P"';
        ctx.fillStyle = '#ff0';
        ctx.fillText(`FINAL SCORE: ${Math.floor(bd.total)}`, width / 2, y);

        y += 80;
        ctx.font = '16px "Press Start 2P"';
        const now = Date.now();
        if (Math.floor(now / 500) % 2 === 0) {
            ctx.fillStyle = '#0f0';
            ctx.fillText('PRESS SPACE TO RESTART', width / 2, y);
        }
    }
}
