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

        this.socket.on('loadMap', function(map){

        });

        this.socket.on('bindCamera', function (entityBindInfo) {
            Game.camera.id = entityBindInfo.id;
        });

        this.socket.on('positionUpdate', function (data) {
            for (var i = 0; i < data.length; i++){
                var updateData = data[i];
                if (Game.entityList.hasOwnProperty(updateData.entityId)) {
                    Game.entityList[updateData.entityId].x = updateData.posX;
                    Game.entityList[updateData.entityId].y = updateData.posY;
                    Game.entityList[updateData.entityId].rotation = updateData.rotation;
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

        this.socket.on('spawnEntity', function (entityInfo) {
            addEntity(entityInfo);
        });

        this.socket.on('despawnEntity', function (entity) {
            if (Game.entityList.hasOwnProperty(entity.entityId)){
                removeEntity(entity.entityId);
            }
        });

        this.socket.on('spawnEffect', function (effect) {

            switch (effect.type) {
                case 'explosion': {

                    console.log('effect');

                    var explosion = new PIXI.extras.AnimatedSprite(Game.effectTextures['explosion']);
                    explosion.x = effect.x;
                    explosion.y = effect.y;
                    explosion.anchor.set(0.5);
                    explosion.rotation = Math.random() * Math.PI;
                    explosion.scale.set(0.75 + Math.random() * 0.5);
                    explosion.loop = false;
                    explosion.play();
                    explosion.zOrder = -1;
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
    removeSprite(Game.entityList[id]);
    delete Game.entityList[id];
}

function removeSprite(sprite) {
    sprite.destroy();
    Game.stage.removeChild(sprite);
}