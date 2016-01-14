///<reference path="../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/30.
 */
module RM {
    export class ResGroupItem extends RM.HashObject {

        private _group:Array<string>;
        private _isComplete:boolean = true;
        private _loadCompleteNum:number = 0;
        private _loadAllNum:number = 0;
        private _callback:Function;
        private _thisObj:any;


        public constructor(group:Array<string>, callback?:Function, thisObj?:any) {
            super();
            this._callback = callback;
            this._group = group;
            this._isComplete = false;
            this._loadAllNum = group.length;
            this._loadCompleteNum = 0;
            this._thisObj = thisObj;
        }

        /**
         *加载一个url列表
         * 进度回调必须传递callback与thisObj
         *2015/10/30
         */
        public static create(group:Array<string>, callback?:Function, thisObj?:any):RM.ResGroupItem {
            return new RM.ResGroupItem(group, callback, thisObj);
        }

        public get group():Array<string> {
            return this._group;
        }

        public get isComplete():boolean {
            return this._isComplete;
        }

        public get loadCompleteNum():number {
            return this._loadCompleteNum;
        }

        public get loadAllNum():number {
            return this._loadAllNum;
        }

        /**
         *
         *2015/10/30
         */
        public reset():void {
            this._callback = null;
            this._group = null;
            this._thisObj = null;
            this._isComplete = true;
            this._loadAllNum = 0;
            this._loadCompleteNum = 0;
        }

        /**
         *
         *2015/10/30
         */
        public load():void {
            for (var idx = 0; idx < this._loadAllNum; idx++) {
                var url:string = this._group[idx];
                RM.ResLoaderItem.create(url, true, this);
            }
        }

        /**
         *
         *2015/10/30
         */
        public _loadCompleteOnce(tag:number):void {
            if (this._isComplete)return;
            this._loadCompleteNum++;
            if (this._loadCompleteNum == this._loadAllNum) {
                this._isComplete = true;
            }
            if (this._callback && this._thisObj) {
                this._callback.apply(this._thisObj, [this]);
            }
        }
    }
}