///<reference path="../../utils/HashObject.ts"/>
/**
 * Created by Rich on 15/10/20.
 */
module RM {
	export class TouchContext extends RM.HashObject {
		/** 最后的点 **/
		private _lastTouchPoint:RM.Point = new RM.Point();
		/** 最大触碰点 **/
		public static MAX_TOUCHES:number = 2;
		/** 触碰点的ID列表 **/
		private _identifierList:Array<any> = [];

		public constructor() {
			super();
		}

		/**
		 * 启动
		 *15/10/20
		 */
		public run():void {
		}

		/**
		 *
		 *2015/10/21
		 */
		private _dispatchTouchEvent( result:RM.DisplayObject, type:string, x:number, y:number, identifier:number ):void {
			RM.TouchEvent.dispatchTouchEvent( result, type, true, null, x, y, identifier );
		}

		/**
		 *当按下时触发
		 *15/10/20
		 */
		public onTouchBegin( x:number, y:number, identifier:number ):void {
			//判断多点触碰是否超过最大处理点数
			if ( this._identifierList.length == RM.TouchContext.MAX_TOUCHES )return;
			this._lastTouchPoint.resetToValue( x, y );
			//获得触摸按下的对象
			var point:RM.Point = this.transformStagePoint( x, y );
			var result:RM.DisplayObject = RM.MainContext.getInstance().stage._$hitTest( point.x, point.y );
			if ( result ) {
				this._dispatchTouchEvent( result, RM.TouchEvent.TOUCH_BEGIN, point.x, point.y, identifier );
			}
			this._identifierList.push( identifier );
			point.release();
		}

		/**
		 *当移动时触发,只有当按下去的时候才会触发移动事件，如拖动
		 *2015/10/21
		 */
		public onTouchMove( x:number, y:number, identifier:number ):void {
			var index:number = this._identifierList.indexOf( identifier );
			//如果为-1则不在按下的触摸列表中，不处理移动事件。
			if ( index == - 1 ) return;
			//如果移动位置等于上一次的触碰位置，则不处理移动。
			if ( x == this._lastTouchPoint.x && y == this._lastTouchPoint.y ) return;
			this._lastTouchPoint.resetToValue( x, y );
			var point:RM.Point = this.transformStagePoint( x, y );
			var result:RM.DisplayObject = RM.MainContext.getInstance().stage._$hitTest( point.x, point.y );
			if ( result ) {
				this._dispatchTouchEvent( result, RM.TouchEvent.TOUCH_MOVE, point.x, point.y, identifier );
			}
			point.release();
		}

		/**
		 *弹起时触发
		 *2015/10/21
		 */
		public onTouchEnd( x:number, y:number, identifier:number ):void {
			var index:number = this._identifierList.indexOf( identifier );
			//如果为-1则不在按下的触摸列表中，不处理弹起事件。
			if ( index == - 1 ) return;
			//从列表中删除一项
			this._identifierList.splice( index, 1 );
			var point:RM.Point = this.transformStagePoint( x, y );
			var result:RM.DisplayObject = RM.MainContext.getInstance().stage._$hitTest( point.x, point.y );
			if ( result ) {
				this._dispatchTouchEvent( result, RM.TouchEvent.TOUCH_END, point.x, point.y, identifier );
			}
			point.release();
		}

		/**
		 * 派发离开舞台事件
		 *2015/10/21
		 */
		public onDispatchLeaveStageEvent():void {
			//清空触点列表
			this._identifierList.length = 0;
			RM.Event.dispatchEvent( RM.MainContext.getInstance().stage, RM.Event.LEAVE_STAGE );
		}

		/**
		 *转换成舞台坐标，涉及舞台缩放参数
		 *2015/11/5
		 */
		private transformStagePoint( x:number, y:number ):RM.Point {
			x = x / RM.StageViewPort.getInstance().stageViewScaleX;
			y = y / RM.StageViewPort.getInstance().stageViewScaleY;
			return RM.Point.create( x, y );
		}
	}
}