import GameManager from '../core/GameManager.js';

export default class AchievementUI {
    static draw(ctx, width, height) {
        const achievements = GameManager.achievementSystem.achievements;
        const startY = 100;
        const cols = 2;
        const cardWidth = (width - 40) / cols;
        const cardHeight = 60;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fff';
        ctx.font = '24px "Press Start 2P"';
        ctx.textAlign = 'left';
        ctx.fillText('ACHIEVEMENTS', 20, 40);

        ctx.font = '12px monospace';
        const unlockedCount = GameManager.achievementSystem.getUnlockedCount();
        const totalCount = GameManager.achievementSystem.getTotalCount();
        ctx.fillText(`${unlockedCount}/${totalCount} Unlocked`, 20, 70);

        let index = 0;
        for (let key in achievements) {
            const achievement = achievements[key];
            const col = index % cols;
            const row = Math.floor(index / cols);

            const x = 20 + col * (cardWidth + 10);
            const y = startY + row * (cardHeight + 10);

            // Card background
            ctx.fillStyle = achievement.unlocked ? 'rgba(100, 200, 100, 0.3)' : 'rgba(100, 100, 100, 0.3)';
            ctx.fillRect(x, y, cardWidth, cardHeight);

            // Border
            ctx.strokeStyle = achievement.unlocked ? '#0f0' : '#888';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cardWidth, cardHeight);

            // Text
            ctx.fillStyle = achievement.unlocked ? '#0f0' : '#888';
            ctx.font = '10px monospace';
            ctx.fillText(achievement.name, x + 5, y + 15);
            ctx.fillText(achievement.desc, x + 5, y + 28);
            ctx.fillText(`+${achievement.points}pts`, x + 5, y + 42);

            index++;
        }

        // Total points
        const totalPoints = GameManager.achievementSystem.getTotalPoints();
        ctx.fillStyle = '#fff';
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText(`Total: ${totalPoints} Points`, 20, height - 20);
    }

    static drawMini(ctx, width, height) {
        const system = GameManager.achievementSystem;
        const unlocked = system.getUnlockedCount();
        const total = system.getTotalCount();

        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`Achievements: ${unlocked}/${total}`, width - 20, height - 20);
    }
}
