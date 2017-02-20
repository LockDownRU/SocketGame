let Player = require('../Player');
let Bullet = require('../Custom/Bullet');
let Ability = require('../../Ability/Ability');
let MathUtils = require('../../Utils/MathUtils');
let IOUtils = require('../../Utils/IOUtils');

class Kirill extends Player {
    constructor() {
        super();
        this.sprite = "sq";
        this.hp.current = 1;
        this.hp.max = 1;
        this.height = 500;
        this.width = 500;
        this.movement.speed = 300;
        this.rotation = Math.PI / 4;
    }

    abilitiesInit() {
        let abilitiesMap = new Map();

        // Abilities
        abilitiesMap.set('fire', new Ability(0.0005, (player) => {
            let bullet = new Bullet(
                player.posX,
                player.posY,
                MathUtils.normalize(player.input.mouse.position.x, player.input.mouse.position.y),
                player.id);
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