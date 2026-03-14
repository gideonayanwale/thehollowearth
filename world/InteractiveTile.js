export default class InteractiveTile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 32;
        this.height = 32;
        this.isActive = true;
        this.cooldown = 0;
    }

    update(dt, player) {
        this.cooldown = Math.max(0, this.cooldown - dt);

        if (!this.isActive || this.cooldown > 0) return;

        if (this.intersects(player)) {
            this.activate(player);
        }
    }

    intersects(entity) {
        return this.x < entity.x + entity.width &&
               this.x + this.width > entity.x &&
               this.y < entity.y + entity.height &&
               this.y + this.height > entity.y;
    }

    activate(player) {
        switch (this.type) {
            case 'spike_trap':
                player.hp -= 25;
                this.cooldown = 500;
                break;
            case 'healing_spring':
                player.hp = Math.min(100, player.hp + 10);
                this.cooldown = 2000;
                break;
            case 'speed_pad':
                player.vx *= 1.5;
                this.cooldown = 1000;
                break;
            case 'bounce_pad':
                player.vy = -300;
                this.cooldown = 800;
                break;
            case 'teleport':
                // Teleport to next tile
                this.cooldown = 3000;
                break;
            case 'lava_pit':
                player.hp -= 40;
                this.cooldown = 500;
                break;
        }
    }

    draw(ctx) {
        if (!this.isActive) {
            ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        } else {
            ctx.fillStyle = this.getColor();
        }

        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Pattern
        ctx.strokeStyle = this.getPatternColor();
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
    }

    getColor() {
        const colors = {
            spike_trap: '#f00',
            healing_spring: '#0f0',
            speed_pad: '#0ff',
            bounce_pad: '#f0f',
            teleport: '#ff0',
            lava_pit: '#f80'
        };
        return colors[this.type] || '#fff';
    }

    getPatternColor() {
        const colors = {
            spike_trap: '#800',
            healing_spring: '#080',
            speed_pad: '#088',
            bounce_pad: '#808',
            teleport: '#880',
            lava_pit: '#840'
        };
        return colors[this.type] || '#888';
    }
}
