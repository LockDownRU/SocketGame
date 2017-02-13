

let GameUtis = {

    despawnEntity: (id) => {
        if (global.Server.globalEntityMap.has(id)) {
            global.IOCore.despawnEntity(id);
        }
    }

};

module.exports = GameUtis;