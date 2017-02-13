let LiveEntity = require('./LiveEntity');
let ServerUtils = require('../Utils/ServerUtils');

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
    }

    onTick() {
        super.onTick();

    }

    onDie (source) {
        console.log('Игрок [' + this.Nickname + '] умер.');
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