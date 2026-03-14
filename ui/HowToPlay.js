import GameManager from '../core/GameManager.js';

export default class HowToPlay {
    static draw(ctx, width, height) {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fff';
        ctx.font = '48px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('HOW TO PLAY', width / 2, 100);

        ctx.font = '18px "Press Start 2P"';
        ctx.textAlign = 'left';
        const lines = [
            'Move: Arrow Keys or WASD',
            'Jump: Space',
            'Interact: E',
            'Open Inventory: I',
            'View Achievements: A',
            'Open Upgrade Shop: S',
            'Pause/Settings: ESC',
            '',
            'Collect ores, defeat enemies,',
            'upgrade your abilities, and',
            'descend deeper into the Hollow Earth!',
            '',
            'Press ESC to return to Main Menu.'
        ];
        lines.forEach((line, i) => {
            ctx.fillText(line, width / 2 - 200, 180 + i * 32);
        });
    }
}
