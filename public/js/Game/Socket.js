var Socket = {
    socket: undefined,


    init: function () {
        this.socket = io.connect();

        this.socket.on('connect', function(){
            Game.textInfo.innerHTML = "Online";
        });

        this.socket.on('disconnect', function(){
            Game.textInfo.innerHTML = "Offline";
        });

        // ----- ES6 Update ------

        this.socket.on('clientRunUp', (packet) => {
            let textureMap = packet.textureMap;
            let entityMap = packet.entityMap;
            let playerControlId = packet.playerControlId;

            Object.keys(textureMap).map(function(key, index) {
                let texture = textureMap[key];
                PIXI.Texture.addTextureToCache(GameUtils.getTextureFromBase64(texture), key);
            });


            Object.keys(entityMap).map(function(key, index) {
                let entity = entityMap[key];
                GameUtils.addEntity(entity);
            });

            Game.player.id = playerControlId;
        });

        this.socket.on('clientEntityMapUpdate', (packet) => {
            let entityMap = packet.entityMap;

            Object.keys(entityMap).map(function(key, index) {
                let entity = entityMap[key];

                GameUtils.updateEntity(entity);
            });
        });

        this.socket.on('bindCamera', (packet) => {
            Game.camera.id = packet.id;
            Game.camera.x = packet.x;
            Game.camera.y = packet.y;
        });

        this.socket.on('spawnEntity', (packet) => {
            GameUtils.addEntity(packet);
        });

        this.socket.on('despawnEntity', (packet) => {
            GameUtils.deleteEntityById(packet);
        });



        //

        this.socket.on('loadMap', function(map){

        });

        this.socket.on('hpUpdate', function (HpUpdateInfo) {
            Game.hpBar.bar.style.width = HpUpdateInfo.hp * 10 + '%';
            Game.hpBar.status.innerHTML = HpUpdateInfo.hp  + ' HP';
        });


        this.socket.on('positionUpdate', function (data) {
            for (var i = 0; i < data.length; i++){
                var updateData = data[i];
                if (Game.entityList.hasOwnProperty(updateData.entityId)) {
                    Game.entityList[updateData.entityId].x = updateData.posX;
                    Game.entityList[updateData.entityId].y = updateData.posY;
                    Game.entityList[updateData.entityId].rotation = updateData.rotation;
                    if (updateData.bindText !== null) {
                        if (Game.entityList[updateData.entityId].hasOwnProperty('bindText')){

                            Game.entityList[updateData.entityId].bindText.text = updateData.bindText;
                            Game.entityList[updateData.entityId].bindText.x = Game.entityList[updateData.entityId].x;
                            Game.entityList[updateData.entityId].bindText.y = Game.entityList[updateData.entityId].y;

                        } else {

                            Game.entityList[updateData.entityId].bindText = new PIXI.Text(updateData.bindText);
                            Game.entityList[updateData.entityId].bindText.anchor.set(0.5, 2.0);
                            Game.entityList[updateData.entityId].bindText.x = Game.entityList[updateData.entityId].x;
                            Game.entityList[updateData.entityId].bindText.y = Game.entityList[updateData.entityId].y;
                            Game.stage.addChild(Game.entityList[updateData.entityId].bindText);

                        }
                    } else {
                        if (Game.entityList[updateData.entityId].hasOwnProperty('bindText')){
                            Game.entityList[updateData.entityId].bindText.destroy();
                            delete Game.entityList[updateData.entityId].bindText;
                        }
                    }
                    if (Game.camera.id === updateData.entityId){
                        Game.camera.x = Game.entityList[updateData.entityId].x;
                        Game.camera.y = Game.entityList[updateData.entityId].y;
                        Game.stage.pivot.x = Game.camera.x;
                        Game.stage.pivot.y = Game.camera.y;
                    }
                }
            }
            Game.textInfo.innerHTML = Game.camera.x + ' - ' + Game.camera.y;
        });

        this.socket.on('reloadEntityList', function (eList) {
            clearEntityList();

            for (var i = 0; i < eList.length; i++) {
                var entityInfo = eList[i];
                addEntity(entityInfo);
            }
        });

        this.socket.on('bindTextToEntity', function (data) {
            if (data === null) {
                if (Game.textBindingList.hasOwnProperty(data.entityId)) {
                    delete Game.textBindingList[data.entityId];
                }
            } else {
                Game.textBindingList[data.entityId] = {text: data.text};
            }
        });


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

function clearEntityList() {
    for (var entityId in Game.entityList) {
        if (Game.entityList.hasOwnProperty(entityId)) {
            removeEntity(entityId);
        }
    }
}

function addEntity(entityInfo) {
    if (!Game.entityList.hasOwnProperty(entityInfo.entityId)){
        Game.entityList[entityInfo.entityId] = new Sprite(PIXI.loader.resources[entityInfo.sprite].texture);
        Game.entityList[entityInfo.entityId].anchor.set(0.5);
        Game.entityList[entityInfo.entityId].rotation = entityInfo.rotation;
        Game.entityList[entityInfo.entityId].id = entityInfo.entityId;
        Game.entityList[entityInfo.entityId].x = entityInfo.posX;
        Game.entityList[entityInfo.entityId].y = entityInfo.posY;
        Game.entityList[entityInfo.entityId].width = entityInfo.width;
        Game.entityList[entityInfo.entityId].height = entityInfo.height;
        Game.stage.addChild(Game.entityList[entityInfo.entityId]);
    }
}

function removeEntity(id) {
    removeText(Game.entityList[id]);
    removeSprite(Game.entityList[id]);
    delete Game.entityList[id];
}

function removeSprite(sprite) {
    sprite.destroy();
    Game.stage.removeChild(sprite);
}

function removeText(sprite) {
    if (sprite.hasOwnProperty('bindText')) {
        sprite.bindText.destroy();
    }
}