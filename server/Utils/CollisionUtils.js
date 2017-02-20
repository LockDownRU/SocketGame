let MathUtils = require('./MathUtils');

let CollisionUtils = {

    getEntityCollisions: (e1) => {
        let collisions = [];


        if (e1.chunk === null) {
            return collisions;
        }

        let nearbyEntities = global.ChunkManager.getNearbyEntities(e1.chunk.cx, e1.chunk.cy);
        nearbyEntities.forEach((eid) => {
            if (global.Server.globalEntityMap.has(eid)) {
                let e2 = global.Server.globalEntityMap.get(eid);

                if (e1.collisionEnabled === true && e2.alive !== false && e1.id !== e2.id && e2.collisionEnabled === true) {
                    if (CollisionUtils.checkEntityCollision(e1, e2)) {
                        collisions.push(e2.id);
                    }
                }

            }
        });


        return collisions;
    },

    checkEntityCollision: (e1, e2) => {

        if (MathUtils.distance(e1.posX, e1.posY, e2.posX, e2.posY) > Math.max(e1.width, e1.height, e2.width, e2.height) * 2)
            return false;

        class Point {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
        }

        function getCollisionMap(x, y, w, h, alpha) {
            let arr = [];
            let xi, yi;
            for (let i = 0; i < 4; i++) {
                let beta = 2 * Math.PI * i / 4;
                let delta = (i%2===0) ? Math.atan(h / w) : Math.atan(w / h);
                xi = x + Math.hypot((h / 2), (w / 2)) * Math.cos(alpha + beta + delta);
                yi = y + Math.hypot((h / 2), (w / 2)) * Math.sin(alpha + beta + delta);
                arr.push(new Point(xi, yi));
            }
            return arr;
        }

        let model1 = getCollisionMap(e1.posX, e1.posY, e1.width, e1.height, -e1.rotation);
        let model2 = getCollisionMap(e2.posX, e2.posY, e2.width, e2.height, -e2.rotation);

        /*
         Important Tips
         Bx-Ax=x1;By-Ay=y1
         Cx-Ax=x2;Cy-Ay=y2

         x1*y2-x2*y1=res

         (Bx-Ax)*(Cy-Ay)-(Cx-Ax)*(By-Ay)=res

         Bx=model1.B.x;
         Ax=model1.A.x;
         By=model1.B.y;
         Ay=model1.A.y;
         Cx=model2.A.x;
         Cy=model2.A.y;

         (model1.B.x-model1.A.x)*(model2.A.y-model1.A.y)-
         (model2.A.x-model1.A.x)*(model1.B.y-model1.A.y)<0

         for AB < 0
         for BC > 0
         for CD > 0
         for AD < 0

         let vec_AB = new Point(model1.B.x-model1.A.x,model1.B.y-model1.A.y);
         let vec_BC = new Point(model1.C.x-model1.B.x,model1.C.y-model1.B.y);
         let vec_CD = new Point(model1.D.x-model1.C.x,model1.D.y-model1.C.y);
         let vec_DA = new Point(model1.A.x-model1.D.x,model1.A.y-model1.D.y);

         function vectorMultiplication(A, B, C) {
         return (B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y);
         }

         for (let i = 0; i < model1.length; i++) {
         let i1 = (i + 1) % model1.length;
         let p1 = model1[i];
         let p2 = model1[i1];
         for (let j = 0; j < model2.length; j++) {
         let j1 = (j + 1) % model2.length;
         let m1 = model2[j];
         let m2 = model2[j1];
         if (vectorMultiplication(p1, p2, m2) * vectorMultiplication(p1, p2, m1) < 0 &&
         vectorMultiplication(m1, m2, p2) * vectorMultiplication(m1, m2, p1) < 0)
         return true;
         }
         }
         return false;
         */
        function vectorMultiplication(A, B, C) {
            return (B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y);
        }

        for (let i = 0; i < model1.length; i++) {
            let i1 = (i + 1) % model1.length;
            let p1 = model1[i];
            let p2 = model1[i1];
            for (let j = 0; j < model2.length; j++) {
                let j1 = (j + 1) % model2.length;
                let m1 = model2[j];
                let m2 = model2[j1];
                if (vectorMultiplication(p1, p2, m2) * vectorMultiplication(p1, p2, m1) < 0 &&
                    vectorMultiplication(m1, m2, p2) * vectorMultiplication(m1, m2, p1) < 0)
                    return true;
            }
        }
        return false;

        /*
        function isUndefined(obj) {
            return obj === undefined;
        }

        let polygons = [model1, model2];
        let minA, maxA, projected, i, i1, j, minB, maxB;

        for (i = 0; i < polygons.length; i++) {

            // for each polygon, look at each edge of the polygon, and determine if it separates
            // the two shapes
            let polygon = polygons[i];
            for (i1 = 0; i1 < polygon.length; i1++) {

                // grab 2 vertices to create an edge
                let i2 = (i1 + 1) % polygon.length;
                let p1 = polygon[i1];
                let p2 = polygon[i2];

                // find the line perpendicular to this edge
                let normal = {x: p2.y - p1.y, y: p1.x - p2.x};

                minA = maxA = undefined;
                // for each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                for (j = 0; j < model1.length; j++) {
                    projected = normal.x * model1[j].x + normal.y * model1[j].y;
                    if (isUndefined(minA) || projected < minA) {
                        minA = projected;
                    }
                    if (isUndefined(maxA) || projected > maxA) {
                        maxA = projected;
                    }
                }

                // for each vertex in the second shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                minB = maxB = undefined;
                for (j = 0; j < model2.length; j++) {
                    projected = normal.x * model2[j].x + normal.y * model2[j].y;
                    if (isUndefined(minB) || projected < minB) {
                        minB = projected;
                    }
                    if (isUndefined(maxB) || projected > maxB) {
                        maxB = projected;
                    }
                }

                // if there is no overlap between the projects, the edge we are looking at separates the two
                // polygons, and we know there is no overlap
                if (maxA < minB || maxB < minA) {
                    return false;
                }
            }
        }
        return true;
        */
    }
};

module.exports = CollisionUtils;