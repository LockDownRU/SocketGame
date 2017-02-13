let GameUtils = {

    getTextureFromBase64: (base64) => {
        let image = new Image();
        image.src = base64;

        let baseTexture = new PIXI.BaseTexture(image);
        return new PIXI.Texture(baseTexture);
    },

    addEntity: (entity) => {
        Game.globalEntityMap.set(entity.id, entity);
        // TODO: Создать PIXI контейнер со спрайтом игрока и ником и записать его в entity
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