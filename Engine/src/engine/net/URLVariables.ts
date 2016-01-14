///<reference path="../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/27.
 */
module RM {
    /**
     * 使用 URLVariables 类可以在应用程序和服务器之间传输变量。
     * 将 URLVariables 对象与 URLLoader 类的方法、URLRequest 类的 data 属性一起使用。
     */
    export class URLVariables extends RM.HashObject {

        /** 包含名称/值对的 URL 编码的字符串。 **/
        public data:string="";

        public constructor( data:string ) {
            super();
            this.data = data;
        }
    }
}