import PhysicsManager from '../physics/PhysicsManager.js';
import GameManager from '../core/GameManager.js';

export default class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.hp = 100;
        this.gravityState = "normal"; // normal, inverted, zero
    }

    update(dt) {
        const gravity = PhysicsManager.getGravity(this);
        const dtSec = dt / 1000;

        this.vy += gravity * dtSec;

        this.x += this.vx * dtSec;
        this.y += this.vy * dtSec;

        this.handleTileCollisions();
    }

    handleTileCollisions() {
        if (!GameManager.layer) return;

        const bottomTile = GameManager.layer.getTileAt(this.x + this.width / 2, this.y + this.height);

        if (bottomTile && bottomTile.solid) {
            if (this.vy > 0) {
                this.y = bottomTile.y * GameManager.layer.tileSize - this.height;
                this.vy = 0;
            }
        }

        const topTile = GameManager.layer.getTileAt(this.x + this.width / 2, this.y);
        if (topTile && topTile.solid) {
            if (this.vy < 0) {
                this.y = (topTile.y + 1) * GameManager.layer.tileSize;
                this.vy = 0;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
