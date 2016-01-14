module RM {
	/**
	 * 延迟调用函数，在下次渲染执行之前进行调用。
	 * @author 
	 *
	 */
	export class DelayedCallback {
    	
        private static _callbackFunctionList: Array<any> = [];
        private static _callbackThisObjectList: Array<any> = [];
        private static _callbackArgsList: Array<any> = [];
    	
        /**
         * 添加延迟回调函数，在下次渲染执行之前进行回调
         * @param function 延迟函数
         * @param thisObject 延迟回调对象
         * @param args[] 延迟回调函数参数列表
         * */
        public static delayCallback( fun: Function, thisObject: any, ...args ): void
        {
            RM.DelayedCallback._callbackFunctionList.push( fun );
            RM.DelayedCallback._callbackThisObjectList.push( thisObject );
            RM.DelayedCallback._callbackArgsList.push( args );
            
        }
        
        /**
         * 执行调用所有延迟函数，会清空延迟调用函数列表
         * */
        public static doCallback(): void
        {
            var len: number = RM.DelayedCallback._callbackFunctionList.length;
            if ( len == 0 ) return;
            
            var callfuns: Array<any> = RM.DelayedCallback._callbackFunctionList.concat();
            var thisObjs: Array<any> = RM.DelayedCallback._callbackThisObjectList.concat();
            var args: Array<any> = RM.DelayedCallback._callbackArgsList.concat();
            
            RM.DelayedCallback.clear();
            
            var fun: Function;
            for ( var idx: number = 0; idx < len; idx++ )
            {
                fun = callfuns[idx];
                if( fun )
                {
                    fun.apply( thisObjs[idx], args[idx] );
                }
            }
        }
        /**
         * 清空延迟调用函数列表
         * */
        public static clear():void
        {
            RM.DelayedCallback._callbackFunctionList.length = 0;
            RM.DelayedCallback._callbackThisObjectList.length = 0;
            RM.DelayedCallback._callbackArgsList.length = 0;
        }
        
		public constructor() {
		}
	}
}
