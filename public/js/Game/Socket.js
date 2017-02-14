 Socket = {
    socket: undefined,

    init: function () {
        this.socket = io.connect();

        // Подключился
        this.socket.on('connect', () => {
            Game.UI.textStatus.innerText = "Online";
        });

        // Отключился
        this.socket.on('disconnect', () => {
            Game.UI.textStatus.innerText = "Offline";
        });

        // Подготовка клиента
        this.socket.on('clientRunUp', (packet) => {
            let textureMap = packet.textureMap;
            let entityMap = packet.entityMap;
            let playerControlId = packet.playerControlId;

            Object.keys(textureMap).map(function(key, index) {
                let texture = textureMap[key];
                PIXI.Texture.addTextureToCache(GameUtils.getTextureFromBase64(texture), key);
            });


            GameUtils.clearEntityList();
            Object.keys(entityMap).map(function(key, index) {
                let entity = entityMap[key];
                GameUtils.addEntity(entity);
            });

            Input.setupKeys(packet.inputReq);

            Game.player.id = playerControlId;
        });

        // Получение обновлений для сущностей
        this.socket.on('clientEntityMapUpdate', (packet) => {
            let entityMap = packet.entityMap;

            Object.keys(entityMap).map(function(key, index) {
                let entity = entityMap[key];

                GameUtils.updateEntity(entity);
            });
        });

        // Спавн сущности
        this.socket.on('spawnEntity', (packet) => {
            GameUtils.addEntity(packet);
        });

        // Удаление сущности
        this.socket.on('despawnEntity', (packet) => {
            GameUtils.deleteEntityById(packet);
        });

        // Установка камеры
        this.socket.on('bindCamera', (packet) => {
            GameUtils.bindCamera(packet.camera);
        });

        //Скролл
        let scroll = new IScroll('#wrapper', {
            mouseWheel: true,
            disablePointer: true
        });

        //Инициализация чата для нового игрока
        this.socket.on('init chat', function (messages) {

            let nickname = Game.globalEntityMap.get(Game.player.id).nickname;

            if (messages.length !== 0) {
                if ($("#msgs")[0].childNodes.length === 1) {
                    messages.forEach(function (item) {
                        if (item.nick === nickname)
                            $("#msgs").append('<li class="msg-1"><div class="author"><p>' + item.nick + '</p></div><div class="text"><p>'+ item.text +'</p></div></li>');
                        else
                            $("#msgs").append('<li class="msg-0"><div class="author"><p>' + item.nick + '</p></div><div class="text"><p>'+ item.text +'</p></div></li>');
                    });
                }
            }

            let autoscroll = false;
            if (scroll.y <= scroll.maxScrollY + 100){
                autoscroll = true;
            }
            scroll.refresh();
            if (autoscroll == true){
                scroll.scrollTo(0, scroll.maxScrollY, 0);
            }
        });

        //Обновление чата для всех игроков
        this.socket.on('chat message', function (messages) {

            let msg = messages[messages.length-1];
            let nickname = Game.globalEntityMap.get(Game.player.id).nickname;

            if (msg.nick === nickname)
                $("#msgs").append('<li class="msg-1"><div class="author"><p>' + msg.nick + '</p></div><div class="text"><p>'+ msg.text +'</p></div></li>');
            else
                $("#msgs").append('<li class="msg-0"><div class="author"><p>' + msg.nick + '</p></div><div class="text"><p>'+ msg.text +'</p></div></li>');

            let autoscroll = false;
            if (scroll.y <= scroll.maxScrollY + 100){
                autoscroll = true;
            }
            scroll.refresh();
            if (autoscroll == true){
                scroll.scrollTo(0, scroll.maxScrollY, 0);
            }
        });


        // TODO: Перевести на новую версию
        // Не исспользовать!
        this.socket.on('spawnEffect', function (effect) {
            switch (effect.type) {
                case 'explosion': {
                    var explosion = new PIXI.extras.AnimatedSprite(Game.effectTextures['explosion']);
                    explosion.x = effect.x;
                    explosion.y = effect.y;
                    explosion.anchor.set(0.5);
                    explosion.rotation = Math.random() * Math.PI;
                    explosion.scale.set(0.75 + Math.random() * 0.5);
                    explosion.loop = false;
                    explosion.onComplete = function () {
                        explosion.destroy();
                    };
                    explosion.play();
                    Game.stage.addChild(explosion);

                    break;
                }
            }
        });
    }
};