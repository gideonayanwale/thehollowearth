import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';
import Pickup from '../../pickups/Pickup.js';

export default class TrappedMiner extends Entity {
    constructor(x, y) {
        super(x, y, 24, 24);
        this.hp = Infinity;
        this.rescued = false;
    }

    update(dt) {
        super.update(dt);

        if (!this.rescued && GameManager.player) {
            const dx = GameManager.player.x - this.x;
            const dy = GameManager.player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 50 && GameManager.inputManager.wasJustPressed('KeyE')) {
                this.rescued = true;
                GameManager.scoreManager.add("rescue", 500);

                if (GameManager.layer) {
                    GameManager.layer.pickups.push(new Pickup(this.x, this.y - 30, 'health_crystal'));
                }
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.rescued ? '#4d4' : '#26a';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (!this.rescued && GameManager.player) {
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
