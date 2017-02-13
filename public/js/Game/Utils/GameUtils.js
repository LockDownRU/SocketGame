let GameUtils = {

    getTextureFromBase64: (base64) => {
        let image = new Image();
        image.src = base64;

        let baseTexture = new PIXI.BaseTexture(image);
        return new PIXI.Texture(baseTexture);
    },

    addEntity: (entity) => {
        // TODO: Создать PIXI контейнер со спрайтом игрока и ником и записать его в entity

        entity.PIXIContainer = new PIXI.Container();

        let entitySprite = new PIXI.Sprite.fromImage(entity.sprite);
        entitySprite.x = 0;
        entitySprite.y = 0;

        entity.PIXIContainer.addChild(entitySprite);

        entity.PIXIContainer.x = entity.posX;
        entity.PIXIContainer.y = entity.posY;
        Game.stage.addChild(entity.PIXIContainer);


        Game.globalEntityMap.set(entity.id, entity);
        console.log('Spawn ' + entity.id);
    },

    deleteEntityById: (id) => {
        // TODO: Очищать PIXI контейнер
        Game.globalEntityMap.delete(id);
        console.log('Despawn ' + id);
    },

    updateEntity: (entity) => {
        if (Game.globalEntityMap.has(entity.id)) {
            // TODO: Обновлять спрайт, ник и т.п.
        }
    }

};