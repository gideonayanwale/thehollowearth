import GameManager from './core/GameManager.js';
import Renderer from './core/Renderer.js';

let lastTime = 0;

function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    // Cap delta time to prevent huge jumps if tab is inactive
    const cappedDt = Math.min(dt, 100);

    GameManager.update(cappedDt);
    Renderer.draw();

    requestAnimationFrame(gameLoop);
}

// Initialize game
function init() {
    GameManager.init();
    Renderer.init(document.getElementById('gameCanvas'));
    
    // Start loop
    requestAnimationFrame((timestamp) => {
        lastTime = timestamp;
        gameLoop(timestamp);
    });
}

window.onload = init;
