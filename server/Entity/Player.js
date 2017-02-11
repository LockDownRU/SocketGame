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

        this.ip = null;
        this.hostname = null;
        this.nickname = null;
    }



    onTick() {

    }

    onConnect(socket) {
        this.ip = ServerUtils.getClientIp(socket);

        ServerUtils.getClientHostname(this.ip, (ip) => {
            this.hostname = ip;
        });

        console.log('Игрок [' + this.Nickname + '] подключился.');
    }

    onDisconnect(socket) {

        console.log('Игрок [' + this.Nickname + '] отключился.');
    }
}

module.exports = Player;