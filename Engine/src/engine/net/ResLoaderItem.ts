///<reference path="../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/29.
 */
module RM {
    export class ResLoaderItem extends RM.HashObject {

        /** 加载器 **/
        private _loader:RM.URLLoader;
        /** 加载路径 **/
        private _url:string = "";
        /** 是否已经加载 **/
        private _isComplete:boolean = false;
        /** 是否正在加载 **/
        private _isLoading:boolean = false;
        /** 使用的Group **/
        private _useGroup:RM.ResGroupItem;

        /**
         *url 加载路径。
         * isStart 是否立即开始加载。
         *2015/10/29
         */
        public constructor(url:string, isStart:boolean = false, useGroup?:RM.ResGroupItem) {
            super();
            this._url = url;
            this._useGroup = useGroup;
            if (!this._loader) {
                this._loader = RM.URLLoader.create();
            }
            this._loader.addEventListener(RM.Event.COMPLETE, this.onComplete, this);
            if (isStart) {
                this.load();
            }
        }

        /**
         *url 加载路径。
         * isStart 是否立即开始加载。
         *2015/10/29
         */
        public static create(url:string, isStart:boolean = false, useGroup?:RM.ResGroupItem):RM.ResLoaderItem {
            return new RM.ResLoaderItem(url, isStart, useGroup);
        }

        /**
         *重置
         *2015/10/29
         */
        public reset():void {
            this._isComplete = false;
            this._isLoading = false;
            this._loader.reset();
            this._url = "";
            this._useGroup = null;
        }

        /**
         *延迟加载调用。
         * 0 表示开始加载。
         * 1 表示正在加载。
         * 2 表示已加载完成。
         * 3 表示url错误加载失败。
         * 4 表示url文件类型不支持。
         * 如果url与创建时传入的url不同，则以最新的url代替创建时的url。
         * 并立即开始加载。
         *2015/10/29
         */
        public load(url?:string):number {
            if (this._isComplete) {
                this.sendGroupComplete(2);
                return 2;
            }
            if (this._isLoading)return 1;
            if (url) {
                if (url.length <= 0) {
                    this.sendGroupComplete(3);
                    RM.Log.print("ResLoaderItem.load 传入的URL错误！");
                    return 3;
                }
            }
            else if (this._url.length <= 0) {
                this.sendGroupComplete(3);
                RM.Log.print("ResLoaderItem.load 原始URL错误！");
                return 3;
            }
            var type:string = "";
            if (url) {
                type = this.getLoaderType(url);
                if (!type) {
                    this.sendGroupComplete(4);
                    return 4;
                }
            }

            if (url && this._url != url) {
                if (this._url && this._url.length > 0) {
                    RM.Log.print("ResLoaderItem.load 传入的URL与创建时传入的URL不同，原", this._url, "新", url);
                }
                this._url = url;
            }

            if (this._url) {
                type = this.getLoaderType(this._url);
                if (!type) {
                    this.sendGroupComplete(4);
                    return 4;
                }
            }
            this._loader.dataFormat = type;

            this._isLoading = true;
            this._loader.load(RM.URLRequest.create(this._url));
            return 0;
        }

        /**
         *
         *2015/10/29
         */
        private onComplete(event:RM.Event):void {
            this._loader.removeEventListener(RM.Event.COMPLETE, this.onComplete, this);
            this._isComplete = true;
            switch (this._loader.dataFormat) {
                case RM.URLLoaderDataFormat.JSON:
                    RM.JsonAnalyzer.create(this._loader.data, this._url);
                    break;
                case RM.URLLoaderDataFormat.TEXT:

                    break;
                //目前图片资源，在加载完成时会自动存在Texture列表中
                case RM.URLLoaderDataFormat.TEXTURE:

                    break;
                case RM.URLLoaderDataFormat.BINARY:

                    break;
                case RM.URLLoaderDataFormat.SOUND:

                    break;
            }

            this.sendGroupComplete(2);
        }

        /**
         *
         *2015/10/29
         */
        private onError(event:RM.Event):void {
            this.sendGroupComplete(3);
        }

        /**
         *获取加载类型，识别引擎可以家在并处理的文件
         *2015/10/29
         *Rich
         */
        private getLoaderType(url:string):string {
            if (!url) {
                RM.Log.warning("暂无解析类型", url);
                return null;
            }
            var typeList:Array<string> = url.split(".");
            var len:number = typeList.length;
            if (len == 0) {
                RM.Log.warning("暂无解析类型", url);
                return null;
            }
            var type:string = "." + typeList[typeList.length - 1];
            switch (type) {
                case RM.Res.RES_TYPE_JPG:
                case RM.Res.RES_TYPE_PNG:
                    return RM.URLLoaderDataFormat.TEXTURE;
                    break;
                case RM.Res.RES_TYPE_JSON:
                    return RM.URLLoaderDataFormat.JSON;
                    break;
                case RM.Res.RES_TYPE_SWF:

                    break;
                case RM.Res.RES_TYPE_MP3:

                    break;
                case RM.Res.RES_TYPE_DAT:

                    break;
                case RM.Res.RES_TYPE_RES:

                    break;
            }

            RM.Log.warning("暂无解析类型", url);
            return null;
        }


        /**
         *对Group对象发送完成
         *2015/10/30
         */
        private sendGroupComplete(tag:number):void {
            if (this._useGroup) {
                this._useGroup._loadCompleteOnce(tag);
            }
        }

    }
}