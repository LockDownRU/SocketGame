

let Input = {

    input: {
        keyborad: new Map(),
        mouse: {
            isDown: false,
            position: {
                x: 0,
                y: 0
            }
        }
    },

    target: null,

    init: () => {
        // Keyborad
        window.onkeydown = (e) => {
            if (Input.input.keyborad.has(e.keyCode)) {
                Input.input.keyborad.set(e.keyCode, true)
            }
        };

        window.onkeyup = (e) => {
            if (Input.input.keyborad.has(e.keyCode)) {
                Input.input.keyborad.set(e.keyCode, false)
            }
        };

        // Mouse
        Input.target = Game.gameCanvas;

        window.addEventListener('mousedown', function(event) {
            if (Input.target === event.target && Input.target === Game.gameCanvas) {
                Input.onMouseDown();
            }
            Input.target = event.target;
        }, false);

        Game.gameCanvas.onmouseup = (event) => {
            if (Input.input.mouse.isDown === true) {
                Input.onMouseUp();
            }
        };

        Game.gameCanvas.onmouseout = (event) => {
            if (Input.input.mouse.isDown === true) {
                Input.onMouseUp();
            }
        };

        Game.gameCanvas.onmousemove = (event) => {
            let rect = Game.gameCanvas.getBoundingClientRect();
            Input.input.mouse.position.x = event.pageX - rect.left - (Game.renderer.renderer.width / 2);
            Input.input.mouse.position.y = event.pageY - rect.top - (Game.renderer.renderer.height / 2);
        };
    },

    onMouseDown: () => {
        Input.input.mouse.isDown = true;
    },

    onMouseUp: () => {
        Input.input.mouse.isDown = false;
    },

    setupKeys(keys) {
        Input.input.keyborad.clear();
        keys.forEach((key, index, array) => {
            Input.input.keyborad.set(key, false);
        });
    },

    getInput() {
        return {
            keyboard: [...Input.input.keyborad],
            mouse: Input.input.mouse
        };
    },
};