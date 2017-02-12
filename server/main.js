let express = require('express');
let expressServer = express();
let httpServer = require('http').Server(expressServer);
let io = require('socket.io')(httpServer);

global.Server = require('./Server/Server');
let Player = require('./Entity/Player');

expressServer.use(express.static('../public'));

const serverPort = 80;
httpServer.listen(serverPort, function () {
    console.log('Сервер запущен. *:' + serverPort);
});

global.Server.init();

// Принимаем подключения от клиентов
io.on('connection', function (socket) {
    socket.player = new Player();
    global.Server.addEntity(socket.player);
    socket.player.onConnect(socket);

    // Отключение клиента
    socket.on('disconnect', function () {
        socket.player.onDisconnect(socket);
    });
});