let TickManager = require('./TickManager');

let Server = {

    globalEntityMap: new Map(),
    globalTextureMap: new Map(),

    init: () => {
        TickManager.init();
    },

    addEntity: (entity) => {
        Server.globalEntityMap.set(entity.id, entity);
    },

    addTexture: (key, texture) => {
        Server.globalTextureMap.set(key, texture);
    }
};

module.exports = Server;