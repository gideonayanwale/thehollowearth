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
        // Mouse click handler for How To Play button
        canvas.addEventListener('click', (e) => {
            if (GameManager.state === 'MAIN_MENU') {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                if (window.MainMenu && window.MainMenu.handleClick && window.MainMenu.handleClick(x, y)) {
                    GameManager.state = 'HOW_TO_PLAY';
                }
            } else if (GameManager.state === 'HOW_TO_PLAY') {
                // Return to main menu on click or ESC
                GameManager.state = 'MAIN_MENU';
            }
        });
    const canvas = document.getElementById('gameCanvas');
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.GameManager = GameManager;
    window.MainMenu = require('./ui/MainMenu.js').default;
    GameManager.init();
    Renderer.init(canvas);
    // Start loop
    requestAnimationFrame((timestamp) => {
        lastTime = timestamp;
        gameLoop(timestamp);
    });
}

window.onload = init;
