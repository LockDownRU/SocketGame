// Алиасы
let Texture = PIXI.Texture;

let Game = {
    tickrate: 40,

    // PIXI
    renderer: undefined,
    stage: undefined,
    gameCanvas: null,

    // IO
    socket: Socket,

    // Input
    inputTimer: undefined,

    // ???
    keyboard: undefined,
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
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

        // Динамическое изменение канваса игры
        window.onresize = function () {
            Game.renderer.renderer.resize(Game.gameCanvas.clientWidth, Game.gameCanvas.clientHeight);
        };

        // TODO: Перевести на новую версию
        Input.init();

        // Подключение к серверу
        Game.socket.init();

        // TODO: Перевести на новую версию
        // Отправка ввода
        Game.inputTimer = setInterval(Game.inputLoop, 1000 / Game.tickrate);

        // Рендер
        Game.renderer.ticker.add(Game.renderLoop);
    },

    renderLoop: function (delta) {

    },

    inputLoop: function () {
        Game.socket.socket.emit('clientInput', Input.getInput());
    }
};


Game.init('gameCanvas', 0xE9FFC7);