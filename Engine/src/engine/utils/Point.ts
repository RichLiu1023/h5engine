///<reference path="HashObject.ts"/>
module RM {
	/**
	 * 二维空间中的点
	 * @author 
	 *
	 */
	export class Point extends RM.HashObject{
    	
        public x: number = 0;
        public y: number = 0;

        private static _PoolUtil:RM.PoolUtil;

        public constructor()
        {
            super();
        }
        public static create( x:number=0, y:number=0 ):RM.Point{
            var point:RM.Point = RM.Point.PoolUtil.getObject();
            point.resetToValue( x,y );
            return point;
        }
        public static get PoolUtil():RM.PoolUtil
        {
            if( !RM.Point._PoolUtil )
            {
                RM.Point._PoolUtil = new RM.PoolUtil(RM.Point);
            }
            return RM.Point._PoolUtil;
        }

        /**释放**/
        public release():void{
            RM.Point.PoolUtil.release(this);
        }
        public reset():void{
            this.x = this.y = 0;
        }
        /**克隆，返回新的点，新的点为原点的副本*/
        public clone(): RM.Point
        {
            return RM.Point.create( this.x, this.y );
        }
        /**重置为指定值*/
        public resetToValue( x:number, y:number ): RM.Point
        {
            this.x = x;
            this.y = y;
            return this;
        }
        /**重置为指定点*/
        public resetToPoint( point: RM.Point ): RM.Point
        {
            this.x = point.x;
            this.y = point.y;
            return this;
        }
		/**加法，不会创建新的值，返回自己*/
        public add( point: RM.Point ): RM.Point
        {
            this.x += point.x;
            this.y += point.y;
            return this;
        }
        /**减法，不会创建新的值，返回自己*/
        public sub( point: RM.Point ): RM.Point
        {
            this.x -= point.x;
            this.y -= point.y;
            return this;
        }
        /**乘法，不会创建新的值，返回自己*/
        public mul( value: number ): RM.Point
        {
            this.x *= value;
            this.y *= value;
            return this;
        }
        /**除法，不会创建新的值，返回自己*/
        public div( value: number ): RM.Point
        {
            this.x /= value;
            this.y /= value;
            return this;
        }
        /**确认是否相同的点*/
        public equals( point: RM.Point ): boolean
        {
            return ( this.x == point.x ) && ( this.y == point.y );
        }
        /**两点之间的距离*/
        public distance( point: RM.Point ): number
        {
            return this.clone().sub( point ).lenght();
        }
        /**获得向量的长度*/
        public lenght(): number
        {
            return Math.sqrt( this.x * this.x + this.y * this.y );
        }
        /**向量值是否为0*/
        public isZero(): boolean
        {
            return ( this.x == 0 ) && ( this.y == 0 );
        }
        /**取反操作，相当于乘以-1*/
        public negate(): RM.Point
        {
            this.mul(-1);
            return this;
        }
        /**绕指定点，旋转angle角度*/
        public rotate( point: RM.Point, angle: number ): RM.Point
        {
            var radian = RM.GFunction.angle2radian( (angle%360) );
            var sin: number = Math.sin( radian );
            var cos: number = Math.cos( radian );
            if( point.isZero() )
            {
                var tx: number = this.x*cos-this.y*sin;
                this.y = this.y * cos + this.x * sin;
                this.x = tx;
            }
            else
            {
                var tx: number = this.x - point.x;
                var ty: number = this.y - point.y;
                this.x = tx * cos - ty * sin + point.x;
                this.y = ty * cos + tx * sin + point.y;
            }
            return this;
        }
        /**限制当前点在指定的区域内，max及min，超过最大和最小值时，将设置为最大值和最小值*/
        public clamp( max: RM.Point, min: RM.Point ): RM.Point
        {
            if( min.x > max.x || min.y > max.y )
            {
                RM.Log.print("RM.Point.clamp 指定区域错误!",this.toString());
                return this;
            }
            if ( this.x < min.x ) { this.x = min.x }
            if ( this.x > max.x ) { this.x = max.x }
            if ( this.y < min.y ) { this.y = min.y }
            if ( this.y > max.y ) { this.y = max.y }
            return this;
        }
        /**获取自己到另一点的中点，返回新值*/
        public pMidpoint( point: RM.Point ): RM.Point
        {
            return this.clone().add( point ).div( 2 );
        }
        /**以字符串的形式输出*/
        public toString():string
        {
            return "(x=" + this.x + ", y=" + this.y + ")";
        }
        
//---------------------------------------Static Function---------------------------------------------------
        
	}
}
