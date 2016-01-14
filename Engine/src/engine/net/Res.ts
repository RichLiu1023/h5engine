///<reference path="ResGroupItem.ts"/>
/**
 * Created by Rich on 2015/10/29.
 */
module RM {
    export class Res extends RM.HashObject {


        //资源文件类型
        public static RES_TYPE_JPG:string = ".jpg";//JPG
        public static RES_TYPE_PNG:string = ".png";//PNG
        public static RES_TYPE_SWF:string = ".swf";//SWF/ZFY
        public static RES_TYPE_DAT:string = ".dat";//DAT
        public static RES_TYPE_RES:string = ".res";//RES
        public static RES_TYPE_TXT:string = ".txt";//TXT
        public static RES_TYPE_MP3:string = ".mp3";//MP3
        public static RES_TYPE_JSON:string = ".json";//MP3

        public constructor() {
            super();
        }

        /**
         *
         * @param list
         * @param callback function( RM.ResGroupItem )
         * @param list
         *2015/10/30
         */
        public static loadGroup(list:Array<string>, callback?:Function, thisObj?:any):void {
            RM.ResGroupItem.create(list,callback,thisObj).load();
        }


    }
}