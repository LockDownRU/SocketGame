let MathUtils = require('../Utils/MathUtils');
let Entity = require('./Entity');

class LiveEntity extends Entity {
    constructor() {
        super();

        this.movement = {
            vX: 0.0,
            vY: 0.0,
            speed: 0.0
        }
    }
}

module.exports = LiveEntity;