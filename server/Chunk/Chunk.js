

class Chunk {

    constructor(cx, cy) {

        this.cx = cx;
        this.cy = cy;

        this.entityList = [];

    }

    addEntity(id) {
        if (this.entityList.includes(id) === false) {
            this.entityList.push(id);
        }
    }

    removeEntity(id) {
        let index = this.entityList.indexOf(id);
        if (index >= 0) {
            this.entityList.splice(index, 1);
        }

        if (this.entityList.length === 0) {
            global.ChunkManager.removeChunk(this);
        }
    }

}

module.exports = Chunk;