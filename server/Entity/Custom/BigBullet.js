let LiveEntity = require('../LiveEntity');
let IOUtils = require('../../Utils/IOUtils');

class BigBullet extends LiveEntity {

    constructor(x, y, vec, parentid) {
        super();

        this.parentid = parentid || null;

        // E
        this.ttl = 400;
        this.posX = x;
        this.posY = y;
        this.rotation = Math.atan2(-vec.vY, vec.vX);

        this.sprite = 'bullet';
        this.width = 100;
        this.height = 32;
        this.text  = {
            content: '{hp.current}',
            style: {
                align: 'center'
            }
        };

        // LE
        this.hp.current = 10;
        this.hp.max = 10;

        this.movement.speed = 200;
        this.movement.vX = vec.vX;
        this.movement.vY = vec.vY;

        this.type.push('BigBullet');
    }

    onCollide(entity, direction) {
        if (entity.id === this.parentid) {
            return;
        }
        if (entity.parentid === this.parentid && this.parentid !== null) {
            return;
        }

        entity.damage(20, {
            id: this.parentid,
            dieMessage: '{0} всадил пулю в голову {1}!'
        });

        if (entity.type.includes('BasePlayer')) {
            this.damage(this.hp.max);
        }
    }

    onDie() {
        let expSize = Math.max(this.height, this.width);
        IOUtils.spawnEffect(this.posX, this.posY, 'exp', expSize * 2, expSize * 2, 1);
        IOUtils.addToDespawnList(this.id);
    }
}

module.exports = BigBullet;