///<reference path="../utils/HashObject.ts"/>
module RM {
	/**
	 * 事件类，负责事件的派发和监听<br>
	 * 1、事件的三个阶段分为捕获、目标、冒泡。可以根据使用的方式，设置在捕获阶段触发，或者在目标或冒泡阶段触发<br>
	 * 2、事件的三个阶段只在显示列表中才有效，具体工作机制可以可以参见DisplayObject.dispatchEvent
	 * @author 
	 *
	 */
	export class EventDispatcher extends RM.HashObject{
    	
    	/**事件监听列表，目标及冒泡阶段<br>
    	 * key：事件类型<br>
    	 * value：EventCallbackData <br>
    	 * */
        private eventListenerMap: any = {};
        /**事件监听列表，捕获阶段<br>
        * key：事件类型<br>
        * value：EventCallbackData <br>
        * */
        private eventListenerCaptureMap: any = {};
        /**事件抛出对象*/
        private _eventTarget: any = null;
    	
    	
		public constructor() {
            super();
            //事件的抛出对象暂且为自己
            this._eventTarget = this;
		}
		/**添加监听事件(自动排除重复添加的监听：type、listener、thisObject相同则不再添加)<br>
		 * type：事件类型<br>
		 * listener：事件回调函数<br>
		 * thisObject：事件回调函数的this对象<br>
		 * useCupture：是否运行于捕获还是运行与目标或冒泡阶段<br>
		 * priority:事件的优先级，默认为0，数字越大优先级越高；
		 * */
        public addEventListener( type: string, listener: Function, thisObject: any, useCupture: boolean = false, priority: number = 0 ):void
        {
            if( !listener )
            {
                RM.Log.print( "listener is null ! by EventDispatcher.addEventListener" );
            }
            var eventList: any;
            if( useCupture )
            {
                if( !this.eventListenerCaptureMap )
                {
                    this.eventListenerCaptureMap = {};
                }
                eventList = this.eventListenerCaptureMap;
            }
            else
            {
                if( !this.eventListenerMap )
                {
                    this.eventListenerMap = {};
                }
                eventList = this.eventListenerMap;
            }
            
            var list: Array<RM.EventCallbackData> = eventList[type];
            if ( !list )
            {
                list = eventList[type] = [];
            }                
            this.insertEventToList(list,type,listener,thisObject);
        }
        /**插入事件到列表*/
        protected insertEventToList( list: Array<RM.EventCallbackData>, type: string, listener: Function, thisObject: any, priority?: number ): boolean
        {
            var len: number = list.length;
            var targetIndex: number = -1;
            var eventCallbackData: RM.EventCallbackData;
            for ( var index: number = 0; index < len; index++ )
            {
                eventCallbackData = list[index];
                if ( eventCallbackData.type == type && eventCallbackData.listener == listener && eventCallbackData.thisObject == thisObject )
                {
                    return false;
                }
                if( targetIndex == -1 && eventCallbackData.priority < priority )
                {
                    targetIndex = index;
                }
            }
            if( targetIndex != -1 )
            {
                list.splice( targetIndex, 0, new RM.EventCallbackData( type, listener, thisObject, priority ) );
            }
            else
            {
                list.push( new RM.EventCallbackData( type, listener, thisObject, priority ) );
            }
        }
        /**删除事件监听器<br>
        * type：事件类型<br>
        * listener：事件回调函数<br>
        * thisObject：事件回调函数的this对象<br>
        * useCupture：是否运行于捕获还是运行与目标或冒泡阶段，由于捕获与目标及冒泡的事件列表是分离开的，
        * 因此谨慎起见必须确定事件是否在捕获事件列表中<br>
         * */
        public removeEventListener( type: string, listener: Function, thisObject: any, useCapture: boolean = false ): void
        {
            var eventList: any = useCapture ? this.eventListenerCaptureMap : this.eventListenerMap;
            if ( !eventList ) return;
            if ( !eventList[type] ) return;
            this.removeEventForList( eventList[type], type, listener, thisObject );
        }
        /**删除事件，从列表中删除*/
        protected removeEventForList( list: Array<RM.EventCallbackData>, type: string, listener: Function, thisObject: any, startIndex: number = 0 ): boolean
        {
            var len: number = list.length;
            var eventCallbackData: RM.EventCallbackData;
            for ( var index: number = startIndex; index < len; index++ )
            {
                eventCallbackData = list[index];
                if ( eventCallbackData.type == type && eventCallbackData.listener == listener && eventCallbackData.thisObject == thisObject )
                {
                    list.splice(index,1);
                    return true;
                }
            }
            return false;
        }
        
        /**派发事件，此事件接收一个RM.Event 对象并根据RM.Event对象的isPropagationImmediateStopped属性来决定是否阻止冒泡*/
        public dispatchEvent( event: RM.Event ): boolean
        {
            event._target = this._eventTarget;
            event._currentTarget = this._eventTarget;
            return this._$notifyListener( event );
        }
        /**在配发事件时，如果响应事件内部删除后续某个侦听，则后续某个侦听在当前事件全部响应后，才生效，因此后续某个侦听在本次事件中会继续触发*/
        public _$notifyListener( event:RM.Event ):boolean
        {
            var eventList: any = event._eventPhase == RM.EventPhase.CAPTURE_PHASE ? this.eventListenerCaptureMap : this.eventListenerMap;
            if ( !eventList ) return true;
            if ( !eventList[event._type] ) return true;
            var list: Array<RM.EventCallbackData> = eventList[event._type];
            var len: number = list.length;
            if ( len == 0 ) return true;
            list = list.concat();
            var eventCallbackData: RM.EventCallbackData;
            for ( var index: number = 0; index < len; index++ )
            {
                eventCallbackData = list[index];
                eventCallbackData.listener.call( eventCallbackData.thisObject, event );
                if ( event.isPropagationImmediateStopped ) break;
            }
            return true;
        }
        
	}
}
