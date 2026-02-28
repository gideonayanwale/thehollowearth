import Tile from './Tile.js';

export default class Room {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.entities = [];
        this.visible = true; // For hidden room functionality

        for (let r = 0; r < height; r++) {
            this.tiles[r] = [];
            for (let c = 0; c < width; c++) {
                this.tiles[r][c] = new Tile(this.x + c, this.y + r, 'empty');
            }
        }
    }

    setTile(lx, ly, type) {
        if (lx >= 0 && lx < this.width && ly >= 0 && ly < this.height) {
            this.tiles[ly][lx] = new Tile(this.x + lx, this.y + ly, type);
        }
    }

    getTile(lx, ly) {
        if (lx >= 0 && lx < this.width && ly >= 0 && ly < this.height) {
            return this.tiles[ly][lx];
        }
        return null;
    }
}
