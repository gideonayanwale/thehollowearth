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
