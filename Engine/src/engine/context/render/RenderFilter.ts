///<reference path="../../utils/HashObject.ts"/>
module RM {
	/**
	 * 渲染过滤器，计算和需要渲染的矩形范围
	 * @author
	 *
	 */
	export class RenderFilter extends RM.HashObject {

		private static _instance:RM.RenderFilter;
		/**需要渲染的区域矩形列表*/
		private _drawAreaList:Array<RM.Rectangle> = [];

		private _isFullScreenRender:boolean = false;

		public constructor() {
			super();
		}

		public static getInstance():RM.RenderFilter {
			if ( !this._instance ) {
				this._instance = new RM.RenderFilter();
			}
			return this._instance;
		}

		/**添加重绘区域*/
		public addDrawArea( area:RM.Rectangle ):void {
			if ( area.isEmpty() )return;
			this._drawAreaList.push( area );
			this.clearContainsRect();
		}

		public _addArea( area:RM.Rectangle ):void {
			if ( area.isEmpty() )return;
			this._drawAreaList.push( area );
		}

		/**
		 * 是否达到全屏渲染
		 * @returns {boolean}
		 */
		public get isFullScreenRender():boolean {
			return this._isFullScreenRender;
		}

		/**清除重绘列表*/
		public clearDrawList():void {
			var len:number = this._drawAreaList.length;
			for ( var idx = 0; idx < len; idx++ ) {
				var rect:RM.Rectangle = this._drawAreaList.shift();
				rect.release();
			}
		}

		/**
		 *只有在计算脏矩形区域后才可使用
		 *15/10/26
		 */
		public getDefaultDrawAreaList():Array<RM.Rectangle> {
			return this._drawAreaList;
		}

		/**
		 *在引擎渲染阶段对比
		 *15/10/26
		 */
		public isHasDrawAreaList( rect:RM.Rectangle ):boolean {
			var len:number = this._drawAreaList.length;
			for ( var idx = 0; idx < len; idx++ ) {
				var item:RM.Rectangle = this._drawAreaList[ idx ];
				if ( item.intersectsRect( rect ) ) {
					return true;
				}
			}
			return false;
		}

		/**
		 *排除相互包含的矩形区域，减少渲染区域次数。<br>
		 *并合并相交矩形。
		 *2015/11/5
		 */
		public clearContainsRect():void {
			this._drawAreaList.sort( this.sortFunc );
			var array:Array<RM.Rectangle> = this._drawAreaList.concat();
			array.sort( this.sortFunc );
			this._drawAreaList = [];
			for ( var idx = 0; idx < array.length - 1; idx++ ) {
				for ( var idy = idx + 1; idy < array.length; idy++ ) {
					var rect1:RM.Rectangle = array[ idx ];
					var rect2:RM.Rectangle = array[ idy ];
					if ( rect1.containsRect( rect2 ) ) {
						array.splice( idy, 1 );
						rect2.release();
						--idy;
					}
				}
			}
			//循环合并相交矩形
			while ( this.mergeDirtyRect( array ) ) {
			}

			var maxArea:number = 0;

			//出现边框1像素的残留，暂时这样解决！！
			array.forEach( function ( item, index, list:Array<RM.Rectangle> ) {
				item.x = Math.max(0,item.x-1);
				item.y = Math.max(0,item.y-1);
				item.width = Math.max(0,item.width+2);
				item.height = Math.max(0,item.height+2);
				maxArea += item.getArea();
			});
			var value:number = maxArea / RM.StageViewPort.getInstance().getRect().getArea();
			this._isFullScreenRender = value > 0.9;
			this._drawAreaList = array;
		}

		/**
		 * 从大到小排序
		 *2015/11/5
		 */
		private sortFunc( a:RM.Rectangle, b:RM.Rectangle ):number {
			return b.getArea() - a.getArea();
		}

		/**
		 *根据合并后的多余面积的大小来次序，<br>
		 *优先合并相近的矩形。<br>
		 *采用三分矩形算法，超过三个矩形则合并。
		 *2015/11/12
		 */
		private mergeDirtyRect( list:Array<RM.Rectangle> ):boolean {
			var len:number = list.length;
			if ( len < 3 )return false;
			var indexA:number = 0;
			var indexB:number = 0;
			var intersectArea:number = 0;//如果相交，则有相交处的面积。
			var area:number;
			var rectA:RM.Rectangle;
			var rectB:RM.Rectangle;
			//最大脏面积
			var dirtyArea:number = Number.POSITIVE_INFINITY;
			for ( var idx = 0; idx < len - 1; idx++ ) {
				rectA = list[ idx ];
				for ( var idy = idx + 1; idy < len; idy++ ) {
					rectB = list[ idy ];
					area = RM.Rectangle.unionArea( rectA, rectB )
						+ RM.Rectangle.intersectionArea( rectA, rectB )
						+ intersectArea - rectA.getArea()
						- rectB.getArea();
					//只合并最小面积的矩形
					if ( dirtyArea > area ) {
						indexA = idx;
						indexB = idy;
						dirtyArea = area;
					}
					if ( dirtyArea == 0 )break;
				}
				if ( dirtyArea == 0 )break;
			}
			if ( indexA != indexB ) {
				list[ indexA ].union( list[ indexB ], true );
				list[ indexB ].release();
				list.splice( indexB, 1 );
				return true;
			}
			return false;
		}
	}
}
