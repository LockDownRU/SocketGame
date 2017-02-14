

let Input = {

    input: {
        keyborad: new Map(),
        mouse: null
    },

    init: () => {
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