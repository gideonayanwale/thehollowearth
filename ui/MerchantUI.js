import GameManager from '../core/GameManager.js';

export default class MerchantUI {
    static draw(ctx, width, height) {
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        ctx.fillRect(width / 4, height / 4, width / 2, height / 2);

        // Draw a border
        ctx.strokeStyle = '#a83';
        ctx.lineWidth = 4;
        ctx.strokeRect(width / 4, height / 4, width / 2, height / 2);

        ctx.fillStyle = '#fff';
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('MOLE MERCHANT', width / 2, height / 4 + 40);

        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = '#da1';
        ctx.fillText('1x IRON ORE -> 1x HEALTH CRYSTAL (PRESS 1)', width / 2, height / 4 + 100);
        ctx.fillStyle = '#f55';
        ctx.fillText('2x IRON ORE -> 1x EXPLOSIVE (PRESS 2)', width / 2, height / 4 + 140);

        const now = Date.now();
        if (Math.floor(now / 500) % 2 === 0) {
            ctx.fillStyle = '#aaa';
            ctx.fillText('PRESS E TO LEAVE', width / 2, height / 4 + 220);
        }
    }
}
