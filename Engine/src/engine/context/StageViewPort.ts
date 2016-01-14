///<reference path="../utils/HashObject.ts"/>
module RM {
	/**
	 *
	 * @author
	 *
	 */
	export class StageViewPort extends RM.HashObject {
		private _stageViewProtW:number = 0;
		private _stageViewProtH:number = 0;
		private _stageViewProtX:number = 0;
		private _stageViewProtY:number = 0;
		private _stageViewScaleX:number = 1;
		private _stageViewScaleY:number = 1;

		public constructor() {
			super();
		}

		public get stageViewProtW():number {
			return this._stageViewProtW;
		}

		public get stageViewProtH():number {
			return this._stageViewProtH;
		}

		public get stageViewProtX():number {
			return this._stageViewProtX;
		}

		public get stageViewProtY():number {
			return this._stageViewProtY;
		}

		public get stageViewScaleX():number {
			return this._stageViewScaleX;
		}

		public get stageViewScaleY():number {
			return this._stageViewScaleY;
		}

		public setStageSize( w:number, h:number, styleW:number = 0, styleH:number = 0 ):void {
			this._stageViewProtW = w;
			this._stageViewProtH = h;
			if ( styleW == 0 ) styleW = this._stageViewProtW;
			if ( styleH == 0 ) styleH = this._stageViewProtH;
			var canvasDiv:any = this.getStageDiv();
			var rootDiv:any = document.getElementById( RM.GlobalConfig.ROOT_DIV_NAME );
			canvasDiv.style.width = styleW + "px";
			canvasDiv.style.height = styleH + "px";
			rootDiv.style.width = styleW + "px";
			rootDiv.style.height = styleH + "px";
			RM.MainContext.getInstance().onResize();
		}

		public setStagePoint( x:number, y:number ):void {
			this._stageViewProtX = Math.round( x );
			this._stageViewProtY = Math.round( y );
			var canvasDiv:any = this.getStageDiv();
			var rootDiv:any = document.getElementById( RM.GlobalConfig.ROOT_DIV_NAME );
			canvasDiv.style.left = this._stageViewProtX + "px";
			canvasDiv.style.top = this._stageViewProtY + "px";
			rootDiv.style.left = this._stageViewProtX + "px";
			rootDiv.style.top = this._stageViewProtY + "px";
		}

		public setStageBackgroundColor( color:string ):void {
			var canvasDiv:any = this.getStageDiv();
			canvasDiv.style.background = color;
		}

		public getStageDiv():any {
			var canvasDiv:any = document.getElementById( RM.GlobalConfig.CANVAS_DIV_NAME );
			var rootDiv:any = document.getElementById( RM.GlobalConfig.ROOT_DIV_NAME );
			if ( ! canvasDiv ) {
				canvasDiv = document.createElement( "div" );
				canvasDiv.id = RM.GlobalConfig.CANVAS_DIV_NAME;
				rootDiv.appendChild( canvasDiv );
			}
			return canvasDiv;
		}

		/**获得视口矩形，起始坐标为0，0*/
		public getRect():RM.Rectangle {
			var rect:RM.Rectangle = RM.Rectangle.create( 0, 0, this._stageViewProtW, this._stageViewProtH );
			return rect;
		}

		/**
		 * 显示区域的分辨率宽度
		 *  */
		public getClientWidth():number {
			return document.documentElement.clientWidth;
		}

		/**
		 * 显示区域的分辨率高度
		 *  */
		public getClientHeight():number {
			return document.documentElement.clientHeight;
		}

		/**
		 * 自适应分辨率
		 * @param isScale ｛true:自动适应屏幕，按照480X800等比缩放。false:充满全屏，不缩放。｝ default true
		 */
		public onFullScreen(isScale:boolean = true):void {
			var clientW:number = this.getClientWidth();
			var clientH:number = this.getClientHeight();
			if( isScale )
			{
				//w,h 缩放相同比例
				var scaleW:number = clientW / this._stageViewProtW;
				if( scaleW >= 1 ) scaleW = 1;
				var scaleH:number = clientH / this._stageViewProtH;
				if( scaleH >= 1 ) scaleH = 1;
				var scale = Math.min(scaleH,scaleW);
				this._stageViewScaleX = scale;
				this._stageViewScaleY = scale;
				var viewPortW:number = this._stageViewProtW * scale;
				//var viewPortH:number = this._stageViewProtH * scaleH;
				var viewPortH:number = this._stageViewProtH * scale;
				this.setStageSize( this._stageViewProtW, this._stageViewProtH, viewPortW, viewPortH );
			}
			else
			{
				this.setStageSize( clientW, clientH, clientW, clientH );
			}
		}

		private static _instance:RM.StageViewPort;

		public static getInstance():RM.StageViewPort {
			if ( ! this._instance ) {
				this._instance = new RM.StageViewPort();
			}
			return this._instance;
		}
	}
}
