import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class MoleMerchant extends Entity {
    constructor(x, y) {
        super(x, y, 24, 24);
        this.hp = Infinity;
    }

    update(dt) {
        super.update(dt);

        if (GameManager.player) {
            const dx = GameManager.player.x - this.x;
            const dy = GameManager.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 50 && GameManager.inputManager.wasJustPressed('KeyE')) {
                GameManager.state = 'MERCHANT_UI';
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#a83';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (GameManager.player) {
            const dx = GameManager.player.x - this.x;
            const dy = GameManager.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 50) {
                ctx.fillStyle = '#fff';
                ctx.font = '10px sans-serif';
                ctx.fillText('Press E', this.x, this.y - 10);
            }
        }
    }
}
