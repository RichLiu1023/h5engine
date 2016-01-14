/**
 * Created by Rich on 2015/12/10.
 */
///<reference path="DisplayObject.ts"/>
module RM {
	export class MovieClip extends RM.DisplayObject {
		/** 纹理集 **/
		private _spriteSheet:RM.SpriteSheet;
		/** 当前播放的bitmap **/
		private _currentTexture:RM.Texture;
		/** 当前帧 **/
		private _currentFrame:number = 0;
		/** 当前播放的label **/
		private _currentLabel:string;
		/** 帧频 **/
		private _frameRate:number = 1;
		/** 总帧数 **/
		private _totalFrames:number = 0;
		/** 播放次数 **/
		private _playTimes:number = 0;
		/** 已播放次数 **/
		private _playedTimes:number = 0;
		/** 计数器 **/
		private _tick:number = 0;
		/** 是否暂停 **/
		private _ispause:boolean = false;
		/** 帧列表 **/
		private _frameList = {};

		public constructor( spriteSheet:RM.SpriteSheet ) {
			super();
			this.setName( "MovieClip" );
			this.setNeedDraw( true );
			this.setSpriteSheet( spriteSheet );
		}

		public get currentFrame():number {
			return this._currentFrame;
		}

		public get currentLabel():string {
			return this._currentLabel;
		}

		public get frameRate():number {
			return this._frameRate;
		}

		public get totalFrames():number {
			return this._totalFrames;
		}

		public get playTimes():number {
			return this._playTimes;
		}

		public get playedTimes():number {
			return this._playedTimes;
		}

		public get ispause():boolean {
			return this._ispause;
		}

		/**
		 * 设置纹理集，如果已设置过setPlayLable那么会从当前帧
		 * @param spriteSheet
		 */
		public setSpriteSheet( spriteSheet:RM.SpriteSheet ):void {
			this._spriteSheet = spriteSheet;
			this._frameList = {};
			if ( this._currentLabel ) {
				this.parseSpriteSheet();
			}
		}

		/**
		 * 设置要播放的标签,会重新开始播放
		 * @param label
		 * @param time 秒值
		 */
		public setPlayLable( label:string, time:number ):void {
			this._currentLabel = label;
			this._frameRate = Math.ceil( time * 1000 / (1000 / RM.GlobalConfig.FRAME_RATE) );
			this.parseSpriteSheet();
			this._readyPlay();
		}

		public parseSpriteSheet():void {
			if ( ! this._spriteSheet )return;
			if ( ! this._currentLabel )return;
			if ( this._frameList.hasOwnProperty( this._currentLabel ) ) return;
			var idx:number = 0;
			var list:Array<RM.Texture> = [];
			var texture:RM.Texture;
			var label:string;
			while ( true ) {
				label = this._currentLabel + idx;
				++ idx;
				texture = this._spriteSheet.getTexture( label );
				if ( texture ) list.push( texture );
				else break;
			}
			if ( list.length > 0 ) {
				this._frameList[ this._currentLabel ] = list;
				this._totalFrames = list.length;
			}
		}

		/**
		 * 是否可以播放
		 * @returns {boolean}
		 */
		public isCanPlay():boolean {
			if ( ! this._spriteSheet )return false;
			if ( ! this._currentLabel )return false;
			if ( ! this._frameList )return false;
			if ( this._totalFrames <= 0 )return false;
			return true;
		}

		/**
		 * 播放准备
		 * @returns {boolean}
		 * @private
		 */
		private _readyPlay():boolean {
			this._tick = 0;
			this._currentFrame = 0;
			if ( this.isCanPlay() == false ) {
				RM.Log.warning( "MovieClip._readyPlay()数据错误，可能没有初始化，准备播放失败！" );
				return false;
			}
			return true;
		}

		/**
		 * 播放
		 * @param times
		 */
		public play( times:number = 0 ):void {
			if ( this._readyPlay() == false )return;
			this._playTimes = times;
			this._ispause = false;
			this.addEventListener( RM.Event.ENTER_FRAME, this.enterFrame, this );
		}

		/**
		 * 暂停
		 */
		public pause():void {
			this._ispause = true;
		}

		/**
		 * 恢复播放，只有在暂停的情况下 才可以继续播放
		 */
		public replay():void {
			if ( this._ispause == false )return;
			if ( this.isCanPlay() == false ) {
				RM.Log.warning( "MovieClip.replay()数据错误，可能没有初始化，播放失败！" );
				return;
			}
			this._ispause = false;
		}

		/**
		 * 停止
		 */
		public stop():void {
			this._ispause = false;
			this.removeEventListener( RM.Event.ENTER_FRAME, this.enterFrame, this );
		}

		/**
		 * 下一帧
		 */
		public nextFrame():void {
			if ( this._currentFrame >= this._totalFrames ) {
				this._playedTimes ++;
				if ( this._playTimes != 0 && this._playedTimes >= this._playTimes ) {
					this.stop();
					return;
				}
				this._currentFrame = 0;
			}
			this._$setDirty();
			if( this._frameList.hasOwnProperty( this._currentLabel ) )
			{
				this._currentTexture = this._frameList[ this._currentLabel ][ this._currentFrame ];
			}
			this._currentFrame ++;
		}

		private enterFrame( dt:number ):void {
			if ( this._ispause )return;
			if ( this._tick >= this._frameRate ) {
				this._tick = 0;
				this.nextFrame();
			}
			this._tick ++;
		}

		public _$render( context:RM.RenderContext ):void {
			var texture:RM.Texture = this._currentTexture;
			if ( ! texture ) {
				this._$texture_to_render = null;
				return;
			}
			var destW:number = this._DOP_Property._hasWidthSet ? this.getWidth() : texture.textureW;
			var destH:number = this._DOP_Property._hasHeightSet ? this.getHeight() : texture.textureH;
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
			var texture:RM.Texture = this._currentTexture;
			if ( ! texture ) {
				return super._$realBounds();
			}
			return this._$rect.resetToValue( 0, 0, texture.textureW, texture.textureH );
		}
	}
}