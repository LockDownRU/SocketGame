let Chunk = require('./Chunk');
// :3

let ChunkManager = {

    chunks: new Map(),

    init: () => {

    },


    // Обновление чанка для entity
    updateEntityChunk: (entity) => {
        let chunkCoords = ChunkManager.getChunkCoords(entity.posX, entity.posY);

        if (entity.chunk instanceof Chunk === true) {
            if (entity.chunk.cx === chunkCoords.cx && entity.chunk.cy === chunkCoords.cy) {
                return; // Мы в нужном чанке
            } else {
                // Удаляем из текущего чанка
                entity.chunk.removeEntity(entity.id);
            }
        }

        // Добавляем в нужный чанк
        let chunk = ChunkManager.getChunk(chunkCoords.cx, chunkCoords.cy);
        if (chunk === null) {
            // Создаем новый чанк
            chunk = new Chunk(chunkCoords.cx, chunkCoords.cy);
            ChunkManager.addChank(chunk);
        }
        chunk.addEntity(entity.id);
        entity.chunk = chunk;
    },


    // Добавление чанка на карту
    addChank: (chunk) => {
        let cx = chunk.cx;
        let cy = chunk.cy;

        if (ChunkManager.chunks.has(cx) === false) {
            ChunkManager.chunks.set(cx, new Map());
        }
        ChunkManager.chunks.get(cx).set(cy, chunk);
    },

    // Удаление чанка с карты
    removeChunk: (chunk) => {

        let cx = chunk.cx;
        let cy = chunk.cy;

        if (ChunkManager.chunks.has(cx) === false) {
            return;
        }
        if (ChunkManager.chunks.get(cx).has(cy) === false) {
            return;
        }

        ChunkManager.chunks.get(cx).delete(cy);
        if (ChunkManager.chunks.get(cx).size === 0) {
            ChunkManager.chunks.delete(cx);
        }
    },

    // Получение коодинат чанка
    getChunkCoords: (x, y) => {
        return {
            cx: x >> 8,
            cy: y >> 8
        }
    },

    // Получить чанк с карты по координатам
    getChunk: (cx, cy) => {

        if (ChunkManager.chunks.has(cx) === false) {
            return null;
        }
        if (ChunkManager.chunks.get(cx).has(cy) === false) {
            return null;
        }

        return ChunkManager.chunks.get(cx).get(cy);
    },

    getNearbyEntities: (cx, cy) => {
        let entityList = [];

        for (let a = cx - 1; a <= cx + 1; a++) {
            for (let b = cy + 1; b >= cy - 1; b--) {
                let chunk = ChunkManager.getChunk(a, b);
                if (chunk !== null) {
                    entityList.push.apply(entityList, chunk.entityList);
                }
            }
        }

        return entityList;
    },

    getLoadedChunks: () => {
        let cn = 0;
        ChunkManager.chunks.forEach((chunk) => {
            cn += chunk.size;
        });
        return cn;
    }

};

module.exports = ChunkManager;