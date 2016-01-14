///<reference path="DisplayObject.ts"/>
module RM {
	/**
	 *
	 * @author
	 *
	 */
	export class Bitmap extends RM.DisplayObject {
		private _texture:RM.Texture;
		private _fillMode:string = RM.BitmapFillMode.SCALE;

		public constructor( value?:RM.Texture ) {
			super();
			this.setName( "Bitmap" );
			this.setNeedDraw( true );
			if ( value ) {
				this.setTexture( value );
			}
		}

		/**
		 *
		 *2015/10/30
		 */
		public static create( value?:RM.Texture ):RM.Bitmap {
			return new RM.Bitmap( value );
		}

		public setTexture( value:RM.Texture ):RM.Bitmap {
			if ( value == this._texture ) return this;
			this._texture = value;
			this._$setDirty();
			return this;
		}

		public getTexture():RM.Texture {
			return this._texture;
		}

		public _$render( context:RM.RenderContext ):void {
			var texture:RM.Texture = this._texture;
			if ( ! texture ) {
				this._$texture_to_render = null;
				return;
			}
			this._$texture_to_render = texture;
			var destW:number = this._DOP_Property._hasWidthSet ? this.getWidth() : texture.textureW;
			var destH:number = this._DOP_Property._hasHeightSet ? this.getHeight() : texture.textureH;
			RM.Bitmap._drawBitmap( context, destW, destH, this );
		}

		public static _drawBitmap( context:RM.RenderContext, destW:number, destH:number, thisObject:RM.Bitmap ):void {
			var texture:RM.Texture = thisObject._$texture_to_render;
			if ( ! texture ) return;
			var tw:number = texture.textureW;
			var th:number = texture.textureH;
			var offsetx:number = texture.offsetX;
			var offsety:number = texture.offsetY;
			var bitmapw:number = texture.bitmapW || tw;
			var bitmaph:number = texture.bitmapH || th;
			var scalex:number = destW / tw;
			var scaley:number = destH / th;
			offsetx = offsetx * scalex;
			offsety = offsety * scaley;
			destW = bitmapw * scalex;
			destH = bitmaph * scaley;
			context.drawImage( texture, texture.bitmapX, texture.bitmapY, bitmapw, bitmaph, offsetx, offsety, destW, destH );
		}

		/** 重写父类方法，计算真实边界 */
		public _$realBounds():RM.Rectangle {
			var texture:RM.Texture = this._texture;
			if ( ! texture ) {
				return super._$realBounds();
			}
			return this._$rect.resetToValue( 0, 0, texture.textureW, texture.textureH );
		}
	}
}
