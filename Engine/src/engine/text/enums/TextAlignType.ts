module RM {
	/**
	 *textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式
	 * @author 
	 *
	 */
	export class TextAlignType {
    	
        /** 文本在指定的位置开始,默认*/
        public static START: string = "start";
        /** 文本在指定的位置结束 */
        public static END: string = "end";
        /** 文本的中心被放置在指定的位置 */
        public static CENTER: string = "center";
        /** 文本左对齐*/
        public static LEFT: string = "left";
        /** 文本右对齐 */
        public static RIGHT: string = "right";
    	
		public constructor() {
		}
	}
}
