///<reference path="TouchContext.ts"/>
/**
 * Created by Administrator on 2015/10/16.
 */
module RM
{
    /**
     * 触摸事件处理<br>
     *
     * */
    export class H5TouchContext extends RM.TouchContext
    {
        /** ��̨��DIV **/
        private _rootDiv:any;

        public constructor()
        {
            super();
            this._rootDiv = RM.StageViewPort.getInstance().getStageDiv();
        }

        /**
         *����
         *2015/10/16
         */
        public run():void
        {
            var self:RM.H5TouchContext = this;
            this.addTouchEventListener();
            self.addMouseEventListener();

            //超出舞台的侦听
            window.addEventListener("mousedown",function(event){
                if( self._isOutOfStage(event) )
                {
                    self.onDispatchLeaveStageEvent();
                }
            });
            window.addEventListener("mouseup",function(event){
                if( self._isOutOfStage(event) )
                {
                    self.onDispatchLeaveStageEvent();
                }
                else
                {
                    self._onTouchEnd(event);
                }
            });
        }
//=======================鼠标事件处理===========================================
        /**
         *侦听鼠标事件
         *2015/10/16
         */
        private addMouseEventListener():void {
            var self:RM.H5TouchContext = this;
            this._rootDiv.addEventListener("mousedown",function (event:MouseEvent)
            {
                self._onTouchBegin(event);
                self._eventPrevent(event);
            });
            this._rootDiv.addEventListener("mouseup",function (event:MouseEvent)
            {
                self._onTouchEnd(event);
                self._eventPrevent(event);
            });
            this._rootDiv.addEventListener("mousemove",function (event:MouseEvent)
            {
                self._onTouchMove(event);
                self._eventPrevent(event);
            });
        }

//=======================触摸事件处理===========================================

        /**
         *侦听触摸事件
         *15/10/20
         */
        private addTouchEventListener():void {
            var self:RM.H5TouchContext = this;
            this._rootDiv.addEventListener("touchstart",function(event:any):void
            {
                var list:Array<any> = event.changedTouches;
                var len:number = list.length;
                for (var idx = 0; idx < len; idx++) {
                    self._onTouchBegin(list[idx]);
                }

                self._eventPrevent(event);

            },false);
            this._rootDiv.addEventListener("touchmove",function(event:any):void
            {
                var list:Array<any> = event.changedTouches;
                var len:number = list.length;
                for (var idx = 0; idx < len; idx++) {
                    self._onTouchMove(list[idx]);
                }
                self._eventPrevent(event);

            },false);
            this._rootDiv.addEventListener("touchend",function(event:any):void
            {
                var list:Array<any> = event.changedTouches;
                var len:number = list.length;
                for (var idx = 0; idx < len; idx++) {
                    self._onTouchEnd(list[idx]);
                }
                self._eventPrevent(event);

            },false);
        }

        /**
         *按下
         *15/10/20
         */
        private _onTouchBegin(event:any):void {
            var point:RM.Point = this._getLocalPoint( event );
            var identifier:number = -1;
            if( event.hasOwnProperty("identifier") )
            {
                identifier = event.identifier;
            }
            this.onTouchBegin(point.x,point.y,identifier);
            point.release();
        }

        /**
         *弹起
         *15/10/20
         */
        private _onTouchEnd(event:any):void {
            var point:RM.Point = this._getLocalPoint( event );
            var identifier:number = -1;
            if( event.hasOwnProperty("identifier") )
            {
                identifier = event.identifier;
            }
            this.onTouchEnd(point.x,point.y,identifier);
            point.release();
        }

        /**
         *移动
         *15/10/20
         */
        private _onTouchMove(event:any):void {
            var point:RM.Point = this._getLocalPoint( event );
            var identifier:number = -1;
            if( event.hasOwnProperty("identifier") )
            {
                identifier = event.identifier;
            }
            this.onTouchMove(point.x,point.y,identifier);
            point.release();
        }


        /**
         * 停止继续冒泡处理<br>
         *阻止特定事件的默认行为,如点击链接跳转
         *2015/10/21
         */
        private _eventPrevent(event:any):void {
            event.stopPropagation();
            //阻止特定事件的默认行为,如点击链接跳转
            event.preventDefault();
        }

        /**
         *获得在canvas上的坐标
         *2015/10/19
         */
        private _getLocalPoint(event:any):RM.Point {
            var tx:number = event.pageX - this._rootDiv.getBoundingClientRect().left;
            var ty:number = event.pageY -  this._rootDiv.getBoundingClientRect().top;
            return RM.Point.create( tx, ty);
        }

        /**
         * 判断触碰点是否超出舞台
         *2015/10/21
         */
        private _isOutOfStage(event:any):boolean {
            var point:RM.Point = this._getLocalPoint(event);
            if( RM.StageViewPort.getInstance().getRect().containsPoint(point) )
            {
                point.release();
                return false;
            }
            point.release();
            return true;
        }

    }
}