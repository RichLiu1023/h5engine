///<reference path="../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/31.
 */
module RM {
	/**
	 *SpriteSheet是由一个或者多个子图拼合成的纹理图集<br>
	 *     图集只存在一份，所有SpriteSheet共享数据，所有子项渲染到画布上的偏移位置不同而已<br>
	 *
	 *2015/10/31
	 *Rich
	 */
	export class SpriteSheet extends RM.HashObject {
		/** 纹理图集 **/
		private _texture:RM.Texture;
		/** 纹理图集JSON **/
		private _textureJSON:RM.JsonTextureFile;
		/** 纹理列表 **/
		private _textureMap:any = {};

		public constructor( texture:RM.Texture, textureJSON:RM.JsonTextureFile ) {
			super();
			this._texture = texture;
			this._textureJSON = textureJSON;
		}

		/**
		 *
		 *2015/10/31
		 */
		public static create( texture:RM.Texture, textureJSON:RM.JsonTextureFile ):RM.SpriteSheet {
			return new RM.SpriteSheet( texture, textureJSON );
		}

		/**
		 * 通过URL创建
		 * @param textureUrl
		 * @param textureJSONUrl
		 * @returns {RM.SpriteSheet}
		 */
		public static createByUrl( textureUrl:string, textureJSONUrl:string ):RM.SpriteSheet {
			var tex:RM.Texture = RM.Texture.getTexture( textureUrl );
			var obj:RM.JsonAnalyzer = RM.JsonAnalyzer.getJsonAnalyzer( textureJSONUrl );
			return new RM.SpriteSheet( tex, obj.getJsonTextureFile() );
		}

		/**
		 *通过名字获取纹理
		 *2015/10/31
		 */
		public getTexture( name:string ):RM.Texture {
			if ( ! name || name.length <= 0 ) return null;
			var texture:RM.Texture = this._textureMap[ name ];
			if ( ! texture ) {
				var frame:RM.JsonFrame = this._textureJSON.getJsonFrameformName( name );
				if ( ! frame ) return null;
				texture = this.createTexture( name, frame.x, frame.y, frame.w, frame.h );
			}
			return texture;
		}

		/**
		 * @param name
		 * @param bitmapX  表示这个纹理从 bitmapData 上的 x 位置开始裁剪
		 * @param bitmapY  表示这个纹理从 bitmapData 上的 y 位置开始裁剪
		 * @param bitmapWidth 表示这个纹理从 bitmapData 上裁剪的宽度
		 * @param bitmapHeight  表示这个纹理在 bitmapData 上裁剪的高度
		 * @param offsetX 表示这个纹理显示了之后在 画布 x 方向的渲染偏移量
		 * @param offsetY 表示这个纹理显示了之后在 画布 y 方向的渲染偏移量
		 * @param textureWidth  纹理渲染宽度（图像裁剪后的实际高度，比_bitmapW大，图像则被拉伸，反之图像则被缩小），若不传入，则使用 bitmapWidth 的值。
		 * @param textureHeight 纹理渲染高度（图像裁剪后的实际高度，比_bitmapH大，图像则被拉伸，反之图像则被放小），若不传入，则使用 bitmapHeight 的值。
		 *2015/10/31
		 */
		public createTexture( name:string, bitmapX:number, bitmapY:number, bitmapWidth:number, bitmapHeight:number,
							  offsetX:number = 0, offsetY:number = 0, textureWidth?:number, textureHeight?:number ):RM.Texture {
			if ( ! textureWidth ) {
				textureWidth = bitmapWidth;
			}
			if ( ! textureHeight ) {
				textureHeight = bitmapHeight;
			}
			var texture:RM.Texture = this._texture.clone();
			texture._bitmapX = bitmapX;
			texture._bitmapY = bitmapY;
			texture._bitmapW = bitmapWidth * RM.GlobalConfig.TEXTURE_SCALE;
			texture._bitmapH = bitmapHeight * RM.GlobalConfig.TEXTURE_SCALE;
			texture._offsetX = offsetX;
			texture._offsetY = offsetY;
			texture._textureW = textureWidth * RM.GlobalConfig.TEXTURE_SCALE;
			texture._textureH = textureHeight * RM.GlobalConfig.TEXTURE_SCALE;
			texture._sourceW = this._texture._sourceW;
			texture._sourceH = this._texture._sourceH;
			this._textureMap[ name ] = texture;
			return texture;
		}
	}
}