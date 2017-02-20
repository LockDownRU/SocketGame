let IOUtils = require('../Utils/IOUtils');
let CollisionUtils = require('../Utils/CollisionUtils');

let TickManager = {

    tickrate: 30,
    _tickTimer: null,
    _currentTick: 0,

    init: () => {
        TickManager._tickTimer = setInterval(TickManager.serverTick, 1000 / TickManager.tickrate);
    },

    serverTick: () => {

        // Чанки
        global.Server.globalEntityMap.forEach((entity) => {
            global.ChunkManager.updateEntityChunk(entity);
        });

        // Коллизия
        global.Server.globalEntityMap.forEach((entity, id, map) => {
            if (entity.alive !== false) {
                let collisions = [];
                if (entity.collisionEnabled === true) {
                    collisions = CollisionUtils.getEntityCollisions(entity);
                }
                entity.collisions = collisions;
                collisions.forEach((collideInfo) => {
                    entity.onCollide(global.Server.globalEntityMap.get(collideInfo.entityId), collideInfo.directionE1, collideInfo.directionE2);
                });
            }
        });

        // Тики
        global.Server.globalEntityMap.forEach((entity, id, map) => {
            if (entity.alive !== false) {
                entity.onTick(TickManager._currentTick);
            }
        });

        global.Server.despawnList.forEach((entityid, index) => {
            IOUtils.despawnEntity(entityid);
        });
        global.Server.despawnList = [];

        IOUtils.clientEntityMapUpdate();
        TickManager._currentTick++;
    }
};

module.exports = TickManager;