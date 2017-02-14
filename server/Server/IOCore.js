let express = require('express');
let expressServer = express();
let httpServer = require('http').Server(expressServer);
let Player = require('../Entity/Player');
let message_history = [];
let players_online = [];

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
        class Message {
            constructor(nick,text, id) {
                this.nick = nick;
                this.text = text;
                this.date = Date.now();
                this.id = id;
            }
        }

        socket.emit('init chat', message_history);

        socket.on('chat message', function(msg){
            let mes = new Message(socket.player.Nickname,msg, socket.player.id);
            message_history.push(mes);
            IOCore.io.emit('chat message', message_history);
        });

        socket.on('clientInput', (packet) => {
            let keyList = packet.keyboard;
            let input = {};
            try {
                input.keyboard = new Map(packet.keyboard);
                input.mouse = packet.mouse;
            } catch (err) {
                input.keyboard = new Map();
                input.mouse = { };
            }
            socket.player.input = input;
        });
    },

    onConnect: (socket) => {
        socket.player = new Player();
        socket.player.onConnect(socket);

        IOUtils.clientRunUp(socket);
        IOUtils.spawnEntity(socket.player);
        IOUtils.bindCamera(socket, new GameUtils.Camera(socket.player.id));
        socket.emit('addPlayers', players_online);
        players_online.push(socket.player.id);
        IOCore.io.emit('addPlayer', socket.player.id);
    },

    onDisconnect: (socket) => {
        players_online.splice(players_online.indexOf(socket.player.id),1);
        IOCore.io.emit('deletePlayer', socket.player.id);
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