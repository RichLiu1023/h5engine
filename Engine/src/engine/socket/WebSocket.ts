/**
 * Created by Rich on 15/12/5.
 */

module RM {
	export class WebSocket {

		/** 正在连接 **/
		public static CONNECTING:number = 0;
		/** 已连接 **/
		public static OPEN:number = 1;
		/** 正在关闭 **/
		public static CLOSING:number = 2;
		/** 已关闭 **/
		public static CLOSED:number = 3;

		private _socket;
		private _thisObj:any;
		private _onConnect:Function;
		private _onError:Function;
		private _onMessage:Function;
		private _onClose:Function;

		private _host:string;
		private _port:number;
		private _url:string;

		public constructor() {
			if ( !window[ "WebSocket" ] ) {
				RM.Log.warning( "window no supports of WebScoket!" );
			}
		}

		/**
		 * Create WebSocket.
		 * WebSocket's "binaryType" default value is "arraybuffer".
		 * "binaryType" can sclect value "arraybuffer" or "blob"
		 * @returns {RM.WebSocket}
		 */
		public static create():RM.WebSocket {
			return new RM.WebSocket();
		}

		/**
		 * Add Listener Function.
		 * @param onConnect
		 * @param onError
		 * @param onMessage 需要参数(data)
		 * @param onClose
		 * @param thisObj
		 * @returns {RM.WebSocket}
		 *
		 */
		public addListener( onConnect:Function, onError:Function, onMessage, onClose:Function, thisObj:any ):RM.WebSocket {

			this._onConnect = onConnect;
			this._onError = onError;
			this._onMessage = onMessage;
			this._onClose = onClose;
			this._thisObj = thisObj;
			return this;
		}

		/**
		 * Connect webserver by host and post.
		 * @param host
		 * @param port
		 * @returns {RM.WebSocket}
		 */
		public connect( host:string, port:number ):RM.WebSocket {

			this._host = host;
			this._port = port;
			var socketUrl:string = "ws://" + host + ":" + port;
			this.connectByUrl( socketUrl );
			return this;
		}

		/**
		 * Connect websocket by url.
		 * @param url
		 * @returns {RM.WebSocket}
		 */
		public connectByUrl( url:string ):RM.WebSocket {

			this._url = url;
			this._socket = new window[ "WebSocket" ]( url );
			this._socket.binaryType = "arraybuffer";
			this.bindListener();
			return this;
		}


		/**
		 * 允许应用程序以 UTF-8 文本、ArrayBuffer 或 Blob 的形式将消息发送至 Websocket 服务器。
		 * 它将验证 Websocket 的 readyState 是否为 OPEN.
		 * @param message
		 */
		public send( message:any ):void {

			if ( this.getSocketState() != RM.WebSocket.OPEN ) return;
			this._socket.send( message );
		}

		/**
		 * 关闭连接
		 */
		public close():void {

			if ( this._socket ) {
				this._socket.close();
			}
		}

		/**
		 * 获取网络状态
		 * 0 正在连接
		 * 1 已连接
		 * 2 正在关闭
		 * 3 已关闭
		 * @returns {number}
		 */
		public getSocketState():number {

			if ( this._socket ) {
				return this._socket.readyState;
			}
			return RM.WebSocket.CLOSED;
		}


		private bindListener():void {
			var self = this;
			this._socket.onopen = function () {
				if ( self._onConnect ) {
					self._onConnect.call( self._thisObj );
				}
			};
			this._socket.onerror = function ( event ) {
				if ( self._onError ) {
					self._onError.call( self._thisObj );
				}
			};
			this._socket.onmessage = function ( event ) {
				if ( self._onMessage ) {
					self._onMessage.call( self._thisObj, event.data );
				}
			};
			this._socket.onclose = function ( event ) {
				if ( self._onClose ) {
					self._onClose.call( self._thisObj );
				}
			};
		}

		/**
		 * 设定websocket的binaryType属性
		 * @param type  ｛ 0:blob，1:arraybuffer ｝default：1
		 */
		public setBinaryType( type:number ):void {

			if ( !this._socket )return;
			var binaryType:string = "arraybuffer";
			switch ( type ) {
				case 0:
					binaryType = "blob";
					break;
				case 1:
					binaryType = "arraybuffer";
					break;
			}
			this._socket.binaryType = binaryType;
		}

		public get host():string {
			return this._host;
		}

		public get port():number {
			return this._port;
		}

		public get url():string {
			return this._url;
		}

	}
}
