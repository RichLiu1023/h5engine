module RM {
	/**
	 *textBaseline 属性设置或返回在绘制文本时的当前文本基线
	 * @author 
	 *
	 */
	export class TextBaselineType {
    	/** 文本基线是 em 方框的顶端 引擎默认*/
        public static TOP:string = "top";
        /** 文本基线是悬挂基线 */
        public static HANGING:string = "hanging";
        /** 文本基线是 em 方框的正中 */
        public static MIDDLE:string = "middle";
        /** 文本基线是表意基线 */
        public static IDEOGRAPHIC:string = "ideographic";
        /** 文本基线是 em 方框的底端 */
        public static BOTTOM:string = "bottom";
        /** 文本基线是普通的字母基线，H5中默认是这个 */
        public static ALPHABETIC:string = "alphabetic";
    	
		public constructor() {
		}
	}
}
