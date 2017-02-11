function Key(keyCode) {
    var key = {
        code: keyCode,
        isDown: false,
        downEvent: undefined,
        upEvent: undefined,

        downHandler: function (event) {
            if(lastDownTarget == Game.gameCanvas) {
                if (event.keyCode === key.code) {
                    if (!key.isDown && key.downEvent) key.downEvent();
                    key.isDown = true;
                }
                event.preventDefault();
            }
        },
        upHandler: function (event) {
            if(lastDownTarget == Game.gameCanvas) {
                if (event.keyCode === key.code) {
                    if (key.isDown && key.upEvent) key.upEvent();
                    key.isDown = false;
                }
                event.preventDefault();
            }
        }
    };

    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );

    return key;
}

var lastDownTarget = null;

var Mouse = {

    isDown: false,
    position: {
        x: 0,
        y: 0
    },

    init: function () {
        lastDownTarget = Game.gameCanvas;
        window.addEventListener('mousedown', function(event) {
            lastDownTarget = event.target;
        }, false);

        Game.gameCanvas.onmousedown = function (event) {
            Mouse.isDown = true;
        };

        Game.gameCanvas.onmouseup = function (event) {
            Mouse.isDown = false;
        };

        Game.gameCanvas.onMouseOut = function (event) {
            Mouse.isDown = false;
        };

        Game.gameCanvas.onmousemove = function (event) {
            var rect = Game.gameCanvas.getBoundingClientRect();
            Mouse.position.x = event.pageX - rect.left - (Game.renderer.renderer.width / 2);
            Mouse.position.y = event.pageY - rect.top - (Game.renderer.renderer.height / 2);
        };
    }
};