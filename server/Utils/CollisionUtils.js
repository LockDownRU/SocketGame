let MathUtils = require('./MathUtils');

let CollisionUtils = {

    getEntityCollisions: (e1) => {
        let collisions = [];

        global.Server.globalEntityMap.forEach((e2, id, map) => {

            if (e1.collisionEnabled === true && e1.id !== e2.id && e2.collisionEnabled === true) {
                if (CollisionUtils.checkEntityCollision(e1, e2)) {
                    collisions.push(collisions);
                }
            }

        });

        return collisions;
    },

    checkEntityCollision: (e1, e2) => {
        /*function AABB(entity) {
         return {
         x: entity.posX - entity.width / 2 ,
         y: entity.posY -  entity.height / 2,
         width : entity.width,
         height: entity.height
         };
         }

         for (let i = 0 ; i < this.collideIgnore.length; i++){
         if (e.id.includes(this.collideIgnore[i])) {

         }
         }

         let rect1 = AABB(this);
         let rect2 = AABB(e);

         return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.height + rect1.y > rect2.y;*/
        let isCollide = false;

        if (MathUtils.distance(e1.posX, e1.posY, e2.posX, e2.posY) > 100)
            return isCollide;

        class Point {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
        }

        function getCollisionMap(x, y, w, h, alpha) {
            let delta1 = alpha + Math.atan(w / h);
            let x1 = Math.cos(delta1) * Math.hypot((w / 2), (h / 2));
            let y1 = Math.sin(delta1) * Math.hypot((w / 2), (h / 2));
            let delta2 = alpha - Math.atan(w / h);
            let x2 = Math.cos(delta2) * Math.hypot((w / 2), (h / 2));
            let y2 = Math.sin(delta2) * Math.hypot((w / 2), (h / 2));
            return [
                new Point(x + x1, y + y1),
                new Point(x + x2, y + y2),
                new Point(x - x1, y - y1),
                new Point(x - x2, y - y2)
            ];
        }

        function vectorMultiplication(A, B, C) {
            return (B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y);
        }

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
         */
        let model1 = getCollisionMap(e1.posX, e1.posY, e1.width, e1.height, e1.rotation);
        let model2 = getCollisionMap(e2.posX, e2.posY, e2.width, e2.height, e2.rotation);

        model2.forEach(function (item) {
            if (vectorMultiplication(model1[0], model1[1], item) < 0 &&
                vectorMultiplication(model1[1], model1[2], item) < 0 &&
                vectorMultiplication(model1[2], model1[3], item) < 0 &&
                vectorMultiplication(model1[3], model1[0], item) < 0 &&
                isCollide === false
            )
                isCollide = true;
        });
        if (isCollide === true)
            return true;
        model1.forEach(function (item) {
            if (
                vectorMultiplication(model2[0], model2[1], item) < 0 &&
                vectorMultiplication(model2[1], model2[2], item) < 0 &&
                vectorMultiplication(model2[2], model2[3], item) < 0 &&
                vectorMultiplication(model2[3], model2[0], item) < 0 &&
                isCollide === false
            )
                isCollide = true;
        });
        return isCollide;
    }
};

module.exports = CollisionUtils;