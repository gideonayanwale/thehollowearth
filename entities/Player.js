import Entity from './Entity.js';
import GameManager from '../core/GameManager.js';

export default class Player extends Entity {
    constructor(x, y) {
        super(x, y, 24, 24);
        this.speed = 200;
        this.lanternRadius = 150;
        this.lanternFuel = 100;
        this.lightBoost = 0;
        this.inventory = { iron_ore: 0, explosive_powder: 0 };
    }

    update(dt) {
        if (GameManager.inputManager.isDown('ArrowLeft') || GameManager.inputManager.isDown('KeyA')) {
            this.vx = -this.speed;
        } else if (GameManager.inputManager.isDown('ArrowRight') || GameManager.inputManager.isDown('KeyD')) {
            this.vx = this.speed;
        } else {
            this.vx = 0;
        }

        const onGround = this.vy === 0;
        if ((GameManager.inputManager.isDown('ArrowUp') || GameManager.inputManager.isDown('KeyW') || GameManager.inputManager.isDown('Space')) && onGround) {
            this.vy = this.gravityState === "inverted" ? 300 : -300;
        }

        this.lanternFuel = Math.max(0, this.lanternFuel - (dt / 3000));

        if (this.lightBoost > 0) {
            this.lightBoost -= dt;
        }

        super.update(dt);

        this.checkTileInteractions();
    }

    checkTileInteractions() {
        if (!GameManager.layer) return;

        const currentTile = GameManager.layer.getTileAt(this.x + this.width / 2, this.y + this.height / 2);

        if (currentTile) {
            if (currentTile.type === 'descent') {
                GameManager.loadLayer(GameManager.currentLayerIndex + 1);
            } else if (currentTile.type === 'gravity_flip') {
                this.gravityState = this.gravityState === 'normal' ? 'inverted' : 'normal';
                currentTile.type = 'empty';
                currentTile.color = null;
                currentTile.solid = false;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#4af';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.lanternFuel > 0) {
            ctx.fillStyle = 'rgba(255, 200, 50, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
