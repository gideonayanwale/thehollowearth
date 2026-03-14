import GameManager from './core/GameManager.js';
import Renderer from './core/Renderer.js';
import MainMenu from './ui/MainMenu.js';

let lastTime = 0;
let menuFrameTick = 0;

function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    if (GameManager.state === 'MAIN_MENU') {
        menuFrameTick += 1;
        if (menuFrameTick % 2 === 0) {
            return;
        }
    } else {
        menuFrameTick = 0;
    }

    // Cap delta time to prevent huge jumps if tab is inactive
    const cappedDt = Math.min(dt, 100);

    GameManager.update(cappedDt);
    Renderer.draw();
}

// Initialize game
function init() {
    const canvas = document.getElementById('gameCanvas');

    const getCanvasCoords = (event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    // Mouse click handler for How To Play button
    canvas.addEventListener('click', (e) => {
        if (GameManager.state === 'MAIN_MENU') {
            const { x, y } = getCanvasCoords(e);
            if (MainMenu.handleClick(x, y)) {
                GameManager.state = 'HOW_TO_PLAY';
                MainMenu.resetButtonState();
            }
        } else if (GameManager.state === 'HOW_TO_PLAY') {
            GameManager.state = 'MAIN_MENU';
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (GameManager.state !== 'MAIN_MENU') {
            MainMenu.resetButtonState();
            return;
        }
        const { x, y } = getCanvasCoords(e);
        MainMenu.updateHover(x, y);
    });

    canvas.addEventListener('mousedown', (e) => {
        if (GameManager.state !== 'MAIN_MENU') {
            MainMenu.resetButtonState();
            return;
        }
        const { x, y } = getCanvasCoords(e);
        MainMenu.updateHover(x, y);
        MainMenu.setPressed(true);
    });

    canvas.addEventListener('mouseup', (e) => {
        if (GameManager.state !== 'MAIN_MENU') {
            MainMenu.resetButtonState();
            return;
        }
        const { x, y } = getCanvasCoords(e);
        MainMenu.updateHover(x, y);
        MainMenu.setPressed(false);
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.GameManager = GameManager;
    window.MainMenu = MainMenu;
    setTimeout(() => {
        GameManager.init();
        Renderer.init(canvas);
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }, 0);
}

window.onload = init;
