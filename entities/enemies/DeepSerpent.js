import Entity from '../Entity.js';
import GameManager from '../../core/GameManager.js';

export default class DeepSerpent extends Entity {
    constructor(x, y) {
        super(x, y, 48, 80);
        this.hp = 400;
        this.maxHp = 400;
        this.phase = 1;
        this.speed = 70;
        this.segmentCount = 5;
        this.segments = [];
        this.actionTimer = 0;
        this.actionInterval = 2000;
        this.headX = x;
        this.headY = y;
        
        // Initialize segments
        for (let i = 0; i < this.segmentCount; i++) {
            this.segments.push({
                x: x - i * 30,
                y: y,
                vx: 0,
                vy: 0
            });
        }
    }

    updateAI(dt, player) {
        this.actionTimer += dt;

        // Phase transition
        if (this.hp < this.maxHp * 0.5 && this.phase === 1) {
            this.phase = 2;
            this.speed = 100;
            this.segmentCount = 7;
        }

        if (player) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Head follows player
            if (dist > 0) {
                this.vx = (dx / dist) * this.speed;
                this.vy = (dy / dist) * (this.speed * 0.5);
            }

            // Update head position
            const dt_sec = dt / 1000;
            this.headX = this.x;
            this.headY = this.y;

            // Make body follow head
            let prevX = this.x;
            let prevY = this.y;
            for (let i = 0; i < this.segments.length; i++) {
                const seg = this.segments[i];
                const segDx = prevX - seg.x;
                const segDy = prevY - seg.y;
                const segDist = Math.sqrt(segDx * segDx + segDy * segDy);
                
                if (segDist > 0) {
                    seg.vx = (segDx / segDist) * this.speed * 0.8;
                    seg.vy = (segDy / segDist) * this.speed * 0.5;
                }
                
                seg.x += seg.vx * dt_sec;
                seg.y += seg.vy * dt_sec;
                prevX = seg.x;
                prevY = seg.y;
            }

            // Special attacks
            if (this.actionTimer > this.actionInterval) {
                if (this.phase === 1) {
                    this.tailWhip();
                } else {
                    this.venomSpit(player);
                }
                this.actionTimer = 0;
            }

            if (this.isColliding(player)) {
                player.hp -= 35 * (dt / 1000);
            }

            // Check segment collisions
            for (let seg of this.segments) {
                if (this.segmentCollides(seg, player)) {
                    player.hp -= 20 * (dt / 1000);
                }
            }
        }
    }

    tailWhip() {
        // Tail creates shockwave
        if (this.segments.length > 0) {
            const tail = this.segments[this.segments.length - 1];
            if (GameManager.layer) {
                const projectile = {
                    x: tail.x,
                    y: tail.y,
                    vx: -this.vx * 1.5,
                    vy: -this.vy * 1.5,
                    width: 12,
                    height: 12,
                    lifetime: 2000,
                    damage: 30
                };
                GameManager.layer.projectiles.push(projectile);
            }
        }
    }

    venomSpit(player) {
        if (GameManager.layer) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 0) {
                for (let i = 0; i < 3; i++) {
                    const angle = Math.atan2(dy, dx) + (i - 1) * 0.3;
                    const projectile = {
                        x: this.x,
                        y: this.y,
                        vx: Math.cos(angle) * 180,
                        vy: Math.sin(angle) * 180,
                        width: 6,
                        height: 6,
                        lifetime: 2500,
                        damage: 25
                    };
                    GameManager.layer.projectiles.push(projectile);
                }
            }
        }
    }

    update(dt) {
        if (GameManager.player) {
            this.updateAI(dt, GameManager.player);
        }

        const dtSec = dt / 1000;
        this.x += this.vx * dtSec;
        this.y += this.vy * dtSec;
    }

    isColliding(other) {
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
    }

    segmentCollides(seg, other) {
        const w = 12, h = 12;
        return seg.x < other.x + other.width &&
            seg.x + w > other.x &&
            seg.y < other.y + other.height &&
            seg.y + h > other.y;
    }

    draw(ctx) {
        // Draw body segments
        for (let i = 0; i < this.segments.length; i++) {
            const seg = this.segments[i];
            ctx.fillStyle = i % 2 === 0 ? '#8f0' : '#6d0';
            ctx.fillRect(seg.x - 6, seg.y - 6, 12, 12);
        }

        // Draw head
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 8, this.y + 10, 6, 6);
        ctx.fillRect(this.x + this.width - 14, this.y + 10, 6, 6);

        // Health indicator
        const healthPercent = this.hp / this.maxHp;
        ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : healthPercent > 0.25 ? '#ff0' : '#f00';
        ctx.fillRect(this.x, this.y - 10, this.width * healthPercent, 4);
    }
}
