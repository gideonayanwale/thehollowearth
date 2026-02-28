import GameManager from '../core/GameManager.js';

export default class LightingEngine {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
    }

    apply(mainCtx, camX, camY) {
        if (!GameManager.player || GameManager.currentLayerIndex === 0) return;

        let darkness = 0;
        switch (GameManager.currentLayerIndex) {
            case 1: darkness = 0.4; break;
            case 2: darkness = 0.7; break;
            case 3: darkness = 0.9; break;
            case 4: darkness = 0.95; break;
            default: darkness = 0;
        }

        if (darkness <= 0) return;

        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        const p = GameManager.player;
        let radius = p.lanternRadius;
        if (p.lanternFuel <= 0) radius = 10;
        if (p.lightBoost > 0) radius += 50;

        const px = p.x + p.width / 2 - camX;
        const py = p.y + p.height / 2 - camY;

        this.ctx.globalCompositeOperation = 'destination-out';

        const gradient = this.ctx.createRadialGradient(px, py, 0, px, py, radius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(px, py, radius, 0, Math.PI * 2);
        this.ctx.fill();

        mainCtx.globalCompositeOperation = 'source-over';
        mainCtx.drawImage(this.canvas, 0, 0);
    }
}
