import GameManager from '../core/GameManager.js';

export default class Explosion {
    constructor(x, y, radius = 64) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.duration = 500;
        this.timer = this.duration;

        GameManager.audioManager.playSound('explosion');
        this.applyDamage();
    }

    applyDamage() {
        if (!GameManager.layer) return;
        const startX = Math.floor((this.x - this.radius) / GameManager.layer.tileSize);
        const endX = Math.ceil((this.x + this.radius) / GameManager.layer.tileSize);
        const startY = Math.floor((this.y - this.radius) / GameManager.layer.tileSize);
        const endY = Math.ceil((this.y + this.radius) / GameManager.layer.tileSize);

        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const tile = GameManager.layer.getTileAt(x * 32, y * 32);
                if (tile && tile.type === 'breakable') {
                    const dx = (x * 32 + 16) - this.x;
                    const dy = (y * 32 + 16) - this.y;
                    if (Math.sqrt(dx * dx + dy * dy) <= this.radius) {
                        tile.type = 'empty';
                        tile.color = null;
                        tile.solid = false;
                    }
                }
            }
        }

        GameManager.layer.entities.forEach(entity => {
            const dx = (entity.x + entity.width / 2) - this.x;
            const dy = (entity.y + entity.height / 2) - this.y;
            if (Math.sqrt(dx * dx + dy * dy) <= this.radius) {
                entity.hp -= 100;
            }
        });

        import('../core/Renderer.js').then(module => {
            if (module.default && module.default.screenShake) {
                module.default.screenShake.apply(10, 300);
            }
        });
    }

    update(dt) {
        this.timer -= dt;
    }

    draw(ctx) {
        if (this.timer > 0) {
            const progress = 1 - (this.timer / this.duration);
            ctx.fillStyle = `rgba(255, 100, 0, ${1 - progress})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * progress, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
