let LiveEntity = require('./LiveEntity');
let ServerUtils = require('../Utils/ServerUtils');
let MathUtils = require('../Utils/MathUtils');
let Ability = require('../Ability/Ability');
let IOUtils = require('../Utils/IOUtils');
let Chat = require('../Chat/Chat');
let Bullet = require('./Custom/Bullet');
let events = require('events');

class Player extends LiveEntity {

    /**
     * @return {string}
     */
    get Hostname() {
        if (this.hostname === null) {
            return this.ip;
        }
        return this.hostname;
    }

    /**
     * @return {string}
     */
    get Nickname() {
        if (this.nickname === null) {
            return this.Hostname;
        }
        return this.nickname;
    }


    constructor() {
        super();

        this.socket = null;
        this.ip = null;
        this.hostname = null;
        this.nickname = null;
        this.input = {
            keyboard: new Map(),
            mouse: {
                isDown: false,
                button: 1,
                position: {
                    x: 0,
                    y: 0
                }
            }
        };

        this.text  = {
            content: '{nickname}\n{hp.current} \\ {hp.max}',
            style: {
                align: 'center'
            }
        };

        this.camera = {
            target: null,
            x: 0,
            y: 0
        };
        this.type.push('BasePlayer');

        this.rotation = Math.random() * Math.PI;

        // Events
        this.eventEmitter = new events.EventEmitter();

        this.abilitiesMap = this.abilitiesInit(this.eventEmitter);
    }

    abilitiesInit() {
        let abilitiesMap = new Map();

        // Abilities
        abilitiesMap.set('fire', new Ability(0.1, (player) => {
            let bullet = new Bullet(player.posX, player.posY, MathUtils.normalize(player.input.mouse.position.x, player.input.mouse.position.y));
            IOUtils.spawnEntity(bullet);
        }));


        this.eventEmitter.on('mouseLeft', (tick, player) => {
            player.abilitiesMap.get('fire').tryUse(tick, player);
        });

        return abilitiesMap;
    }

    onTick(tick) {

        if (this.alive === false) {
            return;
        }

        super.onTick();

        let keyboard = this.input.keyboard;

        if (keyboard.has(87) && keyboard.has(83) && keyboard.has(65) && keyboard.has(68)) {

            let vX = 0;
            let vY = 0;

            if (keyboard.get(87) === true) {
                vY -= 1.0;
            }

            if (keyboard.get(83) === true) {
                vY += 1.0;
            }

            if (keyboard.get(65) === true) {
                vX -= 1.0;
            }

            if (keyboard.get(68) === true) {
                vX += 1.0;
            }

            let normVec = MathUtils.normalize(vX, vY);

            vX = normVec.vX;
            vY = normVec.vY;

            this.movement.vX = vX;
            this.movement.vY = vY;
        }

        if (this.input.mouse.isDown === true) {
            if (this.input.mouse.button === 1) {
                this.eventEmitter.emit('mouseLeft', tick, this)
            } else if (this.input.mouse.button === 2) {
                this.eventEmitter.emit('mouseRight', tick, this)
            }
        }
    }

    onDie (source) {
        super.onDie();
        console.log('Игрок [' + this.Nickname + '] умер.');
        Chat.sendMessage('Server', 'Игрок [' + this.Nickname + '] умер.', '0');
    }

    onConnect(socket) {
        this.socket = socket;
        this.ip = ServerUtils.getClientIp(socket);

        ServerUtils.getClientHostname(this.ip, (ip) => {
            this.hostname = ip;
        });

        console.log('Игрок [' + this.Nickname + '] подключился.');
    }

    onDisconnect(socket) {

        this.socket = null;
        console.log('Игрок [' + this.Nickname + '] отключился.');
    }


    generatePacket() {
        let packet = super.generatePacket();

        packet['nickname'] = this.Nickname;

        return packet;
    }
}

module.exports = Player;