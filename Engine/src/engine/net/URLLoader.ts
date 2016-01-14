///<reference path="../events/EventDispatcher.ts"/>
module RM {
	/**
	 * 网络加载类，通过url进行加载二进制文件、文本文件、图片及数据
	 * @author 
	 *
	 */
	export class URLLoader extends RM.EventDispatcher{
    	
        public dataFormat: string = RM.URLLoaderDataFormat.TEXT;
        public data: any = null;
        public request: RM.URLRequest = null;
    	
		public constructor() {
            super();
		}

        /**
         *
         *2015/10/29
         */
        public static create():RM.URLLoader {
            return new RM.URLLoader();
        }

		public load( request:RM.URLRequest ):void
		{
            this.request = request;
            this.data = null;
            RM.MainContext.getInstance().netContext.proceed(this);
		}
		public reset():void
		{
            this.dataFormat = RM.URLLoaderDataFormat.TEXT;
            this.data = null;
            this.request = null;
		}
	}
}
