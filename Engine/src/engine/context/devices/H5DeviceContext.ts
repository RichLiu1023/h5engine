///<reference path="DeviceContext.ts"/>
module RM {
	/**
	 *
	 * @author
	 *
	 */
	export class H5DeviceContext extends RM.DeviceContext {

		//为了防止this在回调函数中感染，直接用静态属性
		public static instance:RM.H5DeviceContext;
		public static _callback:Function;
		public static _thisObject:any;
		public static requestAnimationFrame:Function;
		public static cancelAnimationFrame:Function;
		private _time:number;

		public constructor() {
			super();
			this._time = 0;
			if ( ! H5DeviceContext.requestAnimationFrame ) {
				H5DeviceContext.requestAnimationFrame = function ( callback ):any {
					return window.setTimeout( callback, 1000 / RM.GlobalConfig.FRAME_RATE );
				}
			}
			if ( ! H5DeviceContext.cancelAnimationFrame ) {
				H5DeviceContext.cancelAnimationFrame = function ( id ):any {
					return window.clearTimeout( id );
				}
			}
			RM.H5DeviceContext.instance = this;
		}

		public executeMainLoop( callback:Function, thisObject:any ):void {
			RM.H5DeviceContext._thisObject = thisObject;
			RM.H5DeviceContext._callback = callback;
			this.enterFrame();
		}

		private enterFrame():void {
			var context:RM.H5DeviceContext = RM.H5DeviceContext.instance;
			var thisObject:any = RM.H5DeviceContext._thisObject;
			var callback:Function = RM.H5DeviceContext._callback;
			var startTime:number = RM.GFunction.getTimer();
			var advancedTime:number = startTime - context._time;
			RM.H5DeviceContext.requestAnimationFrame.call( window, RM.H5DeviceContext.prototype.enterFrame );
			callback.call( thisObject, advancedTime );
			context._time = startTime;
		}
	}
}
