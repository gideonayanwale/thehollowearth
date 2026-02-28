import Layer from './Layer.js';
import Room from './Room.js';
import TunnelRat from '../entities/enemies/TunnelRat.js';
import StoneGolem from '../entities/enemies/StoneGolem.js';
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

        if (layerIndex > 0) {
            layer.entities.push(new TunnelRat((mainRoom.x + 5) * tileSize, (mainRoom.y + 10) * tileSize));
            layer.entities.push(new StoneGolem((mainRoom.x + 15) * tileSize, (mainRoom.y + 10) * tileSize));
        }

        layer.entities.push(new MoleMerchant((mainRoom.x + 10) * tileSize, (mainRoom.y + 5) * tileSize));

        layer.pickups.push(new Pickup((mainRoom.x + 8) * tileSize, (mainRoom.y + 15) * tileSize, 'iron_ore'));
        layer.pickups.push(new Pickup((mainRoom.x + 9) * tileSize, (mainRoom.y + 15) * tileSize, 'iron_ore'));

        return layer;
    }
}
