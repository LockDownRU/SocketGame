let TickManager = require('./TickManager');

let Server = {

    globalEntityMap: new Map(),

    init: () => {
        TickManager.init();
    },

    addEntity: (entity) => {
        Server.globalEntityMap.set(entity.id, entity);
    }
};

module.exports = Server;