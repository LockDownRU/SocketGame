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
        global.Server.globalEntityMap.forEach((entity, id, map) => {
            if (entity.alive !== false) {
                entity.onTick(TickManager._currentTick);
            }
        });


        global.Server.globalEntityMap.forEach((entity, id, map) => {
            if (entity.collisionEnabled === true && entity.alive !== false) {
                let collisions = CollisionUtils.getEntityCollisions(entity);
                collisions.forEach((entityid) => {
                    entity.onCollide(global.Server.globalEntityMap.get(entityid));
                });
            }
        });


        IOUtils.clientEntityMapUpdate();

        TickManager._currentTick++;
    }
};

module.exports = TickManager;