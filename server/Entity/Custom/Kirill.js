let Player = require('../Player');

class Kirill extends Player {
    constructor() {
        super();

        this.hp.current = 1000;
        this.hp.max = 1000;
        this.height = 100;
        this.width = 100;
    }

    onDamage() {
        return true;
    }
}

module.exports = Kirill;