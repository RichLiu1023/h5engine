///<reference path="../events/EventDispatcher.ts"/>
module RM {
	/**
	 * 显示对象的基类，在显示列表树中属于叶节点
	 * @author
	 *
	 */
	export class DisplayObject extends RM.EventDispatcher {
		protected _DOP_Property:RM.DOProtection;
		/**渲染对象*/
		public _$texture_to_render:RM.Texture = null;
		/**全局transform属性*/
		public _$globalTransform:RM.Matrix;
		/**全局透明度属性*/
		public _$globalAlpha:number;
		/** 用于引擎内部计算 **/
		protected _$matrix:RM.Matrix = new RM.Matrix();
		/** 用于引擎内部计算 **/
		protected _$rect:RM.Rectangle = new RM.Rectangle();
		/** 旧的矩形位置，记录下一次改变之前的位置，用于清除自己的位置，以便脏矩形渲染 **/
		public _$againRect:RM.Rectangle = new RM.Rectangle();
		/**缓存位图*/
		private _$renderTexture:RM.RenderTexture;
		/** 在引擎处于渲染阶段时，只计算一次边界范围，减少计算量 **/
		private _$cacheBound:RM.Rectangle = new RM.Rectangle();
		/** 是否需要重新计算边界 **/
		private _$isChangeBound:Boolean = true;

		public constructor() {
			super();
			this._DOP_Property = new RM.DOProtection();
			this.setName( "DisplayObject" );
			this._$globalTransform = new RM.Matrix();
			this._$globalAlpha = 1;
		}

//=============================================Event Function=======================================================			
		/**添加监听事件(自动排除重复添加的监听：type、listener、thisObject相同则不再添加)<br>
		 * type：事件类型<br>
		 * listener：事件回调函数<br>
		 * thisObject：事件回调函数的this对象<br>
		 * useCupture：是否运行于捕获还是运行与目标或冒泡阶段<br>
		 * priority:事件的优先级，默认为0，数字越大优先级越高；
		 * */
		public addEventListener( type:string, listener:Function, thisObject:any, useCupture:boolean = false, priority:number = 0 ):void {
			if ( type == RM.Event.ENTER_FRAME ) {
				this.insertEventToList( RM.MainContext.ENTER_FRAME_CALLBACK_LIST, type, listener, thisObject, priority );
			}
			else {
				super.addEventListener( type, listener, thisObject, useCupture, priority );
			}
		}
		
		/**删除事件监听器<br>
		 * type：事件类型<br>
		 * listener：事件回调函数<br>
		 * thisObject：事件回调函数的this对象<br>
		 * useCupture：是否运行于捕获还是运行与目标或冒泡阶段，由于捕获与目标及冒泡的事件列表是分离开的，
		 * 因此谨慎起见必须确定事件是否在捕获事件列表中<br>
		 * */
		public removeEventListener( type:string, listener:Function, thisObject:any, useCapture:boolean = false ):void {
			if ( type == RM.Event.ENTER_FRAME ) {
				this.removeEventForList( RM.MainContext.ENTER_FRAME_CALLBACK_LIST, type, listener, thisObject );
			}
			else {
				super.removeEventListener( type, listener, thisObject, useCapture );
			}
		}
		
		/**派发事件，此事件接收一个RM.Event 对象<br>
		 * */
		public dispatchEvent( event:RM.Event ):boolean {
			if ( ! event._bubbles ) {
				return super.dispatchEvent.call( this, event );
			}
			var list:Array<RM.DisplayObject> = [];
			var target:RM.DisplayObject = this;
			while ( target ) {
				list.push( target );
				target = target._DOP_Property._parent;
			}
			this._displayPropagationEvent( event, list );
			return true;
		}
		
		/**
		 * 事件流开始派发事件<br>
		 * 根据事件流的三个阶段进行响应
		 * */
		private _displayPropagationEvent( event:RM.Event, list:Array<RM.DisplayObject> ):void {
			var len:number = list.length;
			//第一阶段---捕获
			var eventPhase:string = RM.EventPhase.CAPTURE_PHASE;
			var currentTarget:RM.DisplayObject;
			while ( len -- > 0 ) {
				currentTarget = list[ len ];
				event._currentTarget = currentTarget;
				event._target = this;
				event._eventPhase = eventPhase;
				currentTarget._$notifyListener( event );
				if ( event.isPropagationStopped || event.isPropagationImmediateStopped ) {
					return;
				}
			}
			//第二阶段---目标
			eventPhase = RM.EventPhase.TARGET_PHASE;
			currentTarget = list[ 0 ];
			event._currentTarget = currentTarget;
			event._target = this;
			event._eventPhase = eventPhase;
			currentTarget._$notifyListener( event );
			if ( event.isPropagationStopped || event.isPropagationImmediateStopped ) {
				return;
			}
			//第三阶段---冒泡
			eventPhase = RM.EventPhase.BUBBLE_PHASE;
			len = list.length;
			//目标阶段已经触发过一次后，冒泡从索引1开始向上冒泡
			for ( var idx:number = 1; idx < len; idx ++ ) {
				currentTarget = list[ idx ];
				event._currentTarget = currentTarget;
				event._target = this;
				event._eventPhase = eventPhase;
				currentTarget._$notifyListener( event );
				if ( event.isPropagationStopped || event.isPropagationImmediateStopped ) {
					return;
				}
			}
		}

//=============================================Get Function=======================================================
		public getName():string {
			return this._DOP_Property._name;
		}
		
		public getX():number {
			return this._DOP_Property._x;
		}
		
		public getY():number {
			return this._DOP_Property._y;
		}
		
		public getWidth():number {
			return this._$getSize().width;
		}
		
		public getHeight():number {
			return this._$getSize().height;
		}
		
		public getAlpha():number {
			return this._DOP_Property._alpha;
		}
		
		public getIsContainer():boolean {
			return this._DOP_Property._isContainer;
		}
		
		public getVisible():boolean {
			return this._DOP_Property._visible;
		}
		
		public getParent():RM.DisplayObjectContainer {
			return this._DOP_Property._parent;
		}
		
		public getNeedDraw():boolean {
			return this._DOP_Property._needDraw;
		}
		
		public getSkewX():number {
			return this._DOP_Property._skewX;
		}
		
		public getSkewY():number {
			return this._DOP_Property._skewY;
		}
		
		public getScaleX():number {
			return this._DOP_Property._scaleX;
		}
		
		public getScaleY():number {
			return this._DOP_Property._scaleY;
		}
		
		public getRotate():number {
			return this._DOP_Property._rotate;
		}
		
		public getCacheAsBitmap():boolean {
			return this._DOP_Property._cacheAsBitmap;
		}
		
		public getStage():RM.Stage {
			return this._DOP_Property._stage;
		}
		
		/**
		 * 获取是否可以触摸
		 * */
		public getTouchEnabled():boolean {
			return this._DOP_Property._touchEnabled;
		}
		
		/**
		 *是否已脏
		 *15/10/25
		 */
		public getDirty():boolean {
			return this._DOP_Property._isDirty;
		}

		/**
		 *
		 *获取滚动矩形，遮罩矩形
		 */
		public getScrollRect():RM.Rectangle {
			return this._DOP_Property._scrollRect;
		}

//=============================================Set Function=======================================================
		public setName( value:string ):RM.DisplayObject {
			if ( this._DOP_Property._name != value ) {
				this._DOP_Property._name = value;
			}
			return this;
		}
		
		public setParent( value:DisplayObjectContainer ):RM.DisplayObject {
			if ( this._DOP_Property._parent != value ) {
				this._DOP_Property._parent = value;
			}
			return this;
		}
		
		/**强制每帧执行渲染*/
		public setNeedDraw( value:boolean ):RM.DisplayObject {
			if ( this._DOP_Property._needDraw != value ) {
				this._DOP_Property._needDraw = value;
			}
			return this;
		}
		
		public setWidth( value:number ):RM.DisplayObject {
			if ( this._DOP_Property._width != value ) {
				this._DOP_Property._width = value;
				this._DOP_Property._hasWidthSet = true;
				this._DOP_Property._hasSize = true;
				this._$setDirty();
			}
			return this;
		}
		
		public setHeight( value:number ):RM.DisplayObject {
			if ( this._DOP_Property._height != value ) {
				this._DOP_Property._height = value;
				this._DOP_Property._hasHeightSet = true;
				this._DOP_Property._hasSize = true;
				this._$setDirty();
			}
			return this;
		}
		
		public setSize( w:number, h:number ):RM.DisplayObject {
			this.setWidth( w );
			this.setHeight( h );
			return this;
		}
		
		public setX( value:number ):RM.DisplayObject {
			if ( this._DOP_Property._x != value ) {
				this._DOP_Property._x = value;
				this._$setDirty();
			}
			return this;
		}
		
		public setY( value:number ):RM.DisplayObject {
			if ( this._DOP_Property._y != value ) {
				this._DOP_Property._y = value;
				this._$setDirty();
			}
			return this;
		}
		
		public setPoint( x:number, y:number ):RM.DisplayObject {
			this.setX( x );
			this.setY( y );
			return this;
		}

		/**X轴斜切，以角度为单位*/
		public setSkewX( value:number ):RM.DisplayObject {
			if ( this._DOP_Property._skewX != value ) {
				this._DOP_Property._skewX = value;
				this._$setDirty();
			}
			return this;
		}
		
		/**Y轴斜切，以角度为单位*/
		public setSkewY( value:number ):RM.DisplayObject {
			if ( this._DOP_Property._skewY != value ) {
				this._DOP_Property._skewY = value;
				this._$setDirty();
			}
			return this;
		}
		
		/**X轴缩放*/
		public setScaleX( value:number ):RM.DisplayObject {
			if ( this._DOP_Property._scaleX != value ) {
				this._DOP_Property._scaleX = value;
				this._$setDirty();
			}
			return this;
		}
		
		/**Y轴缩放*/
		public setScaleY( value:number ):RM.DisplayObject {
			if ( this._DOP_Property._scaleY != value ) {
				this._DOP_Property._scaleY = value;
				this._$setDirty();
			}
			return this;
		}
		
		/**旋转，单位为角度*/
		public setRotate( value:number ):RM.DisplayObject {
			if ( this._DOP_Property._rotate != value ) {
				this._DOP_Property._rotate = value;
			}
			return this;
		}
		
		/**透明度，此值为0~1之间的值*/
		public setAlpha( value:number ):RM.DisplayObject {
			if ( this._DOP_Property._alpha != value ) {
				this._DOP_Property._alpha = value;
				this._$setDirty();
			}
			return this;
		}
		
		/**是否显示*/
		public setVisible( value:boolean ):RM.DisplayObject {
			if ( this._DOP_Property._visible != value ) {
				this._DOP_Property._visible = value;
			}
			return this;
		}

		/**设置遮罩矩形，滚动矩形，设置为null则取消遮罩矩形*/
		public setScrollRect( value:RM.Rectangle ):RM.DisplayObject {
			if ( value ) {
				if ( this._DOP_Property._scrollRect == null ) {
					this._DOP_Property._scrollRect = value;
					this._$setDirty();
				}
				else if ( this._DOP_Property._scrollRect.equals( value ) == false ) {
					this._DOP_Property._scrollRect.resetToRect( value );
					this._$setDirty();
				}
			}
			else {
				this._DOP_Property._scrollRect = null;
				this._$setDirty();
			}
			return this;
		}

		/**是否缓存为位图*/
		public setCacheAsBitmap( value:boolean ):RM.DisplayObject {
			if ( this._DOP_Property._cacheAsBitmap != value ) {
				this._DOP_Property._cacheAsBitmap = value;
				if ( value ) {
//                    this._madeBitmapCache();
				}
				else {
					this._$texture_to_render = null;
				}
				this._$setDirty();
			}
			return this;
		}
		
		/**
		 * 设置是否可以触摸
		 * */
		public setTouchEnabled( value:boolean ) {
			if ( this._DOP_Property._touchEnabled != value ) {
				this._DOP_Property._touchEnabled = value;
			}
		}
		
		/** 引擎内部调用，在从舞台删除后调用，清空stage属性 */
		public _$clearStage():void {
			this._DOP_Property._stage = null;
		}
		
		/** 显示对象加入舞台，引擎内部调用 */
		public _$onAddToStage():void {
			this._DOP_Property._stage = RM.MainContext.getInstance().stage;
			RM.MainContext.ADD_TO_STAGE_CALLBACK_LIST.push( this );
		}
		
		/** 显示对象从舞台中移除，引擎内部调用 <br>
		 * 在移除回调时，stage属性会不设置为null，回调结束才置null
		 * */
		public _$onRemoveFormStage():void {
			RM.MainContext.REMOVE_FORM_STAGE_CALLBACK_LIST.push( this );
		}

		/**
		 *设置为脏
		 *2015/11/4
		 *Rich
		 */
		public _$setDirty():void {
			this._DOP_Property._isDirty = true;
			this._$isChangeBound = true;
		}

		/**
		 *清理脏
		 *2015/11/4
		 *Rich
		 */
		public _$clearDirty():void {
			this._DOP_Property._isDirty = false;
		}
		
		/**
		 *添加到RM.DisplayObjectContainer，并返回自己
		 *15/10/30
		 */
		public addTo( parent:RM.DisplayObjectContainer ):RM.DisplayObject {
			if ( parent ) {
				parent.addChild( this );
			}
			return this;
		}

//=============================================Render Function=======================================================
		/**子类实现的渲染接口，子类在此接口调用自己的draw函数，以渲染到canvas*/
		public _$render( renderContext:RM.RenderContext ):void {
		}
		
		/**渲染前准备渲染的各种数据，如透明度、transform等数据，在此函数调用_render函数*/
		public _$draw( renderContext:RM.RenderContext ):void {
			var self:RM.DisplayObject = this;
			if ( ! self._DOP_Property._visible ) return;
			if ( self._drawCacheTexture( renderContext ) ) return;
			renderContext.setAlpha( self._$globalAlpha );
			renderContext.setTransform( self._$globalTransform );
			var isMask:boolean = self._DOP_Property._scrollRect && self._DOP_Property._isContainer;
			if ( isMask ) {
				renderContext.pushMaskRect( self._DOP_Property._scrollRect );
			}
			self._$render( renderContext );
			if ( isMask ) {
				renderContext.popMaskRect();
			}
		}
		
		private _drawCacheTexture( renderContext:RM.RenderContext ):boolean {
			var self:RM.DisplayObject = this;
			if ( ! self._DOP_Property._cacheAsBitmap ) return false;
			//以下判断为：是否要重新绘制缓存图形
			var bounds:RM.Rectangle = self._$getBounds( self._$rect );
			if ( self._$texture_to_render == null || bounds.width - self._$texture_to_render.textureW >= 1 && bounds.height - self._$texture_to_render.textureH >= 1 ) {
				self._madeBitmapCache();
			}
			//生成失败
			if ( self._$texture_to_render == null ) return false;
			self._$updateTransform();
			renderContext.setAlpha( self._$globalAlpha );
			renderContext.setTransform( self._$globalTransform );
			renderContext.drawImage( self._$texture_to_render, 0, 0, self._$texture_to_render.textureW, self._$texture_to_render.textureH,
				self._$texture_to_render.offsetX, self._$texture_to_render.offsetY, self._$texture_to_render.textureW, self._$texture_to_render.textureH );
			return true;
		}
		
		/**制作缓存图像*/
		private _madeBitmapCache():boolean {
			if ( ! this._$renderTexture ) {
				this._$renderTexture = RM.RenderTexture.createRenderTexture();
			}
			var result:boolean = this._$renderTexture.drawToTexture( this );
			this._$texture_to_render = result ? this._$renderTexture : null;
			return result;
		}

		/**
		 *更新全局属性，并判断是否需要渲染
		 *2015/11/4
		 *Rich
		 */
		public _$updateTransform():void {
			var self:RM.DisplayObject = this;
			if ( ! self._DOP_Property._visible ) return;
			self._updateGlobalTransform();
			//绘制缓存位图时，不需要判断脏矩形
			if ( RM.MainContext.USE_CACHE_DRAW == false ) {
				if ( this._isNeedRender() == false ) return;
			}
			if ( self.getNeedDraw() || self._$texture_to_render || self._DOP_Property._cacheAsBitmap ) {
				RM.RenderCommand.push( self._$draw, self );
			}
		}
		
		/**
		 *是否需要绘制，脏矩形的判断，如果去掉则全部绘制
		 *2015/11/3
		 */
		private _isNeedRender():boolean {
			if ( RM.MainContext.RENDER_PHASE == RM.RenderLoopPhase.UPDATE_TRANSFORM_PHASE ) {
				if ( RM.GlobalConfig.IS_OPEN_DIRTY ) {
					if ( RM.RenderFilter.getInstance().isFullScreenRender ) return true;
					var rect:RM.Rectangle = this._$getBounds( this._$rect );
					rect = RM.GFunction.getTransformRectangle( rect, this._$globalTransform );
					if ( this._$againRect.isEmpty() ) {
						this._$againRect.resetToRect( rect );
					}
					if ( RM.RenderFilter.getInstance().isHasDrawAreaList( rect ) ) {
						return true;
					}
				}
			}
			return false;
		}
		
		/**
		 *更新全局属性
		 *2015/11/4
		 *Rich
		 */
		private _updateGlobalTransform():void {
			var self:RM.DisplayObject = this;
			var dop:RM.DOProtection = this._DOP_Property;
			var transform:RM.Matrix = self._$globalTransform;
			var parent:RM.DisplayObjectContainer = dop._parent;
			transform.copyMatrix( parent._$globalTransform );
			//混合变换矩阵
			transform.rightTransform( dop._x, dop._y, dop._scaleX, dop._scaleY, dop._skewX, dop._skewY, dop._rotate );
			if ( self._DOP_Property._scrollRect ) {
				transform.rightMultiply( 1, 0, 0, 1, - self._DOP_Property._scrollRect.x, - self._DOP_Property._scrollRect.y );
			}
			//混合透明度
			self._$globalAlpha = parent._$globalAlpha * dop._alpha;
		}
		
		/**获取变换矩阵
		 * 可以传入一个矩阵与self属性叠加，返回叠加矩阵
		 * */
		public getMatrix( matrix?:RM.Matrix ):RM.Matrix {
			if ( ! matrix ) {
				matrix = this._$matrix;
			}
			matrix.reset();
			var dop:RM.DOProtection = this._DOP_Property;
			matrix.rightTransform( dop._x, dop._y, dop._scaleX, dop._scaleY, dop._skewX, dop._skewY, dop._rotate );
			return matrix;
		}
		
		/**
		 *检测脏矩形
		 *15/10/25
		 */
		public _$checkDirtyRectangle():void {
		}

//=========================================================Function=================================================================
		/**合并所有父代全局tansform综合属性*/
		public getConcatenatedMatrix():RM.Matrix {
			var matrix:RM.Matrix = this._$matrix;
			matrix.reset();
			var self:RM.DisplayObject = this;
			var dop:RM.DOProtection;
			while ( self != null ) {
				dop = self._DOP_Property;
				matrix.leftTransform( dop._x, dop._y, dop._scaleX, dop._scaleY, dop._skewX, dop._skewY, dop._rotate );
				if ( dop._scrollRect ) {
					matrix.rightMultiply( 1, 0, 0, 1, - dop._scrollRect.x, - dop._scrollRect.y );
				}
				self = dop._parent;
			}
			return matrix;
		}
		
		/**本地坐标转换为全局坐标
		 * @param x:本地坐标x轴
		 * @param y:本地坐标y轴
		 * */
		public localToGlobal( x:number = 0, y:number = 0 ):RM.Point {
			var matrix:RM.Matrix = this.getConcatenatedMatrix();
			matrix.rightMultiply( 1, 0, 0, 1, x, y );
			var point:RM.Point = RM.Point.create( matrix.x, matrix.y );
			return point;
		}
		
		/**全局坐标转换为本地坐标
		 * @param x:全局坐标x轴
		 * @param y:全局坐标y轴
		 * */
		public globalToLocal( x:number = 0, y:number = 0 ):RM.Point {
			var matrix:RM.Matrix = this.getConcatenatedMatrix();
			matrix.invert();
			matrix.rightMultiply( 1, 0, 0, 1, x, y );
			var point:RM.Point = RM.Point.create( matrix.x, matrix.y );
			return point;
		}
		
		/**获取真实的边界，与显示边界不同，此方法根据子类的不同，需要子类实现重写*/
		public _$realBounds():RM.Rectangle {
			return this._$rect.resetToValue( 0, 0, 0, 0 );
		}
		
		/**获得显示边界（不包含x,y属性），不同于真实边界，不需要子类重写，此方法根据是否设置过显示宽高来决定返回的显示边界
		 * <br>后续增加描点功能
		 * @return 返回新的矩形
		 * */
		public _$getShowBounds( rect?:RM.Rectangle ):RM.Rectangle {
			if ( ! rect ) {
				rect = RM.Rectangle.create();
			}
			var self:RM.DisplayObject = this;
			rect.resetToRect( self._$realBounds() );
			var realW:number = self._DOP_Property._hasWidthSet ? self._DOP_Property._width : rect.width;
			var realH:number = self._DOP_Property._hasHeightSet ? self._DOP_Property._height : rect.height;
			self._DOP_Property._width = realW;
			self._DOP_Property._height = realH;
			this._DOP_Property._hasSize = false;
			rect.resetToValue( 0, 0, realW, realH );
			return rect;
		}

		/**
		 *获取显示范围（包含x,y属性），也就是有效的位置
		 *2015/11/16
		 */
		public _$getBounds( rect?:RM.Rectangle ):RM.Rectangle {
			if ( ! rect ) {
				rect = RM.Rectangle.create();
			}
			if ( this._$isChangeBound ) {
				var self:RM.DisplayObject = this;
				this._$cacheBound.resetToRect( self._$realBounds() );
				this._$cacheBound.width = self._DOP_Property._hasWidthSet ? self._DOP_Property._width : this._$cacheBound.width;
				this._$cacheBound.height = self._DOP_Property._hasHeightSet ? self._DOP_Property._height : this._$cacheBound.height;
				this._$isChangeBound = false;
			}
			rect.resetToRect( this._$cacheBound );
			return rect;
		}
		
		/**
		 * 获取宽高尺寸<br>
		 * 如果this._DOP_Property._hasSize 为true，则重新计算尺寸<br>
		 * 否则使用上一次计算的结果，以减少计算量。如果设置过宽高属性，则按设置的<br>
		 * 宽高属性返回。如果未设置过，则返回包含所有孩子的最大矩形尺寸。
		 * 注意：宽高属性与缩放属性单独分开。设置缩放属性不影响宽高属性，例如宽度为100时scaleX设置为0.5，<br>
		 * 则图像被缩放，但实际宽度依旧为100。
		 * */
		private _$getSize():RM.Rectangle {
			if ( this._DOP_Property._hasWidthSet && this._DOP_Property._hasHeightSet ) {
				return this._$rect.resetToValue( 0, 0, this._DOP_Property._width, this._DOP_Property._height );
			}
			this._$rect.reset();
			if ( this._DOP_Property._hasSize ) {
				return this._$getBounds( this._$rect );
			}
			else {
				this._$rect.width = this._DOP_Property._width;
				this._$rect.height = this._DOP_Property._height;
			}
			return this._$rect;
		}
		
		/**
		 * 指定舞台坐标是否在对象内
		 * @param isTouchEnabled 是否忽略touchEnabled属性，当容器类可触摸时，忽略子项的属性
		 * */
		public _$hitTest( targetX:number, targetY:number, isTouchEnabled:boolean = false ):RM.DisplayObject {
			var self:RM.DisplayObject = this;
			if ( ! self._DOP_Property._visible ) return null;
			if ( isTouchEnabled == false && ! self._DOP_Property._touchEnabled ) return null;
			var bound:RM.Rectangle = self._$getBounds( this._$rect );
			targetX -= bound.x;
			targetY -= bound.y;
			if ( bound.containsXY( targetX, targetY ) ) {
				if ( self._DOP_Property._scrollRect ) {
					if ( self._DOP_Property._scrollRect.containsXY( targetX, targetY ) ) {
						return self;
					}
				}
				else {
					return self;
				}
			}
			return null;
		}
	}
}
