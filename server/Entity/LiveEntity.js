let Entity = require('./Entity');
let TickManager = require('../Server/TickManager');

class LiveEntity extends Entity {
    constructor() {
        super();

        this.hp = {
            current: 8,
            max: 10
        };
        this.alive = true;
        this.movement = {
            vX: 0.0,
            vY: 0.0,
            speed: 1.0
        };
        this.text = {
            content: '',
            style: {}
        };
        this.type.push('BaseLiveEntity');
    }

    onDamage(damage, source) {
        if (!this.alive) {
            return;
        }

        this.hp.current -= damage;
        if (this.hp.current < 0) {
            this.hp.current = 0;
            this.onDie(source);
        }
    }

    onDie (source) {
        this.alive = false;
    }

    onTick() {
        super.onTick();

        this.posX = this.posX + (this.movement.vX * (this.movement.speed / TickManager.tickrate));
        this.posY = this.posY + (this.movement.vY * (this.movement.speed / TickManager.tickrate));
    }

    generatePacket() {
        let packet = super.generatePacket();

        packet['hp'] = this.hp;
        packet['alive'] = this.alive;

        return packet;
    }
}

module.exports = LiveEntity;