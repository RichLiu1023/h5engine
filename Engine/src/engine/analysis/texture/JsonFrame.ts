///<reference path="../../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/30.
 */
module RM {
    export class JsonFrame extends RM.HashObject {

        private _x:number;
        private _y:number;
        private _w:number;
        private _h:number;
        private _filename:string;

        public constructor(data:any) {
            super();
            this._filename = data.filename;
            if (data.frame) {
                this._x = data.frame.x;
                this._y = data.frame.y;
                this._w = data.frame.w;
                this._h = data.frame.h;
            }
        }

        /**
         *
         *2015/10/30
         */
        public static create(data:any):RM.JsonFrame {
            return new RM.JsonFrame(data);
        }

        public get x():number {
            return this._x;
        }

        public get y():number {
            return this._y;
        }

        public get w():number {
            return this._w;
        }

        public get h():number {
            return this._h;
        }

        public get filename():string {
            return this._filename;
        }

    }
}