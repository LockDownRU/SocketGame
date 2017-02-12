let Server = require('../Server/Server').Server;
let Entity = require('./Entity');

class LiveEntity extends Entity {
    constructor() {
        super();

        this.hp = 0;
        this.alive = false;
        this.movement = {
            vX: 0.0,
            vY: 0.0,
            speed: 0.0
        }
    }

    onDamage(damage, source) {
        if (!this.alive) {
            return;
        }

        this.hp -= damage;
        if (this.hp < 0) {
            this.hp = 0;
            this.onDie(source);
        }
    }

    onDie (source) {
        this.alive = false;
    }

    onTick() {
        super.onTick();

        this.posX = this.posX + (this.movement.vX * (this.movement.speed / Server.tickrate));
        this.posY = this.posY + (this.movement.vY * (this.movement.speed / Server.tickrate));
    }

    generatePacket() {
        let packet = super.generatePacket();

        packet['hp'] = this.hp;
        packet['alive'] = this.alive;

        return packet;
    }
}

module.exports = LiveEntity;