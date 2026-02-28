import GameManager from './GameManager.js';
import MainMenu from '../ui/MainMenu.js';
import HUD from '../ui/HUD.js';
import GameOverScreen from '../ui/GameOverScreen.js';
import MerchantUI from '../ui/MerchantUI.js';
import LightingEngine from '../effects/LightingEngine.js';
import ScreenShake from '../effects/ScreenShake.js';

class Renderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 800;
        this.height = 600;
        this.camX = 0;
        this.camY = 0;
        this.lightingEngine = null;
        this.screenShake = new ScreenShake();
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.lightingEngine = new LightingEngine(this.width, this.height);
    }

    draw() {
        if (!this.ctx) return;

        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.save();

        if (GameManager.player) {
            this.camX = GameManager.player.x - this.width / 2;
            this.camY = GameManager.player.y - this.height / 2;
        }

        this.ctx.translate(-this.camX + this.screenShake.offsetX, -this.camY + this.screenShake.offsetY);

        if (GameManager.state === 'PLAYING' || GameManager.state === 'MERCHANT_UI') {
            if (GameManager.layer) {
                GameManager.layer.drawBackground(this.ctx);
                GameManager.layer.drawPickups(this.ctx);
                GameManager.layer.drawEntities(this.ctx);
            }

            if (GameManager.player) {
                GameManager.player.draw(this.ctx);
            }
        }

        this.ctx.restore();

        if ((GameManager.state === 'PLAYING' || GameManager.state === 'MERCHANT_UI') && this.lightingEngine) {
            this.lightingEngine.apply(this.ctx, this.camX - this.screenShake.offsetX, this.camY - this.screenShake.offsetY);
        }

        if (GameManager.state === 'MAIN_MENU') {
            MainMenu.draw(this.ctx, this.width, this.height);
        } else if (GameManager.state === 'PLAYING') {
            HUD.draw(this.ctx, this.width, this.height);
        } else if (GameManager.state === 'GAME_OVER') {
            GameOverScreen.draw(this.ctx, this.width, this.height);
        } else if (GameManager.state === 'MERCHANT_UI') {
            HUD.draw(this.ctx, this.width, this.height);
            MerchantUI.draw(this.ctx, this.width, this.height);
        }
    }
}

export default new Renderer();
