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

            let localEntity = Game.globalEntityMap.get(entity.id);
            let playerSprite = localEntity.PIXIContainer.getChildAt(0);
            let playerText = localEntity.PIXIContainer.getChildAt(1);

            // Координаты
            localEntity.PIXIContainer.x = entity.posX;
            localEntity.PIXIContainer.y = entity.posY;
            localEntity.posX = entity.posX;
            localEntity.posY = entity.posY;

            // Размер спрайта игрока
            playerSprite.width = entity.width;
            playerSprite.height = entity.height;
            localEntity.width = entity.width;
            localEntity.height = entity.height;

            // Спрайт
            if (localEntity.sprite !== entity.sprite) {
                playerSprite.texture = new Texture.fromImage(entity.sprite);
                localEntity.sprite = entity.sprite;
            }

            // Тип
            localEntity.type = entity.type;
            // Игрок
            if (localEntity.type.includes('BasePlayer')) {
                localEntity.nickname = entity.nickname;
            }
            if (localEntity.type.includes('BaseLiveEntity')) {
                localEntity.hp = entity.hp;
                localEntity.alive = entity.alive;
                localEntity.PIXIContainer.visible = localEntity.alive;
            }

            // Текст
            localEntity.text = entity.text;
            playerText.text = localEntity.text.content.replace(/{(.*?)}/g, (_, match) => {
                return new Function('entity', 'return entity.' + match)(localEntity);
            });
        }
    },

    clearEntityList: () => {
        for (let i = Game.stage.children.length - 1; i >= 0; i--) {
            Game.stage.children[i].destroy({children: true});
            Game.stage.removeChild(Game.stage.children[i]);
        }
    }

};