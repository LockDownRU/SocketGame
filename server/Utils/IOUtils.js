let IOUtis = {

    bindCamera: (socket, camera) => {

        socket.emit('bindCamera', global.IOCore.Packet.bindCamera(camera))

    },

    clientRunUp: (socket) => {
        socket.emit('clientRunUp', global.IOCore.Packet.clientRunUp(socket.player.id));
    },

    spawnEntity: (entity) => {
        if (global.Server.addEntity(entity)) {
            global.IOCore.io.emit('spawnEntity', entity.generatePacket());
        }
    },

    despawnEntity: (id) => {
        if (global.Server.globalEntityMap.has(id)) {
            global.Server.removeEntityById(id);
            global.IOCore.io.emit('despawnEntity', id);
        }
    },

    clientEntityMapUpdate: () => {
        global.IOCore.io.emit('clientEntityMapUpdate', global.IOCore.Packet.clientEntityMapUpdate());
    },

    spawnEffect: (x, y, effect) => {
        global.IOCore.io.emit('spawnEffect', {
            x: 0,
            y: 0,
            effect: effect,
            animationSpeed: 1,
            rotation: 1.0,
            width: 50,
            height: 50
        });
    }

};

module.exports = IOUtis;