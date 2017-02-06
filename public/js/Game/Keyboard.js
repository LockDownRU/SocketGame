function Key(keyCode) {
    var key = {
        code: keyCode,
        isDown: false,
        downEvent: undefined,
        upEvent: undefined,
        downHandler: function (event) {
            if (event.keyCode === key.code) {
                if (!key.isDown && key.downEvent) key.downEvent();
                key.isDown = true;
            }
            event.preventDefault();
        },
        upHandler: function (event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.upEvent) key.upEvent();
                key.isDown = false;
            }
            event.preventDefault();
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