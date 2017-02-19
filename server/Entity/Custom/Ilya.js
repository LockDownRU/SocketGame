let Player = require('../Player');
let Bullet = require('../Custom/Bullet');
let Ability = require('../../Ability/Ability');
let MathUtils = require('../../Utils/MathUtils');
let IOUtils = require('../../Utils/IOUtils');

class Ilya extends Player{

    constructor(){
        super();
        this.sprite = "sonic";
        this.hp.current = 27;
        this.hp.max = 27;
        this.height = 110;
        this.width = 80;
        this.movement.speed = 1200;
    }

    abilitiesInit() {
        let abilitiesMap = new Map();

        // Abilities
        abilitiesMap.set('fire', new Ability(0.025, (player) => {
            let bullet = new Bullet(
                player.posX,
                player.posY,
                MathUtils.normalize(player.input.mouse.position.x, player.input.mouse.position.y),
                player.id,
                1200);
            IOUtils.spawnEntity(bullet);
        }));


        this.eventEmitter.on('mouseLeft', (tick, player) => {
            player.abilitiesMap.get('fire').tryUse(tick, player);
        });

        return abilitiesMap;
    }
}

module.exports = Ilya;