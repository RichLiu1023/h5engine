///<reference path="HashObject.ts"/>
/**
 * Created by Rich on 2015/10/22.
 *
 * 对象池，使用对象池的对象必须实现
 * public reset():void{}函数
 */
module RM {
    export class PoolUtil extends RM.HashObject {

        private _poolList:Array<any> = [];
        private _poolClassName:any;
        public static CLASSLIST:Array<any>=[];
        public constructor( className:any ) {
            super();
            this._poolClassName = className;
            RM.PoolUtil.CLASSLIST.push(className);
        }

        /**
         *
         *2015/10/22
         */
        public getObject():any {
            var object:any;
            if( this._poolList.length>0 )
            {
                object = this._poolList.shift();
                object.reset();
            }
            else
            {
                object = new this._poolClassName();
            }
            return object;
        }

        /**
         *
         *2015/10/22
         */
        public release(object:any):void {
            this._poolList.push(object);
        }

        public getLength():number
        {
            return this._poolList.length;
        }

        public static toStringClassList():string{
            var str:string = "";
            for (var idx = 0; idx < RM.PoolUtil.CLASSLIST.length; idx++) {
                var obj = RM.PoolUtil.CLASSLIST[idx];
                str += obj.name +" Pool: " +obj.PoolUtil.getLength()+"\n";
            }
            return str;
        }

    }
}