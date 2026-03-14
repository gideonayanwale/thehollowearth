import GameManager from '../core/GameManager.js';

export default class GameOverScreen {
    static homeButtonArea = null;
    static isHomeHovered = false;
    static isHomePressed = false;

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

        const buttonW = 140;
        const buttonH = 36;
        const buttonX = width / 2 - buttonW / 2;
        const buttonY = y + 40;
        const pulse = Math.sin(Date.now() / 220) * 0.02;
        const hoverScale = GameOverScreen.isHomeHovered ? 0.04 : pulse;
        const buttonScale = 1 + hoverScale;
        const scaledW = buttonW * buttonScale;
        const scaledH = buttonH * buttonScale;
        const scaledX = buttonX - (scaledW - buttonW) / 2;
        const scaledY = buttonY - (scaledH - buttonH) / 2;

        const homeFill = GameOverScreen.isHomePressed ? '#0ff' : (GameOverScreen.isHomeHovered ? '#333' : '#222');
        const homeStroke = GameOverScreen.isHomeHovered ? '#0ff' : '#fff';
        const homeText = GameOverScreen.isHomePressed ? '#000' : '#fff';
        const glow = GameOverScreen.isHomeHovered ? 16 : 8 + Math.sin(Date.now() / 180) * 6;
        ctx.shadowColor = GameOverScreen.isHomeHovered ? '#0ff' : '#000';
        ctx.shadowBlur = glow;
        ctx.fillStyle = homeFill;
        ctx.fillRect(scaledX, scaledY, scaledW, scaledH);
        ctx.strokeStyle = homeStroke;
        ctx.lineWidth = 2;
        ctx.strokeRect(scaledX, scaledY, scaledW, scaledH);
        ctx.shadowBlur = 0;
        ctx.fillStyle = homeText;
        ctx.font = '14px "Press Start 2P"';
        ctx.fillText('HOME MENU', width / 2, buttonY + 24);
        GameOverScreen.homeButtonArea = { x: scaledX, y: scaledY, w: scaledW, h: scaledH };
        if (GameOverScreen.isHomeHovered) {
            ctx.fillStyle = '#0ff';
            ctx.font = '10px "Press Start 2P"';
            ctx.fillText('PRESS H FOR HOME', width / 2, buttonY + buttonH + 26);
        }
    }

    static handleHomeClick(x, y) {
        if (!GameOverScreen.homeButtonArea) return false;
        const { x: bx, y: by, w, h } = GameOverScreen.homeButtonArea;
        return x >= bx && x <= bx + w && y >= by && y <= by + h;
    }

    static updateHomeHover(x, y) {
        GameOverScreen.isHomeHovered = GameOverScreen.handleHomeClick(x, y);
        if (!GameOverScreen.isHomeHovered) {
            GameOverScreen.isHomePressed = false;
        }
    }

    static setHomePressed(isPressed) {
        GameOverScreen.isHomePressed = isPressed && GameOverScreen.isHomeHovered;
    }

    static resetHomeButtonState() {
        GameOverScreen.isHomeHovered = false;
        GameOverScreen.isHomePressed = false;
    }
}
