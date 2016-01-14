module RM {
	/**
	 *font-style 属性定义字体的风格。
	 * @author 
	 *
	 */
	export class TextFontStyleType {
    	
        /** 默认值。浏览器显示一个标准的字体样式*/
        public static NORMAL: string = "normal";
        /** 浏览器会显示一个斜体的字体样式 */
        public static ITALIC: string = "italic";
        /** 浏览器会显示一个倾斜的字体样式 */
        public static OBLIQUE: string = "oblique";
    	
		public constructor() {
		}
	}
}
