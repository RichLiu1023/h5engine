///<reference path="RenderContext.ts"/>
module RM {
	/**
	 *  渲染
	 * @author
	 *
	 */
	export class H5CanvasRender extends RM.RenderContext {
		/**渲染器*/
		private canvasContext:any;
		/**渲染控件*/
		private canvas:any;
		/**是否使用缓存渲染器*/
		private useCacheCanvas:boolean;
		/**缓存渲染控件*/
		private cacheCanvas:any;
		/**缓存渲染器*/
		private cacheCanvasContext:any;
		/**渲染器代表*/
		private drawCanvasContext:any;

		/** 创建渲染器，默认情况下使用双层渲染器，即缓存渲染器。<br>
		 * 缓存渲染器完成所有的显示对象的渲染，渲染完毕后，<br>
		 * canvasContext在舞台中的渲染器将会把缓存渲染器绘制到舞台。<br>
		 * 缓存渲染器不会直接显示在舞台中。
		 *
		 *  */
		public constructor( canvas?:any, useCacheCanvas:boolean = true ) {
			super();
			this.useCacheCanvas = useCacheCanvas;
			this.canvas = canvas || this.createCanvasRender();
			this.canvasContext = this.canvas.getContext( "2d" );
			if ( useCacheCanvas ) {
				this.cacheCanvas = document.createElement( "canvas" );
				this.cacheCanvas.width = this.canvas.width;
				this.cacheCanvas.height = this.canvas.height;
				this.cacheCanvasContext = this.cacheCanvas.getContext( "2d" );
				this.drawCanvasContext = this.cacheCanvasContext;
			}
			else {
				this.drawCanvasContext = this.canvasContext;
			}
		}

		private createCanvasRender():any {
			var canvas:any = document.createElement( "canvas" );
			canvas.id = RM.GlobalConfig.CANVAS_NAME;
			RM.StageViewPort.getInstance().getStageDiv().appendChild( canvas );
			return canvas;
		}

		public onResize():void {
			if ( ! this.canvas ) return;
			var canvas:any = RM.StageViewPort.getInstance().getStageDiv();
			this.canvas.width = RM.StageViewPort.getInstance().stageViewProtW;
			this.canvas.height = RM.StageViewPort.getInstance().stageViewProtH;
			this.canvas.style.width = canvas.style.width;
			this.canvas.style.height = canvas.style.height;
			if ( this.useCacheCanvas ) {
				this.cacheCanvas.width = this.canvas.width;
				this.cacheCanvas.height = this.canvas.height;
			}
		}
		
		public drawImage( texture:Texture, offsetX:number, offsetY:number, sourceW:number, sourceH:number,
						  destX:number, destY:number, destW:number, destH:number, renderType?:string ):void {
			if ( ! texture ) return;
			texture.drawForCanvas( this.drawCanvasContext, offsetX, offsetY, sourceW, sourceH, destX, destY, destW, destH, renderType );
			super.drawImage( texture, offsetX, offsetY, sourceW, sourceH, destX, destY, destW, destH );
		}
		
		public static createRenderContext( canvas?:any, useCacheCanvas?:boolean ):any {
			return new RM.H5CanvasRender( canvas, useCacheCanvas );
		}

		public onRenderStart():void {
			this.drawCanvasContext.save();
		}

		/**渲染完毕，把渲染结果刷新到画布呈现*/
		public onRenderFinish():void {
			this.drawCanvasContext.restore();
			this.drawCanvasContext.setTransform( 1, 0, 0, 1, 0, 0 );
			if ( this.useCacheCanvas ) {
				var rect:RM.Rectangle;
				if ( RM.GlobalConfig.IS_OPEN_DIRTY ) {
					var list:Array<RM.Rectangle> = RM.RenderFilter.getInstance().getDefaultDrawAreaList();
					var len:number = list.length;
					for ( var idx:number = 0; idx < len; idx ++ ) {
						rect = list[ idx ];
						//获取渲染区域与舞台的相交矩形
						var result = rect.intersection( StageViewPort.getInstance().getRect(), true );
						if ( result.width > 0 && result.height > 0 ) {
							//绘制缓存渲染器的一部分到舞台
							this.canvasContext.drawImage( this.cacheCanvas, result.x, result.y, result.width, result.height, result.x, result.y, result.width, result.height );
						}
					}
					RM.RenderFilter.getInstance().clearDrawList();
				}
				else {
					rect = StageViewPort.getInstance().getRect();
					this.canvasContext.drawImage( this.cacheCanvas, rect.x, rect.y, rect.width, rect.height, rect.x, rect.y, rect.width, rect.height );
				}
			}
		}

		/**清除需要渲染的指定区域列表的像素*/
		public clearScene():void {
			//不实用缓存画布的方式，在制作缓存位图的时候才使用，正常渲染是使用缓存画布的
			if ( this.useCacheCanvas && RM.GlobalConfig.IS_OPEN_DIRTY ) {
				var list:Array<RM.Rectangle> = RM.RenderFilter.getInstance().getDefaultDrawAreaList();
				var len:number = list.length;
				var rect:RM.Rectangle;
				for ( var idx:number = 0; idx < len; idx ++ ) {
					rect = list[ idx ];
					this.clearRect( rect.x, rect.y, rect.width, rect.height );
				}
			}
			else {
				this.clearRect( 0, 0, RM.StageViewPort.getInstance().stageViewProtW, RM.StageViewPort.getInstance().stageViewProtH );
			}
			//清除缓存cacheCanvasContext的全屏
			if ( this.useCacheCanvas ) {
				this.cacheCanvasContext.clearRect( 0, 0, RM.StageViewPort.getInstance().stageViewProtW, RM.StageViewPort.getInstance().stageViewProtH );
			}
		}

		/**清除指定区域的像素(清除的是显示在舞台中的canvasContext的区域，而非cacheCanvasContext)*/
		private clearRect( x:number, y:number, width:number, height:number ):void {
			this.canvasContext.clearRect( x, y, width, height );
		}

		public setTransform( matrix:RM.Matrix ):void {
			this.drawCanvasContext.setTransform( matrix.a, matrix.b, matrix.c, matrix.d, matrix.x, matrix.y );
		}

		public setAlpha( alpha:number ):void {
			this.drawCanvasContext.globalAlpha = alpha;
		}

		public drawText( text:string, x:number, y:number, maxWidth:number = 0xffff, isStrokeText:boolean = false ):void {
			if ( isStrokeText ) this.drawCanvasContext.strokeText( text, x, y, maxWidth );
			else this.drawCanvasContext.fillText( text, x, y, maxWidth );
			super.drawText( text, x, y, maxWidth, isStrokeText );
		}

		/** 设置渲染文本的样式 */
		public setDrawTextStyle( font:string, textAlign:string, textBaseline:string, fillStyle:string, strokeStyle:string ):void {
			var canvas:any = this.drawCanvasContext;
			canvas.font = font;
			canvas.textAlign = textAlign;
			canvas.textBaseline = textBaseline;
			canvas.fillStyle = fillStyle;
			canvas.strokeStyle = strokeStyle;
		}

		/** 测量text宽度 */
		public measureText( text:string ):number {
			return this.drawCanvasContext.measureText( text ).width;
		}

		/**
		 * 压入遮罩矩形，调用此方法后，后续的绘制将以此矩形范围开始渲染
		 * @param mask
		 */
		public pushMaskRect( mask:RM.Rectangle ):void {
			this.drawCanvasContext.save();
			this.drawCanvasContext.beginPath();
			this.drawCanvasContext.rect( mask.x, mask.y, mask.width, mask.height );
			this.drawCanvasContext.clip();
			this.drawCanvasContext.closePath();
		}

		/**
		 * 从栈顶移除遮罩矩形，如果栈内还存在遮罩矩形，则继续以栈顶矩形渲染
		 */
		public popMaskRect():void {
			this.drawCanvasContext.restore();
			this.drawCanvasContext.setTransform( 1, 0, 0, 1, 0, 0 );
		}
	}
}
