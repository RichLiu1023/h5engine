module RM {
    /**
     *矩阵类
     * @author
     *
     */
    export class Matrix {
        public a:number;
        public b:number;
        public c:number;
        public d:number;
        public x:number;
        public y:number;
        private static _PoolUtil:RM.PoolUtil;

        public constructor() {
            this.reset();
        }

        public static create(a:number = 1, b:number = 0, c:number = 0, d:number = 1, x:number = 0, y:number = 0):RM.Matrix {
            var matrix:RM.Matrix = RM.Matrix.PoolUtil.getObject();
            matrix.resetToValue(a, b, c, d, x, y);
            return matrix;
        }

        public static get PoolUtil():RM.PoolUtil {
            if (!RM.Matrix._PoolUtil) {
                RM.Matrix._PoolUtil = new RM.PoolUtil(RM.Matrix);
            }
            return RM.Matrix._PoolUtil;
        }

        /**释放**/
        public release():void {
            RM.Matrix.PoolUtil.release(this);
        }

        /**重置矩阵数据*/
        public reset():RM.Matrix {
            this.a = this.d = 1;
            this.b = this.c = this.x = this.y = 0;
            return this;
        }

        /**重置为指定值*/
        public resetToValue(a:number = 1, b:number = 0, c:number = 0, d:number = 1, x:number = 0, y:number = 0):RM.Matrix {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.x = x;
            this.y = y;
            return this;
        }

        /**平移x，y像素*/
        public translate(x:number, y:number):RM.Matrix {
            this.x += x;
            this.y += y;
            return this;
        }

        /**缩放，x、y轴方向缩放*/
        public scale(scaleX:number, scaleY:number):RM.Matrix {
            this.a *= scaleX;
            this.b *= scaleY;
            this.c *= scaleX;
            this.d *= scaleY;
            this.x *= scaleX;
            this.y *= scaleY;
            return this;
        }

        /**旋转，单位是角度
         * 旋转矩阵（ cosA, sinA, -sinA, cosA, 0, 0）
         * */
        public rotate(angle:number):RM.Matrix {
            angle = ( angle % 360 )
            angle = RM.GFunction.angle2radian(angle);
            var cos:number = Math.cos(angle);
            var sin:number = Math.sin(angle);
            var ta:number = this.a;
            var tc:number = this.c;
            var tx:number = this.x;
            this.a = ta * cos - this.b * sin;
            this.b = ta * sin + this.b * cos;
            this.c = tc * cos - this.d * sin;
            this.d = tc * sin + this.d * cos;
            this.x = tx * cos - this.y * sin;
            this.y = tx * sin + this.y * cos;
            return this;
        }

        /**切变，单位是角度
         * 切变矩阵 （ 1, tanAy, tanAx, 1, 0, 0）
         * */
        public skew(angleX:number, angleY:number):RM.Matrix {
            angleX = ( angleX % 90 );
            angleY = ( angleY % 90 );
            angleX = RM.GFunction.angle2radian(angleX);
            angleY = RM.GFunction.angle2radian(angleY);
            var tanAx:number = Math.tan(angleX);
            var tanAy:number = Math.tan(angleY);
            var ta:number = this.a;
            var tc:number = this.c;
            var tx:number = this.x;
            this.a = ta + tanAx * this.b;
            this.b = ta * tanAy + this.b;
            this.c = tc + tanAx * this.d;
            this.d = tc * tanAy + this.d;
            this.x = tx + tanAx * this.y;
            this.y = tx * tanAy + this.y;
            return this;
        }

        /**矩阵左乘*/
        public leftMultiply(a:number, b:number, c:number, d:number, x:number, y:number):RM.Matrix {
            //如果没有旋转、缩放、切变操作，就不需要计算
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                var ta:number = this.a;
                var tc:number = this.c;
                this.a = a * ta + c * this.b;
                this.b = b * ta + d * this.b;
                this.c = a * tc + c * this.d;
                this.d = b * tc + d * this.d;
            }
            var tx:number = this.x;
            this.x = a * tx + c * this.y + x;
            this.y = b * tx + d * this.y + y;
            return this;
        }

        /**矩阵右乘*/
        public rightMultiply(a:number, b:number, c:number, d:number, x:number, y:number):RM.Matrix {
            var ta:number = this.a;
            var tb:number = this.b;
            var tc:number = this.c;
            var td:number = this.d;
            //如果没有旋转、缩放、切变操作，就不需要计算
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                this.a = ta * a + tc * b;
                this.b = tb * a + td * b;
                this.c = ta * c + tc * d;
                this.d = tb * c + td * d;
            }
            this.x = ta * x + tc * y + this.x;
            this.y = tb * x + td * y + this.y;
            return this;
        }

        /**逆矩阵*/
        public invert():RM.Matrix {
            var ta:number = this.a;
            var tb:number = this.b;
            var tc:number = this.c;
            var td:number = this.d;
            var tx:number = this.x;
            var n = ta * td - tb * tc;
            this.a = td / n;
            this.b = -tb / n;
            this.c = -tc / n;
            this.d = ta / n;
            this.x = ( tc * this.y - td * tx ) / n;
            this.y = -( ta * this.y - tb * tx ) / n;
            return this;
        }

        /**拷贝矩阵，拷贝一个矩阵的数据到自己*/
        public copyMatrix(matrix:RM.Matrix):RM.Matrix {
            this.a = matrix.a;
            this.b = matrix.b;
            this.c = matrix.c;
            this.d = matrix.d;
            this.x = matrix.x;
            this.y = matrix.y;
            return this;
        }

        /**转换矩阵操作，顺序为：缩放、切变、旋转、平移*/
        public rightTransform(x:number, y:number, scaleX:number, scaleY:number, skewX:number, skewY:number, rotate:number, offX:number = 0, offY:number = 0):RM.Matrix {
            rotate = ( rotate % 360 );
            rotate = RM.GFunction.angle2radian(rotate);
            //旋转与切变一起算
            skewX = RM.GFunction.angle2radian(skewX) + rotate;
            skewY = RM.GFunction.angle2radian(skewY) + rotate;
            if (skewX || skewY) {
                this.rightMultiply(Math.cos(skewY) * scaleX, Math.sin(skewY) * scaleX, -Math.sin(skewX) * scaleY, Math.cos(skewX) * scaleY, x, y);
            }
            else {
                this.rightMultiply(scaleX, 0, 0, scaleY, x, y);
            }
            //轴心，坐标都是以相对0,0点为轴心，也可以设置中心点坐标
            if (offX || offY) {
                this.x -= offX * this.a + offY * this.c;
                this.y -= offX * this.b + offY * this.d;
            }
            return this;
        }

        /**转换矩阵操作，顺序为：缩放、切变、旋转、平移*/
        public leftTransform(x:number, y:number, scaleX:number, scaleY:number, skewX:number, skewY:number, rotate:number, offX:number = 0, offY:number = 0):RM.Matrix {
            rotate = ( rotate % 360 );
            rotate = RM.GFunction.angle2radian(rotate);
            //轴心，坐标都是以相对0,0点为轴心，也可以设置中心点坐标
            if (offX || offY) {
                this.x -= offX * this.a + offY * this.c;
                this.y -= offX * this.b + offY * this.d;
            }
            skewX = RM.GFunction.angle2radian(skewX) + rotate;
            skewY = RM.GFunction.angle2radian(skewY) + rotate;
            if (skewX || skewY) {
                this.leftMultiply(Math.cos(skewY) * scaleX, Math.sin(skewY) * scaleX, -Math.sin(skewX) * scaleY, Math.cos(skewX) * scaleY, x, y);
            }
            else {
                this.leftMultiply(scaleX, 0, 0, scaleY, x, y);
            }
            return this;
        }
    }
}
