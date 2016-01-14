module RM {
	/**
	 *
	 * @author 
	 *
	 */
	export class TFProtection {
    	
    	/** 显示文本 */
        public _text: string = "";
        /** textBaseline 属性设置或返回在绘制文本时的当前文本基线。<br>
        * top	文本基线是 em 方框的顶端。<br>
        * hanging	文本基线是悬挂基线。<br>
        * middle	文本基线是 em 方框的正中。<br>
        * ideographic	文本基线是表意基线。<br>
        * bottom	文本基线是 em 方框的底端。<br>
        * 参见：TextBaselineType
        * 默认为top <br>
        * */
        public _textBaseline: string = "top";
        /** textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式。<br>
        * start	默认。文本在指定的位置开始。<br>
        * end	文本在指定的位置结束。<br>
        * center	文本的中心被放置在指定的位置。<br>
        * left	文本左对齐。<br>
        * right	文本右对齐。<br>
        * 参见：TextAlignType
        * 默认为start <br>
        * */
        public _textAlign: string = "start";
        /** 文本颜色值，十六进制 */
        public _textColor: number = 0x000000;
        /** 描边颜色值，十六进制 */
        public _strokeColor: number = 0x000000;
        /** 是否镂空文字 */
        public _isStrokeText: boolean = false;

        /** font-style 属性定义字体的风格<br>
         * 该属性设置使用斜体、倾斜或正常字体。斜体字体通常定义为字体系列中的一个单独的字体。理论上讲，用户代理可以根据正常字体计算一个斜体字体。<br>
         * normal	默认值。浏览器显示一个标准的字体样式。<br>
         * italic	浏览器会显示一个斜体的字体样式。<br>
         * oblique	浏览器会显示一个倾斜的字体样式。<br>
         * 参见TextFontStyleType
         * */
        public _fontStyle: string = "normal";
        
        /** 是否使用异体 <br>
         * font-variant 属性设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。<br>
         * false 默认值。浏览器会显示一个标准的字体normal<br>
         * true 浏览器会显示小型大写字母的字体small-caps<br>
         * */
        public _fontVariant: boolean = false;
        
        /**该属性用于设置显示元素的文本中所用的字体加粗。<br>
         * 数字值 400 相当于 关键字 normal，700 等价于 bold。<br>
         * 每个数字值对应的字体加粗必须至少与下一个最小数字一样细，而且至少与下一个最大数字一样粗。<br>
         * 注意：为方便，直接选两个值，加粗bold与默认normal
         * 默认为false
         * */
        public _isBold: boolean = false;
        /**
         * font-size 属性可设置字体的尺寸。<br>
         * 该属性设置元素的字体大小。注意，实际上它设置的是字体中字符框的高度；实际的字符字形可能比这些框高或矮（通常会矮）。
         各关键字对应的字体必须比一个最小关键字相应字体要高，并且要小于下一个最大关键字对应的字体。<br>
         * 
         * */
        public _fontSize: number = 12;
        /**
         * font-family 规定元素的字体系列<br>
         * font-family 可以把多个字体名称作为一个“回退”系统来保存。如果浏览器不支持第一个字体，则会尝试下一个。<br>
         * 也就是说，font-family 属性的值是用于某个元素的字体族名称或/及类族名称的一个优先表。浏览器会使用它可识别的第一个值。<br>
         * 
         * */
        public _fontFamily: string = "arial,宋体,微软雅黑";
        
        /** 行间距，垂直距离 */
        public _lineSpacing: number = 2;
        /**  */
        public _textMaxWidth: number = 0;
        /**  */
        public _textMaxHeight: number = 0;
        /**  */
        
		public constructor() {
		}
	}
}
