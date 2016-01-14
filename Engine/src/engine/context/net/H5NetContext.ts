///<reference path="NetContext.ts"/>
module RM {
    /**
     * 网络加载类，根据不同的类型进行加载数据
     * @author
     *
     */
    export class H5NetContext extends RM.NetContext {
        public constructor() {
            super();
        }

        public proceed(loader:RM.URLLoader):void {
            var H5XHR:RM.H5XMLHttpRequest;
            if (loader.dataFormat == RM.URLLoaderDataFormat.TEXTURE) {
                this.loadTexture(loader);
            }
            else if (loader.dataFormat == RM.URLLoaderDataFormat.TEXT
                || loader.dataFormat == RM.URLLoaderDataFormat.JSON
                || loader.dataFormat == RM.URLLoaderDataFormat.BINARY) {
                H5XHR = RM.H5XMLHttpRequest.create();
                H5XHR.addCompleteFunc(this, this.onComplete, [loader], this.onError);
                H5XHR.sendByURLRequest(loader.request);
            } else if (loader.dataFormat == RM.URLLoaderDataFormat.SOUND) {


            }
        }

        private loadTexture(loader:RM.URLLoader):void {
            RM.Texture.createBitmapData(loader.request.url, function (code:number, bitmapData:any):void {
                if (code != 0) {
                    RM.Log.warning("H5NetContext.loadTexture is IOError,path:", loader.request.url);
                    return;
                }
                var texture:RM.Texture = RM.Texture.create(bitmapData);
                loader.data = texture;
                RM.DelayedCallback.delayCallback(RM.Event.dispatchEvent, RM.Event, loader, RM.Event.COMPLETE);
            })
        }

        /**
         * 加载完成
         *2015/10/28
         */
        private onComplete(XHR:RM.H5XMLHttpRequest, loader:RM.URLLoader):void {
            switch (loader.dataFormat) {
                case RM.URLLoaderDataFormat.TEXT:
                    loader.data = XHR.responseText;
                    break;
                case RM.URLLoaderDataFormat.BINARY:
                    loader.data = XHR.response;
                    break;
                case RM.URLLoaderDataFormat.JSON:
                    loader.data = XHR.responseText;
                    break;
            }
            RM.DelayedCallback.delayCallback(RM.Event.dispatchEvent, RM.Event, loader, RM.Event.COMPLETE);
        }

        /**
         * 加载失败
         *2015/10/28
         */
        private onError(XHR:RM.H5XMLHttpRequest):void {
            RM.Log.warning("H5NetContext:loader error!", XHR.statusText);
        }
    }
}
