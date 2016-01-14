module RM {
	/**
	 * 日志
	 * @author
	 *
	 */
	export class Log {
    	/**开启debug*/
        public static OPEN_DEBUG: boolean = true;

        public static STRING:string = "";

		public constructor() {
		}
        /** 打印日志 */
        public static print( ...args ):void
		{
            if ( !RM.Log.OPEN_DEBUG ) return;
            console.log( args.toString() );
            RM.Log.STRING += args.toString()+"\n";
		}

        /**错误日志*/
        public static warning( ...args ): void
        {
            if ( !RM.Log.OPEN_DEBUG ) return;
            console.warn( args.toString() );
            RM.Log.STRING += args.toString();
        }
	}
}
