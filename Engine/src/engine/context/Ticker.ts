///<reference path="../events/EventDispatcher.ts"/>
module RM {
	/**
	 * 帧刷新控制器,引擎心跳控制器，唯一时间入口<br>
	 * 1、主渲染跑道的循环，引擎优先级最高Number.NEGATIVE_INFINITY<br>
	 * 2、进入帧事件的派发，引擎优先级最低Number.POSITIVE_INFINITY<br>
	 * 最先执行渲染跑道，当派发进入帧事件后才会进入逻辑跑道。因此，引擎内部执行监听选中间值，
	 * @author 
	 *
	 */
	export class Ticker extends RM.EventDispatcher{
    	
        private static EVENT_TYPE: string = "ticker_type";
        /** 暂停*/
        private _paused: boolean = false;
        /**时间回调函数列表*/
        private _callBackList: Array<RM.EventCallbackData> = [];
        /**时间回调函数在执行中时的缓存执行列表*/
        private _callList: Array<RM.EventCallbackData> = null;
        /**时间回调函数在执行过程中，如果删除了其他定时器函数，就必须在缓存列表中即时的删除掉，
         * 这个索引值代表当前定时器回调函数在缓存列表中的位置，从这个位置的下一位开始，
         * 至道缓存列表的末尾，在这个区间内查找需要删除的定时器函数，如果找到则删除。*/
        private _callIndex: number = -1;
        
        private static _instance: RM.Ticker;
		public constructor() {
            super();
            this._callBackList = [];
		}
        public static getInstance(): RM.Ticker
		{
            if( !this._instance )
            {
                this._instance = new RM.Ticker();
            }
            return this._instance;
		}
        public paused(): void
		{
            this._paused = true;
		}
        public resume(): void
		{
            this._paused = false;
		}
		/**添加侦听，如果在事件内部调用，则在下一帧才会触发*/
        public register( listener: Function, thisObject: any, priority?: number ):void
        {
            if( typeof priority === "undefined" )
            {
                priority = 0;
            }
            var list: Array<RM.EventCallbackData> = this._callBackList;
            this.insertEventToList( list, RM.Ticker.EVENT_TYPE, listener, thisObject, priority );
        }
        /**取消监听*/
        public unregister( listener: Function, thisObject: any ): void
        {
            var list: Array<RM.EventCallbackData> = this._callBackList;
            this.removeEventForList( list, RM.Ticker.EVENT_TYPE, listener, thisObject );
            //防止在定时器回调函数内删除其他定时器
            if( this._callList && this._callIndex > -1 )
            {
                this.removeEventForList( this._callList, RM.Ticker.EVENT_TYPE, listener, thisObject, this._callIndex );
            }
        }
        
        /**帧刷新定时器函数*/
        public _update( advancedTime: number ): void
        {
            if( this._paused ) return;
            //备份列表，防止响应回调时增加监听时，队列会增长
            this._callList = this._callBackList.concat();
            this._callIndex = 0;
            var eventData: RM.EventCallbackData;
            //动态计算_callList的长度，防止回调时删除后续的监听，而引起再次响应
            for( ;this._callIndex < this._callList.length;this._callIndex++ )
            {
                eventData = this._callList[this._callIndex];
                eventData.listener.call( eventData.thisObject, advancedTime );
            }
            this._callList = null;
            this._callIndex = -1;
        }
        /**启动心跳控制器，此函数只在启动引擎时执行一次。*/
        public run(): void
        {
            RM.MainContext.ENGINE_START_TIME = new Date().getTime();
            var context: RM.DeviceContext = RM.MainContext.getInstance().deviceContext;
            context.executeMainLoop( this._update, this );
        }
        
	}
}
