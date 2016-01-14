///<reference path="../../utils/HashObject.ts"/>
module RM {
	/**
	 * 渲染对象的基类，根据不同的环境有不同的渲染对象<br>
	 * 因此作为接口
	 * @author
	 *
	 */
	export class RenderContext extends RM.HashObject {
		public constructor() {
			super();
		}

		/**创建渲染对象*/
		public static createRenderContext():any {
			return null;
		}

		/**
		 * 重复绘制image到画布，渲染类型可选renderType：<br>
		 * （repeat：。该模式在水平和垂直方向重复。铺满画布<br>
		 *  repeat-x：该模式只在水平方向重复。横向铺满<br>
		 *  repeat-y：该模式只在垂直方向重复。纵向铺满<br>
		 *  no-repeat 默认：该模式只显示一次（不重复）。）
		 */
		public drawImage( texture:RM.Texture, offsetX:number, offsetY:number, sourceW:number, sourceH:number, destX:number, destY:number, destW:number, destH:number, renderType?:string ):void {
			RM.RenderPerformance.getInstance().addRenderCount();
		}

		/** 渲染文本 */
		public drawText( text:string, x:number, y:number, maxWidth:number, isStrokeText:boolean ):void {
			RM.RenderPerformance.getInstance().addRenderCount();
		}

		/** 设置渲染文本的样式 */
		public setDrawTextStyle( font:string, textAlign:string, textBaseline:string, fillStyle:string, strokeStyle:string ):void {
		}

		/** 测量text宽度 */
		public measureText( text:string ):number {
			return 0
		}

		//暂时为了方便直接写方法
		public onResize():void {
		}

		public onRenderStart():void {
		}

		/**渲染完毕，把渲染结果刷新到画布呈现*/
		public onRenderFinish():void {
		}

		public clearScene():void {
		}

		public setTransform( matrix:RM.Matrix ):void {
		}

		public setAlpha( alpha:number ):void {
		}

		/**
		 * 压入遮罩矩形，调用此方法后，后续的绘制将以此矩形范围开始渲染
		 * @param mask
		 */
		public pushMaskRect( mask:RM.Rectangle ):void {
		}

		/**
		 * 从栈顶移除遮罩矩形，如果栈内还存在遮罩矩形，则继续以栈顶矩形渲染
		 */
		public popMaskRect():void {
		}
	}
}
