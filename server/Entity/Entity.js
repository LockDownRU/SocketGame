let MathUtils = require('../Utils/MathUtils');
let IOUtils = require('../Utils/IOUtils');

class Entity {
    constructor() {
        this.id = MathUtils.guid();

        this.posX = 0.0;
        this.posY = 0.0;

        this.chunk = null;

        this.collisions = [];

        this.sprite = 'bunny';
        this.width = 39;
        this.height = 55;
        this.rotation = 0.0;

        this.text = {
            content: '',
            style: {}
        };

        this.collisionEnabled = true;

        this.ttl = -1;
        this.type = ['BaseEntity'];
    }

    onTick(tick) {
        if (this.ttl === 0) {
            IOUtils.despawnEntity(this.id);
        } else if (this.ttl > 0) {
            this.ttl--;
        }
    }

    onCollide(entity, directionE1, directionE2) {

    }

    onDespawn() {

    }

    generatePacket() {
        let packet = {
            id: this.id,
            posX: this.posX,
            posY: this.posY,
            sprite: this.sprite,
            width: this.width,
            height: this.height,
            rotation: this.rotation,
            text: this.text,
            type: this.type
        };

        return packet;
    }
}

module.exports = Entity;