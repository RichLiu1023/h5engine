///<reference path="../utils/HashObject.ts"/>
module RM {
	/**
	 * 被派发的事件类<br>
	 * bindData:携带派发时附加的user数据
	 * @author 
	 *
	 */
	export class Event extends RM.HashObject{

        /** 帧频刷新，在进入帧时进行派发 */
        public static ENTER_FRAME: string = "enter_frame";
        /**完成事件，在加载完成后派发*/
        public static COMPLETE: string = "complete";

        /** 添加到舞台事件 */
        public static ADD_TO_STAGE: string = "add_to_stage";
        /** 从舞台移除事件 */
        public static REMOVE_FORM_STAGE: string = "remove_form_stage";
        /** 离开舞台事件 */
        public static LEAVE_STAGE: string = "leave_stage";


        public _type: string;
        public _target: any;
        public _currentTarget: any;
        /**表示事件是否参与冒泡，如果可以则为true，默认为false*/
        public _bubbles: boolean;
        /**停止处理事件流中 （当前节点） 中的后续节点的监听处理*/
        private _isPropagationImmediateStopped: boolean;
        /** 停止处理事件流中 （当前节点的后续节点） 中的所有事件监听器的处理 */
        private _isPropagationStopped: boolean;
        /**代表事件的三个阶段，分别是<br>
         * 捕获、目标、冒泡，对应EventPhase类的三个值<br>
         * 默认为目标阶段。
         * */
        public _eventPhase: string;
        public _bindData: any;
        public constructor() {
            super();
            this.reset();
		}

        /**
         *创建对象，建有内存池
         *2015/10/22
         */
        public static create( EventClass:any, type?:string, bubbles?:boolean, bindData?:any):any {
            if( !EventClass.PoolUtil )
            {
                EventClass.PoolUtil = new RM.PoolUtil(EventClass);
            }
            var object = EventClass.PoolUtil.getObject();
            object.create(type,bubbles,bindData);
            return object;
        }

        /**
         *回收
         *2015/10/22
         */
        public release():void {
            this.reset();
            var EventClass:any = Object.getPrototypeOf(this).constructor;
            EventClass.PoolUtil.release(this);
        }

        public create( type?:string, bubbles?:boolean, bindData?:any ):void
        {
            this._type = type;
            this._bubbles = bubbles;
            this._eventPhase = RM.EventPhase.TARGET_PHASE;
            this._bindData = bindData;
            this._isPropagationStopped = false;
            this._isPropagationImmediateStopped = false;
        }

        /**停止处理时间流中 （当前节点） 中的后续节点的监听处理*/
		public stopImmediatePropagation():void
		{
            if( this._bubbles )
            {
                this._isPropagationImmediateStopped = true;
            }
		}
        /** 是否 停止处理时间流中 （当前节点） 中的后续节点的监听处理*/
		public get isPropagationImmediateStopped():boolean
		{
            return this._isPropagationImmediateStopped;
		}
		
        /** 停止处理时间流中 （当前节点的后续节点） 中的所有事件监听器的处理 <br>
         *  此方法并不会影响当前节点中的后续节点的监听处理。
         * */
        public stopPropagation():void
        {
            if( this._bubbles )
            {
                this._isPropagationStopped = true;
            }
        }
        /** 是否 停止处理时间流中 （当前节点的后续节点） 中的所有事件监听器的处理 */
        public get isPropagationStopped():boolean
        {
            return this._isPropagationStopped;
        }
		
		public reset():void
		{
            this._target = null;
            this._currentTarget = null;
            this._type = null;
            this._bindData = null;
            this._bubbles = false;
            this._eventPhase = RM.EventPhase.TARGET_PHASE;
            this._isPropagationImmediateStopped = false;
            this._isPropagationStopped = false;
		}
		
        /**通过EventDispatcher类，或子类派发一个事件*/
        public static dispatchEvent( target: RM.EventDispatcher, type?:string, bubbles?:boolean, bindData?:any ): void
        {
            var event = RM.Event.create( RM.Event,type,bubbles,bindData );
            target.dispatchEvent( event );
            event.release();
        }
	}
}
