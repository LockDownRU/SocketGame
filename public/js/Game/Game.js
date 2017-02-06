//Aliases
var Loader = PIXI.loader,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Resources = PIXI.loader.resources;

var Game = {
    renderer: undefined,
    stage: undefined,
    socket: Socket,
    textInfo: undefined,
    keyboard: undefined,
    inputTimer: undefined,
    gameCanvas: null,
    effectTextures: { },

    entityList: { },
    camera: {
        id: null,
        x: 0,
        y: 0
    },

    init: function (element, width, height, backgroundColor) {
        // HTML Canvas
        this.gameCanvas = document.getElementById(element);
        if (this.gameCanvas === null) {
            throw "Invalid Element ID.";
        }
        // Html Вывод текста
        this.textInfo = document.getElementById("textInfo");
        if (this.textInfo === null) {
            throw "Element ID 'textInfo' not found.";
        }

        // Инициализация PIXI
        this.renderer = new PIXI.Application(Game.gameCanvas.clientWidth, Game.gameCanvas.clientHeight, {view: Game.gameCanvas, backgroundColor: backgroundColor}, false);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        // Контейнер для рисования
        this.stage = this.renderer.stage;

        // Инициализация клавиатуры и мышки
        Game.keyboard = {
            up: Key(87),
            down: Key(83),
            left: Key(65),
            right: Key(68),
            shift: Key(16)
        };
        Mouse.init();

        // Загрузка текстур
        PIXI.loader
            .add('spritesheet', 'image/mc.json')
            .add("image/bunny.png")
            .add("image/bullet.png")
            .load(function () {

                // Эфекты
                Game.effectTextures['explosion'] = [];
                for (var i = 0; i < 26; i++) {
                    var texture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i + 1) + '.png');
                    Game.effectTextures['explosion'].push(texture);
                }

                // Сокет
                Game.socket.init();

                // Отправка ввода
                Game.inputTimer = setInterval(Game.inputLoop, 25);

                // Рендер
                Game.renderer.ticker.add(Game.renderLoop);
            });

    },

    renderLoop: function (delta) {
        if (Game.camera.id !== null){
            if (Game.entityList.hasOwnProperty(Game.camera.id)) {
                Game.camera.x = Game.entityList[Game.camera.id].x;
                Game.camera.y = Game.entityList[Game.camera.id].y;
            }
        }

        Game.stage.pivot.x = Game.camera.x;
        Game.stage.pivot.y = Game.camera.y;
        Game.stage.position.x = Game.renderer.renderer.width / 2;
        Game.stage.position.y = Game.renderer.renderer.height / 2;

    },

    inputLoop: function () {
        Socket.socket.emit('clientInput', {
            left: Game.keyboard.left.isDown,
            up: Game.keyboard.up.isDown,
            right: Game.keyboard.right.isDown,
            down: Game.keyboard.down.isDown,
            shift: Game.keyboard.shift.isDown,
            Mouse: {
                isDown: Mouse.isDown,
                position: Mouse.position
            }
        });
    }
};


Game.init('gameCanvas', window.innerWidth, window.innerHeight, 0xFFC1A4);