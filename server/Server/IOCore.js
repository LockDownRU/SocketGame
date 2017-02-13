let express = require('express');
let expressServer = express();
let httpServer = require('http').Server(expressServer);
let Player = require('../Entity/Player');

const serverPort = 80;

let IOCore = {

    io: require('socket.io')(httpServer),

    init: () => {
        expressServer.use(express.static('../public'));
        httpServer.listen(serverPort, function () {
            console.log('Сервер запущен. *:' + serverPort);
        });

        IOCore.io.on('connection', function (socket) {
            IOCore.onConnect(socket);
            IOCore.initEvents(socket);
            socket.on('disconnect', function () {
                IOCore.onDisconnect(socket);
            });
        });
    },

    initEvents: (socket) => {

    },

    onConnect: (socket) => {

        socket.emit('clientRunUp', IOCore.Packet.clientRunUp());

        socket.player = new Player();
        global.Server.addEntity(socket.player);
        socket.player.onConnect(socket);
    },

    onDisconnect: (socket) => {
        socket.player.onDisconnect(socket);
    },

    Packet: {
        clientRunUp: () => {
            // Подгрузка текстур, сущностей и карты

            let packet = { };

            packet.textureMap = { };
            packet.entityMap = { };

            global.Server.globalTextureMap.forEach((texture, key, map) => {
                packet.textureMap[key] = texture;
            });

            global.Server.globalEntityMap.forEach((entity, id, map) => {
                packet.entityMap[id] = entity.generatePacket();
            });

            // TODO: Подгрузка карты

            return packet;
        }
    },

    Events: {
        despawnEntity: (id) => {

        }
    }
};

module.exports = IOCore;