module RM {
	/**
	 * DisplayObject 的保护属性
	 * @author 
	 *
	 */
	export class DOProtection {
    	
    	/** 名字 */
        public _name:string = "";
        /** x轴偏移值 */
        public _x: number = 0;
        /** y轴偏移值 */
        public _y: number = 0;
        /** 显示对象的宽度 */
        public _width: number = 0;
        /** 显示对象的高度 */
        public _height: number = 0;
        
        /** x轴缩放*/
        public _scaleX: number = 1;
        /** y轴缩放 */
        public _scaleY: number = 1;
        /** x轴切变 */
        public _skewX: number = 0;
        /** y轴切变 */
        public _skewY: number = 0;
        /** 旋转弧度 */
        public _rotate: number = 0;
        /** 滚动矩形，遮罩矩形 */
        public _scrollRect: RM.Rectangle=null;

        /** 显示对象的透明度 */
        public _alpha = 1;
        /** 对象是否显示 */
        public _visible: boolean = true;
        /** 对象是否是显示容器 */
        public _isContainer: boolean = false;
        /** 父容器 */
        public _parent: RM.DisplayObjectContainer = null;
        /** 舞台 */
        public _stage: RM.Stage = null;
        
        /**是否需要绘制*/
        public _needDraw: boolean = false;
        /**是否设置了宽度*/
        public _hasWidthSet: boolean = false;
        /**是否设置了高度*/
        public _hasHeightSet: boolean = false;
        /** 尺寸是否改变 */
        public _hasSize: boolean = true;
        /**缓存为位图*/
        public _cacheAsBitmap: boolean = false;
        /**是否接收触摸事件*/
        public _touchEnabled: boolean = false;
        /**是否为脏*/
        public _isDirty: boolean = true;
		public constructor() {
		}
	}
}
