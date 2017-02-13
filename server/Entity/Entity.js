let MathUtils = require('../Utils/MathUtils');

class Entity {
    constructor() {
        this.id = MathUtils.guid();

        this.posX = 0.1;
        this.posY = 0.0;

        this.sprite = null;
        this.width = 0;
        this.height = 0;
    }

    onTick() {

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