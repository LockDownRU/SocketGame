let IOUtils = require('./IOUtils');

function Camera(id, x, y) {
    this.id = id || null;
    this.x = x || 0;
    this.y = y || 0;
}

module.exports = {
    Camera: Camera
};