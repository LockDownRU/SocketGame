let LiveEntity = require('../LiveEntity');
let IOUtils = require('../../Utils/IOUtils');

class Bullet extends LiveEntity {

    constructor(x, y, vec, speed, parentid, width, height, d, hp, text) {
        super();

        this.parentid = parentid || null;
        this.dm = d || 1;

        // E
        this.ttl = 100;
        this.posX = x;
        this.posY = y;
        this.rotation = Math.atan2(-vec.vY, vec.vX);

        this.sprite = 'bullet';
        this.width = width || 60;
        this.height = height || 16;

        if (text === true) {
            this.text  = {
                content: '.:{hp.current} \\ {hp.max}:.',
                style: {
                    align: 'center'
                }
            };
        }

        // LE
        this.hp.current = hp || 10;
        this.hp.max = hp || 10;

        this.movement.speed = speed || 800;
        this.movement.vX = vec.vX;
        this.movement.vY = vec.vY;

        this.type.push('Bullet');
    }

    onCollide(entity) {
        if (entity.id === this.parentid) {
            return;
        }
        if (entity.parentid === this.parentid && this.parentid !== null) {
            return;
        }
        IOUtils.spawnEffect(this.posX, this.posY, 'newexp');

        entity.damage(this.dm, {
            id: this.parentid,
            dieMessage: '{0} всадил пулю в голову {1}!'
        });

        if (entity.type.includes('BasePlayer')) {
            IOUtils.despawnEntity(this.id);
        }
    }

    onDie() {
        super.onDie();
        IOUtils.despawnEntity(this.id);
    }

}

module.exports = Bullet;