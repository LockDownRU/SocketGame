let Player = require('../Player');

class Kirill extends Player {
    constructor() {
        super();

        this.sprite = 'bulba';
        this.hp.current = 1000;
        this.hp.max = 1000;
    }

    onDamage() {
        return true;
    }
}

module.exports = Kirill;