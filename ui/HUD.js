import GameManager from '../core/GameManager.js';

export default class HUD {
    static homeButtonArea = null;
    static isHomeHovered = false;
    static isHomePressed = false;

    static draw(ctx, width, height) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, 50);

        ctx.fillStyle = '#fff';
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'left';

        ctx.fillText(`LAYER:${GameManager.currentLayerIndex}`, 10, 20);
        ctx.fillText(`SCORE:${Math.floor(GameManager.scoreManager.total)}`, 10, 40);

        const buttonW = 90;
        const buttonH = 26;
        const buttonX = width - buttonW - 20;
        const buttonY = 12;
        const pulse = Math.sin(Date.now() / 220) * 0.02;
        const hoverScale = HUD.isHomeHovered ? 0.04 : pulse;
        const buttonScale = 1 + hoverScale;
        const scaledW = buttonW * buttonScale;
        const scaledH = buttonH * buttonScale;
        const scaledX = buttonX - (scaledW - buttonW) / 2;
        const scaledY = buttonY - (scaledH - buttonH) / 2;

        const homeFill = HUD.isHomePressed ? '#0ff' : (HUD.isHomeHovered ? '#333' : '#222');
        const homeStroke = HUD.isHomeHovered ? '#0ff' : '#fff';
        const homeText = HUD.isHomePressed ? '#000' : '#fff';
        const glow = HUD.isHomeHovered ? 16 : 8 + Math.sin(Date.now() / 180) * 6;
        ctx.shadowColor = HUD.isHomeHovered ? '#0ff' : '#000';
        ctx.shadowBlur = glow;
        ctx.fillStyle = homeFill;
        ctx.fillRect(scaledX, scaledY, scaledW, scaledH);
        ctx.strokeStyle = homeStroke;
        ctx.lineWidth = 2;
        ctx.strokeRect(scaledX, scaledY, scaledW, scaledH);
        ctx.shadowBlur = 0;
        ctx.fillStyle = homeText;
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('HOME', buttonX + buttonW / 2, buttonY + 18);
        HUD.homeButtonArea = { x: scaledX, y: scaledY, w: scaledW, h: scaledH };
        if (HUD.isHomeHovered) {
            ctx.fillStyle = '#0ff';
            ctx.font = '10px "Press Start 2P"';
            ctx.textAlign = 'right';
            ctx.fillText('PRESS H FOR HOME', scaledX - 8, buttonY + 18);
        }
        ctx.textAlign = 'left';

        if (GameManager.player) {
            const p = GameManager.player;
            const rightTextX = buttonX - 10;

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
            ctx.fillText(`IRON:${p.inventory.iron_ore}`, rightTextX, 20);
            ctx.fillText(`POWDER:${p.inventory.explosive_powder}`, rightTextX, 40);

            // Gravity state centered
            ctx.textAlign = 'center';
            ctx.fillStyle = p.gravityState === 'normal' ? '#aaa' : '#0ff';
            ctx.fillText(`GRAVITY:${p.gravityState.toUpperCase()}`, width / 2, 30);
        }
    }

    static handleHomeClick(x, y) {
        if (!HUD.homeButtonArea) return false;
        const { x: bx, y: by, w, h } = HUD.homeButtonArea;
        return x >= bx && x <= bx + w && y >= by && y <= by + h;
    }

    static updateHomeHover(x, y) {
        HUD.isHomeHovered = HUD.handleHomeClick(x, y);
        if (!HUD.isHomeHovered) {
            HUD.isHomePressed = false;
        }
    }

    static setHomePressed(isPressed) {
        HUD.isHomePressed = isPressed && HUD.isHomeHovered;
    }

    static resetHomeButtonState() {
        HUD.isHomeHovered = false;
        HUD.isHomePressed = false;
    }
}
