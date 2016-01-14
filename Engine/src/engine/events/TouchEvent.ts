///<reference path="Event.ts"/>
/**
 * Created by Rich on 2015/10/21.
 */
module RM {
    export class TouchEvent extends RM.Event {


        /** 触摸开始 */
        public static TOUCH_BEGIN: string = "touch_begin";
        /**触摸移动*/
        public static TOUCH_MOVE: string = "touch_move";
        /** 触摸结束*/
        public static TOUCH_END: string = "touch_end";


        /** 舞台坐标X轴 **/
        private _stageX:number = 0;
        /** 舞台坐标Y轴 **/
        private _stageY:number = 0;
        /** 点击的标识索引 **/
        private _identifier:number = NaN;

        public constructor() {
            super();
        }

        /**
         *
         *2015/10/22
         */
        public setData( stageX:number,stageY:number,identifier:number ):void {
            this._stageX = stageX;
            this._stageY = stageY;
            this._identifier = identifier;
        }

        public reset():void
        {
            super.reset();
            this._stageX = 0;
            this._stageY = 0;
            this._identifier = NaN;
        }

        /**
         *获得舞台坐标
         *2015/10/21
         */
        public getStageX():number {
            return this._stageX;
        }
        /**
         *获得舞台坐标
         *2015/10/21
         */
        public getStageY():number {
            return this._stageY;
        }
        /**
         *获得触摸唯一索引
         *2015/10/21
         */
        public getIdentifier():number {
            return this._identifier;
        }
        /**
         *获得目标本地坐标
         *2015/10/21
         */
        public getLocalPoint():RM.Point {
            return this._currentTarget.globalToLocal(this._stageX,this._stageY);
        }

        /**
         * 派发触碰事件
         *2015/10/22
         */
        public static dispatchTouchEvent(target:RM.EventDispatcher, type?:string, bubbles?:boolean, bindData?:any,
                                   stageX:number=0,stageY:number=0,identifier:number=NaN ):void {
            var event:RM.TouchEvent = RM.Event.create(RM.TouchEvent,type,bubbles,bindData);
            event.setData(stageX,stageY,identifier);
            target.dispatchEvent(event);
            event.release();
        }

    }
}