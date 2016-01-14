///<reference path="../../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/30.
 */
module RM {
    export class JsonTextureFile extends RM.HashObject {

        private _meta:RM.JsonMeta;
        private _frames:Array<RM.JsonFrame>;


        private fileJson:Array<string> = ["meta", "frames"];
        private egretFileJson:Array<string> = ["file", "frames"];
        private egretMCJson:Array<string> = ["mc", "res"];

        public constructor(data:any) {
            super();
            this.analyzing(data);
        }

        /**
         *接收通过JSON处理后的纹理文件
         *2015/10/30
         */
        public static create(data:any):RM.JsonTextureFile {
            return new RM.JsonTextureFile(data);
        }

        /**
         *
         *15/10/31
         */
        private create(data:any):void {
            this._meta = RM.JsonMeta.create(data.meta);
            this._frames = [];
            var len:number = data.frames.length;
            for (var idx = 0; idx < len; idx++) {
                this._frames.push(RM.JsonFrame.create(data.frames[idx]));
            }
        }

        /**
         *TexturePacker导出的Json文件的详情信息
         *2015/10/30
         *Rich
         */
        public get meta():RM.JsonMeta {
            return this._meta;
        }

        /**
         *TexturePacker导出的Json文件的资源信息列表
         *2015/10/30
         *Rich
         */
        public get frames():Array<RM.JsonFrame> {
            return this._frames;
        }

        /**
         *通过纹理名字，获取JSON数据
         *2015/10/30
         */
        public getJsonFrameformName(name:string):RM.JsonFrame {
            if (!this._frames)return null;
            var len:number = this._frames.length;
            for (var idx = 0; idx < len; idx++) {
                var frame:RM.JsonFrame = this._frames[idx];
                if (frame.filename == name) {
                    return frame;
                }
            }
            return null;
        }

        /**
         *解析JSON，转换为引擎支持的数据
         *15/10/31
         */
        private analyzing(data:any):void {

            if( this.fileJsonAnalyzing(data) )return;
            if( this.egretFileJsonAnalyzing(data) )return;

            RM.Log.warning("引擎不支持的JSON纹理文件！");
        }

        /**
         *引擎解析
         *15/10/31
         */
        private fileJsonAnalyzing(data:any):boolean {
            var len:number = this.fileJson.length;
            for (var idx = 0; idx < len; idx++) {
                if (!data.hasOwnProperty(this.fileJson[idx])) {
                    return false;
                }
            }

            this.create(data);

            return true;
        }

        /**
         *白鹭Json文件解析
         *15/10/31
         */
        private egretFileJsonAnalyzing(data:any):boolean {

            var len:number = this.egretFileJson.length;
            for (var idx = 0; idx < len; idx++) {
                if (!data.hasOwnProperty(this.egretFileJson[idx])) {
                    return false;
                }
            }

            var frames:Array<any> = [];
            for (var key in data.frames) {
                var obj:any = data.frames[key];
                frames.push({
                    filename: key,
                    frame: {
                        x: obj.x,
                        y: obj.y,
                        w: obj.w,
                        h: obj.h
                    }
                });
            }

            var fileData:any = {
                meta: {image: data.file},
                frames: frames
            };

            this.create(fileData);

            return true;
        }

    }
}