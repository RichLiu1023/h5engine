module RM {
	/**
	 * 事件列表中的数据项
	 * @author 
	 *
	 */
	export class EventCallbackData extends RM.HashObject{
        public type: string;
        public listener: Function;
        public thisObject: any;
        /**优先级默认为0，数字越大，优先级越高*/
        public priority: number = 0;
        public constructor( type: string, listener: Function, thisObject: any, priority: number ) {
            super();
            this.type = type;
            this.listener = listener;
            this.thisObject = thisObject;
            this.priority = priority;
		}
	}
}
