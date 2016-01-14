///<reference path="../utils/HashObject.ts"/>
module RM {
	/**
	 * 纹理类
	 * @author Rich
	 *
	 */
	export class Texture extends RM.HashObject {
		public static _bitmapDataFactoryMap = {};
		public static _bitmapDataCallBackMap = {};
		/**纹理bitmapData*/
		public _bitmapData:any = null;
		/**bitmapData原始宽度*/
		public _sourceW:number = 0;
		/**bitmapData资源原始高度*/
		public _sourceH:number = 0;
		//从原始纹理裁剪的属性
		/**表示这个纹理从 bitmapData 上的 x 位置开始裁剪*/
		public _bitmapX:number = 0;
		/**表示这个纹理从 bitmapData 上的 y 位置开始裁剪*/
		public _bitmapY:number = 0;
		/**表示这个纹理从 bitmapData 上裁剪的宽度*/
		public _bitmapW:number = 0;
		/**表示这个纹理在 bitmapData 上裁剪的高度*/
		public _bitmapH:number = 0;
		//渲染在画布中的属性
		/**表示这个纹理显示了之后在 画布 x 方向的渲染偏移量*/
		public _offsetX:number = 0;
		/**表示这个纹理显示了之后在 画布 y 方向的渲染偏移量*/
		public _offsetY:number = 0;
		/**纹理渲染宽度（图像裁剪后的实际高度，比_bitmapW大，图像则被拉伸，反之图像则被缩小）*/
		public _textureW:number = 0;
		/**纹理渲染高度（图像裁剪后的实际高度，比_bitmapH大，图像则被拉伸，反之图像则被放小）*/
		public _textureH:number = 0;

		public constructor( bitmapData?:any ) {
			super();
			if ( bitmapData ) {
				this.setBitmapData( bitmapData );
			}
		}

		/**
		 *
		 *2015/10/30
		 */
		public static create( bitmapData?:any ):RM.Texture {
			return new RM.Texture( bitmapData );
		}

		public setBitmapData( value:any ):void {
			this._bitmapData = value;
			this._sourceW = value.width;
			this._sourceH = value.height;
			this._textureW = this._sourceW * RM.GlobalConfig.TEXTURE_SCALE;
			this._textureH = this._sourceH * RM.GlobalConfig.TEXTURE_SCALE;
			this._bitmapW = this._textureW;
			this._bitmapH = this._textureH;
			this._offsetX = this._offsetY = this._bitmapX = this._bitmapY = 0;
		}

		/**纹理渲染宽度（图像裁剪后的实际高度，比_bitmapW大，图像则被拉伸，反之图像则被缩小）*/
		public get textureW():number {
			return this._textureW;
		}

		/**纹理渲染高度（图像裁剪后的实际高度，比_bitmapH大，图像则被拉伸，反之图像则被放小）*/
		public get textureH():number {
			return this._textureH;
		}

		/**表示这个纹理从 bitmapData 上裁剪的宽度*/
		public get bitmapW():number {
			return this._bitmapW;
		}

		/**表示这个纹理在 bitmapData 上裁剪的高度*/
		public get bitmapH():number {
			return this._bitmapH;
		}

		/**表示这个纹理从 bitmapData 上的 x 位置开始裁剪*/
		public get bitmapX():number {
			return this._bitmapX;
		}

		/**表示这个纹理从 bitmapData 上的 y 位置开始裁剪*/
		public get bitmapY():number {
			return this._bitmapY;
		}

		/**bitmapData原始宽度*/
		public get sourceW():number {
			return this._sourceW;
		}

		/**bitmapData原始高度*/
		public get sourceH():number {
			return this._sourceH;
		}

		/**表示这个纹理显示了之后在 画布 x 方向的渲染偏移量*/
		public get offsetX():number {
			return this._offsetX;
		}

		/**表示这个纹理显示了之后在 画布 y 方向的渲染偏移量*/
		public get offsetY():number {
			return this._offsetY;
		}

		public drawForCanvas( context:any, sourceX:number, sourceY:number, sourceW:number, sourceH:number,
							  destX:number, destY:number, destW:number, destH:number, renderType?:string ):void {
			var bitmapData:any = this._bitmapData;
			if ( ! bitmapData || ! bitmapData[ "loadComplete" ] ) {
				return;
			}
			if ( renderType ) {
				this.drawRepeatImageForCanvas( context, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH, renderType );
			}
			else {
				context.drawImage( bitmapData, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH );
			}
		}

		/**
		 * 重复绘制image到画布，渲染类型可选renderType：<br>
		 * （repeat：默认。该模式在水平和垂直方向重复。铺满画布<br>
		 *  repeat-x：该模式只在水平方向重复。横向铺满<br>
		 *  repeat-y：该模式只在垂直方向重复。纵向铺满<br>
		 *  no-repeat：该模式只显示一次（不重复）。）
		 */
		private drawRepeatImageForCanvas( context:any, sourceX:number, sourceY:number, sourceW:number, sourceH:number,
										  destX:number, destY:number, destW:number, destH:number, renderType:string ):void {
			var bitmapData:any = this._bitmapData;
			var img:any = bitmapData;
			if ( bitmapData.width != sourceW || bitmapData.height != sourceH || GlobalConfig.TEXTURE_SCALE != 1 ) {
				var sw:number = sourceW * RM.GlobalConfig.TEXTURE_SCALE;
				var sh:number = sourceH * RM.GlobalConfig.TEXTURE_SCALE;
				var canvas:any = document.createElement( "canvas" );
				canvas.width = sw;
				canvas.height = sh;
				var ctx:any = canvas.getContext( "2d" );
				ctx.drawImage( bitmapData, sourceX, sourceY, sourceW, sourceH, 0, 0, sw, sh );
				img = ctx;
			}
			var pattern:any = context.createPattern( img, renderType );
			context.fillStyle = pattern;
			context.translate( destX, destY );//移动到（destX，destY）位置准备绘制
			context.fillRect( 0, 0, destW, destH );//绘制被填充的矩形
			context.translate( - destX, - destY );//绘制完毕，还原到上次的位置
		}

		public clone():RM.Texture {
			var texture:RM.Texture = new RM.Texture();
			texture._bitmapData = this._bitmapData;
			return texture;
		}

		public dispose():void {
		}

		/**
		 * 通过url，创建bitmapdata纹理<br>
		 * url：资源路径<br>
		 * callback：加载完成或加载失败回调函数，包含｛是否成功（0成功、1失败），bitmapData对象｝<br>
		 * return
		 */
		public static createBitmapData( url:string, callback:Function ):void {
			var bitmapdata:any = this._bitmapDataFactoryMap[ url ];
			if ( ! bitmapdata ) {
				bitmapdata = document.createElement( "img" );
				bitmapdata.setAttribute( "bitmapUrl", url );
				Texture._bitmapDataFactoryMap[ url ] = bitmapdata;
			}
			if ( bitmapdata[ "loadComplete" ] ) {
				callback( 0, bitmapdata );
				return;
			}
			if ( this._bitmapDataCallBackMap[ url ] == null ) {
				this.addToBitmapDataCallBackMap( url, callback );
				//the first loader
				bitmapdata.onload = function () {
					Texture.onloadResult( 0, url, bitmapdata );
				}
				bitmapdata.onerror = function () {
					Texture.onloadResult( 1, url, bitmapdata );
				}
				bitmapdata.src = url;
			}
			else {
				this.addToBitmapDataCallBackMap( url, callback );
			}
		}

		/**
		 *通过url获取缓存中的纹理，如果未加载则返回null
		 *2015/10/30
		 */
		public static getTexture( url:string ):RM.Texture {
			var bitmapdata:any = this._bitmapDataFactoryMap[ url ];
			if ( bitmapdata && bitmapdata[ "loadComplete" ] ) {
				return RM.Texture.create( bitmapdata );
			}
			return null;
		}

		private static onloadResult( result:number, url:string, bitmapData:any ):void {
			if ( result < 1 ) {
				bitmapData[ "loadComplete" ] = true;
			}
			if ( bitmapData.onload ) bitmapData.onload = null;
			if ( bitmapData.onerror ) bitmapData.onerror = null;
			var list = this._bitmapDataCallBackMap[ url ];
			var len:number = list.length;
			if ( list && ( len > 0 ) ) {
				delete this._bitmapDataCallBackMap[ url ];
				var callback:Function;
				for ( var index = 0; index < len; index ++ ) {
					callback = list[ index ];
					callback( result, bitmapData );
				}
			}
		}

		public static addToBitmapDataCallBackMap( url:string, callback:Function ):void {
			var list = this._bitmapDataCallBackMap[ url ];
			if ( list == null ) {
				list = [];
			}
			list.push( callback );
			this._bitmapDataCallBackMap[ url ] = list;
		}
	}
}
