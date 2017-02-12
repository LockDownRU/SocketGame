let Server = {

    globalEntityMap: new Map(),

    init: () => {
        TickManager.init();
    },

    addEntity: (entity) => {
        Server.globalEntityMap.set(entity.id, entity);
    }
};

let TickManager = {

    tickrate: 40,
    tickTimer: null,

    init: () => {
        TickManager.tickTimer = setInterval(TickManager.serverTick, 1000 / this.tickrate);
    },

    serverTick: () => {
        Server.globalEntityMap.forEach((entity, id, map) => {
            entity.onTick();
        });
    }
};

module.exports = {
    Server: Server,
    TickManager: TickManager
};