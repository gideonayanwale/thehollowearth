import ScoreManager from './ScoreManager.js';
import InputManager from './InputManager.js';
import AudioManager from './AudioManager.js';
import UpgradeManager from './UpgradeManager.js';
import PhysicsManager from '../physics/PhysicsManager.js';
import Player from '../entities/Player.js';
import Generator from '../world/Generator.js';
import Renderer from './Renderer.js';
import PowerUpSystem from '../systems/PowerUpSystem.js';
import AchievementSystem from '../systems/AchievementSystem.js';
import CraftingSystem from '../systems/CraftingSystem.js';
import ParticleSystem from '../systems/ParticleSystem.js';
import PlayerUpgrades from '../systems/PlayerUpgrades.js';
import SettingsMenu from '../systems/SettingsMenu.js';

class GameManager {
    constructor() {
        this.currentLayerIndex = 0;
        this.difficultyMultiplier = 1.0;
        this.layer = null;
        this.player = null;
        this.scoreManager = ScoreManager;
        this.inputManager = InputManager;
        this.audioManager = AudioManager;
        this.upgradeManager = new UpgradeManager();
        this.physicsManager = PhysicsManager;

        this.state = 'MAIN_MENU';

        // Expansion systems
        this.powerUpSystem = new PowerUpSystem();
        this.achievementSystem = new AchievementSystem();
        this.craftingSystem = new CraftingSystem();
        this.particleSystem = new ParticleSystem();
        this.playerUpgrades = new PlayerUpgrades();
        this.settingsMenu = new SettingsMenu();

        this.uiState = {
            showInventory: false,
            showAchievements: false,
            showUpgradeShop: false,
            showSettings: false,
            showMerchant: false,
            dialogueActive: false
        };
    }

    init() {
        this.inputManager.init();
        this.audioManager.init();
        this.goToMainMenu();
    }

    goToMainMenu() {
        this.state = 'MAIN_MENU';
    }

    startGame() {
        this.resetGame();
        this.state = 'PLAYING';
    }

    resetGame() {
        this.currentLayerIndex = 0;
        this.difficultyMultiplier = 1.0;
        this.scoreManager.reset();

        this.player = new Player(400, 300);
        this.loadLayer(this.currentLayerIndex);
    }

    loadLayer(index) {
        this.currentLayerIndex = index;
        this.difficultyMultiplier = 1.0 + (index * 0.5);

        this.layer = Generator.generate(index, this.difficultyMultiplier);

        if (this.player && this.layer.spawnPoint) {
            this.player.x = this.layer.spawnPoint.x;
            this.player.y = this.layer.spawnPoint.y;
        }

        this.audioManager.playAmbientForLayer(index);
        this.scoreManager.add("depth", 100 * index);

        if (this.player) {
            this.player.lanternRadius = Math.max(50, 200 - (index * 30));
        }
    }

    update(dt) {
        this.inputManager.update();
        if (Renderer.screenShake) {
            Renderer.screenShake.update(dt);
        }

        if (this.state === 'MAIN_MENU') {
            if (this.inputManager.wasJustPressed('Space')) {
                this.startGame();
            }
        } else if (this.state === 'GAME_OVER') {
            if (this.inputManager.wasJustPressed('Space')) {
                this.resetGame();
                this.state = 'PLAYING';
            }
        } else if (this.state === 'PLAYING') {
            if (this.player) {
                this.player.update(dt);
                if (this.player.hp <= 0) {
                    this.triggerGameOver();
                }
                // Apply upgrades to player
                this.playerUpgrades.applyUpgradesToPlayer(this.player);
            }
            if (this.layer) {
                this.layer.update(dt);
            }
            // Expansion system updates
            this.powerUpSystem.update(dt, this.player);
            this.particleSystem.update(dt);
            this.craftingSystem.update(dt);
        } else if (this.state === 'MERCHANT_UI') {
            if (this.inputManager.wasJustPressed('KeyE')) {
                this.state = 'PLAYING';
            } else if (this.inputManager.wasJustPressed('Digit1')) {
                if (this.player && this.player.inventory.iron_ore >= 1) {
                    this.player.inventory.iron_ore -= 1;
                    this.player.hp = Math.min(100, this.player.hp + 25);
                }
            } else if (this.inputManager.wasJustPressed('Digit2')) {
                if (this.player && this.player.inventory.iron_ore >= 2) {
                    this.player.inventory.iron_ore -= 2;
                    this.player.inventory.explosive_powder += 1;
                }
            }
        }
    }

    triggerGameOver() {
        this.state = 'GAME_OVER';

        const highScoreStr = localStorage.getItem("hollow_earth_highscore");
        const highScore = highScoreStr ? parseInt(highScoreStr, 10) : 0;
        if (this.scoreManager.total > highScore) {
            localStorage.setItem("hollow_earth_highscore", this.scoreManager.total.toString());
        }

        // Expansion: update achievement system high score
        this.achievementSystem.setStat('highScore', Math.max(this.achievementSystem.stats.highScore, this.scoreManager.total));
    }
}

export default new GameManager();
