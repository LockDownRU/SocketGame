let LiveEntity = require('../LiveEntity');
let IOUtils = require('../../Utils/IOUtils');

class Bullet extends LiveEntity {

    constructor(x, y, vec, parentid) {
        super();

        // B
        this.parentid = parentid || null;

        // E
        this.ttl = 140;
        this.posX = x;
        this.posY = y;
        this.rotation = Math.atan2(-vec.vY, vec.vX);

        this.sprite = 'bullet';
        this.width = 50;
        this.height = 16;

        // LE
        this.hp.current = 1;
        this.hp.max = 1;

        this.movement.speed = 400;
        this.movement.vX = vec.vX;
        this.movement.vY = vec.vY;

        this.type.push('Bullet');
    }

    onCollide(entity, directionE1, directionE2) {
        if (entity.id === this.parentid) {
            return;
        }
        if (entity.parentid === this.parentid && this.parentid !== null) {
            return;
        }

        entity.damage(1, {
            id: this.parentid,
            dieMessage: '{0} всадил пулю в голову {1}!'
        });

        console.log(directionE2);

        this.damage(this.hp.max);
    }

    onDamage(damage, source) {
        super.onDamage(damage, source);
        return true;
    }

    onDie() {
        let expSize = Math.max(this.height, this.width);
        IOUtils.spawnEffect(this.posX, this.posY, 'newexp', expSize, expSize);
        IOUtils.addToDespawnList(this.id);
    }

}

module.exports = Bullet;