let GameUtils = {

    getTextureFromBase64: (base64) => {
        let image = new Image();
        image.src = base64;

        let baseTexture = new PIXI.BaseTexture(image);
        return new PIXI.Texture(baseTexture);
    },

    addEntity: (entity) => {
        entity.PIXIContainer = new PIXI.Container();

        let entitySprite = new PIXI.Sprite.fromImage(entity.sprite);
        entitySprite.x = 0;
        entitySprite.y = 0;
        entitySprite.height = entity.height;
        entitySprite.width = entity.width;
        entitySprite.anchor.set(0.5);
        entity.PIXIContainer.addChild(entitySprite);

        let text = entity.text.content.replace(/{(.*?)}/g, (_, match) => {
            return new Function('entity', 'return entity.' + match)(entity);
        });

        let renderText = new PIXI.Text(text, entity.text.style);
        renderText.x = 0;
        renderText.y = (-entity.height / 2) * 1.3;
        renderText.anchor.set(0.5, 1);
        entity.PIXIContainer.addChild(renderText);


        entity.PIXIContainer.x = entity.posX;
        entity.PIXIContainer.y = entity.posY;
        Game.stage.addChild(entity.PIXIContainer);


        Game.globalEntityMap.set(entity.id, entity);
        console.log('Spawn ' + entity.id);
    },

    deleteEntityById: (id) => {
        Game.globalEntityMap.get(id).PIXIContainer.destroy({children: true});
        Game.globalEntityMap.delete(id);
        console.log('Despawn ' + id);
    },

    updateEntity: (entity) => {
        if (Game.globalEntityMap.has(entity.id)) {
            // TODO: Обновлять спрайт, ник и т.п.

        }
    }

};