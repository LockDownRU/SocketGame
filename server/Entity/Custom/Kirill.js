let Player = require('../Player');
let Bullet = require('../Custom/Bullet');
let Ability = require('../../Ability/Ability');
let MathUtils = require('../../Utils/MathUtils');
let IOUtils = require('../../Utils/IOUtils');

class Kirill extends Player {
    constructor() {
        super();
        this.sprite = "bulba";
        this.hp.current = 1;
        this.hp.max = 1;
        this.height = 50;
        this.width = 50;
        this.movement.speed = 300;
    }

    abilitiesInit() {
        let abilitiesMap = new Map();

        // Abilities
        abilitiesMap.set('fire', new Ability(0.0005, (player) => {
            let bullet = new Bullet(
                player.posX,
                player.posY,
                MathUtils.normalize(player.input.mouse.position.x, player.input.mouse.position.y),
                player.id,
                800);
            IOUtils.spawnEntity(bullet);
        }));


        this.eventEmitter.on('mouseLeft', (tick, player) => {
            player.abilitiesMap.get('fire').tryUse(tick, player);
        });

        return abilitiesMap;
    }

    onDamage() {
        return false;
    }
}

module.exports = Kirill;