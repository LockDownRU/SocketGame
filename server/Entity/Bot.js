let LiveEntity = require('./LiveEntity');
let MathUtils = require('../Utils/MathUtils');
let Bullet = require('./Custom/Bullet');
let Ability = require('../Ability/Ability');
let IOUtils = require('../Utils/IOUtils');
let Chat = require('../Chat/Chat');
let events = require('events');

class Bot extends LiveEntity{
    constructor () {
        super();

        this.nickname = 'The Bot';

        this.posX = Math.random()*1000 - 500;
        this.posY = Math.random()*1000 - 500;

        this.sprite = 'sq';
        this.width = 50;
        this.height = 50;

        this.movement.speed = 50;

        this.text  = {
            content: '{hp.current} \\ {hp.max}',
            style: {
                align: 'center'
            }
        };

        this.enemy = undefined;
        this.fireRadius = 500;

        this.ttl = 5400 * Math.random();
        this.type.push('Bot');

        // Events
        this.eventEmitter = new events.EventEmitter();

        this.abilitiesMap = this.abilitiesInit(this.eventEmitter);
    }

    abilitiesInit() {
        let abilitiesMap = new Map();

        // Abilities
        abilitiesMap.set('fire', new Ability(0.3, (player) => {
            let bullet = new Bullet(
                player.posX,
                player.posY,
                MathUtils.normalize(this.enemy.posX - this.posX, this.enemy.posY - this.posY),
                player.id);
            IOUtils.spawnEntity(bullet);
        }));

        this.eventEmitter.on('fire', (tick, player) => {
            player.abilitiesMap.get('fire').tryUse(tick, player);
        });

        return abilitiesMap;
    }

    onTick(tick) {
        super.onTick();

        if (this.chunk === null) {
            return;
        }

        let vX = 0;
        let vY = 0;

        this.movement.speed = 50;

        let aim = this.findAim();
        let minDistance = aim.distance;
        this.enemy = aim.enemy;

        if (tick % 90 === 0) {
            vX = Math.random() * 2 - 1;
            vY = Math.sqrt(1 - vX * vX) * 2 - 1;

            this.movement.vX = vX;
            this.movement.vY = vY;
        }

        if (this.enemy !== undefined && minDistance <= this.fireRadius) {
            if (minDistance <= this.fireRadius) {
                let normVec = MathUtils.normalize(this.enemy.posX - this.posX, this.enemy.posY - this.posY);

                this.movement.speed = 150;
                this.movement.vX = normVec.vX;
                this.movement.vY = normVec.vY;
            }

            if (minDistance <= this.fireRadius-200) {
                this.eventEmitter.emit('fire', tick, this);
            }
        }
    }

    findAim () {
        let nearbyEntities = global.ChunkManager.getNearbyEntities(this.chunk.cx, this.chunk.cy);
        let minDistance = null;
        let enemy = undefined;

        nearbyEntities.forEach((entity) =>{
            let e = global.Server.globalEntityMap.get(entity);
            if (e.type.includes('BasePlayer') && e.alive === true) {
                let dist = MathUtils.distance(this.posX, this.posY, e.posX, e.posY);
                if (minDistance !== null || minDistance < dist) {
                    minDistance = dist;
                    enemy = e;
                }
            }
        });

        return {enemy: enemy, distance: minDistance};
    }

    onDamage(damage, source) {
        return true;
    }

    onDespawn () {
        IOUtils.spawnEntity(new Bot());
    }

    onDie (source) {
        super.onDie();
        this.onDespawn();
        IOUtils.despawnEntity(this.id);
    }
}

module.exports = Bot;