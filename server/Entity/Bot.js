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

        this.posX = Math.random()*2000 - 1000;
        this.posY = Math.random()*2000 - 1000;

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

        this.ttl = 1800;
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

        if (this.ttl === 0) {
            IOUtils.despawnEntity(this.id);
        } else if (this.ttl > 0) {
            this.ttl--;
        }

        let nearbyEntities = global.ChunkManager.getNearbyEntities(this.chunk.cx,this.chunk.cy);
        let minDistance = null;

        let vX = 0;
        let vY = 0;
        this.enemy = undefined;
        this.movement.speed = 50;

        nearbyEntities.forEach((entity) =>{
            let e = global.Server.globalEntityMap.get(entity);
            if (e.type.includes('BasePlayer')) {
                let dist = MathUtils.distance(this.posX, this.posY, e.posX, e.posY);
                if (minDistance !== null || minDistance < dist) {
                    minDistance = dist;
                    this.enemy = e;
                }
            }
        });

        if (tick % 90 === 0){
            vX = Math.random()*2 - 1;
            vY = Math.sqrt(1 - vX*vX)*2 - 1;

            this.movement.vX = vX;
            this.movement.vY = vY;
        }

        if (this.enemy !== undefined && minDistance <= 500){
            if (minDistance <= 500){
                let normVec = MathUtils.normalize(this.enemy.posX - this.posX, this.enemy.posY - this.posY);

                this.movement.speed = 150;
                this.movement.vX = normVec.vX;
                this.movement.vY = normVec.vY;
            }

            if (minDistance <= 300){
                this.eventEmitter.emit('fire', tick, this);
            }
        }
    }

    onDie (source) {
        super.onDie();
        console.log('Игрок [' + this.nickname + '] умер.');

        let killer = global.Server.globalEntityMap.get(source.id);
        let killSource;
        if (killer === undefined) {
            killSource = '\\o/';
        } else {
            killSource = killer.nickname || '\\o/';
        }

        let dieMsg = source.dieMessage.format(killSource, this.nickname);

        Chat.sendMessage('Server', dieMsg, '0');
    }
}

module.exports = Bot;