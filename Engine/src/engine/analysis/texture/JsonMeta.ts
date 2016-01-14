///<reference path="../../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/30.
 */
module RM {
    export class JsonMeta extends RM.HashObject {

        private _image:string;
        private _version:string;
        private _format:string;
        private _width:number;
        private _height:number;
        private _scale:number;

        public constructor(data:any) {
            super();
            this._image = data.image;
            this._version = data.version;
            this._format = data.format;
            this._scale = data.scale;
            if (data.size) {
                this._width = data.size.w;
                this._height = data.size.h;
            }
        }

        /**
         *
         *2015/10/30
         */
        public static create(data:any):RM.JsonMeta {
            return new RM.JsonMeta(data);
        }

        public get image():string {
            return this._image;
        }

        public get version():string {
            return this._version;
        }

        public get format():string {
            return this._format;
        }

        public get width():number {
            return this._width;
        }

        public get height():number {
            return this._height;
        }

        public get scale():number {
            return this._scale;
        }
    }
}