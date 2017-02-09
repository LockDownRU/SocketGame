var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dns = require('dns');

http.listen(80, function () {
    console.log('listening on *:80');
});

app.use(express.static(__dirname + '/public'));

function Entity (id, type, posX, posY, width, height, speed, sprite, parent, vX, vY, rotation, collision, collideIgnore, ttl) {

    this.id = type + '-' + id || type + '-' + guid();
    this.type = type;
    this.posX = posX || 0;
    this.posY = posY || 0;
    this.speed = speed || 3;
    this.sprite = sprite || 'image/bunny.png';
    this.width = width || 50;
    this.height = height || 50;

    this.hp = 10;

    this.parent = parent || null;

    this.vX = vX || 0;
    this.vY = vY || 0;

    if (this.vX < -1 || this.vX > 1 || this.vY < -1 || this.vY > 1) {

        this.vX = 0;
        this.vY = 0;
    }

    this.rotation = rotation || 0.0;

    this.prevPosX = this.posX;
    this.prevPosY = this.posY;

    this.collision = collision || true;
    this.collideIgnore = collideIgnore || [ ];

    this.ttl = ttl || -1;

    this.bindText = null;

    // Функции Entity

    this.getClientInfo = function () {
        return {
            entityId: this.id,
            posX: this.posX,
            posY: this.posY,
            sprite: this.sprite,
            width: this.width,
            height: this.height,
            rotation: this.rotation,
            bindText: this.bindText
        };
    };

    this.getUpdateInfo = function () {
        var bt = null;
        if (this.bindText !== null) {
            bt = this.bindText + '\n<' + this.hp + '|10>';
        }
        return {
            entityId: this.id,
            posX: this.posX,
            posY: this.posY,
            rotation: this.rotation,
            bindText: bt
        };
    };

    this.onCollide = function (entity) {

    };

    this.checkCollisionWith = function (e) {
        function AABB(entity) {
            return {
                x: entity.posX - entity.width / 2 ,
                y: entity.posY -  entity.height / 2,
                width : entity.width,
                height: entity.height
            };
        }

        for (var i = 0 ; i < this.collideIgnore.length; i++){
            if (e.id.includes(this.collideIgnore[i])) {
                return false;
            }
        }

        var rect1 = AABB(this);
        var rect2 = AABB(e);

        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y;
    };

    //

}

io.on('connection', function (socket) {

    // Игрок
    var player = {
        entity: new Entity(socket.id, 'player', 0, 0, 26, 37, 2.5, 'image/bunny.png'),

        AbilityManager: {

            abilitiesList: { },


            tryUseAbility: function (abilityName, data) {
                if (this.abilitiesList.hasOwnProperty(abilityName)) {
                    if (this.canUseAbility(abilityName)) {
                        this.useAbility(abilityName, data);
                    }
                }
            },

            useAbility: function (abilityName, data) {
                if (this.abilitiesList.hasOwnProperty(abilityName)) {
                    this.abilitiesList[abilityName].use(player, data);
                    this.startCoolDown(abilityName);
                }
            },

            addAbility: function (abilityName, defaultCoolDown, use) {
                if (!this.abilitiesList.hasOwnProperty(abilityName)) {
                    this.abilitiesList[abilityName] = {
                        use: use,
                        cooldown: {
                            timeleft: 0,
                            default: defaultCoolDown
                        }
                    };
                }
            },

            startCoolDown: function (abilityName) {
                if (this.abilitiesList.hasOwnProperty(abilityName)) {
                    this.abilitiesList[abilityName].cooldown.timeleft = this.abilitiesList[abilityName].cooldown.default;
                }
            },

            setCoolDown: function (abilityName, value) {
                if (this.abilitiesList.hasOwnProperty(abilityName)) {
                    this.abilitiesList[abilityName].cooldown.timeleft = value;
                }
            },

            canUseAbility: function (abilityName) {
                if (this.abilitiesList.hasOwnProperty(abilityName)) {
                    return this.abilitiesList[abilityName].cooldown.timeleft <= 0;
                }
                return false;
            },

            coolDownUpdate: function () {
                for (var abilityName in this.abilitiesList) {
                    if (this.abilitiesList.hasOwnProperty(abilityName)) {
                        if (this.abilitiesList[abilityName].cooldown.timeleft > 0){
                            this.abilitiesList[abilityName].cooldown.timeleft--;
                        }
                    }
                }
            }
        }

    };
    socket.player = player;

    console.log(socket.id + ' Connected');

    // Спавним игрока
    ServerUtils.spawnEntity(player.entity);

    // Name
    var address = socket.client.conn.remoteAddress;
    if (address.length > 7 || address.startsWith('::ffff:')) {
        address = address.substring(7);
    }

    player.entity.bindText = address;
    dns.reverse(address, function(err, domain) {
        if(err) {
            return;
        }
        if (domain.length > 0) {
            player.entity.bindText = domain[0].replace(/\s*\.itstep\.lan\s*/g, '').toUpperCase()
        }
    });

    if (address == '127.0.0.1' || address == '::1') {
        player.entity.bindText = '.:..::$ADMINISTRATOR$::..:.';

        player.entity.hp = 100;
        player.AbilityManager.addAbility('fire', 1, function (player, data) {
            GameUtils.playerFire(player, GameUtils.normalizeVector(data.input.Mouse.position), 60);
        });

        console.log('Local - ' + player.entity.id);
        // Local iP
    } else {
        // Способн.
        player.AbilityManager.addAbility('fire', 7, function (player, data) {
            GameUtils.playerFire(player, GameUtils.normalizeVector(data.input.Mouse.position));
        });
    }


    // Камера на игрока
    socket.emit('bindCamera', { id: player.entity.id });

    // Отправка объектов
    ServerUtils.sendEntityList(socket);

    // Получение ввода клиента
    socket.on('clientInput', function (input) {
        socket.input = input;
    });

    // Клиентские ивенты
    ServerUtils.initEvents(socket);


    // Отключение клиента
    socket.on('disconnect', function () {
        console.log(socket.id + ' Disconnected');
        ServerUtils.despawnEntityById(player.entity.id);
    });
});

var entityList = {};

var ServerUtils = {

    initEvents: function (socket) {

    },

    spawnEffect: function (effect) {
        io.emit('spawnEffect', effect);
    },

    spawnEntity: function (entity) {
        entityList[entity.id] = entity;

        io.emit('spawnEntity', entity.getClientInfo());
    },

    despawnEntityById: function (id) {
        if (entityList.hasOwnProperty(id)) {
            delete entityList[id];
            io.emit('despawnEntity', {entityId: id});
        }
    },

    sendEntityList: function (socket) {
        var eList = [];
        for (var entityId in entityList) {
            if (entityList.hasOwnProperty(entityId)) {
                var entity = entityList[entityId];
                eList.push(entity.getClientInfo());
            }
        }
        socket.emit('reloadEntityList', eList);
    },

    getCollisionIds: function (id) {
        var collisionIds = [];

        var entityMain = entityList[id];

        for (var entityId in entityList) {
            if (entityList.hasOwnProperty(entityId) && entityId !== id) {
                var entity = entityList[entityId];

                if (entity.collision === true) {
                    // Check collision
                    if (entityMain.checkCollisionWith(entity)) {
                        collisionIds.push(entity.id);
                    }
                }
            }
        }
        return collisionIds;
    }
};

var GameUtils = {
    playerFire: function (player, normVec, speed) {
        var ignoreIds = [  ];

        // 'bullet-'

        if (player.entity !== null) {
            ignoreIds.push(player.entity.id);
        }

        var entity = new Entity(
            guid(),
            'bullet',
            player.entity.posX,
            player.entity.posY,
            60,
            20,
            speed || 16,
            'image/bullet.png',
            player.entity.id,
            normVec.x,
            normVec.y,
            Math.atan2(normVec.y, normVec.x),
            true,
            ignoreIds,
            140
        );

        entity.onCollide = function (entity) {
            if (entity.type == 'player') {
                if (entity.hp <= 0) {
                    entity.hp = 10;
                    entity.posX = 0;
                    entity.posY = 0;
                    var elem = document.getElementById("myBar");
                    elem.style.width = 100 + '%';
                    document.getElementById("demo").innerHTML = 100  + '%';
                } else {
                    entity.hp--;
                    var elem = document.getElementById("myBar");
                    var width = parseInt(elem.style.width);
                    var end_width = width - 10;
                    var id = setInterval(frame, 20);
                    function frame() {
                        if (width > end_width) {
                            width--;
                            elem.style.width = width + '%';
                            document.getElementById("demo").innerHTML = width * 1  + '%';
                        } else {
                            clearInterval(id);
                        }
                    }
                }
            }

            if (entity.parent !== player.entity.id) {
                ServerUtils.despawnEntityById(this.id);
                ServerUtils.spawnEffect( {
                    x: this.posX,
                    y: this.posY,
                    type: 'explosion'
                });
            }
        };

        ServerUtils.spawnEntity(entity);
    },

    normalizeVector: function (vec) {
        var norm = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
        if (norm != 0) {
            return {
                x: vec.x / norm,
                y: vec.y / norm
            };
        } else {
            return {
                x: vec.x,
                y: vec.y
            };
        }
    }
};

function tick() {

    for (var sid in io.sockets.sockets) {
        if (io.sockets.sockets.hasOwnProperty(sid)) {
            var socket = io.sockets.sockets[sid];
            if (socket.hasOwnProperty('input') && socket.hasOwnProperty('player')){

                var player = socket.player;
                var input = socket.input;

                player.AbilityManager.coolDownUpdate();

                player.entity.vX = 0;
                player.entity.vY = 0;

                if (input.left) {
                    player.entity.vX = -player.entity.speed;
                }
                if (input.right) {
                    player.entity.vX = player.entity.speed;
                }
                if (input.up) {
                    player.entity.vY = -player.entity.speed;
                }
                if (input.down) {
                    player.entity.vY = player.entity.speed;
                }

                if (input.shift) {
                    player.entity.vX *= 2;
                    player.entity.vY *= 2;
                }

                if (input.Mouse.isDown) {
                    player.AbilityManager.tryUseAbility('fire', { input: input });
                }

            }
        }
    }

    var updateList = [];
    for (var entityName in entityList) {
        if (entityList.hasOwnProperty(entityName)) {

            var entity = entityList[entityName];

            if (entity.ttl == 0) {

                ServerUtils.despawnEntityById(entity.id);

            } else {

                if (entity.ttl != -1) {
                    entity.ttl--;
                }

                entity.prevPosX = entity.posX;
                entity.prevPosY = entity.posY;
                entity.posX += entity.vX * entity.speed;
                entity.posY += entity.vY * entity.speed;

                if (entity.collision === true) {
                    var collisions = ServerUtils.getCollisionIds(entity.id);
                    for (var i = 0; i < collisions.length; i++) {
                        var collideEntity = entityList[collisions[i]];
                        entity.onCollide(collideEntity);
                    }
                }

                if (entity.type === 'bullet') {
                    //entity.rotation += 0.5;

                }

                updateList.push(entity.getUpdateInfo());

            }
        }
    }

    io.emit('positionUpdate', updateList);
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var tickTimer = setInterval(tick, 25);