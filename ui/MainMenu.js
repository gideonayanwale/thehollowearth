export default class MainMenu {
    static buttonArea = null;
    static isButtonHovered = false;
    static isButtonPressed = false;

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

        const now = Date.now();
        if (Math.floor(now / 500) % 2 === 0) {
            ctx.fillStyle = '#0f0';
            ctx.fillText('PRESS SPACE TO START', width / 2, height / 2 + 80);
        }

        const buttonX = width / 2 - 120;
        const buttonY = height / 2 + 120;
        const buttonW = 240;
        const buttonH = 50;

        const fillColor = MainMenu.isButtonPressed
            ? '#0ff'
            : MainMenu.isButtonHovered
                ? '#333'
                : '#222';
        const borderColor = MainMenu.isButtonHovered ? '#0ff' : '#fff';
        const textColor = MainMenu.isButtonPressed ? '#000' : '#fff';
        ctx.shadowColor = MainMenu.isButtonHovered ? '#0ff' : '#000';
        ctx.shadowBlur = MainMenu.isButtonHovered ? 15 : 0;

        ctx.fillStyle = fillColor;
        ctx.fillRect(buttonX, buttonY, buttonW, buttonH);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonW, buttonH);

        ctx.shadowBlur = 0;
        ctx.shadowColor = '#000';
        ctx.fillStyle = textColor;
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('HOW TO PLAY', width / 2, height / 2 + 155);

        MainMenu.buttonArea = { x: buttonX, y: buttonY, w: buttonW, h: buttonH };
    }

    static isPointInsideButton(x, y) {
        if (!MainMenu.buttonArea) return false;
        const { x: bx, y: by, w, h } = MainMenu.buttonArea;
        return x >= bx && x <= bx + w && y >= by && y <= by + h;
    }

    static handleClick(x, y) {
        return MainMenu.isPointInsideButton(x, y);
    }

    static updateHover(x, y) {
        MainMenu.isButtonHovered = MainMenu.isPointInsideButton(x, y);
        if (!MainMenu.isButtonHovered) {
            MainMenu.isButtonPressed = false;
        }
    }

    static setPressed(isPressed) {
        MainMenu.isButtonPressed = isPressed && MainMenu.isButtonHovered;
    }

    static resetButtonState() {
        MainMenu.isButtonHovered = false;
        MainMenu.isButtonPressed = false;
    }
}
