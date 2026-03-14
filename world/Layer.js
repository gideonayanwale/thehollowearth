import Tile from './Tile.js';

export default class Layer {
    constructor(index, cols, rows, tileSize) {
        this.index = index;
        this.cols = cols;
        this.rows = rows;
        this.tileSize = tileSize;

        this.grid = [];
        this.rooms = [];
        this.entities = [];
        this.pickups = [];
        this.projectiles = [];
        this.spawnPoint = { x: 0, y: 0 };

        for (let y = 0; y < rows; y++) {
            this.grid[y] = [];
            for (let x = 0; x < cols; x++) {
                this.grid[y][x] = new Tile(x, y, 'empty');
            }
        }
    }

    setTile(x, y, type) {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            this.grid[y][x] = new Tile(x, y, type);
        }
    }

    getTileAt(px, py) {
        const x = Math.floor(px / this.tileSize);
        const y = Math.floor(py / this.tileSize);
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            return this.grid[y][x];
        }
        return null;
    }

    revealHiddenRooms() {
        this.rooms.forEach(room => {
            room.visible = true;
        });
    }

    update(dt) {
        this.entities.forEach(entity => entity.update(dt));
        
        // Update projectiles
        this.projectiles = this.projectiles.filter(p => {
            p.lifetime -= dt;
            const dtSec = dt / 1000;
            p.x += p.vx * dtSec;
            p.y += p.vy * dtSec;
            return p.lifetime > 0;
        });
        this.pickups.forEach(pickup => pickup.update(dt));
    }

    drawBackground(ctx) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.grid[y][x].draw(ctx, this.tileSize);
            }

    drawProjectiles(ctx) {
        this.projectiles.forEach(projectile => {
            ctx.fillStyle = '#ff8';
            ctx.fillRect(projectile.x - projectile.width / 2, projectile.y - projectile.height / 2, projectile.width, projectile.height);
            ctx.strokeStyle = '#f0f';
            ctx.lineWidth = 1;
            ctx.strokeRect(projectile.x - projectile.width / 2, projectile.y - projectile.height / 2, projectile.width, projectile.height);
        });
    }
        }
    }

    drawEntities(ctx) {
        this.entities.forEach(entity => entity.draw(ctx));
    }

    drawPickups(ctx) {
        this.pickups.forEach(pickup => pickup.draw(ctx));
    }
}
