let TickManager = require('./TickManager');

let Server = {

    globalEntityMap: new Map(),
    globalTextureMap: new Map(),
    despawnList: [],

    init: () => {
        TickManager.init();
    },

    addEntity: (entity) => {
        if (!Server.globalEntityMap.has(entity.id)) {
            Server.globalEntityMap.set(entity.id, entity);
            return true;
        }
        return false;
    },

    removeEntityById: (id) => {
        if (Server.globalEntityMap.has(id)) {
            Server.globalEntityMap.delete(id);
            return true;
        }
        return false;
    },

    addTexture: (key, texture) => {
        if (!Server.globalTextureMap.has(key)) {
            Server.globalTextureMap.set(key, texture);
            return true;
        }
        return false;
    }
};

module.exports = Server;