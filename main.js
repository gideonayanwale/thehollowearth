import GameManager from './core/GameManager.js';
import Renderer from './core/Renderer.js';
import MainMenu from './ui/MainMenu.js';
import HUD from './ui/HUD.js';
import GameOverScreen from './ui/GameOverScreen.js';

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
    let lastPointerMove = 0;

    const getCanvasCoords = (event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    const goHome = () => {
        if (GameManager.uiState) {
            GameManager.uiState.showInventory = false;
            GameManager.uiState.showAchievements = false;
            GameManager.uiState.showUpgradeShop = false;
            GameManager.uiState.showSettings = false;
            GameManager.uiState.showMerchant = false;
            GameManager.uiState.dialogueActive = false;
        }
        GameManager.goToMainMenu();
        MainMenu.resetButtonState();
        HUD.resetHomeButtonState();
        GameOverScreen.resetHomeButtonState();
    };

    // Mouse click handler for menu/home navigation
    canvas.addEventListener('click', (e) => {
        const { x, y } = getCanvasCoords(e);
        if (GameManager.state === 'MAIN_MENU') {
            if (MainMenu.handleClick(x, y)) {
                GameManager.state = 'HOW_TO_PLAY';
                MainMenu.resetButtonState();
            }
        } else if (GameManager.state === 'HOW_TO_PLAY') {
            goHome();
        } else if (GameManager.state === 'PLAYING' || GameManager.state === 'MERCHANT_UI') {
            if (HUD.handleHomeClick(x, y)) {
                goHome();
            }
        } else if (GameManager.state === 'GAME_OVER') {
            if (GameOverScreen.handleHomeClick(x, y)) {
                goHome();
            }
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastPointerMove < 16) {
            return;
        }
        lastPointerMove = now;
        if (GameManager.state === 'MAIN_MENU') {
            const { x, y } = getCanvasCoords(e);
            MainMenu.updateHover(x, y);
            HUD.resetHomeButtonState();
            GameOverScreen.resetHomeButtonState();
            return;
        }
        if (GameManager.state === 'PLAYING' || GameManager.state === 'MERCHANT_UI') {
            const { x, y } = getCanvasCoords(e);
            HUD.updateHomeHover(x, y);
            MainMenu.resetButtonState();
            GameOverScreen.resetHomeButtonState();
            return;
        }
        if (GameManager.state === 'GAME_OVER') {
            const { x, y } = getCanvasCoords(e);
            GameOverScreen.updateHomeHover(x, y);
            MainMenu.resetButtonState();
            HUD.resetHomeButtonState();
            return;
        }
        MainMenu.resetButtonState();
        HUD.resetHomeButtonState();
        GameOverScreen.resetHomeButtonState();
    });

    canvas.addEventListener('mousedown', (e) => {
        if (GameManager.state === 'MAIN_MENU') {
            const { x, y } = getCanvasCoords(e);
            MainMenu.updateHover(x, y);
            MainMenu.setPressed(true);
            return;
        }
        if (GameManager.state === 'PLAYING' || GameManager.state === 'MERCHANT_UI') {
            const { x, y } = getCanvasCoords(e);
            HUD.updateHomeHover(x, y);
            HUD.setHomePressed(true);
            return;
        }
        if (GameManager.state === 'GAME_OVER') {
            const { x, y } = getCanvasCoords(e);
            GameOverScreen.updateHomeHover(x, y);
            GameOverScreen.setHomePressed(true);
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (GameManager.state === 'MAIN_MENU') {
            const { x, y } = getCanvasCoords(e);
            MainMenu.updateHover(x, y);
            MainMenu.setPressed(false);
            return;
        }
        if (GameManager.state === 'PLAYING' || GameManager.state === 'MERCHANT_UI') {
            const { x, y } = getCanvasCoords(e);
            HUD.updateHomeHover(x, y);
            HUD.setHomePressed(false);
            return;
        }
        if (GameManager.state === 'GAME_OVER') {
            const { x, y } = getCanvasCoords(e);
            GameOverScreen.updateHomeHover(x, y);
            GameOverScreen.setHomePressed(false);
            return;
        }
        MainMenu.resetButtonState();
        HUD.resetHomeButtonState();
        GameOverScreen.resetHomeButtonState();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'h' || e.key === 'H') {
            goHome();
        }
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
