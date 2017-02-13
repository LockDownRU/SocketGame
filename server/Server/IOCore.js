let express = require('express');
let expressServer = express();
let httpServer = require('http').Server(expressServer);
let Player = require('../Entity/Player');

let IOUtils = require('../Utils/IOUtils');
let GameUtils = require('../Utils/GameUtils');

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
        socket.player = new Player();
        socket.player.onConnect(socket);


        IOUtils.clientRunUp(socket);
        IOUtils.spawnEntity(socket.player);
        IOUtils.bindCamera(socket, new GameUtils.Camera(socket.player.id));

    },

    onDisconnect: (socket) => {
        socket.player.onDisconnect(socket);
        IOUtils.despawnEntity(socket.player.id);
    },

    Packet: {
        clientRunUp: (id) => {
            // Подгрузка текстур, сущностей и карты
            let packet = { };

            packet.textureMap = { };
            packet.entityMap = { };
            packet.playerControlId = id;

            global.Server.globalTextureMap.forEach((texture, key, map) => {
                packet.textureMap[key] = texture;
            });

            global.Server.globalEntityMap.forEach((entity, id, map) => {
                packet.entityMap[id] = entity.generatePacket();
            });

            // TODO: Подгрузка карты

            return packet;
        },

        clientEntityMapUpdate: () => {
            let packet = {};
            packet.entityMap = { };

            global.Server.globalEntityMap.forEach((entity, id, map) => {
                packet.entityMap[id] = entity.generatePacket();
            });

            return packet;
        },

        bindCamera: (camera) => {
            // Привязать камеру к объекту или координатам
            let packet = { };

            packet.camera = camera;

            return packet;
        }
    }
};

module.exports = IOCore;