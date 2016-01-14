///<reference path="../../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/27.
 */
module RM {

    /**
     * 表示XMLHttpRequest对象的状态：<br>
     * 0：未初始化。对象已创建，未调用open；<br>
     * 1：open方法成功调用，但Sendf方法未调用；<br>
     * 2：send方法已经调用，尚未开始接受数据；<br>
     * 3：正在接受数据。Http响应头信息已经接受，但尚未接收完成；<br>
     * 4：完成，即响应数据接受完成。
     * **/
    enum READY_STATE
    {
        state_0,
        state_1,
        state_2,
        state_3,
        state_4
    }

    /**
     *引擎的XMLHttpRequest封装<br>
     *2015/10/27
     *Rich
     */
    export class H5XMLHttpRequest extends RM.HashObject {

        /** 响应数据接收完成回调 **/
        private _onCompleteFunc:Function;
        /** 响应数据接收完成回调参数列表 **/
        private _onCompleteFuncArgs:Array<any>;
        /** 响应数据接收错误时回调 **/
        private _onErrorFunc:Function;
        /** 响应数据接收错误时回调参数列表 **/
        private _onErrorFuncArgs:Array<any>;
        /** XMLHttpRequest请求对象 **/
        private _XHR:XMLHttpRequest;
        /** thisObj接收完成回调的this对象 **/
        private _thisObj:any;


        public constructor() {
            super();
            this._XHR = this.createXMLHttpRequest();
            var self:RM.H5XMLHttpRequest = this;
            /** 请求状态改变的事件触发器（readyState变化时会调用这个属性上注册的javascript函数）。
             *2015/10/27
             */
            this._XHR.onreadystatechange = function ():void {
                if (self._XHR.readyState == READY_STATE.state_0) {

                } else if (self._XHR.readyState == READY_STATE.state_1) {

                } else if (self._XHR.readyState == READY_STATE.state_2) {

                } else if (self._XHR.readyState == READY_STATE.state_3) {

                } else if (self._XHR.readyState == READY_STATE.state_4) {
                    //200正确的数据返回
                    if (self._XHR.status == 200) {
                        if (self._onCompleteFunc) {
                            self._onCompleteFunc.apply(self._thisObj, self._onCompleteFuncArgs);
                        }
                    }
                    else {
                        if (self._onErrorFunc) {
                            self._onErrorFunc.apply(self._thisObj, self._onErrorFuncArgs);
                        }
                    }
                }
            }
        }

        /**
         * 创建
         *2015/10/27
         */
        public static create():RM.H5XMLHttpRequest {
            return new RM.H5XMLHttpRequest();
        }


        /** 服务器响应的文本内容 **/
        public get responseText():string {
            return this._XHR.responseText;
        }

        /** 服务器响应的BINARY内容 **/
        public get response():string {
            return this._XHR.response;
        }

        /** 服务器响应的XML内容对应的DOM对象 **/
        public get responseXML():any {
            return this._XHR.responseXML;
        }

        /** 服务器返回的http状态码。200表示“成功”，404表示“未找到”，500表示“服务器内部错误”等。 **/
        public get status():number {
            return this._XHR.status;
        }

        /** 服务器返回状态的文本信息。 **/
        public get statusText():string {
            return this._XHR.statusText;
        }

        /**
         * 表示XMLHttpRequest对象的状态：<br>
         * 0：未初始化。对象已创建，未调用open；<br>
         * 1：open方法成功调用，但Sendf方法未调用；<br>
         * 2：send方法已经调用，尚未开始接受数据；<br>
         * 3：正在接受数据。Http响应头信息已经接受，但尚未接收完成；<br>
         * 4：完成，即响应数据接受完成。
         * **/
        public get readyState():number {
            return this._XHR.readyState;
        }

        /**
         * 获取一个XMLHttpRequest请求（兼容IE）
         *2015/10/27
         */
        private createXMLHttpRequest():XMLHttpRequest {
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            }
            else if (window["ActiveXObject"]) {
                var activeNameList = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
                var len:number = activeNameList.length;
                for (var idx:number = 0; idx < len; idx++) {
                    try {
                        return new ActiveXObject(activeNameList[idx]);
                    }
                    catch (e) {
                    }
                }
            }
            else {
                RM.Log.warning("H5XMLHttpRequest:创建XMLHttpRequest失败！！");
                return null;
            }
        }

        /**
         *注册响应完成回调
         * 第一个参数为H5XMLHttpRequest，后续为传入的参数列表
         *2015/10/27
         */
        public addCompleteFunc(thisObj:any, callFunc:Function, callFuncArgs?:Array<any>, errorFunc?:Function, errorFuncArgs?:Array<any>):void {
            this._thisObj = thisObj;
            this._onCompleteFunc = callFunc;
            this._onErrorFunc = errorFunc;
            this._onCompleteFuncArgs = callFuncArgs;
            this._onErrorFuncArgs = errorFuncArgs;

            if (!this._onCompleteFuncArgs) {
                this._onCompleteFuncArgs = [];
            }
            if (!this._onErrorFuncArgs) {
                this._onErrorFuncArgs = [];
            }

            this._onCompleteFuncArgs.unshift(this);
            this._onErrorFuncArgs.unshift(this);
        }

        /**
         *指定和服务器端交互的HTTP方法，URL地址，即其他请求信息；
         * Method:表示http请求方法，一般使用"GET","POST".
         * url：表示请求的服务器的地址；
         * asynch：表示是否采用异步方法，true为异步，表示脚本会在 send() 方法之后继续执行，而不等待来自服务器的响应。
         *         false为同步，需要在等待服务器响应。
         * username：用户名，提供http认证机制需要的用户名和密码
         * password：密码，提供http认证机制需要的用户名和密码
         *2015/10/27
         */
        public open(httpMethod:string, url:string, asynch:boolean = true, username?:string, password?:string):void {
            this._XHR.open(httpMethod, url, asynch);
        }

        /**
         * 向服务器发出请求，如果采用异步方式，该方法会立即返回。
         * data可以指定为null表示不发送数据，其内容可以是DOM对象，输入流或字符串。
         *2015/10/27
         */
        public send(data:any = null):void {
            this._XHR.send(data);
        }

        /**
         *停止当前http请求。对应的XMLHttpRequest对象会复位到未初始化的状态。
         *2015/10/27
         */
        public abort():void {
            this._XHR.abort();
        }

        /**
         *设置HTTP请求中的指定头部header的值为value.
         *此方法需在open方法以后调用，一般在post方式中使用。
         *2015/10/27
         */
        public setRequestHeader(header:string, value:string):void {
            this._XHR.setRequestHeader(header, value);
        }

        /**
         *返回包含Http的所有响应头信息，其中相应头包括Content-length,date,uri等内容。
         *返回值是一个字符串，包含所有头信息，其中每个键名和键值用冒号分开，每一组键之间用CR和LF（回车加换行符）来分隔！
         *2015/10/27
         */
        public getAllResponseHeaders():string {
            return this._XHR.getAllResponseHeaders();
        }

        /**
         *返回HTTP响应头中指定的键名header对应的值
         *2015/10/27
         */
        public getResponseHeader(header:string):string {
            return this._XHR.getResponseHeader(header);
        }

        /**
         *通过指定的RM.URLRequest与服务器端交互<br>
         *会先执行open再send方法。
         *2015/10/27
         */
        public sendByURLRequest(request:RM.URLRequest, asynch:boolean = true, username?:string, password?:string):void {

            var url:string = request.url;
            if (url.indexOf("?") == -1 && request.method == RM.URLRequestMethod.GET
                && request.data && (request.data instanceof RM.URLVariables)) {
                url += "?" + request.data.toString();
            }
            this.open(request.method, url, asynch, username, password);

            if (request.method == RM.URLRequestMethod.GET || !request.data) {
                this._XHR.send();
            }
            else if (request.data instanceof RM.URLVariables) {
                this._XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                this._XHR.send(request.data.toString());
            }
            else {
                this._XHR.setRequestHeader("Content-Type", "multipart/form-data");
                this._XHR.send(request.data);
            }
        }

    }
}