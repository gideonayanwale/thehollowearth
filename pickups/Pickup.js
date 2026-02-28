import GameManager from '../core/GameManager.js';

export default class Pickup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.type = type;
        this.collected = false;
    }

    update(dt) {
        // Handle collect collision
        if (!this.collected && GameManager.player) {
            const p = GameManager.player;
            if (this.x < p.x + p.width && this.x + this.width > p.x &&
                this.y < p.y + p.height && this.y + this.height > p.y) {
                this.onCollect(p);
                this.collected = true; // Layer should sweep these up
            }
        }
    }

    draw(ctx) {
        if (this.collected) return;
        ctx.fillStyle = this.getColor();
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    getColor() {
        switch (this.type) {
            case 'health_crystal': return '#f44';
            case 'glowstone_shard': return '#ff0';
            case 'iron_ore': return '#888';
            case 'ancient_coin': return '#da1';
            case 'rope_coil': return '#d52';
            case 'explosive_powder': return '#422';
            case 'depth_map_fragment': return '#aef';
            case 'lantern_oil': return '#fb1';
            case 'gravity_shard': return '#b2f';
            default: return '#fff';
        }
    }

    onCollect(player) {
        switch (this.type) {
            case 'health_crystal':
                player.hp = Math.min(100, player.hp + 25);
                break;
            case 'glowstone_shard':
                player.lightBoost = 10000;
                break;
            case 'iron_ore':
                player.inventory.iron_ore++;
                break;
            case 'ancient_coin':
                GameManager.scoreManager.add("pickup", 250);
                break;
            case 'rope_coil':
                if (GameManager.currentLayerIndex > 0) {
                    GameManager.loadLayer(GameManager.currentLayerIndex - 1);
                }
                break;
            case 'explosive_powder':
                player.inventory.explosive_powder++;
                break;
            case 'depth_map_fragment':
                if (GameManager.layer) GameManager.layer.revealHiddenRooms();
                break;
            case 'lantern_oil':
                player.lanternFuel = 100;
                break;
            case 'gravity_shard':
                player.gravityState = player.gravityState === 'normal' ? 'inverted' : 'normal';
                break;
        }
    }
}
