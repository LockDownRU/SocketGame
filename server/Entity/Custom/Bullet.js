let LiveEntity = require('../LiveEntity');
let IOUtils = require('../../Utils/IOUtils');

class Bullet extends LiveEntity {

    constructor(x, y, vec, speed) {
        super();

        // E
        this.ttl = 100;
        this.posX = x;
        this.posY = y;
        this.rotation = Math.atan2(vec.vY, vec.vX);

        this.sprite = 'bullet';
        this.width = 64;
        this.height = 16;

        // LE
        this.hp.current = 2;
        this.hp.max = 2;

        this.movement.speed = speed || 800;
        this.movement.vX = vec.vX;
        this.movement.vY = vec.vY;

        this.type.push('Bullet');
    }

    onCollide(entity) {
        IOUtils.spawnEffect(this.posX, this.posY, 'newexp');
        entity.damage(1, 'Bullet');
    }

}

module.exports = Bullet;