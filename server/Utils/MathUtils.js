

let MathUtils = {
    guid: () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    normalize: (x, y) => {
        let norm = Math.sqrt(x * x + y * y);
        if (norm != 0) {
            return {
                vX: x / norm,
                vY: y / norm
            };
        } else {
            return {
                vX: x,
                vY: y
            };
        }
    },

    distance: (x1, y1, x2, y2) => {
        return Math.hypot(
            Math.max(x1,x2)-Math.min(x1,x2),
            Math.max(y1,y2)-Math.min(y1,y2));
    }
};

module.exports = MathUtils;