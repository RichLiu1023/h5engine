///<reference path="../events/EventDispatcher.ts"/>
module RM {
	/**
	 * 主控器，引擎结构中的中枢，包含各种控制器，如渲染、网络等控制器
	 * @author
	 *
	 */
	export class MainContext extends RM.EventDispatcher {
		/**
		 * 渲染cache位图时设置为true。
		 * */
		public static USE_CACHE_DRAW:boolean = false;
		/**当前帧需要渲染的子项列表*/
		public static DRAW_COMMAND_LIST:Array<RM.RenderCommand> = [];
		/**引擎启动的时间*/
		public static ENGINE_START_TIME:number = 0;
		/**当前渲染阶段*/
		public static RENDER_PHASE:string = "";
		/**渲染*/
		public renderContext:RM.RenderContext;
		/**网络*/
		public netContext:RM.NetContext;
		/**设备*/
		public deviceContext:RM.DeviceContext;
		/**触摸控制*/
		public touchContext:RM.H5TouchContext;
		/**舞台*/
		public stage:RM.Stage;
		/**进入帧时回调函数列表*/
		public static ENTER_FRAME_CALLBACK_LIST:Array<RM.EventCallbackData> = [];
		/**进入帧事件*/
		private _enterFrameEvent:RM.Event = new RM.Event();
		/**添加到舞台回调函数列表*/
		public static ADD_TO_STAGE_CALLBACK_LIST:Array<RM.DisplayObject> = [];
		/**从舞台移除回调函数列表*/
		public static REMOVE_FORM_STAGE_CALLBACK_LIST:Array<RM.DisplayObject> = [];

		public constructor() {
			super();
			this.renderContext = RM.H5CanvasRender.createRenderContext();
			this.netContext = new RM.H5NetContext();
			this.deviceContext = new RM.H5DeviceContext();
			this.touchContext = new RM.H5TouchContext();
			RM.MainContext.RENDER_PHASE = RM.RenderLoopPhase.DEFAULT_RENDER_PHASE;
		}

		/**启动引擎*/
		public run():void {
			RM.Ticker.getInstance().run();
			//主帧渲染跑道，级别为最先执行Number.POSITIVE_INFINITY
			RM.Ticker.getInstance().register( this.renderLoop, this, Number.POSITIVE_INFINITY );
			//进入帧事件最后派发，Number.NEGATIVE_INFINITY
			RM.Ticker.getInstance().register( this.broadcastEnterFrame, this, Number.NEGATIVE_INFINITY );
			this.touchContext.run();
		}

		/**帧跑道模型，渲染部分*/
		private renderLoop( frameRate:number ):void {
			//渲染之前，处理延迟函数执行
			RM.DelayedCallback.doCallback();
			var self:RM.MainContext = this;
			var context:RM.RenderContext = self.renderContext;
			var stage:RM.Stage = self.stage;
			//渲染开始
			RM.MainContext.RENDER_PHASE = RM.RenderLoopPhase.CLEAR_AREA_PHASE;
			//计算渲染脏矩形区域
			if ( RM.GlobalConfig.IS_OPEN_DIRTY ) {
				stage._$checkDirtyRectangle();
				stage._$clearDirty();
				if ( RM.RenderPerformance.getInstance().isRun() ) {
					RM.RenderFilter.getInstance()._addArea(
						RM.RenderPerformance.getInstance().getRect() );
				}
			}
			context.onRenderStart();
			context.clearScene();
			RM.MainContext.RENDER_PHASE = RM.RenderLoopPhase.UPDATE_TRANSFORM_PHASE;
			RM.MainContext.DRAW_COMMAND_LIST = [];
			stage._$updateTransform();
			RM.MainContext.RENDER_PHASE = RM.RenderLoopPhase.DRAW_PHASE;
			self._draw( context );
			if ( RM.RenderPerformance.getInstance().isRun() ) {
				RM.RenderPerformance.getInstance().draw( context );
			}
			context.onRenderFinish();
			RM.MainContext.RENDER_PHASE = RM.RenderLoopPhase.COMPLETE_PHASE;
		}

		/**新的渲染机制，通过updateTransform整理所有需要渲染的子项，在此时开始回调渲染*/
		private _draw( context:RM.RenderContext ):void {
			var list:Array<RM.RenderCommand> = RM.MainContext.DRAW_COMMAND_LIST;
			var len:number = list.length;
			var cmd:RM.RenderCommand;
			for ( var idx:number = 0; idx < len; idx++ ) {
				cmd = list[ idx ];
				cmd.call( context );
				cmd.dispose();
			}
		}

		/**广播进入帧事件*/
		private broadcastEnterFrame( time:number ):void {
			var event:RM.Event = this._enterFrameEvent;
			event._type = RM.Event.ENTER_FRAME;
			var list:Array<RM.EventCallbackData> = RM.MainContext.ENTER_FRAME_CALLBACK_LIST.concat();
			var len:number = list.length;
			var eventdata:RM.EventCallbackData;
			for ( var idx:number = 0; idx < len; idx++ ) {
				eventdata = list[ idx ];
				eventdata.listener.call( eventdata.thisObject, time );
			}
		}

		/**
		 * 广播添加入舞台事件
		 * */
		public broadcastAddToStage():void {
			var list:Array<RM.DisplayObject> = RM.MainContext.ADD_TO_STAGE_CALLBACK_LIST;
			var child:RM.DisplayObject;
			while ( list.length > 0 ) {
				child = list.shift();
				RM.Event.dispatchEvent( child, RM.Event.ADD_TO_STAGE );
			}
		}

		/**
		 * 广播从舞台删除事件
		 * */
		public broadcastRemoveFormStage():void {
			var list:Array<RM.DisplayObject> = RM.MainContext.REMOVE_FORM_STAGE_CALLBACK_LIST;
			var child:RM.DisplayObject;
			while ( list.length > 0 ) {
				child = list.shift();
				RM.Event.dispatchEvent( child, RM.Event.REMOVE_FORM_STAGE );
				child._$clearStage();
			}
		}

		public onResize():void {
			this.renderContext.onResize();
		}

		private static _instance:RM.MainContext;

		public static getInstance():RM.MainContext {
			if ( !this._instance ) {
				this._instance = new RM.MainContext();
			}
			return this._instance;
		}
	}
}
