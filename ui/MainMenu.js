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
        ctx.fillText('HOLLOW EARTH', width / 2, height / 2 - 60);
        ctx.shadowBlur = 0;

        const highScoreStr = localStorage.getItem("hollow_earth_highscore");
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

        // Draw How To Play button
        ctx.fillStyle = '#222';
        ctx.fillRect(width / 2 - 120, height / 2 + 120, 240, 50);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(width / 2 - 120, height / 2 + 120, 240, 50);
        ctx.fillStyle = '#fff';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('HOW TO PLAY', width / 2, height / 2 + 155);

        // Store button area for click detection
        MainMenu.buttonArea = {
            x: width / 2 - 120,
            y: height / 2 + 120,
            w: 240,
            h: 50
        };
        static handleClick(x, y) {
            if (!MainMenu.buttonArea) return false;
            const { x: bx, y: by, w, h } = MainMenu.buttonArea;
            if (x >= bx && x <= bx + w && y >= by && y <= by + h) {
                return true;
            }
            return false;
        }
    }
}
