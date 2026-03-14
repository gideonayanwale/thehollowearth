import Layer from './Layer.js';
import Room from './Room.js';
import TunnelRat from '../entities/enemies/TunnelRat.js';
import StoneGolem from '../entities/enemies/StoneGolem.js';
import CrystallineSlug from '../entities/enemies/CrystallineSlug.js';
import ShadowSpider from '../entities/enemies/ShadowSpider.js';
import MagmaBat from '../entities/enemies/MagmaBat.js';
import DepthTitan from '../entities/bosses/DepthTitan.js';
import CrystalColossus from '../entities/bosses/CrystalColossus.js';
import MoleMerchant from '../entities/npcs/MoleMerchant.js';
import Pickup from '../pickups/Pickup.js';

export default class Generator {
    static generate(layerIndex, difficultyMultiplier) {
        const cols = 50 + layerIndex * 10;
        const rows = cols;
        const tileSize = 32;

        const layer = new Layer(layerIndex, cols, rows, tileSize);

        const mainRoom = new Room(5, 5, 20, 20);
        layer.rooms.push(mainRoom);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                layer.setTile(x, y, 'solid');
            }
        }

        for (let y = 0; y < mainRoom.height; y++) {
            for (let x = 0; x < mainRoom.width; x++) {
                layer.setTile(mainRoom.x + x, mainRoom.y + y, 'empty');
            }
        }

        layer.setTile(mainRoom.x + Math.floor(mainRoom.width / 2), mainRoom.y + mainRoom.height - 2, 'descent');
        layer.spawnPoint = { x: (mainRoom.x + 2) * tileSize, y: (mainRoom.y + 2) * tileSize };

        // Expansion: Spawn enemies and bosses based on layer depth
        if (layerIndex > 0) {
            if (layerIndex <= 2) {
                layer.entities.push(new TunnelRat((mainRoom.x + 5) * tileSize, (mainRoom.y + 10) * tileSize));
                layer.entities.push(new StoneGolem((mainRoom.x + 15) * tileSize, (mainRoom.y + 10) * tileSize));
                layer.entities.push(new CrystallineSlug((mainRoom.x + 8) * tileSize, (mainRoom.y + 15) * tileSize));
            } else if (layerIndex === 3) {
                layer.entities.push(new CrystallineSlug((mainRoom.x + 8) * tileSize, (mainRoom.y + 12) * tileSize));
                layer.entities.push(new TunnelRat((mainRoom.x + 5) * tileSize, (mainRoom.y + 10) * tileSize));
            } else if (layerIndex === 4) {
                layer.entities.push(new ShadowSpider((mainRoom.x + 10) * tileSize, (mainRoom.y + 10) * tileSize));
                layer.entities.push(new CrystallineSlug((mainRoom.x + 5) * tileSize, (mainRoom.y + 12) * tileSize));
            } else if (layerIndex === 5) {
                layer.entities.push(new DepthTitan((mainRoom.x + 10) * tileSize, (mainRoom.y + 10) * tileSize));
                layer.entities.push(new MagmaBat((mainRoom.x + 3) * tileSize, (mainRoom.y + 5) * tileSize));
            } else if (layerIndex === 7) {
                layer.entities.push(new CrystalColossus((mainRoom.x + 10) * tileSize, (mainRoom.y + 10) * tileSize));
            } else if (layerIndex > 7) {
                // Deep layers - mix of all enemies
                const enemyTypes = [CrystallineSlug, ShadowSpider, MagmaBat];
                for (let i = 0; i < 3; i++) {
                    const EnemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
                    const x = (mainRoom.x + 5 + i * 5) * tileSize;
                    const y = (mainRoom.y + 10) * tileSize;
                    layer.entities.push(new EnemyType(x, y));
                }
            }
        }

        layer.entities.push(new MoleMerchant((mainRoom.x + 10) * tileSize, (mainRoom.y + 5) * tileSize));

        // More ore as you go deeper
        const oreCount = 2 + Math.floor(layerIndex / 3);
        for (let i = 0; i < oreCount; i++) {
            const randomX = (mainRoom.x + 8 + Math.floor(Math.random() * 4)) * tileSize;
            const randomY = (mainRoom.y + 14 + Math.floor(Math.random() * 4)) * tileSize;
            layer.pickups.push(new Pickup(randomX, randomY, 'iron_ore'));
        }

        return layer;
    }
}
