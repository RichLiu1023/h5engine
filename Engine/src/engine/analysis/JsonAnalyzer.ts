///<reference path="../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/11/1.
 */
module RM {
    export class JsonAnalyzer extends RM.HashObject {

        /** JSON文件缓存 **/
        private static _jsonResMap:any = {};

        /** 原始json数据 **/
        private _json:any;
        /** textureJson数据 **/
        private _jsonTextureFile:RM.JsonTextureFile;
        /**
         * 创建,如果传入url参数则会缓存。可根据url再次获得（RM.JsonAnalyzer.getJsonAnalyzer）<br>
         *     相同的url将会覆盖旧的缓存。
         *2015/10/29
         */
        public constructor(data:any, url?:string) {
            super();
            this._json = JSON.parse(data);
            if( url && url.length>0 )
            {
                RM.JsonAnalyzer._jsonResMap[url] = this;
            }
        }

        /**
         * 创建,如果传入url参数则会缓存。可根据url再次获得（RM.JsonAnalyzer.getJsonAnalyzer）<br>
         *     相同的url将会覆盖旧的缓存。
         *2015/10/29
         */
        public static create(data:any, url?:string):RM.JsonAnalyzer {
            return new RM.JsonAnalyzer(data, url);
        }

        /**
         *通过URL获取RM.JsonAnalyzer
         *2015/11/1
         */
        public static getJsonAnalyzer(url:string):RM.JsonAnalyzer {
            return RM.JsonAnalyzer._jsonResMap[url];
        }

        /**
         * 获取原始JSON数据
         *2015/11/1
         */
        public getJson():any {
            return this._json;
        }
        /**
         * 获取TextureJSON数据
         *2015/11/1
         */
        public getJsonTextureFile():RM.JsonTextureFile {
            if( !this._jsonTextureFile )
            {
                this._jsonTextureFile = RM.JsonTextureFile.create(this._json);
            }
            return this._jsonTextureFile;
        }

    }
}