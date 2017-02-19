let Chunk = require('./Chunk');
// :3

let ChunkManager = {

    chunks: [],

    init: () => {

    },


    updateEntityChunk: (entity) => {
        let chunkCoords = ChunkManager.getChunkCoords(entity.posX, entity.posY);

        if (entity.chunk !== null) {
            if (entity.chunk.cx === chunkCoords.cx && entity.chunk.cy === chunkCoords.cy) {
                return; // Мы в нужном чанке
            }
        }

        // Добавляем в нужный чанк
    },

    getChunkCoords: (x, y) => {
        return {
            cx: x >> 8,
            cy: y >> 8
        }
    },

    getChunkFromCoords: (x, y) => {
        let chunkCoords = ChunkManager.getChunkCoords(x, y);
        return ChunkManager.getChunk(chunkCoords.cx, chunkCoords.cy);
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