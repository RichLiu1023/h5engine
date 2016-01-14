///<reference path="DisplayObject.ts"/>
module RM {
	/**
	 * 显示对象容器类的基类，在显示列表树中属于父节点<br>
	 * @author
	 *
	 */
	export class DisplayObjectContainer extends RM.DisplayObject {
		protected _$children:Array<RM.DisplayObject>;
		/**子对象是否接收触摸事件*/
		protected _$touchChildren = true;

		public constructor() {
			super();
			this.setName( "DisplayObjectContainer" );
			this._$children = [];
			this._DOP_Property._isContainer = true;
		}

		/**
		 * 获取是否可以触摸子对象
		 * */
		public get touchChildren():boolean {
			return this._$touchChildren;
		}

		/**
		 * 设置是否可以触摸子对象
		 * */
		public set touchChildren( value:boolean ) {
			if ( this._$touchChildren != value ) {
				this._$touchChildren = value;
			}
		}

//===========================覆盖父类方法=======================================
		/** 不要设置宽高属性 **/
		public setWidth( value:number ):RM.DisplayObject {
			return this;
		}

		/** 不要设置宽高属性 **/
		public setHeight( value:number ):RM.DisplayObject {
			return this;
		}

		/** 不要设置宽高属性 **/
		public setSize( w:number, h:number ):RM.DisplayObject {
			return this;
		}

//==================================================================
		/**
		 * 添加DisplayObject子类的实例到显示列表容器，被添加至显示显示列表容器的末尾。
		 * @param child 子项
		 * @param index 索引位置
		 * */
		public addChild( child:RM.DisplayObject ):RM.DisplayObject {
			var len:number = this._$children.length;
			if ( child.getParent() == this ) {
				len --;
			}
			return this._doAddChild( child, len );
		}

		/**
		 * 添加DisplayObject子类的实例到显示列表容器，被添加至显示显示列表容器的index指定的位置。
		 * @param child 子项
		 * @param index 索引位置
		 * */
		public addChildAt( child:RM.DisplayObject, index:number ):RM.DisplayObject {
			return this._doAddChild( child, index );
		}

		private _doAddChild( child:RM.DisplayObject, index:number ):RM.DisplayObject {
			if ( child == this )
				return child;
			if ( index < 0 || index > this._$children.length ) {
				RM.Log.print( "DisplayObjectContainer._doAddChild 添加child到指定index位置错误！index为：", index );
			}
			var childParent:RM.DisplayObjectContainer = child.getParent();
			if ( childParent == this ) {
				this._doSetChildIndex( child, index );
				return child;
			}
			if ( childParent ) {
				var targetIndex:number = childParent._$children.indexOf( child );
				if ( targetIndex >= 0 ) {
					childParent.removeChildAt( targetIndex );
				}
			}
			this._$children.splice( index, 0, child );
			child.setParent( this );
			if ( this.getStage() ) {
				child._$onAddToStage();
				RM.MainContext.getInstance().broadcastAddToStage();
			}
			//重新计算尺寸
			this._DOP_Property._hasSize = true;
			child._$setDirty();
			return child;
		}

		/**
		 * 改变DisplayObject子类的实例在显示列表容器中的坐标。
		 * @param child 子项
		 * @param index 索引位置
		 * */
		public setChildIndex( child:RM.DisplayObject, index:number ):void {
			this._doSetChildIndex( child, index );
		}

		private _doSetChildIndex( child:RM.DisplayObject, index:number ):void {
			var targetIndex:number = this._$children.indexOf( child );
			if ( targetIndex < 0 ) {
				RM.Log.print( "DisplayObjectContainer._doSetChildIndex更改子项位置失败，该child不存在于其父类" );
			}
			this._$children.splice( targetIndex, 1 );
			if ( index < 0 || index >= this._$children.length ) {
				this._$children.push( child );
			}
			else {
				this._$children.splice( index, 0, child );
			}
		}

		/**
		 * 移除DisplayObject子类的实例，从显示列表容器中。
		 * @param child 子项
		 * */
		public removeChild( child:RM.DisplayObject ):RM.DisplayObject {
			var index:number = this._$children.indexOf( child );
			if ( index >= 0 && index < this._$children.length ) {
				return this._doRemoveChildAt( index );
			}
			else {
				RM.Log.print( "DisplayObjectContainer.removeChild删除位置错误！index:", index );
				return null;
			}
		}

		/**
		 * 移除DisplayObject子类的实例，从显示列表容器中的指定位置。
		 * @param index 索引位置
		 * */
		public removeChildAt( index:number ):RM.DisplayObject {
			if ( index >= 0 && index < this._$children.length ) {
				return this._doRemoveChildAt( index );
			}
			else {
				RM.Log.print( "DisplayObjectContainer.removeChildAt删除位置错误！index:", index );
				return null;
			}
		}

		/**
		 * 移除DisplayObject子类的所有孩子
		 * */
		public removeAllChild():void {
			var len:number = this._$children.length;
			while ( len -- > 0 ) {
				var child:RM.DisplayObject = this._$children[ len ];
				if ( this.getStage() ) {
					child._$onRemoveFormStage();
				}
				child.setParent( null );
			}
			RM.MainContext.getInstance().broadcastRemoveFormStage();
			len = this._$children.length;
			while ( len -- > 0 ) {
				var child:RM.DisplayObject = this._$children[ len ];
				child.setParent( null );
			}
			this._$children.length = 0;
			this._DOP_Property._hasSize = true;
			this._$setDirty();
		}

		private _doRemoveChildAt( index:number ):RM.DisplayObject {
			var child:RM.DisplayObject = this._$children[ index ];
			if ( this.getStage() ) {
				child._$onRemoveFormStage();
				RM.MainContext.getInstance().broadcastRemoveFormStage();
			}
			child.setParent( null );
			this._$children.splice( index, 1 );
			this._DOP_Property._hasSize = true;
			this._$setDirty();
			return child;
		}

		/**
		 * 获取DisplayObject子类的实例，从显示列表容器中的指定位置。
		 * @param index 索引位置
		 * */
		public getChildAt( index:number ):RM.DisplayObject {
			if ( index < 0 || index >= this._$children.length ) {
				RM.Log.print( "DisplayObjectContainer.getChildAt获取位置错误！index:", index );
				return null;
			}
			return this._$children[ index ];
		}

		/**
		 * 获取DisplayObject子类的实例，从指定的名字name。
		 * @param name 显示对象的名字
		 * */
		public getChildByName( name:string ):RM.DisplayObject {
			var len:number = this._$children.length;
			var target:RM.DisplayObject;
			while ( len -- > 0 ) {
				target = this._$children[ len ];
				if ( target.getName() == name ) {
					return target;
				}
			}
			return null;
		}

		/**
		 * 获取指定DisplayObject对象在父类显示列表中的位置index。
		 * @param child 显示对象
		 * */
		public getChildIndex( child:RM.DisplayObject ):number {
			var index:number = this._$children.indexOf( child );
			return index;
		}

		/**
		 * 在子级列表中两个指定的位置，交换子对象的Z轴顺序
		 * @param index1 第一个索引位置
		 * @param index2 第二个索引位置
		 * */
		public swapChildrenAt( index1:number, index2:number ):void {
			var len:number = this._$children.length;
			if ( index1 < 0 || index1 >= len || index2 < 0 || index2 >= len ) {
				return;
			}
			this._doSwapChildrenAt( index1, index2 );
		}

		/**
		 * 在子级列表中两个指定的子项，交换子对象的Z轴顺序
		 * @param child1 第一个索引位置
		 * @param child2 第二个索引位置
		 * */
		public swapChildren( child1:RM.DisplayObject, child2:RM.DisplayObject ):void {
			var index1:number = this._$children.indexOf( child1 );
			var index2:number = this._$children.indexOf( child2 );
			if ( index1 < 0 || index2 < 0 ) return;
			this._doSwapChildrenAt( index1, index2 );
		}

		private _doSwapChildrenAt( index1:number, index2:number ):void {
			if ( index1 == index2 ) {
				return;
			}
			var list:Array<RM.DisplayObject> = this._$children;
			var child:RM.DisplayObject = list[ index1 ];
			list[ index1 ] = list[ index2 ];
			list[ index2 ] = child;
			this._$setDirty();
		}

		/**
		 * 获得子项的数量
		 * */
		public getChildrenNum():number {
			return this._$children.length;
		}

//======================================覆写父类方法=============================
		/** 显示对象加入舞台，引擎内部调用 */
		public _$onAddToStage():void {
			super._$onAddToStage();
			var self:RM.DisplayObjectContainer = this;
			var len:number = self._$children.length;
			var child:RM.DisplayObject;
			for ( var idx:number = 0; idx < len; idx ++ ) {
				child = self._$children[ idx ];
				child._$onAddToStage();
			}
		}

		/** 显示对象从舞台中移除，引擎内部调用 <br>
		 * 在移除回调时，stage属性会不设置为null，回调结束才置null
		 * */
		public _$onRemoveFormStage():void {
			super._$onRemoveFormStage();
			var self:RM.DisplayObjectContainer = this;
			var len:number = self._$children.length;
			var child:RM.DisplayObject;
			for ( var idx:number = 0; idx < len; idx ++ ) {
				child = self._$children[ idx ];
				child._$onRemoveFormStage();
			}
		}

//===================================渲染相关=============================================
		public pushMaskRect( renderContext:RM.RenderContext ):void {
			if ( this._DOP_Property._scrollRect ) {
				renderContext.setTransform( this._$globalTransform );
				renderContext.pushMaskRect( this._DOP_Property._scrollRect );
			}
		}

		public popMaskRect( renderContext:RM.RenderContext ):void {
			if ( this._DOP_Property._scrollRect ) {
				renderContext.popMaskRect();
			}
		}

		public _$render( renderContext:RM.RenderContext ):void {
			if ( RM.MainContext.USE_CACHE_DRAW ) {
				var list:Array<RM.DisplayObject> = this._$children;
				var len:number = list.length;
				var child:RM.DisplayObject;
				for ( var idx:number = 0; idx < len; idx ++ ) {
					child = list[ idx ];
					child._$draw( renderContext );
				}
			}
		}

		public _$updateTransform():void {
			if ( ! this._DOP_Property._visible ) return;
			if ( this._DOP_Property._scrollRect ) {
				//按照渲染次序，先设置遮罩再渲染子项
				RM.RenderCommand.push( this.pushMaskRect, this );
			}
			super._$updateTransform.call( this );
			if ( ! this._DOP_Property._cacheAsBitmap || ! this._$texture_to_render ) {
				var len:number = this._$children.length;
				var list:Array<RM.DisplayObject> = this._$children;
				var child:RM.DisplayObject;
				for ( var idx:number = 0; idx < len; idx ++ ) {
					child = list[ idx ];
					child._$updateTransform();
				}
			}
			if ( this._DOP_Property._scrollRect ) {
				//按照渲染次序，渲染完毕子项可以去除遮罩
				RM.RenderCommand.push( this.popMaskRect, this );
			}
		}

		/**
		 *检测脏矩形
		 *15/10/25
		 */
		public _$checkDirtyRectangle():void {
			if ( ! this._DOP_Property._visible ) return;
			var len:number = this._$children.length;
			var list:Array<RM.DisplayObject> = this._$children;
			var child:RM.DisplayObject;
			for ( var idx:number = 0; idx < len; idx ++ ) {
				child = list[ idx ];
				if ( child.getDirty() ) {
					var rect:RM.Rectangle = child._$getBounds();
					rect = RM.GFunction.getTransformRectangle( rect, child.getConcatenatedMatrix() );
					if ( ! child._$againRect.isEmpty() ) {
						//清除旧的位置
						RM.RenderFilter.getInstance().addDrawArea( child._$againRect.clone() );
					}
					//设置为新的位置
					child._$againRect.resetToRect( rect );
					RM.RenderFilter.getInstance().addDrawArea( rect );
				}
				else {
					child._$checkDirtyRectangle();
				}
			}
		}

		/**
		 * 清理脏标记
		 *15/10/25
		 */
		public _$clearDirty():void {
			super._$clearDirty();
			var len:number = this._$children.length;
			var list:Array<RM.DisplayObject> = this._$children;
			var child:RM.DisplayObject;
			for ( var idx:number = 0; idx < len; idx ++ ) {
				child = list[ idx ];
				child._$clearDirty();
			}
		}

//======================================== Function =============================================================
		/** 重写父类方法，计算真实边界 */
		public _$realBounds():RM.Rectangle {
			var minX = 0, maxX = 0, minY = 0, maxY = 0;
			var self:RM.DisplayObjectContainer = this;
			var len:number = self._$children.length;
			var child:RM.DisplayObject;
			var rect:RM.Rectangle = RM.Rectangle.create();
			var matrix:RM.Matrix;
			for ( var idx:number = 0; idx < len; idx ++ ) {
				child = self._$children[ idx ];
				if ( ! child.getVisible() ) continue;
				rect = child._$getBounds( rect );
				matrix = child.getMatrix();
				rect = RM.GFunction.getTransformRectangle( rect, matrix );
				if ( rect.x < minX || idx == 0 ) {
					minX = rect.x;
				}
				if ( rect.getMaxX() > maxX || idx == 0 ) {
					maxX = rect.getMaxX();
				}
				if ( rect.y < minY || idx == 0 ) {
					minY = rect.y;
				}
				if ( rect.getMaxY() > maxY || idx == 0 ) {
					maxY = rect.getMaxY();
				}
			}
			return rect.resetToValue( minX, minY, maxX - minX, maxY - minY );
		}

		/**
		 * 覆盖父类方法，指定舞台坐标是否在对象内<br>
		 * 容器是透明的矩形，是否触摸到容器的判断，要通过判断是否触摸在容器内部的子对象来确定。<br>
		 * 如果触摸到可触摸的子对象，那么就说明触摸到了容器。<br>
		 * 就算是缓存位图对象也会触发子对象的检测。
		 *
		 * */
		public _$hitTest( targetX:number, targetY:number, isTouchEnabled:boolean = false ):RM.DisplayObject {
			if ( ! this._DOP_Property._visible ) return null;
			if ( this._DOP_Property._scrollRect && this._DOP_Property._scrollRect.containsXY( targetX, targetY ) == false )return;
			var self:RM.DisplayObjectContainer = this;
			var len:number = self._$children.length;
			var child:RM.DisplayObject;
			var matrix:RM.Matrix;
			var point:RM.Point;
			var result:RM.DisplayObject = null;
			var childResult:RM.DisplayObject = null;
			var touchChildren:boolean = self._$touchChildren;
			var scrollrect:RM.Rectangle;
			for ( var idx:number = len - 1; idx >= 0; idx -- ) {
				child = self._$children[ idx ];
				matrix = child.getMatrix();
				scrollrect = child.getScrollRect();
				if ( scrollrect ) {
					matrix.rightMultiply( 1, 0, 0, 1, - scrollrect.x, - scrollrect.y )
				}
				matrix.invert();
				point = RM.GFunction.transformCoords( matrix, targetX, targetY );
				childResult = child._$hitTest( point.x, point.y, true );
				point.release();
				if ( childResult ) {
					if ( ! touchChildren ) {
						return self;
					}
					if ( childResult.getTouchEnabled() && touchChildren ) {
						return childResult;
					}
					result = self;
				}
			}
			if ( result ) return result;
			else if ( self._$texture_to_render ) {
				return super._$hitTest( targetX, targetY, isTouchEnabled );
			}
			return null;
		}
	}
}
