///<reference path="../utils/HashObject.ts"/>
module RM {
	/**
	 * URLRequest类捕获单个HTTP请求中的所有信息
	 * @author 
	 *
	 */
	export class URLRequest extends RM.HashObject{
    	
        private _url: string = "";
        /**
         * 一个对象，它包含将随 URL 请求一起传输的数据。
         * 该属性与 method 属性配合使用。当 method 值为 GET 时，将使用 HTTP 查询字符串语法将 data 值追加到 URLRequest.url 值。
         * 当 method 值为 POST（或 GET 之外的任何值）时，将在 HTTP 请求体中传输 data 值。
         * URLRequest API 支持二进制 POST，并支持 URL 编码变量和字符串。该数据对象可以是 ByteArray、URLVariables 或 String 对象。
         * 该数据的使用方式取决于所用对象的类型：
         * 如果该对象为 ByteArray 对象，则 ByteArray 对象的二进制数据用作 POST 数据。对于 GET，不支持 ByteArray 类型的数据。
         * 如果该对象是 URLVariables 对象，并且该方法是 POST，则使用 x-www-form-urlencoded 格式对变量进行编码，并且生成的字符串会用作 POST 数据。
         * 如果该对象是 URLVariables 对象，并且该方法是 GET，则 URLVariables 对象将定义要随 URLRequest 对象一起发送的变量。
         * 否则，该对象会转换为字符串，并且该字符串会用作 POST 或 GET 数据。
         */
        public data: any = null;

        public method:string = RM.URLRequestMethod.GET;
        /**
         * URLRequest类捕获单个HTTP请求中的所有信息
         * @author
         *
         */
		public constructor( url:string ) {
            super();
            this._url = url;
		}

        /**
         *创建
         *2015/10/28
         */
        public static create(url:string):RM.URLRequest {
            return new RM.URLRequest(url);
        }
		public reset():void
		{
            this._url = "";
            this.data = null;
            this.method = RM.URLRequestMethod.GET;
		}


        public get url():string {
            return this._url;
        }

        public set url(value:string) {
            this._url = value;
        }
    }
}
