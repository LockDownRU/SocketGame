let MathUtils = require('../Utils/MathUtils');
let GameUtils = require('../Utils/GameUtils');

class Entity {
    constructor() {
        this.id = MathUtils.guid();

        this.posX = 0.1;
        this.posY = 0.0;

        this.sprite = null;
        this.width = 0;
        this.height = 0;

        this.ttl = -1;
    }

    onTick() {
        if (this.ttl === 0) {
            GameUtils.despawnEntity(id);
        } else if (this.ttl > 0) {
            this.ttl--;
        }
    }

    generatePacket() {
        let packet = {
            id: this.id,
            posX: this.posX,
            posY: this.posY,
            sprite: this.sprite,
            width: this.width,
            height: this.height
        };

        return packet;
    }
}

module.exports = Entity;