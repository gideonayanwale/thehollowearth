import GameManager from '../core/GameManager.js';

export default class MainMenu {
    static draw(ctx, width, height) {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fff';
        ctx.font = '60px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 10;
        ctx.fillText('ANTIGRAVITY', width / 2, height / 2 - 60);
        ctx.shadowBlur = 0;

        const highScoreStr = localStorage.getItem("antigravity_highscore");
        const highScore = highScoreStr ? parseInt(highScoreStr, 10) : 0;

        ctx.font = '16px "Press Start 2P"';
        ctx.fillStyle = '#ff0';
        ctx.fillText(`HIGH SCORE: ${highScore}`, width / 2, height / 2 + 20);

        // Blinking start text logic over time
        const now = Date.now();
        if (Math.floor(now / 500) % 2 === 0) {
            ctx.fillStyle = '#0f0';
            ctx.fillText('PRESS SPACE TO START', width / 2, height / 2 + 80);
        }
    }
}
