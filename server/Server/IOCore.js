let express = require('express');
let expressServer = express();
let httpServer = require('http').Server(expressServer);
let Player = require('../Entity/Player');
let KirillPlayer = require('../Entity/Custom/Kirill');
let IlyaPlayer = require('../Entity/Custom/Ilya');
let Bot = require('../Entity/Bot');
let Chat = require('../Chat/Chat');

let IOUtils = require('../Utils/IOUtils');
let ServerUtils = require('../Utils/ServerUtils');
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

        // Chat
        socket.on('chat message', function(msg){
            Chat.onMessageReceive(socket, msg);
        });

        socket.on('clientInput', (packet) => {
            function Mouse(isDown, button,  x, y) {
                this.isDown = isDown || false;
                this.button = button || 1;
                this.position = {
                    x: x || 0,
                    y: -y || 0
                }
            }

            let keyList = packet.keyboard;
            let input = {};
            try {
                input.keyboard = new Map(packet.keyboard);
                input.mouse = new Mouse(packet.mouse.isDown, packet.mouse.button, packet.mouse.position.x, packet.mouse.position.y);
            } catch (err) {
                input.keyboard = new Map();
                input.mouse = { };
            }
            socket.player.input = input;
        });
    },

    onConnect: (socket) => {

        for (let i = 0; i < 0; i++){
            IOUtils.spawnEntity(new Bot());
        }

        const customPlayers = true;
        if ((ServerUtils.getClientIp(socket) === '192.168.4.55' || ServerUtils.getClientIp(socket) === '::1') && customPlayers === true) {
            socket.player = new KirillPlayer();
        } else {
            socket.player = new Player();
        }

        socket.player.onConnect(socket);

        IOUtils.clientRunUp(socket);
        IOUtils.spawnEntity(socket.player);
        IOUtils.bindCamera(socket, new GameUtils.Camera(socket.player.id));

        // Chat
        Chat.onPlayerConnect(socket);
    },

    onDisconnect: (socket) => {
        Chat.onPlayerDisconnect(socket);

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

            packet.inputReq = [87, 83, 65, 68, 16];

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