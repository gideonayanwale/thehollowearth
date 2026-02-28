export default class Tile {
    constructor(x, y, type = 'empty') {
        this.x = x;
        this.y = y;
        this.type = type; // empty, solid, breakable, descent, gravity_flip

        // Visual properties based on type
        this.color = this.getColorForType(type);
        this.solid = ['solid', 'breakable'].includes(type);
    }

    getColorForType(type) {
        switch (type) {
            case 'solid': return '#444';
            case 'breakable': return '#642';
            case 'descent': return '#d1a';
            case 'gravity_flip': return '#1da';
            case 'empty': default: return null;
        }
    }

    draw(ctx, size) {
        if (!this.color) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * size, this.y * size, size, size);
    }
}
