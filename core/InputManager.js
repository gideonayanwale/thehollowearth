class InputManager {
    constructor() {
        this.keysDown = new Set();
        this.justPressed = new Set();
        this.mousePos = { x: 0, y: 0 };
        this.mouseButtons = new Set();
    }

    init() {
        window.addEventListener('keydown', (e) => {
            if (!this.keysDown.has(e.code)) {
                this.justPressed.add(e.code);
            }
            this.keysDown.add(e.code);

            // Expansion: UI toggles
            if (e.key === 'i' || e.key === 'I') {
                window.GameManager.uiState.showInventory = !window.GameManager.uiState.showInventory;
            }
            if (e.key === 'a' || e.key === 'A') {
                window.GameManager.uiState.showAchievements = !window.GameManager.uiState.showAchievements;
            }
            if (e.key === 's' || e.key === 'S') {
                window.GameManager.uiState.showUpgradeShop = !window.GameManager.uiState.showUpgradeShop;
            }
            if (e.key === 'Escape') {
                window.GameManager.uiState.showInventory = false;
                window.GameManager.uiState.showAchievements = false;
                window.GameManager.uiState.showUpgradeShop = false;
                window.GameManager.uiState.showSettings = false;
            }
            // Upgrade purchases (1-6)
            if (e.key >= '1' && e.key <= '6' && window.GameManager.uiState.showUpgradeShop) {
                const upgradeKeys = Object.keys(window.GameManager.playerUpgrades.upgrades);
                const index = parseInt(e.key) - 1;
                if (index < upgradeKeys.length) {
                    const key = upgradeKeys[index];
                    const cost = window.GameManager.playerUpgrades.getCost(key);
                    if (window.GameManager.scoreManager.total >= cost) {
                        window.GameManager.playerUpgrades.purchase(key, window.GameManager.scoreManager.total);
                        window.GameManager.scoreManager.total -= cost;
                    }
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keysDown.delete(e.code);
            this.justPressed.delete(e.code);
        });

        window.addEventListener('mousedown', (e) => {
            this.mouseButtons.add(e.button);
        });

        window.addEventListener('mouseup', (e) => {
            this.mouseButtons.delete(e.button);
        });
    }

    isDown(key) {
        return this.keysDown.has(key);
    }

    wasJustPressed(key) {
        const wasPressed = this.justPressed.has(key);
        if (wasPressed) {
            this.justPressed.delete(key);
        }
        return wasPressed;
    }

    update() {
        // Frame-based updates if necessary
    }
}

export default new InputManager();
