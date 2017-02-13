// Алиасы
let Texture = PIXI.Texture;

let Game = {

    // PIXI
    renderer: undefined,
    stage: undefined,
    gameCanvas: null,

    // IO
    socket: Socket,

    // ???
    keyboard: undefined,
    inputTimer: undefined,
    effectTextures: {},

    // HTML
    UI: {
        nicknameBox: document.getElementById('nickname'),
        hpBar: {
            bar: document.getElementById("hpBar"),
            status: document.getElementById("hpStatus")
        },
        textStatus: document.getElementById("textInfo")
    },

    // Управляемый игрок
    player: {
        id: null
    },

    // Список сущностей и текстур
    globalEntityMap: new Map(),
    globalTextureMap: new Map(),

    // Камера
    camera: {
        id: null,
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    },


    // Инициализация канваса (PIXI)
    init: function (element, backgroundColor) {

        // HTML Game Canvas
        this.gameCanvas = document.getElementById(element);
        if (this.gameCanvas === null) {
            throw "Invalid Element ID.";
        }

        // Инициализация PIXI
        this.renderer = new PIXI.Application(Game.gameCanvas.clientWidth, Game.gameCanvas.clientHeight, {
            view: Game.gameCanvas,
            backgroundColor: backgroundColor
        }, false);
        this.stage = this.renderer.stage; // Алиас основного контейнера
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        // Динамическое изменение канваса игры
        window.onresize = function () {
            Game.renderer.renderer.resize(Game.gameCanvas.clientWidth, Game.gameCanvas.clientHeight);
        };

        // TODO: Перевести на новую версию
        // Инициализация клавиатуры и мышки
        Game.keyboard = {
            up: Key(87),
            down: Key(83),
            left: Key(65),
            right: Key(68),
            shift: Key(16)
        };
        Mouse.init();

        // Подключение к серверу
        Game.socket.init();

        // TODO: Перевести на новую версию
        // Отправка ввода
        Game.inputTimer = setInterval(Game.inputLoop, 25);

        // Рендер
        Game.renderer.ticker.add(Game.renderLoop);
    },

    renderLoop: function (delta) {



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


Game.init('gameCanvas', 0xE9FFC7);