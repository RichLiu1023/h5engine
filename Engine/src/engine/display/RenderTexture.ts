///<reference path="Texture.ts"/>
///<reference path="../utils/Rectangle.ts"/>
module RM {
	/**
	 *
	 * @author
	 *
	 */
	export class RenderTexture extends RM.Texture {
		private static _pool:Array<RM.RenderTexture> = [];
		private _renderContext:RM.RenderContext;
		private static _rect:RM.Rectangle = new RM.Rectangle();

		public constructor() {
			super();
		}
		
		public static createRenderTexture():RM.RenderTexture {
			if ( RM.RenderTexture._pool.length > 0 ) {
				return RM.RenderTexture._pool.pop();
			}
			return new RM.RenderTexture();
		}

		/**回收*/
		public release():void {
			RM.RenderTexture._pool.push( this );
		}

		public dispose():void {
			if ( this._bitmapData ) {
				this._bitmapData = null;
				this._renderContext = null;
			}
		}

		public init():void {
			this._bitmapData = document.createElement( "canvas" );
			this._bitmapData[ "loadComplete" ] = true;
			this._renderContext = RM.H5CanvasRender.createRenderContext( this._bitmapData, false );
		}

		public setSize( width:number, height:number ):void {
			var cacheCanvas = this._bitmapData;
			cacheCanvas.width = width;
			cacheCanvas.height = height;
			cacheCanvas.style.width = width + "px";
			cacheCanvas.style.height = height + "px";
		}

		public drawToTexture( displayObject:RM.DisplayObject ):boolean {
			//获取显示边界
			var bounds:RM.Rectangle = displayObject._$getBounds();
			//如果宽高为0 则不缓存
			if ( bounds.width == 0 || bounds.height == 0 ) return false;
			if ( ! this._renderContext ) {
				this.init();
			}
			//设置显示边界
			this.setSize( bounds.width, bounds.height );
			//设置偏移
			this._offsetX = bounds.x;
			this._offsetY = bounds.y;
			displayObject._$globalTransform.rightMultiply( 1, 0, 0, 1, - this._offsetX, - this._offsetY );
			displayObject._$globalAlpha = 1;
			//如果是容器类，则update子类
			if ( displayObject instanceof RM.DisplayObjectContainer ) {
				var len:number = displayObject.getChildrenNum();
				var child:RM.DisplayObject;
				for ( var idx:number = 0; idx < len; idx ++ ) {
					child = displayObject.getChildAt( idx );
					child._$updateTransform();
				}
			}
			//设置全局变换
			this._renderContext.setTransform( displayObject._$globalTransform );
			this._renderContext.clearScene();
			this._renderContext.onRenderStart();
			RM.MainContext.USE_CACHE_DRAW = true;
			if ( displayObject.getScrollRect() ) {
				this._renderContext.pushMaskRect( displayObject.getScrollRect() );
			}
			//把所有子项绘制到画布
			displayObject._$render( this._renderContext );
			if ( displayObject.getScrollRect() ) {
				this._renderContext.popMaskRect();
			}
			//还原全局配置
			RM.MainContext.USE_CACHE_DRAW = false;
			//设置绘制区域，绘制画面
			RM.RenderTexture._rect.width = bounds.width;
			RM.RenderTexture._rect.height = bounds.height;
			this._renderContext.onRenderFinish();
			this._sourceW = bounds.width;
			this._sourceH = bounds.height;
			this._textureW = bounds.width;
			this._textureH = bounds.height;
			return true;
		}
	}
}
　