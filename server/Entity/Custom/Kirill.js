let Player = require('../Player');
let Bullet = require('../Custom/Bullet');
let Ability = require('../../Ability/Ability');
let MathUtils = require('../../Utils/MathUtils');
let IOUtils = require('../../Utils/IOUtils');

class Kirill extends Player {
    constructor() {
        super();
        this.sprite = "sq";
        this.hp.current = 50;
        this.hp.max = 50;
        this.height = 256;
        this.width = 256;
        this.movement.speed = 180;
        this.rotation = Math.PI / 4;
    }

    onDamage() {
        return true;
    }
}

module.exports = Kirill;