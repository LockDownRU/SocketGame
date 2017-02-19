let Chunk = require('./Chunk');
// :3

let ChunkManager = {

    chunks: [],

    init: () => {

    },


    updateEntityChunk: (entity) => {
        let chunk = ChunkManager.getChunkFromCoords(entity.posX, entity.posY);

        if (entity.chunk === null) {

        }
    },


    getChunkFromCoords: (x, y) => {
        let cx = x >> 8;
        let cy = y >> 8;

        return ChunkManager.getChunk(cx, cy);
    },

    getChunk: (cx, cy) => {
        if (ChunkManager.chunks[cx] === undefined) {
            return null;
        }
        if (ChunkManager.chunks[cx][cy] === undefined) {
            return null;
        }

        return ChunkManager.chunks[cx][cy];
    }

};

module.exports = ChunkManager;