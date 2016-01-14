///<reference path="DisplayObjectContainer.ts"/>
module RM {
	/**
	 * 舞台，主绘区
	 * @author
	 *
	 */
	export class Stage extends RM.DisplayObjectContainer {
		public constructor() {
			super();
			this.setName( "Stage" );
			this._DOP_Property._touchEnabled = true;
			this._DOP_Property._stage = this;
		}

		public _$updateTransform():void {
			var child:RM.DisplayObject;
			for ( var idx:number = 0, len:number = this._$children.length; idx < len; idx ++ ) {
				child = this._$children[ idx ];
				child._$updateTransform();
			}
		}

		/**
		 * 覆盖父类方法，指定舞台坐标是否在对象内<br>
		 * */
		public _$hitTest( targetX:number, targetY:number, isTouchEnabled:boolean = false ):RM.DisplayObject {
			if ( ! this._DOP_Property._touchEnabled ) return null;
			if ( ! this._$touchChildren ) return this;
			var len:number = this._$children.length;
			var child:RM.DisplayObject;
			var matrix:RM.Matrix;
			var point:RM.Point;
			var result:RM.DisplayObject = null;
			var scrollrect:RM.Rectangle;
			for ( var idx:number = len - 1; idx >= 0; idx -- ) {
				child = this._$children[ idx ];
				matrix = child.getMatrix();
				scrollrect = child.getScrollRect();
				if ( scrollrect ) {
					matrix.rightMultiply( 1, 0, 0, 1, - scrollrect.x, - scrollrect.y )
				}
				matrix.invert();
				point = RM.GFunction.transformCoords( matrix, targetX, targetY );
				result = child._$hitTest( point.x, point.y, true );
				point.release();
				if ( result ) {
					if ( result.getTouchEnabled() ) {
						return result;
					}
				}
			}
			return this;
		}
	}
}
