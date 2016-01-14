module RM {
	/**
	 *
	 * @author
	 *
	 */
	export class GFunction {
		public constructor() {
		}

		/**获得自引擎运行以来走过的时间*/
		public static getTimer():number {
			return Date.now() - RM.MainContext.ENGINE_START_TIME;
		}

		/**角度转换为弧度*/
		public static angle2radian( angle:number ):number {
			return angle * Math.PI / 180;
		}

		/**弧度转换为角度*/
		public static radian2angle( radian:number ):number {
			return radian / Math.PI * 180;
		}

		/**颜色值转换，把数字值转换为16进制值*/
		public static toColorString( value:number ):string {
			if ( isNaN( value ) || value < 0 )
				value = 0;
			if ( value > 16777215 )
				value = 16777215;
			var color = value.toString( 16 ).toUpperCase();
			while ( color.length < 6 ) {
				color = "0" + color;
			}
			return "#" + color;
		}

		/**获得变换矩形，经过仿射变换后的矩形
		 * @param rect 需要进行仿射变换的矩形
		 * @param matrix 仿射变换的值
		 * @return bounds 返回经过变换后传进来的矩形
		 * */
		public static getTransformRectangle( rect:RM.Rectangle, matrix:RM.Matrix ):RM.Rectangle {
			//如果x轴或y轴为非0值，以（x,y）为轴心
			if ( rect.x || rect.y ) {
				matrix.rightTransform( 0, 0, 1, 1, 0, 0, 0, - rect.x, - rect.y );
			}
			var x_a:number = rect.width * matrix.a;
			var x_b:number = rect.width * matrix.b;
			var y_c:number = rect.height * matrix.c;
			var y_d:number = rect.height * matrix.d;
			var minX:number = matrix.x;
			var maxX:number = matrix.x;
			var minY:number = matrix.y;
			var maxY:number = matrix.y;
			var x:number = x_a + matrix.x;
			if ( x < minX ) minX = x;
			else if ( x > maxX ) maxX = x;
			x = x_a + y_c + matrix.x;
			if ( x < minX ) minX = x;
			else if ( x > maxX ) maxX = x;
			x = y_c + matrix.x;
			if ( x < minX ) minX = x;
			else if ( x > maxX ) maxX = x;
			var y:number = x_b + matrix.y;
			if ( y < minY ) minY = y;
			else if ( y > maxY ) maxY = y;
			y = x_b + y_d + matrix.y;
			if ( y < minY ) minY = y;
			else if ( y > maxY ) maxY = y;
			y = y_d + matrix.y;
			if ( y < minY ) minY = y;
			else if ( y > maxY ) maxY = y;
			return rect.resetToValue( minX, minY, maxX - minX, maxY - minY );
		}

		/**
		 * 通过一个矩阵，返回某点在此矩阵上的坐标点
		 * */
		public static transformCoords( matrix:RM.Matrix, x:number, y:number ):RM.Point {
			var point:RM.Point = RM.Point.create();
			point.x = matrix.a * x + matrix.c * y + matrix.x;
			point.y = matrix.d * y + matrix.b * x + matrix.y;
			return point;
		}
	}
}
