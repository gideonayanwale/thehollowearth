import GameManager from '../core/GameManager.js';

export default class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, type, count = 1) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = 50 + Math.random() * 150;
            
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                type,
                age: 0,
                maxAge: this.getMaxAge(type),
                color: this.getColor(type)
            });
        }
    }

    getMaxAge(type) {
        const maxAges = {
            spark: 400,
            smoke: 800,
            blood: 600,
            crystal: 500,
            heal: 700,
            explosion: 300
        };
        return maxAges[type] || 500;
    }

    getColor(type) {
        const colors = {
            spark: '#ff0',
            smoke: '#888',
            blood: '#f00',
            crystal: '#0ff',
            heal: '#0f0',
            explosion: '#f80'
        };
        return colors[type] || '#fff';
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.age += dt;

            if (p.age >= p.maxAge) {
                this.particles.splice(i, 1);
                continue;
            }

            const dtSec = dt / 1000;
            p.x += p.vx * dtSec;
            p.y += p.vy * dtSec;
            p.vy += 100 * dtSec; // Gravity
        }
    }

    draw(ctx) {
        for (let p of this.particles) {
            const alpha = 1 - (p.age / p.maxAge);
            const size = 2 + (p.age / p.maxAge) * 3;

            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
            ctx.globalAlpha = 1;
        }
    }

    clear() {
        this.particles = [];
    }
}
