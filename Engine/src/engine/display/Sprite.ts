///<reference path="DisplayObjectContainer.ts"/>
module RM {
	/**
	 * 精灵类，显示列表中的节点，包含一系列子项的列表
	 * @author
	 *
	 */
	export class Sprite extends RM.DisplayObjectContainer {
		public constructor() {
			super();
			this.setName( "Sprite" );
		}
	}
}
