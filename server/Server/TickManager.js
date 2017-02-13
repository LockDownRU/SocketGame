let IOUtils = require('../Utils/IOUtils');

let TickManager = {

    tickrate: 40,
    tickTimer: null,

    init: () => {
        TickManager.tickTimer = setInterval(TickManager.serverTick, 1000 / this.tickrate);
    },

    serverTick: () => {
        global.Server.globalEntityMap.forEach((entity, id, map) => {
            entity.onTick();
        });

        IOUtils.clientEntityMapUpdate();
    }
};

module.exports = TickManager;