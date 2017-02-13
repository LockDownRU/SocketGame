let GameUtils = {

    getTextureFromBase64: (base64) => {
        let image = new Image();
        image.src = base64;

        let baseTexture = new PIXI.BaseTexture(image);
        return new PIXI.Texture(baseTexture);
    },

    addEntity: (entity) => {
        Game.globalEntityMap.set(entity.id, entity);
        console.log('Spawn ' + entity.id);
    },

    deleteEntityById: (id) => {
        Game.globalEntityMap.delete(id);
        console.log('Despawn ' + id);
    }

};