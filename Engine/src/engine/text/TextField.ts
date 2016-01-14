///<reference path="../display/DisplayObject.ts"/>
module RM {
	/**
	 * 文本类
	 * @author
	 *
	 */
	export class TextField extends RM.DisplayObject {
		private _TFP_properties:RM.TFProtection;
		/**文本行列表*/
		private _$textLineList:Array<string> = [];

		/**
		 * 文本类
		 * @author
		 *
		 */
		public constructor() {
			super();
			this._TFP_properties = new RM.TFProtection();
			this.setNeedDraw( true );
		}

//=============================================Set Function===============================================================		
		public setText( text:string ):RM.TextField {
			if ( text == this._TFP_properties._text ) return this;
			this._TFP_properties._text = text;
			this._$setDirty();
			this._updateTextSize();
			return this;
		}

		/** textBaseline 属性设置或返回在绘制文本时的当前文本基线。<br>
		 * top    文本基线是 em 方框的顶端。<br>
		 * hanging    文本基线是悬挂基线。<br>
		 * middle    文本基线是 em 方框的正中。<br>
		 * ideographic    文本基线是表意基线。<br>
		 * bottom    文本基线是 em 方框的底端。<br>
		 * 参见：TextBaselineType
		 * 默认为top <br>
		 * */
		public setTextBaseline( type:string ):RM.TextField {
			if ( type == this._TFP_properties._textBaseline ) return this;
			this._TFP_properties._textBaseline = type;
			this._$setDirty();
			return this;
		}

		/** textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式。<br>
		 * start    默认。文本在指定的位置开始。<br>
		 * end    文本在指定的位置结束。<br>
		 * center    文本的中心被放置在指定的位置。<br>
		 * left    文本左对齐。<br>
		 * right    文本右对齐。<br>
		 * 参见：TextAlignType
		 * 默认为start <br>
		 * */
		public setTextAlign( type:string ):RM.TextField {
			if ( type == this._TFP_properties._textAlign ) return this;
			this._TFP_properties._textAlign = type;
			this._$setDirty();
			return this;
		}

		/** 颜色值，十六进制 */
		public setTextColor( value:number ):RM.TextField {
			if ( value == this._TFP_properties._textColor ) return this;
			this._TFP_properties._textColor = value;
			this._$setDirty();
			return this;
		}

		/** 颜色值，十六进制 */
		public setStrokeColor( value:number ):RM.TextField {
			if ( value == this._TFP_properties._strokeColor ) return this;
			this._TFP_properties._strokeColor = value;
			this._$setDirty();
			return this;
		}

		/** font-style 属性定义字体的风格<br>
		 * normal    默认值。浏览器显示一个标准的字体样式。<br>
		 * italic    浏览器会显示一个斜体的字体样式。<br>
		 * oblique    浏览器会显示一个倾斜的字体样式。<br>
		 * 参见TextFontStyleType
		 * */
		public setFontStyle( type:string ):RM.TextField {
			if ( type == this._TFP_properties._fontStyle ) return this;
			this._TFP_properties._fontStyle = type;
			this._$setDirty();
			return this;
		}

		/** 是否使用异体 <br>
		 * font-variant 属性设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。<br>
		 * false 默认值。浏览器会显示一个标准的字体normal<br>
		 * true 浏览器会显示小型大写字母的字体small-caps<br>
		 * */
		public setFontVariant( value:boolean ):RM.TextField {
			if ( value == this._TFP_properties._fontVariant ) return this;
			this._TFP_properties._fontVariant = value;
			this._$setDirty();
			return this;
		}

		/**该属性用于设置显示元素的文本中所用的字体加粗。<br>
		 * 数字值 400 相当于 关键字 normal，700 等价于 bold。<br>
		 * 每个数字值对应的字体加粗必须至少与下一个最小数字一样细，而且至少与下一个最大数字一样粗。<br>
		 * 注意：为方便，直接选两个值，加粗bold与默认normal
		 * 默认为false
		 * */
		public setIsBold( value:boolean ):RM.TextField {
			if ( value == this._TFP_properties._isBold ) return this;
			this._TFP_properties._isBold = value;
			this._$setDirty();
			return this;
		}

		/**
		 * font-size 属性可设置字体的尺寸。<br>
		 * 该属性设置元素的字体大小。注意，实际上它设置的是字体中字符框的高度；实际的字符字形可能比这些框高或矮（通常会矮）。
		 各关键字对应的字体必须比一个最小关键字相应字体要高，并且要小于下一个最大关键字对应的字体。<br>
		 *
		 * */
		public setFontSize( value:number ):RM.TextField {
			if ( value == this._TFP_properties._fontSize ) return this;
			this._TFP_properties._fontSize = value;
			this._updateTextSize();
			this._$setDirty();
			return this;
		}

		/**
		 * font-family 规定元素的字体系列<br>
		 * font-family 可以把多个字体名称作为一个“回退”系统来保存。如果浏览器不支持第一个字体，则会尝试下一个。<br>
		 * 也就是说，font-family 属性的值是用于某个元素的字体族名称或/及类族名称的一个优先表。浏览器会使用它可识别的第一个值。<br>
		 *
		 * */
		public setFontFamily( type:string ):RM.TextField {
			if ( type == this._TFP_properties._fontFamily ) return this;
			this._TFP_properties._fontFamily = type;
			this._$setDirty();
			return this;
		}

		/**
		 * 设置是否启用镂空样式
		 * */
		public setIsStrokeText( value:boolean ):RM.TextField {
			if ( value == this._TFP_properties._isStrokeText ) return this;
			this._TFP_properties._isStrokeText = value;
			this._$setDirty();
			return this;
		}

		/**
		 * 设置垂直距离的行间距
		 * */
		public setLineSpacing( value:number ):RM.TextField {
			if ( value == this._TFP_properties._lineSpacing ) return this;
			this._TFP_properties._lineSpacing = value;
			this._$setDirty();
			return this;
		}

//=============================================Get Function===============================================================
		public getText():string {
			return this._TFP_properties._text;
		}

		/** textBaseline 属性设置或返回在绘制文本时的当前文本基线。<br>
		 * top    文本基线是 em 方框的顶端。<br>
		 * hanging    文本基线是悬挂基线。<br>
		 * middle    文本基线是 em 方框的正中。<br>
		 * ideographic    文本基线是表意基线。<br>
		 * bottom    文本基线是 em 方框的底端。<br>
		 * 参见：TextBaselineType
		 * 默认为top <br>
		 * */
		public getTextBaseline():string {
			return this._TFP_properties._textBaseline;
		}

		/** textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式。<br>
		 * start    默认。文本在指定的位置开始。<br>
		 * end    文本在指定的位置结束。<br>
		 * center    文本的中心被放置在指定的位置。<br>
		 * left    文本左对齐。<br>
		 * right    文本右对齐。<br>
		 * 参见：TextAlignType
		 * 默认为start <br>
		 * */
		public getTextAlign():string {
			return this._TFP_properties._textAlign;
		}

		/** 颜色值，十六进制 */
		public getTextColor():number {
			return this._TFP_properties._textColor;
		}

		/** 颜色值，十六进制 */
		public getStrokeColor():number {
			return this._TFP_properties._strokeColor;
		}

		/** font-style 属性定义字体的风格<br>
		 * normal    默认值。浏览器显示一个标准的字体样式。<br>
		 * italic    浏览器会显示一个斜体的字体样式。<br>
		 * oblique    浏览器会显示一个倾斜的字体样式。<br>
		 * 参见TextFontStyleType
		 * */
		public getFontStyle():string {
			return this._TFP_properties._fontStyle;
		}

		/** 是否使用异体 <br>
		 * font-variant 属性设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。<br>
		 * false 默认值。浏览器会显示一个标准的字体normal<br>
		 * true 浏览器会显示小型大写字母的字体small-caps<br>
		 * */
		public getFontVariant():boolean {
			return this._TFP_properties._fontVariant;
		}

		/**该属性用于设置显示元素的文本中所用的字体加粗。<br>
		 * 数字值 400 相当于 关键字 normal，700 等价于 bold。<br>
		 * 每个数字值对应的字体加粗必须至少与下一个最小数字一样细，而且至少与下一个最大数字一样粗。<br>
		 * 注意：为方便，直接选两个值，加粗bold与默认normal
		 * 默认为false
		 * */
		public getIsBold():boolean {
			return this._TFP_properties._isBold;
		}

		/**
		 * font-size 属性可设置字体的尺寸。<br>
		 * 该属性设置元素的字体大小。注意，实际上它设置的是字体中字符框的高度；实际的字符字形可能比这些框高或矮（通常会矮）。
		 各关键字对应的字体必须比一个最小关键字相应字体要高，并且要小于下一个最大关键字对应的字体。<br>
		 *
		 * */
		public getFontSize():number {
			return this._TFP_properties._fontSize;
		}

		/**
		 * font-family 规定元素的字体系列<br>
		 * font-family 可以把多个字体名称作为一个“回退”系统来保存。如果浏览器不支持第一个字体，则会尝试下一个。<br>
		 * 也就是说，font-family 属性的值是用于某个元素的字体族名称或/及类族名称的一个优先表。浏览器会使用它可识别的第一个值。<br>
		 *
		 * */
		public getFontFamily():string {
			return this._TFP_properties._fontFamily;
		}

		/**
		 * 获得垂直距离的行间距
		 *
		 * */
		public getLineSpacing():number {
			return this._TFP_properties._lineSpacing;
		}

//===========================================Function====================================================
		/**
		 * 可以按顺序设置如下属性：<br>
		 font-style<br>
		 font-variant<br>
		 font-weight<br>
		 font-size/line-height<br>
		 font-family<br>
		 * */
		public getFontToString():string {
			var style:string = this.getFontStyle();
			style += this.getFontVariant() ? " small-caps" : " normal";
			style += this.getIsBold() ? " bold" : " normal";
			style += " " + this.getFontSize() + "px";
			style += " " + this.getFontFamily();
			return style;
		}

		/**
		 * 更新文本宽高
		 * */
		private _updateTextSize():void {
			var render = RM.MainContext.getInstance().renderContext;
			render.setDrawTextStyle( this.getFontToString(), this.getTextAlign(), this.getTextBaseline(),
				RM.GFunction.toColorString( this.getTextColor() ), RM.GFunction.toColorString( this.getStrokeColor() ) );
			this._$textLineList = this._TFP_properties._text.split( /(?:\r\n|\r|\n)/ );
			var len:number = this._$textLineList.length;
			var text:string;
			var textH:number = 0;
			var textW:number = 0;
			for ( var idx = 0; idx < len; idx ++ ) {
				text = this._$textLineList[ idx ];
				textH += this._TFP_properties._fontSize + this._TFP_properties._lineSpacing;
				textW = Math.max( textW, render.measureText( text ) );
			}
			this._TFP_properties._textMaxHeight = textH;
			this._TFP_properties._textMaxWidth = textW;
		}

//===========================================Render Function====================================================		
		/**子类实现的渲染接口，子类在此接口调用自己的draw函数，以渲染到canvas*/
		public _$render( renderContext:RM.RenderContext ):void {
			renderContext.setDrawTextStyle( this.getFontToString(), this.getTextAlign(), this.getTextBaseline(),
				RM.GFunction.toColorString( this.getTextColor() ), RM.GFunction.toColorString( this.getStrokeColor() ) );
			var len:number = this._$textLineList.length;
			var text:string;
			var textY:number = 0;
			for ( var idx = 0; idx < len; idx ++ ) {
				text = this._$textLineList[ idx ];
				renderContext.drawText( text, 0, textY, this._TFP_properties._textMaxWidth, this._TFP_properties._isStrokeText );
				textY += this._TFP_properties._fontSize + this._TFP_properties._lineSpacing;
			}
		}

		public _$draw( renderContext:RM.RenderContext ):void {
			super._$draw( renderContext );
		}

		public _$updateTransform():void {
			super._$updateTransform();
		}

		/** 重写父类方法，计算真实边界 */
		public _$realBounds():RM.Rectangle {
			this._updateTextSize();
			if ( this._TFP_properties._textMaxWidth == 0 ) {
				return this._$rect.resetToValue( 0, 0, 0, 0 );
			}
			return this._$rect.resetToValue( 0, 0, this._TFP_properties._textMaxWidth, this._TFP_properties._textMaxHeight );
		}
	}
}
