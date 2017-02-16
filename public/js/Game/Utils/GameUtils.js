let GameUtils = {

    getTextureFromBase64: (base64) => {
        let image = new Image();
        image.src = base64;

        let baseTexture = new PIXI.BaseTexture(image);
        return new PIXI.Texture(baseTexture);
    },

    addEntity: (entity) => {
        entity.posY = -entity.posY;

        entity.PIXIContainer = new PIXI.Container();

        let entitySprite = new PIXI.Sprite.fromImage(entity.sprite);
        entitySprite.x = 0;
        entitySprite.y = 0;
        entitySprite.height = entity.height;
        entitySprite.width = entity.width;
        entitySprite.rotation = entity.rotation;
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

        if (entity.id === Game.player.id) {
            GameUtils.updateCamera();
            GameUtils.setUINickname(entity.nickname);
            GameUtils.setUIHp(entity.hp);
        }

        Game.globalEntityMap.set(entity.id, entity);
        //console.log('Spawn ' + entity.id);
    },

    deleteEntityById: (id) => {
        Game.globalEntityMap.get(id).PIXIContainer.destroy({children: true});
        Game.globalEntityMap.delete(id);

        if (id === Game.camera.id) {
            GameUtils.updateCamera();
        }

        //console.log('Despawn ' + id);
    },

    updateEntity: (entity) => {
        entity.posY = -entity.posY;

        if (Game.globalEntityMap.has(entity.id)) {

            let localEntity = Game.globalEntityMap.get(entity.id);
            let playerSprite = localEntity.PIXIContainer.getChildAt(0);
            let playerText = localEntity.PIXIContainer.getChildAt(1);


            if (localEntity.id === Game.camera.id) {
                if (entity.posX !== localEntity.posX || entity.posY !== localEntity.posY) {
                    GameUtils.updateCamera();
                }
            }

            if (localEntity.id === Game.player.id) {
                if (entity.nickname !== localEntity.nickname) {
                    GameUtils.setUINickname(entity.nickname);
                }

                if (entity.hp !== localEntity.hp) {
                    GameUtils.setUIHp(entity.hp);
                }
            }

            // Координаты
            localEntity.PIXIContainer.x = entity.posX;
            localEntity.PIXIContainer.y = entity.posY;
            localEntity.posX = entity.posX;
            localEntity.posY = entity.posY;

            // Размер спрайта игрока
            playerSprite.width = entity.width;
            playerSprite.height = entity.height;
            playerSprite.rotation = entity.rotation;
            localEntity.width = entity.width;
            localEntity.height = entity.height;
            localEntity.rotation = entity.rotation;


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
                if (localEntity.id === Game.player.id) {
                    GameUtils.updateCamera();
                }
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

    bindCamera: (camera) => {
        Game.camera.id = camera.id;
        Game.camera.dx = camera.x;
        Game.camera.dy = camera.y;
        GameUtils.updateCamera();
    },

    updateCamera: () => {
        if (Game.camera.id !== null) {
            if (Game.globalEntityMap.has(Game.camera.id)) {
                let player = Game.globalEntityMap.get(Game.camera.id);
                if (player) {
                    Game.camera.x = player.posX;
                    Game.camera.y = player.posY;
                }
            } else {
                Game.camera.x = Game.camera.dx;
                Game.camera.x = Game.camera.dy;
            }
        } else {
            Game.camera.x = Game.camera.dx;
            Game.camera.x = Game.camera.dy;
        }

        Game.UI.textStatus.innerText = 'Online [x:' + Game.camera.x + ', y:' + -Game.camera.y + ']';

        Game.stage.pivot.x = Game.camera.x;
        Game.stage.pivot.y = Game.camera.y;
        Game.stage.position.x = Game.renderer.renderer.width / 2;
        Game.stage.position.y = Game.renderer.renderer.height / 2;
    },

    setUIHp: (hp) => {
        if (Game.UI.hpBar.status.innerText !== hp.current + ' / ' + hp.max) {
            Game.UI.hpBar.status.innerText = hp.current + ' / ' + hp.max;
            Game.UI.hpBar.bar.style.width = (100 / hp.max * hp.current) + '%';
        }
    },

    setUINickname: (nickname) => {
        if (Game.UI.nicknameBox.innerText !== nickname) {
            Game.UI.nicknameBox.innerText = nickname;
        }
    },

    clearEntityList: () => {
        for (let i = Game.stage.children.length - 1; i >= 0; i--) {
            Game.stage.children[i].destroy({children: true});
            Game.stage.removeChild(Game.stage.children[i]);
        }
    },

    spawnEffect: (packet) => {
        packet.y = -packet.y;

        let arr = Object.values(PIXI.loader.resources[packet.effect].textures);
        let PIXIEffect = new PIXI.extras.AnimatedSprite(arr);
        PIXIEffect.anchor.set(0.5);
        PIXIEffect.loop = false;
        PIXIEffect.onComplete = () => {
            PIXIEffect.destroy();
        };

        PIXIEffect.x = packet.x;
        PIXIEffect.y = packet.y;
        PIXIEffect.animationSpeed = packet.animationSpeed;
        PIXIEffect.rotation = packet.rotation;
        PIXIEffect.width = packet.width;
        PIXIEffect.height = packet.height;

        Game.stage.addChild(PIXIEffect);
        PIXIEffect.play();
    }

};