///<reference path="HashObject.ts"/>
module RM {
	/**
	 * 矩形类
	 * @author
	 *
	 */
	export class Rectangle extends RM.HashObject {
		public x:number = 0;
		public y:number = 0;
		public width:number = 0;
		public height:number = 0;
		private static _PoolUtil:RM.PoolUtil;

		public constructor() {
			super();
		}

		public static create( x:number = 0, y:number = 0, width:number = 0, height:number = 0 ):RM.Rectangle {
			var rect:RM.Rectangle = RM.Rectangle.PoolUtil.getObject();
			rect.resetToValue( x, y, width, height );
			return rect;
		}

		public static get PoolUtil():RM.PoolUtil {
			if ( ! RM.Rectangle._PoolUtil ) {
				RM.Rectangle._PoolUtil = new RM.PoolUtil( RM.Rectangle );
			}
			return RM.Rectangle._PoolUtil;
		}

		/**释放**/
		public release():void {
			RM.Rectangle.PoolUtil.release( this );
		}

		public reset():void {
			this.x = this.y = this.width = this.height = 0;
		}

		/**克隆，制作自己的分身，值的拷贝，产生新值*/
		public clone():RM.Rectangle {
			return RM.Rectangle.create( this.x, this.y, this.width, this.height );
		}

		/**重置为指定值*/
		public resetToValue( x:number, y:number, width:number, height:number ):RM.Rectangle {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			return this;
		}

		/**重置为指定Rect*/
		public resetToRect( rect:RM.Rectangle ):RM.Rectangle {
			this.x = rect.x;
			this.y = rect.y;
			this.width = rect.width;
			this.height = rect.height;
			return this;
		}

		/**对比两个矩形是否是相同的值*/
		public equals( rect:RM.Rectangle ):boolean {
			return ( this.x == rect.x ) && ( this.y == rect.y ) && ( this.width == rect.width ) && ( this.height == rect.height );
		}

		/**获取最大X轴的值*/
		public getMaxX():number {
			return this.x + this.width;
		}

		/**获取最小X轴的值*/
		public getMinX():number {
			return this.x;
		}

		/**获取在X轴的中间值*/
		public getMidX():number {
			return this.x + this.width / 2;
		}

		/**获取最大Y轴的值*/
		public getMaxY():number {
			return this.y + this.height;
		}

		/**获取最小Y轴的值*/
		public getMinY():number {
			return this.y;
		}

		/**获取在Y轴的中间值*/
		public getMidY():number {
			return this.y + this.height / 2;
		}

		/** 是否为空矩形 **/
		public isEmpty():boolean {
			return this.width == 0 || this.height == 0;
		}

		/**指定点是否在矩形内*/
		public containsPoint( point:RM.Point ):boolean {
			if ( this.containsXY( point.x, point.y ) ) {
				return true;
			}
			return false;
		}

		/**指定坐标是否在矩形内*/
		public containsXY( x:number, y:number ):boolean {
			if ( x >= this.getMinX() && x <= this.getMaxX() && y <= this.getMaxY() && y >= this.getMinY() ) {
				return true;
			}
			return false;
		}

		/**自己是否包含指定rect，如果rect完全处于自己内部，则属于包含rect*/
		public containsRect( rect:RM.Rectangle ):boolean {
			return ( rect.x >= this.x ) && ( rect.x < this.getMaxX() ) && ( rect.y >= this.y ) && ( rect.y < this.getMaxY() ) && ( rect.getMaxX() > this.x ) && ( rect.getMaxX() <= this.getMaxX() ) && ( rect.getMaxY() > this.y ) && ( rect.getMaxY() <= this.getMaxY() );
		}

		/**指定矩形与自己是否相交*/
		public intersectsRect( rect:RM.Rectangle ):boolean {
			return Math.max( this.x, rect.x ) <= Math.min( this.getMaxX(), rect.getMaxX() ) && Math.max( this.y, rect.y ) <= Math.min( this.getMaxY(), rect.getMaxY() );
		}

		/**指定矩形rect与自己是否相交<br>
		 * 如果相交则返回交集区域 Rectangle 对象。<br>
		 * 如果矩形不相交，则此方法返回一个空的 Rectangle 对象，其属性设置为 0。*/
		public intersection( rect:RM.Rectangle, toSelf:boolean = false ):RM.Rectangle {
			var result;
			if ( toSelf ) {
				result = this;
			}
			else {
				result = this.clone();
			}
			var minx:number = Math.max( result.x, rect.x );
			var maxx:number = Math.min( result.getMaxX(), rect.getMaxX() );
			if ( minx <= maxx ) {
				var miny:number = Math.max( result.y, rect.y );
				var maxy:number = Math.min( result.getMaxY(), rect.getMaxY() );
				if ( miny <= maxy ) {
					result.resetToValue( minx, miny, maxx - minx, maxy - miny );
					return result;
				}
			}
			result.resetToValue( 0, 0, 0, 0 );
			return result;
		}

		/**通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
		 *
		 * */
		public union( toUnion:RM.Rectangle, toSelf:boolean = false ):RM.Rectangle {
			var result;
			if ( toSelf ) {
				result = this;
			}
			else {
				result = this.clone();
			}
			if ( toUnion.isEmpty() ) {
				return result;
			}
			if ( result.isEmpty() ) {
				result.resetToRect( toUnion );
				return result;
			}
			var minx = Math.min( result.x, toUnion.x );
			var miny = Math.min( result.y, toUnion.y );
			var maxx:number = Math.max( result.getMaxX(), toUnion.getMaxX() );
			var maxy:number = Math.max( result.getMaxY(), toUnion.getMaxY() );
			result.resetToValue( minx, miny, maxx - minx, maxy - miny );
			return result;
		}

		/**
		 *获取两个矩形合并后的面积
		 *2015/11/12
		 */
		public static unionArea( rect1:RM.Rectangle, rect2:RM.Rectangle ):number {
			var minx = Math.min( rect1.x, rect2.x );
			var miny = Math.min( rect1.y, rect2.y );
			var maxx:number = Math.max( rect1.getMaxX(), rect2.getMaxX() );
			var maxy:number = Math.max( rect1.getMaxY(), rect2.getMaxY() );
			return ( maxx - minx) * ( maxy - miny );
		}

		/**
		 *获取两个矩形重叠区域的面积
		 *2015/11/12
		 */
		public static intersectionArea( rect1:RM.Rectangle, rect2:RM.Rectangle ):number {
			if ( rect1.intersectsRect( rect2 ) == false )return 0;
			var minx:number = Math.max( rect1.x, rect2.x );
			var miny:number = Math.max( rect1.y, rect2.y );
			var maxx:number = Math.min( rect1.getMaxX(), rect2.getMaxX() );
			var maxy:number = Math.min( rect1.getMaxY(), rect2.getMaxY() );
			return ( maxx - minx) * ( maxy - miny );
		}

		/**
		 *获取面积
		 *15/10/25
		 */
		public getArea():number {
			return this.width * this.height;
		}

		/**以字符串的形式输出*/
		public toString():string {
			return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
		}
	}
}
