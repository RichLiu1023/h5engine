var RM;
(function (RM) {
    /**
     * 所有对象的基类，赋予hasCount属性，对象计数
     * @author Rich
     *
     */
    var HashObject = (function () {
        function HashObject() {
            this._hasCount = HashObject.hasCount++;
        }
        Object.defineProperty(HashObject.prototype, "hasCount", {
            get: function () {
                return this._hasCount;
            },
            enumerable: true,
            configurable: true
        });
        HashObject.hasCount = 1;
        return HashObject;
    })();
    RM.HashObject = HashObject;
})(RM || (RM = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/11/1.
 */
var RM;
(function (RM) {
    var JsonAnalyzer = (function (_super) {
        __extends(JsonAnalyzer, _super);
        /**
         * 创建,如果传入url参数则会缓存。可根据url再次获得（RM.JsonAnalyzer.getJsonAnalyzer）<br>
         *     相同的url将会覆盖旧的缓存。
         *2015/10/29
         */
        function JsonAnalyzer(data, url) {
            _super.call(this);
            this._json = JSON.parse(data);
            if (url && url.length > 0) {
                RM.JsonAnalyzer._jsonResMap[url] = this;
            }
        }
        /**
         * 创建,如果传入url参数则会缓存。可根据url再次获得（RM.JsonAnalyzer.getJsonAnalyzer）<br>
         *     相同的url将会覆盖旧的缓存。
         *2015/10/29
         */
        JsonAnalyzer.create = function (data, url) {
            return new RM.JsonAnalyzer(data, url);
        };
        /**
         *通过URL获取RM.JsonAnalyzer
         *2015/11/1
         */
        JsonAnalyzer.getJsonAnalyzer = function (url) {
            return RM.JsonAnalyzer._jsonResMap[url];
        };
        /**
         * 获取原始JSON数据
         *2015/11/1
         */
        JsonAnalyzer.prototype.getJson = function () {
            return this._json;
        };
        /**
         * 获取TextureJSON数据
         *2015/11/1
         */
        JsonAnalyzer.prototype.getJsonTextureFile = function () {
            if (!this._jsonTextureFile) {
                this._jsonTextureFile = RM.JsonTextureFile.create(this._json);
            }
            return this._jsonTextureFile;
        };
        /** JSON文件缓存 **/
        JsonAnalyzer._jsonResMap = {};
        return JsonAnalyzer;
    })(RM.HashObject);
    RM.JsonAnalyzer = JsonAnalyzer;
})(RM || (RM = {}));
///<reference path="../utils/HashObject.ts"/>
var RM;
(function (RM) {
    /**
     * 事件类，负责事件的派发和监听<br>
     * 1、事件的三个阶段分为捕获、目标、冒泡。可以根据使用的方式，设置在捕获阶段触发，或者在目标或冒泡阶段触发<br>
     * 2、事件的三个阶段只在显示列表中才有效，具体工作机制可以可以参见DisplayObject.dispatchEvent
     * @author
     *
     */
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            _super.call(this);
            /**事件监听列表，目标及冒泡阶段<br>
             * key：事件类型<br>
             * value：EventCallbackData <br>
             * */
            this.eventListenerMap = {};
            /**事件监听列表，捕获阶段<br>
            * key：事件类型<br>
            * value：EventCallbackData <br>
            * */
            this.eventListenerCaptureMap = {};
            /**事件抛出对象*/
            this._eventTarget = null;
            //事件的抛出对象暂且为自己
            this._eventTarget = this;
        }
        /**添加监听事件(自动排除重复添加的监听：type、listener、thisObject相同则不再添加)<br>
         * type：事件类型<br>
         * listener：事件回调函数<br>
         * thisObject：事件回调函数的this对象<br>
         * useCupture：是否运行于捕获还是运行与目标或冒泡阶段<br>
         * priority:事件的优先级，默认为0，数字越大优先级越高；
         * */
        EventDispatcher.prototype.addEventListener = function (type, listener, thisObject, useCupture, priority) {
            if (useCupture === void 0) { useCupture = false; }
            if (priority === void 0) { priority = 0; }
            if (!listener) {
                RM.Log.print("listener is null ! by EventDispatcher.addEventListener");
            }
            var eventList;
            if (useCupture) {
                if (!this.eventListenerCaptureMap) {
                    this.eventListenerCaptureMap = {};
                }
                eventList = this.eventListenerCaptureMap;
            }
            else {
                if (!this.eventListenerMap) {
                    this.eventListenerMap = {};
                }
                eventList = this.eventListenerMap;
            }
            var list = eventList[type];
            if (!list) {
                list = eventList[type] = [];
            }
            this.insertEventToList(list, type, listener, thisObject);
        };
        /**插入事件到列表*/
        EventDispatcher.prototype.insertEventToList = function (list, type, listener, thisObject, priority) {
            var len = list.length;
            var targetIndex = -1;
            var eventCallbackData;
            for (var index = 0; index < len; index++) {
                eventCallbackData = list[index];
                if (eventCallbackData.type == type && eventCallbackData.listener == listener && eventCallbackData.thisObject == thisObject) {
                    return false;
                }
                if (targetIndex == -1 && eventCallbackData.priority < priority) {
                    targetIndex = index;
                }
            }
            if (targetIndex != -1) {
                list.splice(targetIndex, 0, new RM.EventCallbackData(type, listener, thisObject, priority));
            }
            else {
                list.push(new RM.EventCallbackData(type, listener, thisObject, priority));
            }
        };
        /**删除事件监听器<br>
        * type：事件类型<br>
        * listener：事件回调函数<br>
        * thisObject：事件回调函数的this对象<br>
        * useCupture：是否运行于捕获还是运行与目标或冒泡阶段，由于捕获与目标及冒泡的事件列表是分离开的，
        * 因此谨慎起见必须确定事件是否在捕获事件列表中<br>
         * */
        EventDispatcher.prototype.removeEventListener = function (type, listener, thisObject, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            var eventList = useCapture ? this.eventListenerCaptureMap : this.eventListenerMap;
            if (!eventList)
                return;
            if (!eventList[type])
                return;
            this.removeEventForList(eventList[type], type, listener, thisObject);
        };
        /**删除事件，从列表中删除*/
        EventDispatcher.prototype.removeEventForList = function (list, type, listener, thisObject, startIndex) {
            if (startIndex === void 0) { startIndex = 0; }
            var len = list.length;
            var eventCallbackData;
            for (var index = startIndex; index < len; index++) {
                eventCallbackData = list[index];
                if (eventCallbackData.type == type && eventCallbackData.listener == listener && eventCallbackData.thisObject == thisObject) {
                    list.splice(index, 1);
                    return true;
                }
            }
            return false;
        };
        /**派发事件，此事件接收一个RM.Event 对象并根据RM.Event对象的isPropagationImmediateStopped属性来决定是否阻止冒泡*/
        EventDispatcher.prototype.dispatchEvent = function (event) {
            event._target = this._eventTarget;
            event._currentTarget = this._eventTarget;
            return this._$notifyListener(event);
        };
        /**在配发事件时，如果响应事件内部删除后续某个侦听，则后续某个侦听在当前事件全部响应后，才生效，因此后续某个侦听在本次事件中会继续触发*/
        EventDispatcher.prototype._$notifyListener = function (event) {
            var eventList = event._eventPhase == RM.EventPhase.CAPTURE_PHASE ? this.eventListenerCaptureMap : this.eventListenerMap;
            if (!eventList)
                return true;
            if (!eventList[event._type])
                return true;
            var list = eventList[event._type];
            var len = list.length;
            if (len == 0)
                return true;
            list = list.concat();
            var eventCallbackData;
            for (var index = 0; index < len; index++) {
                eventCallbackData = list[index];
                eventCallbackData.listener.call(eventCallbackData.thisObject, event);
                if (event.isPropagationImmediateStopped)
                    break;
            }
            return true;
        };
        return EventDispatcher;
    })(RM.HashObject);
    RM.EventDispatcher = EventDispatcher;
})(RM || (RM = {}));
///<reference path="../events/EventDispatcher.ts"/>
var RM;
(function (RM) {
    /**
     * 主控器，引擎结构中的中枢，包含各种控制器，如渲染、网络等控制器
     * @author
     *
     */
    var MainContext = (function (_super) {
        __extends(MainContext, _super);
        function MainContext() {
            _super.call(this);
            /**进入帧事件*/
            this._enterFrameEvent = new RM.Event();
            this.renderContext = RM.H5CanvasRender.createRenderContext();
            this.netContext = new RM.H5NetContext();
            this.deviceContext = new RM.H5DeviceContext();
            this.touchContext = new RM.H5TouchContext();
            RM.MainContext.RENDER_PHASE = RM.RenderLoopPhase.DEFAULT_RENDER_PHASE;
        }
        /**启动引擎*/
        MainContext.prototype.run = function () {
            RM.Ticker.getInstance().run();
            //主帧渲染跑道，级别为最先执行Number.POSITIVE_INFINITY
            RM.Ticker.getInstance().register(this.renderLoop, this, Number.POSITIVE_INFINITY);
            //进入帧事件最后派发，Number.NEGATIVE_INFINITY
            RM.Ticker.getInstance().register(this.broadcastEnterFrame, this, Number.NEGATIVE_INFINITY);
            this.touchContext.run();
        };
        /**帧跑道模型，渲染部分*/
        MainContext.prototype.renderLoop = function (frameRate) {
            //渲染之前，处理延迟函数执行
            RM.DelayedCallback.doCallback();
            var self = this;
            var context = self.renderContext;
            var stage = self.stage;
            //渲染开始
            RM.MainContext.RENDER_PHASE = RM.RenderLoopPhase.CLEAR_AREA_PHASE;
            //计算渲染脏矩形区域
            if (RM.GlobalConfig.IS_OPEN_DIRTY) {
                stage._$checkDirtyRectangle();
                stage._$clearDirty();
                if (RM.RenderPerformance.getInstance().isRun()) {
                    RM.RenderFilter.getInstance()._addArea(RM.RenderPerformance.getInstance().getRect());
                }
            }
            context.onRenderStart();
            context.clearScene();
            RM.MainContext.RENDER_PHASE = RM.RenderLoopPhase.UPDATE_TRANSFORM_PHASE;
            RM.MainContext.DRAW_COMMAND_LIST = [];
            stage._$updateTransform();
            RM.MainContext.RENDER_PHASE = RM.RenderLoopPhase.DRAW_PHASE;
            self._draw(context);
            if (RM.RenderPerformance.getInstance().isRun()) {
                RM.RenderPerformance.getInstance().draw(context);
            }
            context.onRenderFinish();
            RM.MainContext.RENDER_PHASE = RM.RenderLoopPhase.COMPLETE_PHASE;
        };
        /**新的渲染机制，通过updateTransform整理所有需要渲染的子项，在此时开始回调渲染*/
        MainContext.prototype._draw = function (context) {
            var list = RM.MainContext.DRAW_COMMAND_LIST;
            var len = list.length;
            var cmd;
            for (var idx = 0; idx < len; idx++) {
                cmd = list[idx];
                cmd.call(context);
                cmd.dispose();
            }
        };
        /**广播进入帧事件*/
        MainContext.prototype.broadcastEnterFrame = function (time) {
            var event = this._enterFrameEvent;
            event._type = RM.Event.ENTER_FRAME;
            var list = RM.MainContext.ENTER_FRAME_CALLBACK_LIST.concat();
            var len = list.length;
            var eventdata;
            for (var idx = 0; idx < len; idx++) {
                eventdata = list[idx];
                eventdata.listener.call(eventdata.thisObject, time);
            }
        };
        /**
         * 广播添加入舞台事件
         * */
        MainContext.prototype.broadcastAddToStage = function () {
            var list = RM.MainContext.ADD_TO_STAGE_CALLBACK_LIST;
            var child;
            while (list.length > 0) {
                child = list.shift();
                RM.Event.dispatchEvent(child, RM.Event.ADD_TO_STAGE);
            }
        };
        /**
         * 广播从舞台删除事件
         * */
        MainContext.prototype.broadcastRemoveFormStage = function () {
            var list = RM.MainContext.REMOVE_FORM_STAGE_CALLBACK_LIST;
            var child;
            while (list.length > 0) {
                child = list.shift();
                RM.Event.dispatchEvent(child, RM.Event.REMOVE_FORM_STAGE);
                child._$clearStage();
            }
        };
        MainContext.prototype.onResize = function () {
            this.renderContext.onResize();
        };
        MainContext.getInstance = function () {
            if (!this._instance) {
                this._instance = new RM.MainContext();
            }
            return this._instance;
        };
        /**
         * 渲染cache位图时设置为true。
         * */
        MainContext.USE_CACHE_DRAW = false;
        /**当前帧需要渲染的子项列表*/
        MainContext.DRAW_COMMAND_LIST = [];
        /**引擎启动的时间*/
        MainContext.ENGINE_START_TIME = 0;
        /**当前渲染阶段*/
        MainContext.RENDER_PHASE = "";
        /**进入帧时回调函数列表*/
        MainContext.ENTER_FRAME_CALLBACK_LIST = [];
        /**添加到舞台回调函数列表*/
        MainContext.ADD_TO_STAGE_CALLBACK_LIST = [];
        /**从舞台移除回调函数列表*/
        MainContext.REMOVE_FORM_STAGE_CALLBACK_LIST = [];
        return MainContext;
    })(RM.EventDispatcher);
    RM.MainContext = MainContext;
})(RM || (RM = {}));
///<reference path="../utils/HashObject.ts"/>
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var StageViewPort = (function (_super) {
        __extends(StageViewPort, _super);
        function StageViewPort() {
            _super.call(this);
            this._stageViewProtW = 0;
            this._stageViewProtH = 0;
            this._stageViewProtX = 0;
            this._stageViewProtY = 0;
            this._stageViewScaleX = 1;
            this._stageViewScaleY = 1;
        }
        Object.defineProperty(StageViewPort.prototype, "stageViewProtW", {
            get: function () {
                return this._stageViewProtW;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageViewPort.prototype, "stageViewProtH", {
            get: function () {
                return this._stageViewProtH;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageViewPort.prototype, "stageViewProtX", {
            get: function () {
                return this._stageViewProtX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageViewPort.prototype, "stageViewProtY", {
            get: function () {
                return this._stageViewProtY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageViewPort.prototype, "stageViewScaleX", {
            get: function () {
                return this._stageViewScaleX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageViewPort.prototype, "stageViewScaleY", {
            get: function () {
                return this._stageViewScaleY;
            },
            enumerable: true,
            configurable: true
        });
        StageViewPort.prototype.setStageSize = function (w, h, styleW, styleH) {
            if (styleW === void 0) { styleW = 0; }
            if (styleH === void 0) { styleH = 0; }
            this._stageViewProtW = w;
            this._stageViewProtH = h;
            if (styleW == 0)
                styleW = this._stageViewProtW;
            if (styleH == 0)
                styleH = this._stageViewProtH;
            var canvasDiv = this.getStageDiv();
            var rootDiv = document.getElementById(RM.GlobalConfig.ROOT_DIV_NAME);
            canvasDiv.style.width = styleW + "px";
            canvasDiv.style.height = styleH + "px";
            rootDiv.style.width = styleW + "px";
            rootDiv.style.height = styleH + "px";
            RM.MainContext.getInstance().onResize();
        };
        StageViewPort.prototype.setStagePoint = function (x, y) {
            this._stageViewProtX = Math.round(x);
            this._stageViewProtY = Math.round(y);
            var canvasDiv = this.getStageDiv();
            var rootDiv = document.getElementById(RM.GlobalConfig.ROOT_DIV_NAME);
            canvasDiv.style.left = this._stageViewProtX + "px";
            canvasDiv.style.top = this._stageViewProtY + "px";
            rootDiv.style.left = this._stageViewProtX + "px";
            rootDiv.style.top = this._stageViewProtY + "px";
        };
        StageViewPort.prototype.setStageBackgroundColor = function (color) {
            var canvasDiv = this.getStageDiv();
            canvasDiv.style.background = color;
        };
        StageViewPort.prototype.getStageDiv = function () {
            var canvasDiv = document.getElementById(RM.GlobalConfig.CANVAS_DIV_NAME);
            var rootDiv = document.getElementById(RM.GlobalConfig.ROOT_DIV_NAME);
            if (!canvasDiv) {
                canvasDiv = document.createElement("div");
                canvasDiv.id = RM.GlobalConfig.CANVAS_DIV_NAME;
                rootDiv.appendChild(canvasDiv);
            }
            return canvasDiv;
        };
        /**获得视口矩形，起始坐标为0，0*/
        StageViewPort.prototype.getRect = function () {
            var rect = RM.Rectangle.create(0, 0, this._stageViewProtW, this._stageViewProtH);
            return rect;
        };
        /**
         * 显示区域的分辨率宽度
         *  */
        StageViewPort.prototype.getClientWidth = function () {
            return document.documentElement.clientWidth;
        };
        /**
         * 显示区域的分辨率高度
         *  */
        StageViewPort.prototype.getClientHeight = function () {
            return document.documentElement.clientHeight;
        };
        /**
         * 自适应分辨率
         * @param isScale ｛true:自动适应屏幕，按照480X800等比缩放。false:充满全屏，不缩放。｝ default true
         */
        StageViewPort.prototype.onFullScreen = function (isScale) {
            if (isScale === void 0) { isScale = true; }
            var clientW = this.getClientWidth();
            var clientH = this.getClientHeight();
            if (isScale) {
                //w,h 缩放相同比例
                var scaleW = clientW / this._stageViewProtW;
                if (scaleW >= 1)
                    scaleW = 1;
                var scaleH = clientH / this._stageViewProtH;
                if (scaleH >= 1)
                    scaleH = 1;
                var scale = Math.min(scaleH, scaleW);
                this._stageViewScaleX = scale;
                this._stageViewScaleY = scale;
                var viewPortW = this._stageViewProtW * scale;
                //var viewPortH:number = this._stageViewProtH * scaleH;
                var viewPortH = this._stageViewProtH * scale;
                this.setStageSize(this._stageViewProtW, this._stageViewProtH, viewPortW, viewPortH);
            }
            else {
                this.setStageSize(clientW, clientH, clientW, clientH);
            }
        };
        StageViewPort.getInstance = function () {
            if (!this._instance) {
                this._instance = new RM.StageViewPort();
            }
            return this._instance;
        };
        return StageViewPort;
    })(RM.HashObject);
    RM.StageViewPort = StageViewPort;
})(RM || (RM = {}));
///<reference path="../events/EventDispatcher.ts"/>
var RM;
(function (RM) {
    /**
     * 帧刷新控制器,引擎心跳控制器，唯一时间入口<br>
     * 1、主渲染跑道的循环，引擎优先级最高Number.NEGATIVE_INFINITY<br>
     * 2、进入帧事件的派发，引擎优先级最低Number.POSITIVE_INFINITY<br>
     * 最先执行渲染跑道，当派发进入帧事件后才会进入逻辑跑道。因此，引擎内部执行监听选中间值，
     * @author
     *
     */
    var Ticker = (function (_super) {
        __extends(Ticker, _super);
        function Ticker() {
            _super.call(this);
            /** 暂停*/
            this._paused = false;
            /**时间回调函数列表*/
            this._callBackList = [];
            /**时间回调函数在执行中时的缓存执行列表*/
            this._callList = null;
            /**时间回调函数在执行过程中，如果删除了其他定时器函数，就必须在缓存列表中即时的删除掉，
             * 这个索引值代表当前定时器回调函数在缓存列表中的位置，从这个位置的下一位开始，
             * 至道缓存列表的末尾，在这个区间内查找需要删除的定时器函数，如果找到则删除。*/
            this._callIndex = -1;
            this._callBackList = [];
        }
        Ticker.getInstance = function () {
            if (!this._instance) {
                this._instance = new RM.Ticker();
            }
            return this._instance;
        };
        Ticker.prototype.paused = function () {
            this._paused = true;
        };
        Ticker.prototype.resume = function () {
            this._paused = false;
        };
        /**添加侦听，如果在事件内部调用，则在下一帧才会触发*/
        Ticker.prototype.register = function (listener, thisObject, priority) {
            if (typeof priority === "undefined") {
                priority = 0;
            }
            var list = this._callBackList;
            this.insertEventToList(list, RM.Ticker.EVENT_TYPE, listener, thisObject, priority);
        };
        /**取消监听*/
        Ticker.prototype.unregister = function (listener, thisObject) {
            var list = this._callBackList;
            this.removeEventForList(list, RM.Ticker.EVENT_TYPE, listener, thisObject);
            //防止在定时器回调函数内删除其他定时器
            if (this._callList && this._callIndex > -1) {
                this.removeEventForList(this._callList, RM.Ticker.EVENT_TYPE, listener, thisObject, this._callIndex);
            }
        };
        /**帧刷新定时器函数*/
        Ticker.prototype._update = function (advancedTime) {
            if (this._paused)
                return;
            //备份列表，防止响应回调时增加监听时，队列会增长
            this._callList = this._callBackList.concat();
            this._callIndex = 0;
            var eventData;
            //动态计算_callList的长度，防止回调时删除后续的监听，而引起再次响应
            for (; this._callIndex < this._callList.length; this._callIndex++) {
                eventData = this._callList[this._callIndex];
                eventData.listener.call(eventData.thisObject, advancedTime);
            }
            this._callList = null;
            this._callIndex = -1;
        };
        /**启动心跳控制器，此函数只在启动引擎时执行一次。*/
        Ticker.prototype.run = function () {
            RM.MainContext.ENGINE_START_TIME = new Date().getTime();
            var context = RM.MainContext.getInstance().deviceContext;
            context.executeMainLoop(this._update, this);
        };
        Ticker.EVENT_TYPE = "ticker_type";
        return Ticker;
    })(RM.EventDispatcher);
    RM.Ticker = Ticker;
})(RM || (RM = {}));
///<reference path="../events/EventDispatcher.ts"/>
var RM;
(function (RM) {
    /**
     * 显示对象的基类，在显示列表树中属于叶节点
     * @author
     *
     */
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject() {
            _super.call(this);
            /**渲染对象*/
            this._$texture_to_render = null;
            /** 用于引擎内部计算 **/
            this._$matrix = new RM.Matrix();
            /** 用于引擎内部计算 **/
            this._$rect = new RM.Rectangle();
            /** 旧的矩形位置，记录下一次改变之前的位置，用于清除自己的位置，以便脏矩形渲染 **/
            this._$againRect = new RM.Rectangle();
            /** 在引擎处于渲染阶段时，只计算一次边界范围，减少计算量 **/
            this._$cacheBound = new RM.Rectangle();
            /** 是否需要重新计算边界 **/
            this._$isChangeBound = true;
            this._DOP_Property = new RM.DOProtection();
            this.setName("DisplayObject");
            this._$globalTransform = new RM.Matrix();
            this._$globalAlpha = 1;
        }
        //=============================================Event Function=======================================================			
        /**添加监听事件(自动排除重复添加的监听：type、listener、thisObject相同则不再添加)<br>
         * type：事件类型<br>
         * listener：事件回调函数<br>
         * thisObject：事件回调函数的this对象<br>
         * useCupture：是否运行于捕获还是运行与目标或冒泡阶段<br>
         * priority:事件的优先级，默认为0，数字越大优先级越高；
         * */
        DisplayObject.prototype.addEventListener = function (type, listener, thisObject, useCupture, priority) {
            if (useCupture === void 0) { useCupture = false; }
            if (priority === void 0) { priority = 0; }
            if (type == RM.Event.ENTER_FRAME) {
                this.insertEventToList(RM.MainContext.ENTER_FRAME_CALLBACK_LIST, type, listener, thisObject, priority);
            }
            else {
                _super.prototype.addEventListener.call(this, type, listener, thisObject, useCupture, priority);
            }
        };
        /**删除事件监听器<br>
         * type：事件类型<br>
         * listener：事件回调函数<br>
         * thisObject：事件回调函数的this对象<br>
         * useCupture：是否运行于捕获还是运行与目标或冒泡阶段，由于捕获与目标及冒泡的事件列表是分离开的，
         * 因此谨慎起见必须确定事件是否在捕获事件列表中<br>
         * */
        DisplayObject.prototype.removeEventListener = function (type, listener, thisObject, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            if (type == RM.Event.ENTER_FRAME) {
                this.removeEventForList(RM.MainContext.ENTER_FRAME_CALLBACK_LIST, type, listener, thisObject);
            }
            else {
                _super.prototype.removeEventListener.call(this, type, listener, thisObject, useCapture);
            }
        };
        /**派发事件，此事件接收一个RM.Event 对象<br>
         * */
        DisplayObject.prototype.dispatchEvent = function (event) {
            if (!event._bubbles) {
                return _super.prototype.dispatchEvent.call(this, event);
            }
            var list = [];
            var target = this;
            while (target) {
                list.push(target);
                target = target._DOP_Property._parent;
            }
            this._displayPropagationEvent(event, list);
            return true;
        };
        /**
         * 事件流开始派发事件<br>
         * 根据事件流的三个阶段进行响应
         * */
        DisplayObject.prototype._displayPropagationEvent = function (event, list) {
            var len = list.length;
            //第一阶段---捕获
            var eventPhase = RM.EventPhase.CAPTURE_PHASE;
            var currentTarget;
            while (len-- > 0) {
                currentTarget = list[len];
                event._currentTarget = currentTarget;
                event._target = this;
                event._eventPhase = eventPhase;
                currentTarget._$notifyListener(event);
                if (event.isPropagationStopped || event.isPropagationImmediateStopped) {
                    return;
                }
            }
            //第二阶段---目标
            eventPhase = RM.EventPhase.TARGET_PHASE;
            currentTarget = list[0];
            event._currentTarget = currentTarget;
            event._target = this;
            event._eventPhase = eventPhase;
            currentTarget._$notifyListener(event);
            if (event.isPropagationStopped || event.isPropagationImmediateStopped) {
                return;
            }
            //第三阶段---冒泡
            eventPhase = RM.EventPhase.BUBBLE_PHASE;
            len = list.length;
            //目标阶段已经触发过一次后，冒泡从索引1开始向上冒泡
            for (var idx = 1; idx < len; idx++) {
                currentTarget = list[idx];
                event._currentTarget = currentTarget;
                event._target = this;
                event._eventPhase = eventPhase;
                currentTarget._$notifyListener(event);
                if (event.isPropagationStopped || event.isPropagationImmediateStopped) {
                    return;
                }
            }
        };
        //=============================================Get Function=======================================================
        DisplayObject.prototype.getName = function () {
            return this._DOP_Property._name;
        };
        DisplayObject.prototype.getX = function () {
            return this._DOP_Property._x;
        };
        DisplayObject.prototype.getY = function () {
            return this._DOP_Property._y;
        };
        DisplayObject.prototype.getWidth = function () {
            return this._$getSize().width;
        };
        DisplayObject.prototype.getHeight = function () {
            return this._$getSize().height;
        };
        DisplayObject.prototype.getAlpha = function () {
            return this._DOP_Property._alpha;
        };
        DisplayObject.prototype.getIsContainer = function () {
            return this._DOP_Property._isContainer;
        };
        DisplayObject.prototype.getVisible = function () {
            return this._DOP_Property._visible;
        };
        DisplayObject.prototype.getParent = function () {
            return this._DOP_Property._parent;
        };
        DisplayObject.prototype.getNeedDraw = function () {
            return this._DOP_Property._needDraw;
        };
        DisplayObject.prototype.getSkewX = function () {
            return this._DOP_Property._skewX;
        };
        DisplayObject.prototype.getSkewY = function () {
            return this._DOP_Property._skewY;
        };
        DisplayObject.prototype.getScaleX = function () {
            return this._DOP_Property._scaleX;
        };
        DisplayObject.prototype.getScaleY = function () {
            return this._DOP_Property._scaleY;
        };
        DisplayObject.prototype.getRotate = function () {
            return this._DOP_Property._rotate;
        };
        DisplayObject.prototype.getCacheAsBitmap = function () {
            return this._DOP_Property._cacheAsBitmap;
        };
        DisplayObject.prototype.getStage = function () {
            return this._DOP_Property._stage;
        };
        /**
         * 获取是否可以触摸
         * */
        DisplayObject.prototype.getTouchEnabled = function () {
            return this._DOP_Property._touchEnabled;
        };
        /**
         *是否已脏
         *15/10/25
         */
        DisplayObject.prototype.getDirty = function () {
            return this._DOP_Property._isDirty;
        };
        /**
         *
         *获取滚动矩形，遮罩矩形
         */
        DisplayObject.prototype.getScrollRect = function () {
            return this._DOP_Property._scrollRect;
        };
        //=============================================Set Function=======================================================
        DisplayObject.prototype.setName = function (value) {
            if (this._DOP_Property._name != value) {
                this._DOP_Property._name = value;
            }
            return this;
        };
        DisplayObject.prototype.setParent = function (value) {
            if (this._DOP_Property._parent != value) {
                this._DOP_Property._parent = value;
            }
            return this;
        };
        /**强制每帧执行渲染*/
        DisplayObject.prototype.setNeedDraw = function (value) {
            if (this._DOP_Property._needDraw != value) {
                this._DOP_Property._needDraw = value;
            }
            return this;
        };
        DisplayObject.prototype.setWidth = function (value) {
            if (this._DOP_Property._width != value) {
                this._DOP_Property._width = value;
                this._DOP_Property._hasWidthSet = true;
                this._DOP_Property._hasSize = true;
                this._$setDirty();
            }
            return this;
        };
        DisplayObject.prototype.setHeight = function (value) {
            if (this._DOP_Property._height != value) {
                this._DOP_Property._height = value;
                this._DOP_Property._hasHeightSet = true;
                this._DOP_Property._hasSize = true;
                this._$setDirty();
            }
            return this;
        };
        DisplayObject.prototype.setSize = function (w, h) {
            this.setWidth(w);
            this.setHeight(h);
            return this;
        };
        DisplayObject.prototype.setX = function (value) {
            if (this._DOP_Property._x != value) {
                this._DOP_Property._x = value;
                this._$setDirty();
            }
            return this;
        };
        DisplayObject.prototype.setY = function (value) {
            if (this._DOP_Property._y != value) {
                this._DOP_Property._y = value;
                this._$setDirty();
            }
            return this;
        };
        DisplayObject.prototype.setPoint = function (x, y) {
            this.setX(x);
            this.setY(y);
            return this;
        };
        /**X轴斜切，以角度为单位*/
        DisplayObject.prototype.setSkewX = function (value) {
            if (this._DOP_Property._skewX != value) {
                this._DOP_Property._skewX = value;
                this._$setDirty();
            }
            return this;
        };
        /**Y轴斜切，以角度为单位*/
        DisplayObject.prototype.setSkewY = function (value) {
            if (this._DOP_Property._skewY != value) {
                this._DOP_Property._skewY = value;
                this._$setDirty();
            }
            return this;
        };
        /**X轴缩放*/
        DisplayObject.prototype.setScaleX = function (value) {
            if (this._DOP_Property._scaleX != value) {
                this._DOP_Property._scaleX = value;
                this._$setDirty();
            }
            return this;
        };
        /**Y轴缩放*/
        DisplayObject.prototype.setScaleY = function (value) {
            if (this._DOP_Property._scaleY != value) {
                this._DOP_Property._scaleY = value;
                this._$setDirty();
            }
            return this;
        };
        /**旋转，单位为角度*/
        DisplayObject.prototype.setRotate = function (value) {
            if (this._DOP_Property._rotate != value) {
                this._DOP_Property._rotate = value;
            }
            return this;
        };
        /**透明度，此值为0~1之间的值*/
        DisplayObject.prototype.setAlpha = function (value) {
            if (this._DOP_Property._alpha != value) {
                this._DOP_Property._alpha = value;
                this._$setDirty();
            }
            return this;
        };
        /**是否显示*/
        DisplayObject.prototype.setVisible = function (value) {
            if (this._DOP_Property._visible != value) {
                this._DOP_Property._visible = value;
            }
            return this;
        };
        /**设置遮罩矩形，滚动矩形，设置为null则取消遮罩矩形*/
        DisplayObject.prototype.setScrollRect = function (value) {
            if (value) {
                if (this._DOP_Property._scrollRect == null) {
                    this._DOP_Property._scrollRect = value;
                    this._$setDirty();
                }
                else if (this._DOP_Property._scrollRect.equals(value) == false) {
                    this._DOP_Property._scrollRect.resetToRect(value);
                    this._$setDirty();
                }
            }
            else {
                this._DOP_Property._scrollRect = null;
                this._$setDirty();
            }
            return this;
        };
        /**是否缓存为位图*/
        DisplayObject.prototype.setCacheAsBitmap = function (value) {
            if (this._DOP_Property._cacheAsBitmap != value) {
                this._DOP_Property._cacheAsBitmap = value;
                if (value) {
                }
                else {
                    this._$texture_to_render = null;
                }
                this._$setDirty();
            }
            return this;
        };
        /**
         * 设置是否可以触摸
         * */
        DisplayObject.prototype.setTouchEnabled = function (value) {
            if (this._DOP_Property._touchEnabled != value) {
                this._DOP_Property._touchEnabled = value;
            }
        };
        /** 引擎内部调用，在从舞台删除后调用，清空stage属性 */
        DisplayObject.prototype._$clearStage = function () {
            this._DOP_Property._stage = null;
        };
        /** 显示对象加入舞台，引擎内部调用 */
        DisplayObject.prototype._$onAddToStage = function () {
            this._DOP_Property._stage = RM.MainContext.getInstance().stage;
            RM.MainContext.ADD_TO_STAGE_CALLBACK_LIST.push(this);
        };
        /** 显示对象从舞台中移除，引擎内部调用 <br>
         * 在移除回调时，stage属性会不设置为null，回调结束才置null
         * */
        DisplayObject.prototype._$onRemoveFormStage = function () {
            RM.MainContext.REMOVE_FORM_STAGE_CALLBACK_LIST.push(this);
        };
        /**
         *设置为脏
         *2015/11/4
         *Rich
         */
        DisplayObject.prototype._$setDirty = function () {
            this._DOP_Property._isDirty = true;
            this._$isChangeBound = true;
        };
        /**
         *清理脏
         *2015/11/4
         *Rich
         */
        DisplayObject.prototype._$clearDirty = function () {
            this._DOP_Property._isDirty = false;
        };
        /**
         *添加到RM.DisplayObjectContainer，并返回自己
         *15/10/30
         */
        DisplayObject.prototype.addTo = function (parent) {
            if (parent) {
                parent.addChild(this);
            }
            return this;
        };
        //=============================================Render Function=======================================================
        /**子类实现的渲染接口，子类在此接口调用自己的draw函数，以渲染到canvas*/
        DisplayObject.prototype._$render = function (renderContext) {
        };
        /**渲染前准备渲染的各种数据，如透明度、transform等数据，在此函数调用_render函数*/
        DisplayObject.prototype._$draw = function (renderContext) {
            var self = this;
            if (!self._DOP_Property._visible)
                return;
            if (self._drawCacheTexture(renderContext))
                return;
            renderContext.setAlpha(self._$globalAlpha);
            renderContext.setTransform(self._$globalTransform);
            var isMask = self._DOP_Property._scrollRect && self._DOP_Property._isContainer;
            if (isMask) {
                renderContext.pushMaskRect(self._DOP_Property._scrollRect);
            }
            self._$render(renderContext);
            if (isMask) {
                renderContext.popMaskRect();
            }
        };
        DisplayObject.prototype._drawCacheTexture = function (renderContext) {
            var self = this;
            if (!self._DOP_Property._cacheAsBitmap)
                return false;
            //以下判断为：是否要重新绘制缓存图形
            var bounds = self._$getBounds(self._$rect);
            if (self._$texture_to_render == null || bounds.width - self._$texture_to_render.textureW >= 1 && bounds.height - self._$texture_to_render.textureH >= 1) {
                self._madeBitmapCache();
            }
            //生成失败
            if (self._$texture_to_render == null)
                return false;
            self._$updateTransform();
            renderContext.setAlpha(self._$globalAlpha);
            renderContext.setTransform(self._$globalTransform);
            renderContext.drawImage(self._$texture_to_render, 0, 0, self._$texture_to_render.textureW, self._$texture_to_render.textureH, self._$texture_to_render.offsetX, self._$texture_to_render.offsetY, self._$texture_to_render.textureW, self._$texture_to_render.textureH);
            return true;
        };
        /**制作缓存图像*/
        DisplayObject.prototype._madeBitmapCache = function () {
            if (!this._$renderTexture) {
                this._$renderTexture = RM.RenderTexture.createRenderTexture();
            }
            var result = this._$renderTexture.drawToTexture(this);
            this._$texture_to_render = result ? this._$renderTexture : null;
            return result;
        };
        /**
         *更新全局属性，并判断是否需要渲染
         *2015/11/4
         *Rich
         */
        DisplayObject.prototype._$updateTransform = function () {
            var self = this;
            if (!self._DOP_Property._visible)
                return;
            self._updateGlobalTransform();
            //绘制缓存位图时，不需要判断脏矩形
            if (RM.MainContext.USE_CACHE_DRAW == false) {
                if (this._isNeedRender() == false)
                    return;
            }
            if (self.getNeedDraw() || self._$texture_to_render || self._DOP_Property._cacheAsBitmap) {
                RM.RenderCommand.push(self._$draw, self);
            }
        };
        /**
         *是否需要绘制，脏矩形的判断，如果去掉则全部绘制
         *2015/11/3
         */
        DisplayObject.prototype._isNeedRender = function () {
            if (RM.MainContext.RENDER_PHASE == RM.RenderLoopPhase.UPDATE_TRANSFORM_PHASE) {
                if (RM.GlobalConfig.IS_OPEN_DIRTY) {
                    if (RM.RenderFilter.getInstance().isFullScreenRender)
                        return true;
                    var rect = this._$getBounds(this._$rect);
                    rect = RM.GFunction.getTransformRectangle(rect, this._$globalTransform);
                    if (this._$againRect.isEmpty()) {
                        this._$againRect.resetToRect(rect);
                    }
                    if (RM.RenderFilter.getInstance().isHasDrawAreaList(rect)) {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         *更新全局属性
         *2015/11/4
         *Rich
         */
        DisplayObject.prototype._updateGlobalTransform = function () {
            var self = this;
            var dop = this._DOP_Property;
            var transform = self._$globalTransform;
            var parent = dop._parent;
            transform.copyMatrix(parent._$globalTransform);
            //混合变换矩阵
            transform.rightTransform(dop._x, dop._y, dop._scaleX, dop._scaleY, dop._skewX, dop._skewY, dop._rotate);
            if (self._DOP_Property._scrollRect) {
                transform.rightMultiply(1, 0, 0, 1, -self._DOP_Property._scrollRect.x, -self._DOP_Property._scrollRect.y);
            }
            //混合透明度
            self._$globalAlpha = parent._$globalAlpha * dop._alpha;
        };
        /**获取变换矩阵
         * 可以传入一个矩阵与self属性叠加，返回叠加矩阵
         * */
        DisplayObject.prototype.getMatrix = function (matrix) {
            if (!matrix) {
                matrix = this._$matrix;
            }
            matrix.reset();
            var dop = this._DOP_Property;
            matrix.rightTransform(dop._x, dop._y, dop._scaleX, dop._scaleY, dop._skewX, dop._skewY, dop._rotate);
            return matrix;
        };
        /**
         *检测脏矩形
         *15/10/25
         */
        DisplayObject.prototype._$checkDirtyRectangle = function () {
        };
        //=========================================================Function=================================================================
        /**合并所有父代全局tansform综合属性*/
        DisplayObject.prototype.getConcatenatedMatrix = function () {
            var matrix = this._$matrix;
            matrix.reset();
            var self = this;
            var dop;
            while (self != null) {
                dop = self._DOP_Property;
                matrix.leftTransform(dop._x, dop._y, dop._scaleX, dop._scaleY, dop._skewX, dop._skewY, dop._rotate);
                if (dop._scrollRect) {
                    matrix.rightMultiply(1, 0, 0, 1, -dop._scrollRect.x, -dop._scrollRect.y);
                }
                self = dop._parent;
            }
            return matrix;
        };
        /**本地坐标转换为全局坐标
         * @param x:本地坐标x轴
         * @param y:本地坐标y轴
         * */
        DisplayObject.prototype.localToGlobal = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var matrix = this.getConcatenatedMatrix();
            matrix.rightMultiply(1, 0, 0, 1, x, y);
            var point = RM.Point.create(matrix.x, matrix.y);
            return point;
        };
        /**全局坐标转换为本地坐标
         * @param x:全局坐标x轴
         * @param y:全局坐标y轴
         * */
        DisplayObject.prototype.globalToLocal = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var matrix = this.getConcatenatedMatrix();
            matrix.invert();
            matrix.rightMultiply(1, 0, 0, 1, x, y);
            var point = RM.Point.create(matrix.x, matrix.y);
            return point;
        };
        /**获取真实的边界，与显示边界不同，此方法根据子类的不同，需要子类实现重写*/
        DisplayObject.prototype._$realBounds = function () {
            return this._$rect.resetToValue(0, 0, 0, 0);
        };
        /**获得显示边界（不包含x,y属性），不同于真实边界，不需要子类重写，此方法根据是否设置过显示宽高来决定返回的显示边界
         * <br>后续增加描点功能
         * @return 返回新的矩形
         * */
        DisplayObject.prototype._$getShowBounds = function (rect) {
            if (!rect) {
                rect = RM.Rectangle.create();
            }
            var self = this;
            rect.resetToRect(self._$realBounds());
            var realW = self._DOP_Property._hasWidthSet ? self._DOP_Property._width : rect.width;
            var realH = self._DOP_Property._hasHeightSet ? self._DOP_Property._height : rect.height;
            self._DOP_Property._width = realW;
            self._DOP_Property._height = realH;
            this._DOP_Property._hasSize = false;
            rect.resetToValue(0, 0, realW, realH);
            return rect;
        };
        /**
         *获取显示范围（包含x,y属性），也就是有效的位置
         *2015/11/16
         */
        DisplayObject.prototype._$getBounds = function (rect) {
            if (!rect) {
                rect = RM.Rectangle.create();
            }
            if (this._$isChangeBound) {
                var self = this;
                this._$cacheBound.resetToRect(self._$realBounds());
                this._$cacheBound.width = self._DOP_Property._hasWidthSet ? self._DOP_Property._width : this._$cacheBound.width;
                this._$cacheBound.height = self._DOP_Property._hasHeightSet ? self._DOP_Property._height : this._$cacheBound.height;
                this._$isChangeBound = false;
            }
            rect.resetToRect(this._$cacheBound);
            return rect;
        };
        /**
         * 获取宽高尺寸<br>
         * 如果this._DOP_Property._hasSize 为true，则重新计算尺寸<br>
         * 否则使用上一次计算的结果，以减少计算量。如果设置过宽高属性，则按设置的<br>
         * 宽高属性返回。如果未设置过，则返回包含所有孩子的最大矩形尺寸。
         * 注意：宽高属性与缩放属性单独分开。设置缩放属性不影响宽高属性，例如宽度为100时scaleX设置为0.5，<br>
         * 则图像被缩放，但实际宽度依旧为100。
         * */
        DisplayObject.prototype._$getSize = function () {
            if (this._DOP_Property._hasWidthSet && this._DOP_Property._hasHeightSet) {
                return this._$rect.resetToValue(0, 0, this._DOP_Property._width, this._DOP_Property._height);
            }
            this._$rect.reset();
            if (this._DOP_Property._hasSize) {
                return this._$getBounds(this._$rect);
            }
            else {
                this._$rect.width = this._DOP_Property._width;
                this._$rect.height = this._DOP_Property._height;
            }
            return this._$rect;
        };
        /**
         * 指定舞台坐标是否在对象内
         * @param isTouchEnabled 是否忽略touchEnabled属性，当容器类可触摸时，忽略子项的属性
         * */
        DisplayObject.prototype._$hitTest = function (targetX, targetY, isTouchEnabled) {
            if (isTouchEnabled === void 0) { isTouchEnabled = false; }
            var self = this;
            if (!self._DOP_Property._visible)
                return null;
            if (isTouchEnabled == false && !self._DOP_Property._touchEnabled)
                return null;
            var bound = self._$getBounds(this._$rect);
            targetX -= bound.x;
            targetY -= bound.y;
            if (bound.containsXY(targetX, targetY)) {
                if (self._DOP_Property._scrollRect) {
                    if (self._DOP_Property._scrollRect.containsXY(targetX, targetY)) {
                        return self;
                    }
                }
                else {
                    return self;
                }
            }
            return null;
        };
        return DisplayObject;
    })(RM.EventDispatcher);
    RM.DisplayObject = DisplayObject;
})(RM || (RM = {}));
///<reference path="DisplayObject.ts"/>
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap(value) {
            _super.call(this);
            this._fillMode = RM.BitmapFillMode.SCALE;
            this.setName("Bitmap");
            this.setNeedDraw(true);
            if (value) {
                this.setTexture(value);
            }
        }
        /**
         *
         *2015/10/30
         */
        Bitmap.create = function (value) {
            return new RM.Bitmap(value);
        };
        Bitmap.prototype.setTexture = function (value) {
            if (value == this._texture)
                return this;
            this._texture = value;
            this._$setDirty();
            return this;
        };
        Bitmap.prototype.getTexture = function () {
            return this._texture;
        };
        Bitmap.prototype._$render = function (context) {
            var texture = this._texture;
            if (!texture) {
                this._$texture_to_render = null;
                return;
            }
            this._$texture_to_render = texture;
            var destW = this._DOP_Property._hasWidthSet ? this.getWidth() : texture.textureW;
            var destH = this._DOP_Property._hasHeightSet ? this.getHeight() : texture.textureH;
            RM.Bitmap._drawBitmap(context, destW, destH, this);
        };
        Bitmap._drawBitmap = function (context, destW, destH, thisObject) {
            var texture = thisObject._$texture_to_render;
            if (!texture)
                return;
            var tw = texture.textureW;
            var th = texture.textureH;
            var offsetx = texture.offsetX;
            var offsety = texture.offsetY;
            var bitmapw = texture.bitmapW || tw;
            var bitmaph = texture.bitmapH || th;
            var scalex = destW / tw;
            var scaley = destH / th;
            offsetx = offsetx * scalex;
            offsety = offsety * scaley;
            destW = bitmapw * scalex;
            destH = bitmaph * scaley;
            context.drawImage(texture, texture.bitmapX, texture.bitmapY, bitmapw, bitmaph, offsetx, offsety, destW, destH);
        };
        /** 重写父类方法，计算真实边界 */
        Bitmap.prototype._$realBounds = function () {
            var texture = this._texture;
            if (!texture) {
                return _super.prototype._$realBounds.call(this);
            }
            return this._$rect.resetToValue(0, 0, texture.textureW, texture.textureH);
        };
        return Bitmap;
    })(RM.DisplayObject);
    RM.Bitmap = Bitmap;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var BitmapFillMode = (function () {
        function BitmapFillMode() {
        }
        /**绘制平铺位图*/
        BitmapFillMode.REPEAT = "repeat";
        /**绘制拉伸位图*/
        BitmapFillMode.SCALE = "scale";
        return BitmapFillMode;
    })();
    RM.BitmapFillMode = BitmapFillMode;
})(RM || (RM = {}));
///<reference path="DisplayObject.ts"/>
var RM;
(function (RM) {
    /**
     * 显示对象容器类的基类，在显示列表树中属于父节点<br>
     * @author
     *
     */
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            _super.call(this);
            /**子对象是否接收触摸事件*/
            this._$touchChildren = true;
            this.setName("DisplayObjectContainer");
            this._$children = [];
            this._DOP_Property._isContainer = true;
        }
        Object.defineProperty(DisplayObjectContainer.prototype, "touchChildren", {
            /**
             * 获取是否可以触摸子对象
             * */
            get: function () {
                return this._$touchChildren;
            },
            /**
             * 设置是否可以触摸子对象
             * */
            set: function (value) {
                if (this._$touchChildren != value) {
                    this._$touchChildren = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        //===========================覆盖父类方法=======================================
        /** 不要设置宽高属性 **/
        DisplayObjectContainer.prototype.setWidth = function (value) {
            return this;
        };
        /** 不要设置宽高属性 **/
        DisplayObjectContainer.prototype.setHeight = function (value) {
            return this;
        };
        /** 不要设置宽高属性 **/
        DisplayObjectContainer.prototype.setSize = function (w, h) {
            return this;
        };
        //==================================================================
        /**
         * 添加DisplayObject子类的实例到显示列表容器，被添加至显示显示列表容器的末尾。
         * @param child 子项
         * @param index 索引位置
         * */
        DisplayObjectContainer.prototype.addChild = function (child) {
            var len = this._$children.length;
            if (child.getParent() == this) {
                len--;
            }
            return this._doAddChild(child, len);
        };
        /**
         * 添加DisplayObject子类的实例到显示列表容器，被添加至显示显示列表容器的index指定的位置。
         * @param child 子项
         * @param index 索引位置
         * */
        DisplayObjectContainer.prototype.addChildAt = function (child, index) {
            return this._doAddChild(child, index);
        };
        DisplayObjectContainer.prototype._doAddChild = function (child, index) {
            if (child == this)
                return child;
            if (index < 0 || index > this._$children.length) {
                RM.Log.print("DisplayObjectContainer._doAddChild 添加child到指定index位置错误！index为：", index);
            }
            var childParent = child.getParent();
            if (childParent == this) {
                this._doSetChildIndex(child, index);
                return child;
            }
            if (childParent) {
                var targetIndex = childParent._$children.indexOf(child);
                if (targetIndex >= 0) {
                    childParent.removeChildAt(targetIndex);
                }
            }
            this._$children.splice(index, 0, child);
            child.setParent(this);
            if (this.getStage()) {
                child._$onAddToStage();
                RM.MainContext.getInstance().broadcastAddToStage();
            }
            //重新计算尺寸
            this._DOP_Property._hasSize = true;
            child._$setDirty();
            return child;
        };
        /**
         * 改变DisplayObject子类的实例在显示列表容器中的坐标。
         * @param child 子项
         * @param index 索引位置
         * */
        DisplayObjectContainer.prototype.setChildIndex = function (child, index) {
            this._doSetChildIndex(child, index);
        };
        DisplayObjectContainer.prototype._doSetChildIndex = function (child, index) {
            var targetIndex = this._$children.indexOf(child);
            if (targetIndex < 0) {
                RM.Log.print("DisplayObjectContainer._doSetChildIndex更改子项位置失败，该child不存在于其父类");
            }
            this._$children.splice(targetIndex, 1);
            if (index < 0 || index >= this._$children.length) {
                this._$children.push(child);
            }
            else {
                this._$children.splice(index, 0, child);
            }
        };
        /**
         * 移除DisplayObject子类的实例，从显示列表容器中。
         * @param child 子项
         * */
        DisplayObjectContainer.prototype.removeChild = function (child) {
            var index = this._$children.indexOf(child);
            if (index >= 0 && index < this._$children.length) {
                return this._doRemoveChildAt(index);
            }
            else {
                RM.Log.print("DisplayObjectContainer.removeChild删除位置错误！index:", index);
                return null;
            }
        };
        /**
         * 移除DisplayObject子类的实例，从显示列表容器中的指定位置。
         * @param index 索引位置
         * */
        DisplayObjectContainer.prototype.removeChildAt = function (index) {
            if (index >= 0 && index < this._$children.length) {
                return this._doRemoveChildAt(index);
            }
            else {
                RM.Log.print("DisplayObjectContainer.removeChildAt删除位置错误！index:", index);
                return null;
            }
        };
        /**
         * 移除DisplayObject子类的所有孩子
         * */
        DisplayObjectContainer.prototype.removeAllChild = function () {
            var len = this._$children.length;
            while (len-- > 0) {
                var child = this._$children[len];
                if (this.getStage()) {
                    child._$onRemoveFormStage();
                }
                child.setParent(null);
            }
            RM.MainContext.getInstance().broadcastRemoveFormStage();
            len = this._$children.length;
            while (len-- > 0) {
                var child = this._$children[len];
                child.setParent(null);
            }
            this._$children.length = 0;
            this._DOP_Property._hasSize = true;
            this._$setDirty();
        };
        DisplayObjectContainer.prototype._doRemoveChildAt = function (index) {
            var child = this._$children[index];
            if (this.getStage()) {
                child._$onRemoveFormStage();
                RM.MainContext.getInstance().broadcastRemoveFormStage();
            }
            child.setParent(null);
            this._$children.splice(index, 1);
            this._DOP_Property._hasSize = true;
            this._$setDirty();
            return child;
        };
        /**
         * 获取DisplayObject子类的实例，从显示列表容器中的指定位置。
         * @param index 索引位置
         * */
        DisplayObjectContainer.prototype.getChildAt = function (index) {
            if (index < 0 || index >= this._$children.length) {
                RM.Log.print("DisplayObjectContainer.getChildAt获取位置错误！index:", index);
                return null;
            }
            return this._$children[index];
        };
        /**
         * 获取DisplayObject子类的实例，从指定的名字name。
         * @param name 显示对象的名字
         * */
        DisplayObjectContainer.prototype.getChildByName = function (name) {
            var len = this._$children.length;
            var target;
            while (len-- > 0) {
                target = this._$children[len];
                if (target.getName() == name) {
                    return target;
                }
            }
            return null;
        };
        /**
         * 获取指定DisplayObject对象在父类显示列表中的位置index。
         * @param child 显示对象
         * */
        DisplayObjectContainer.prototype.getChildIndex = function (child) {
            var index = this._$children.indexOf(child);
            return index;
        };
        /**
         * 在子级列表中两个指定的位置，交换子对象的Z轴顺序
         * @param index1 第一个索引位置
         * @param index2 第二个索引位置
         * */
        DisplayObjectContainer.prototype.swapChildrenAt = function (index1, index2) {
            var len = this._$children.length;
            if (index1 < 0 || index1 >= len || index2 < 0 || index2 >= len) {
                return;
            }
            this._doSwapChildrenAt(index1, index2);
        };
        /**
         * 在子级列表中两个指定的子项，交换子对象的Z轴顺序
         * @param child1 第一个索引位置
         * @param child2 第二个索引位置
         * */
        DisplayObjectContainer.prototype.swapChildren = function (child1, child2) {
            var index1 = this._$children.indexOf(child1);
            var index2 = this._$children.indexOf(child2);
            if (index1 < 0 || index2 < 0)
                return;
            this._doSwapChildrenAt(index1, index2);
        };
        DisplayObjectContainer.prototype._doSwapChildrenAt = function (index1, index2) {
            if (index1 == index2) {
                return;
            }
            var list = this._$children;
            var child = list[index1];
            list[index1] = list[index2];
            list[index2] = child;
        };
        /**
         * 获得子项的数量
         * */
        DisplayObjectContainer.prototype.getChildrenNum = function () {
            return this._$children.length;
        };
        //======================================覆写父类方法=============================
        /** 显示对象加入舞台，引擎内部调用 */
        DisplayObjectContainer.prototype._$onAddToStage = function () {
            _super.prototype._$onAddToStage.call(this);
            var self = this;
            var len = self._$children.length;
            var child;
            for (var idx = 0; idx < len; idx++) {
                child = self._$children[idx];
                child._$onAddToStage();
            }
        };
        /** 显示对象从舞台中移除，引擎内部调用 <br>
         * 在移除回调时，stage属性会不设置为null，回调结束才置null
         * */
        DisplayObjectContainer.prototype._$onRemoveFormStage = function () {
            _super.prototype._$onRemoveFormStage.call(this);
            var self = this;
            var len = self._$children.length;
            var child;
            for (var idx = 0; idx < len; idx++) {
                child = self._$children[idx];
                child._$onRemoveFormStage();
            }
        };
        //===================================渲染相关=============================================
        DisplayObjectContainer.prototype.pushMaskRect = function (renderContext) {
            if (this._DOP_Property._scrollRect) {
                renderContext.setTransform(this._$globalTransform);
                renderContext.pushMaskRect(this._DOP_Property._scrollRect);
            }
        };
        DisplayObjectContainer.prototype.popMaskRect = function (renderContext) {
            if (this._DOP_Property._scrollRect) {
                renderContext.popMaskRect();
            }
        };
        DisplayObjectContainer.prototype._$render = function (renderContext) {
            if (RM.MainContext.USE_CACHE_DRAW) {
                var list = this._$children;
                var len = list.length;
                var child;
                for (var idx = 0; idx < len; idx++) {
                    child = list[idx];
                    child._$draw(renderContext);
                }
            }
        };
        DisplayObjectContainer.prototype._$updateTransform = function () {
            if (!this._DOP_Property._visible)
                return;
            if (this._DOP_Property._scrollRect) {
                //按照渲染次序，先设置遮罩再渲染子项
                RM.RenderCommand.push(this.pushMaskRect, this);
            }
            _super.prototype._$updateTransform.call(this);
            if (!this._DOP_Property._cacheAsBitmap || !this._$texture_to_render) {
                var len = this._$children.length;
                var list = this._$children;
                var child;
                for (var idx = 0; idx < len; idx++) {
                    child = list[idx];
                    child._$updateTransform();
                }
            }
            if (this._DOP_Property._scrollRect) {
                //按照渲染次序，渲染完毕子项可以去除遮罩
                RM.RenderCommand.push(this.popMaskRect, this);
            }
        };
        /**
         *检测脏矩形
         *15/10/25
         */
        DisplayObjectContainer.prototype._$checkDirtyRectangle = function () {
            if (!this._DOP_Property._visible)
                return;
            var len = this._$children.length;
            var list = this._$children;
            var child;
            for (var idx = 0; idx < len; idx++) {
                child = list[idx];
                if (child.getDirty()) {
                    var rect = child._$getBounds();
                    rect = RM.GFunction.getTransformRectangle(rect, child.getConcatenatedMatrix());
                    if (!child._$againRect.isEmpty()) {
                        //清除旧的位置
                        RM.RenderFilter.getInstance().addDrawArea(child._$againRect.clone());
                    }
                    //设置为新的位置
                    child._$againRect.resetToRect(rect);
                    RM.RenderFilter.getInstance().addDrawArea(rect);
                }
                else {
                    child._$checkDirtyRectangle();
                }
            }
        };
        /**
         * 清理脏标记
         *15/10/25
         */
        DisplayObjectContainer.prototype._$clearDirty = function () {
            _super.prototype._$clearDirty.call(this);
            var len = this._$children.length;
            var list = this._$children;
            var child;
            for (var idx = 0; idx < len; idx++) {
                child = list[idx];
                child._$clearDirty();
            }
        };
        //======================================== Function =============================================================
        /** 重写父类方法，计算真实边界 */
        DisplayObjectContainer.prototype._$realBounds = function () {
            var minX = 0, maxX = 0, minY = 0, maxY = 0;
            var self = this;
            var len = self._$children.length;
            var child;
            var rect = RM.Rectangle.create();
            var matrix;
            for (var idx = 0; idx < len; idx++) {
                child = self._$children[idx];
                if (!child.getVisible())
                    continue;
                rect = child._$getBounds(rect);
                matrix = child.getMatrix();
                rect = RM.GFunction.getTransformRectangle(rect, matrix);
                if (rect.x < minX || idx == 0) {
                    minX = rect.x;
                }
                if (rect.getMaxX() > maxX || idx == 0) {
                    maxX = rect.getMaxX();
                }
                if (rect.y < minY || idx == 0) {
                    minY = rect.y;
                }
                if (rect.getMaxY() > maxY || idx == 0) {
                    maxY = rect.getMaxY();
                }
            }
            return rect.resetToValue(minX, minY, maxX - minX, maxY - minY);
        };
        /**
         * 覆盖父类方法，指定舞台坐标是否在对象内<br>
         * 容器是透明的矩形，是否触摸到容器的判断，要通过判断是否触摸在容器内部的子对象来确定。<br>
         * 如果触摸到可触摸的子对象，那么就说明触摸到了容器。<br>
         * 就算是缓存位图对象也会触发子对象的检测。
         *
         * */
        DisplayObjectContainer.prototype._$hitTest = function (targetX, targetY, isTouchEnabled) {
            if (isTouchEnabled === void 0) { isTouchEnabled = false; }
            if (!this._DOP_Property._visible)
                return null;
            if (this._DOP_Property._scrollRect && this._DOP_Property._scrollRect.containsXY(targetX, targetY) == false)
                return;
            var self = this;
            var len = self._$children.length;
            var child;
            var matrix;
            var point;
            var result = null;
            var childResult = null;
            var touchChildren = self._$touchChildren;
            var scrollrect;
            for (var idx = len - 1; idx >= 0; idx--) {
                child = self._$children[idx];
                matrix = child.getMatrix();
                scrollrect = child.getScrollRect();
                if (scrollrect) {
                    matrix.rightMultiply(1, 0, 0, 1, -scrollrect.x, -scrollrect.y);
                }
                matrix.invert();
                point = RM.GFunction.transformCoords(matrix, targetX, targetY);
                childResult = child._$hitTest(point.x, point.y, true);
                point.release();
                if (childResult) {
                    if (!touchChildren) {
                        return self;
                    }
                    if (childResult.getTouchEnabled() && touchChildren) {
                        return childResult;
                    }
                    result = self;
                }
            }
            if (result)
                return result;
            else if (self._$texture_to_render) {
                return _super.prototype._$hitTest.call(this, targetX, targetY, isTouchEnabled);
            }
            return null;
        };
        return DisplayObjectContainer;
    })(RM.DisplayObject);
    RM.DisplayObjectContainer = DisplayObjectContainer;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     * DisplayObject 的保护属性
     * @author
     *
     */
    var DOProtection = (function () {
        function DOProtection() {
            /** 名字 */
            this._name = "";
            /** x轴偏移值 */
            this._x = 0;
            /** y轴偏移值 */
            this._y = 0;
            /** 显示对象的宽度 */
            this._width = 0;
            /** 显示对象的高度 */
            this._height = 0;
            /** x轴缩放*/
            this._scaleX = 1;
            /** y轴缩放 */
            this._scaleY = 1;
            /** x轴切变 */
            this._skewX = 0;
            /** y轴切变 */
            this._skewY = 0;
            /** 旋转弧度 */
            this._rotate = 0;
            /** 滚动矩形，遮罩矩形 */
            this._scrollRect = null;
            /** 显示对象的透明度 */
            this._alpha = 1;
            /** 对象是否显示 */
            this._visible = true;
            /** 对象是否是显示容器 */
            this._isContainer = false;
            /** 父容器 */
            this._parent = null;
            /** 舞台 */
            this._stage = null;
            /**是否需要绘制*/
            this._needDraw = false;
            /**是否设置了宽度*/
            this._hasWidthSet = false;
            /**是否设置了高度*/
            this._hasHeightSet = false;
            /** 尺寸是否改变 */
            this._hasSize = true;
            /**缓存为位图*/
            this._cacheAsBitmap = false;
            /**是否接收触摸事件*/
            this._touchEnabled = false;
            /**是否为脏*/
            this._isDirty = true;
        }
        return DOProtection;
    })();
    RM.DOProtection = DOProtection;
})(RM || (RM = {}));
/**
 * Created by Rich on 2015/12/10.
 */
///<reference path="DisplayObject.ts"/>
var RM;
(function (RM) {
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(spriteSheet) {
            _super.call(this);
            /** 当前帧 **/
            this._currentFrame = 0;
            /** 帧频 **/
            this._frameRate = 1;
            /** 总帧数 **/
            this._totalFrames = 0;
            /** 播放次数 **/
            this._playTimes = 0;
            /** 已播放次数 **/
            this._playedTimes = 0;
            /** 计数器 **/
            this._tick = 0;
            /** 是否暂停 **/
            this._ispause = false;
            /** 帧列表 **/
            this._frameList = {};
            this.setName("MovieClip");
            this.setNeedDraw(true);
            this.setSpriteSheet(spriteSheet);
        }
        Object.defineProperty(MovieClip.prototype, "currentFrame", {
            get: function () {
                return this._currentFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "currentLabel", {
            get: function () {
                return this._currentLabel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "frameRate", {
            get: function () {
                return this._frameRate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "totalFrames", {
            get: function () {
                return this._totalFrames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "playTimes", {
            get: function () {
                return this._playTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "playedTimes", {
            get: function () {
                return this._playedTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "ispause", {
            get: function () {
                return this._ispause;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置纹理集，如果已设置过setPlayLable那么会从当前帧
         * @param spriteSheet
         */
        MovieClip.prototype.setSpriteSheet = function (spriteSheet) {
            this._spriteSheet = spriteSheet;
            this._frameList = {};
            if (this._currentLabel) {
                this.parseSpriteSheet();
            }
        };
        /**
         * 设置要播放的标签,会重新开始播放
         * @param label
         * @param time 秒值
         */
        MovieClip.prototype.setPlayLable = function (label, time) {
            this._currentLabel = label;
            this._frameRate = Math.ceil(time * 1000 / (1000 / RM.GlobalConfig.FRAME_RATE));
            this.parseSpriteSheet();
            this._readyPlay();
        };
        MovieClip.prototype.parseSpriteSheet = function () {
            if (!this._spriteSheet)
                return;
            if (!this._currentLabel)
                return;
            if (this._frameList.hasOwnProperty(this._currentLabel))
                return;
            var idx = 0;
            var list = [];
            var texture;
            var label;
            while (true) {
                label = this._currentLabel + idx;
                ++idx;
                texture = this._spriteSheet.getTexture(label);
                if (texture)
                    list.push(texture);
                else
                    break;
            }
            if (list.length > 0) {
                this._frameList[this._currentLabel] = list;
                this._totalFrames = list.length;
            }
        };
        /**
         * 是否可以播放
         * @returns {boolean}
         */
        MovieClip.prototype.isCanPlay = function () {
            if (!this._spriteSheet)
                return false;
            if (!this._currentLabel)
                return false;
            if (!this._frameList)
                return false;
            if (this._totalFrames <= 0)
                return false;
            return true;
        };
        /**
         * 播放准备
         * @returns {boolean}
         * @private
         */
        MovieClip.prototype._readyPlay = function () {
            this._tick = 0;
            this._currentFrame = 0;
            if (this.isCanPlay() == false) {
                RM.Log.warning("MovieClip._readyPlay()数据错误，可能没有初始化，准备播放失败！");
                return false;
            }
            return true;
        };
        /**
         * 播放
         * @param times
         */
        MovieClip.prototype.play = function (times) {
            if (times === void 0) { times = 0; }
            if (this._readyPlay() == false)
                return;
            this._playTimes = times;
            this._ispause = false;
            this.addEventListener(RM.Event.ENTER_FRAME, this.enterFrame, this);
        };
        /**
         * 暂停
         */
        MovieClip.prototype.pause = function () {
            this._ispause = true;
        };
        /**
         * 恢复播放，只有在暂停的情况下 才可以继续播放
         */
        MovieClip.prototype.replay = function () {
            if (this._ispause == false)
                return;
            if (this.isCanPlay() == false) {
                RM.Log.warning("MovieClip.replay()数据错误，可能没有初始化，播放失败！");
                return;
            }
            this._ispause = false;
        };
        /**
         * 停止
         */
        MovieClip.prototype.stop = function () {
            this._ispause = false;
            this.removeEventListener(RM.Event.ENTER_FRAME, this.enterFrame, this);
        };
        /**
         * 下一帧
         */
        MovieClip.prototype.nextFrame = function () {
            if (this._currentFrame >= this._totalFrames) {
                this._playedTimes++;
                if (this._playTimes != 0 && this._playedTimes >= this._playTimes) {
                    this.stop();
                    return;
                }
                this._currentFrame = 0;
            }
            this._$setDirty();
            if (this._frameList.hasOwnProperty(this._currentLabel)) {
                this._currentTexture = this._frameList[this._currentLabel][this._currentFrame];
            }
            this._currentFrame++;
        };
        MovieClip.prototype.enterFrame = function (dt) {
            if (this._ispause)
                return;
            if (this._tick >= this._frameRate) {
                this._tick = 0;
                this.nextFrame();
            }
            this._tick++;
        };
        MovieClip.prototype._$render = function (context) {
            var texture = this._currentTexture;
            if (!texture) {
                this._$texture_to_render = null;
                return;
            }
            var destW = this._DOP_Property._hasWidthSet ? this.getWidth() : texture.textureW;
            var destH = this._DOP_Property._hasHeightSet ? this.getHeight() : texture.textureH;
            var tw = texture.textureW;
            var th = texture.textureH;
            var offsetx = texture.offsetX;
            var offsety = texture.offsetY;
            var bitmapw = texture.bitmapW || tw;
            var bitmaph = texture.bitmapH || th;
            var scalex = destW / tw;
            var scaley = destH / th;
            offsetx = offsetx * scalex;
            offsety = offsety * scaley;
            destW = bitmapw * scalex;
            destH = bitmaph * scaley;
            context.drawImage(texture, texture.bitmapX, texture.bitmapY, bitmapw, bitmaph, offsetx, offsety, destW, destH);
        };
        /** 重写父类方法，计算真实边界 */
        MovieClip.prototype._$realBounds = function () {
            var texture = this._currentTexture;
            if (!texture) {
                return _super.prototype._$realBounds.call(this);
            }
            return this._$rect.resetToValue(0, 0, texture.textureW, texture.textureH);
        };
        return MovieClip;
    })(RM.DisplayObject);
    RM.MovieClip = MovieClip;
})(RM || (RM = {}));
///<reference path="../utils/HashObject.ts"/>
var RM;
(function (RM) {
    /**
     * 纹理类
     * @author Rich
     *
     */
    var Texture = (function (_super) {
        __extends(Texture, _super);
        function Texture(bitmapData) {
            _super.call(this);
            /**纹理bitmapData*/
            this._bitmapData = null;
            /**bitmapData原始宽度*/
            this._sourceW = 0;
            /**bitmapData资源原始高度*/
            this._sourceH = 0;
            //从原始纹理裁剪的属性
            /**表示这个纹理从 bitmapData 上的 x 位置开始裁剪*/
            this._bitmapX = 0;
            /**表示这个纹理从 bitmapData 上的 y 位置开始裁剪*/
            this._bitmapY = 0;
            /**表示这个纹理从 bitmapData 上裁剪的宽度*/
            this._bitmapW = 0;
            /**表示这个纹理在 bitmapData 上裁剪的高度*/
            this._bitmapH = 0;
            //渲染在画布中的属性
            /**表示这个纹理显示了之后在 画布 x 方向的渲染偏移量*/
            this._offsetX = 0;
            /**表示这个纹理显示了之后在 画布 y 方向的渲染偏移量*/
            this._offsetY = 0;
            /**纹理渲染宽度（图像裁剪后的实际高度，比_bitmapW大，图像则被拉伸，反之图像则被缩小）*/
            this._textureW = 0;
            /**纹理渲染高度（图像裁剪后的实际高度，比_bitmapH大，图像则被拉伸，反之图像则被放小）*/
            this._textureH = 0;
            if (bitmapData) {
                this.setBitmapData(bitmapData);
            }
        }
        /**
         *
         *2015/10/30
         */
        Texture.create = function (bitmapData) {
            return new RM.Texture(bitmapData);
        };
        Texture.prototype.setBitmapData = function (value) {
            this._bitmapData = value;
            this._sourceW = value.width;
            this._sourceH = value.height;
            this._textureW = this._sourceW * RM.GlobalConfig.TEXTURE_SCALE;
            this._textureH = this._sourceH * RM.GlobalConfig.TEXTURE_SCALE;
            this._bitmapW = this._textureW;
            this._bitmapH = this._textureH;
            this._offsetX = this._offsetY = this._bitmapX = this._bitmapY = 0;
        };
        Object.defineProperty(Texture.prototype, "textureW", {
            /**纹理渲染宽度（图像裁剪后的实际高度，比_bitmapW大，图像则被拉伸，反之图像则被缩小）*/
            get: function () {
                return this._textureW;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "textureH", {
            /**纹理渲染高度（图像裁剪后的实际高度，比_bitmapH大，图像则被拉伸，反之图像则被放小）*/
            get: function () {
                return this._textureH;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "bitmapW", {
            /**表示这个纹理从 bitmapData 上裁剪的宽度*/
            get: function () {
                return this._bitmapW;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "bitmapH", {
            /**表示这个纹理在 bitmapData 上裁剪的高度*/
            get: function () {
                return this._bitmapH;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "bitmapX", {
            /**表示这个纹理从 bitmapData 上的 x 位置开始裁剪*/
            get: function () {
                return this._bitmapX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "bitmapY", {
            /**表示这个纹理从 bitmapData 上的 y 位置开始裁剪*/
            get: function () {
                return this._bitmapY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "sourceW", {
            /**bitmapData原始宽度*/
            get: function () {
                return this._sourceW;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "sourceH", {
            /**bitmapData原始高度*/
            get: function () {
                return this._sourceH;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "offsetX", {
            /**表示这个纹理显示了之后在 画布 x 方向的渲染偏移量*/
            get: function () {
                return this._offsetX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "offsetY", {
            /**表示这个纹理显示了之后在 画布 y 方向的渲染偏移量*/
            get: function () {
                return this._offsetY;
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype.drawForCanvas = function (context, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH, renderType) {
            var bitmapData = this._bitmapData;
            if (!bitmapData || !bitmapData["loadComplete"]) {
                return;
            }
            if (renderType) {
                this.drawRepeatImageForCanvas(context, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH, renderType);
            }
            else {
                context.drawImage(bitmapData, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);
            }
        };
        /**
         * 重复绘制image到画布，渲染类型可选renderType：<br>
         * （repeat：默认。该模式在水平和垂直方向重复。铺满画布<br>
         *  repeat-x：该模式只在水平方向重复。横向铺满<br>
         *  repeat-y：该模式只在垂直方向重复。纵向铺满<br>
         *  no-repeat：该模式只显示一次（不重复）。）
         */
        Texture.prototype.drawRepeatImageForCanvas = function (context, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH, renderType) {
            var bitmapData = this._bitmapData;
            var img = bitmapData;
            if (bitmapData.width != sourceW || bitmapData.height != sourceH || RM.GlobalConfig.TEXTURE_SCALE != 1) {
                var sw = sourceW * RM.GlobalConfig.TEXTURE_SCALE;
                var sh = sourceH * RM.GlobalConfig.TEXTURE_SCALE;
                var canvas = document.createElement("canvas");
                canvas.width = sw;
                canvas.height = sh;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(bitmapData, sourceX, sourceY, sourceW, sourceH, 0, 0, sw, sh);
                img = ctx;
            }
            var pattern = context.createPattern(img, renderType);
            context.fillStyle = pattern;
            context.translate(destX, destY); //移动到（destX，destY）位置准备绘制
            context.fillRect(0, 0, destW, destH); //绘制被填充的矩形
            context.translate(-destX, -destY); //绘制完毕，还原到上次的位置
        };
        Texture.prototype.clone = function () {
            var texture = new RM.Texture();
            texture._bitmapData = this._bitmapData;
            return texture;
        };
        Texture.prototype.dispose = function () {
        };
        /**
         * 通过url，创建bitmapdata纹理<br>
         * url：资源路径<br>
         * callback：加载完成或加载失败回调函数，包含｛是否成功（0成功、1失败），bitmapData对象｝<br>
         * return
         */
        Texture.createBitmapData = function (url, callback) {
            var bitmapdata = this._bitmapDataFactoryMap[url];
            if (!bitmapdata) {
                bitmapdata = document.createElement("img");
                bitmapdata.setAttribute("bitmapUrl", url);
                Texture._bitmapDataFactoryMap[url] = bitmapdata;
            }
            if (bitmapdata["loadComplete"]) {
                callback(0, bitmapdata);
                return;
            }
            if (this._bitmapDataCallBackMap[url] == null) {
                this.addToBitmapDataCallBackMap(url, callback);
                //the first loader
                bitmapdata.onload = function () {
                    Texture.onloadResult(0, url, bitmapdata);
                };
                bitmapdata.onerror = function () {
                    Texture.onloadResult(1, url, bitmapdata);
                };
                bitmapdata.src = url;
            }
            else {
                this.addToBitmapDataCallBackMap(url, callback);
            }
        };
        /**
         *通过url获取缓存中的纹理，如果未加载则返回null
         *2015/10/30
         */
        Texture.getTexture = function (url) {
            var bitmapdata = this._bitmapDataFactoryMap[url];
            if (bitmapdata && bitmapdata["loadComplete"]) {
                return RM.Texture.create(bitmapdata);
            }
            return null;
        };
        Texture.onloadResult = function (result, url, bitmapData) {
            if (result < 1) {
                bitmapData["loadComplete"] = true;
            }
            if (bitmapData.onload)
                bitmapData.onload = null;
            if (bitmapData.onerror)
                bitmapData.onerror = null;
            var list = this._bitmapDataCallBackMap[url];
            var len = list.length;
            if (list && (len > 0)) {
                delete this._bitmapDataCallBackMap[url];
                var callback;
                for (var index = 0; index < len; index++) {
                    callback = list[index];
                    callback(result, bitmapData);
                }
            }
        };
        Texture.addToBitmapDataCallBackMap = function (url, callback) {
            var list = this._bitmapDataCallBackMap[url];
            if (list == null) {
                list = [];
            }
            list.push(callback);
            this._bitmapDataCallBackMap[url] = list;
        };
        Texture._bitmapDataFactoryMap = {};
        Texture._bitmapDataCallBackMap = {};
        return Texture;
    })(RM.HashObject);
    RM.Texture = Texture;
})(RM || (RM = {}));
///<reference path="HashObject.ts"/>
var RM;
(function (RM) {
    /**
     * 矩形类
     * @author
     *
     */
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle() {
            _super.call(this);
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
        Rectangle.create = function (x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            var rect = RM.Rectangle.PoolUtil.getObject();
            rect.resetToValue(x, y, width, height);
            return rect;
        };
        Object.defineProperty(Rectangle, "PoolUtil", {
            get: function () {
                if (!RM.Rectangle._PoolUtil) {
                    RM.Rectangle._PoolUtil = new RM.PoolUtil(RM.Rectangle);
                }
                return RM.Rectangle._PoolUtil;
            },
            enumerable: true,
            configurable: true
        });
        /**释放**/
        Rectangle.prototype.release = function () {
            RM.Rectangle.PoolUtil.release(this);
        };
        Rectangle.prototype.reset = function () {
            this.x = this.y = this.width = this.height = 0;
        };
        /**克隆，制作自己的分身，值的拷贝，产生新值*/
        Rectangle.prototype.clone = function () {
            return RM.Rectangle.create(this.x, this.y, this.width, this.height);
        };
        /**重置为指定值*/
        Rectangle.prototype.resetToValue = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };
        /**重置为指定Rect*/
        Rectangle.prototype.resetToRect = function (rect) {
            this.x = rect.x;
            this.y = rect.y;
            this.width = rect.width;
            this.height = rect.height;
            return this;
        };
        /**对比两个矩形是否是相同的值*/
        Rectangle.prototype.equals = function (rect) {
            return (this.x == rect.x) && (this.y == rect.y) && (this.width == rect.width) && (this.height == rect.height);
        };
        /**获取最大X轴的值*/
        Rectangle.prototype.getMaxX = function () {
            return this.x + this.width;
        };
        /**获取最小X轴的值*/
        Rectangle.prototype.getMinX = function () {
            return this.x;
        };
        /**获取在X轴的中间值*/
        Rectangle.prototype.getMidX = function () {
            return this.x + this.width / 2;
        };
        /**获取最大Y轴的值*/
        Rectangle.prototype.getMaxY = function () {
            return this.y + this.height;
        };
        /**获取最小Y轴的值*/
        Rectangle.prototype.getMinY = function () {
            return this.y;
        };
        /**获取在Y轴的中间值*/
        Rectangle.prototype.getMidY = function () {
            return this.y + this.height / 2;
        };
        /** 是否为空矩形 **/
        Rectangle.prototype.isEmpty = function () {
            return this.width == 0 || this.height == 0;
        };
        /**指定点是否在矩形内*/
        Rectangle.prototype.containsPoint = function (point) {
            if (this.containsXY(point.x, point.y)) {
                return true;
            }
            return false;
        };
        /**指定坐标是否在矩形内*/
        Rectangle.prototype.containsXY = function (x, y) {
            if (x >= this.getMinX() && x <= this.getMaxX() && y <= this.getMaxY() && y >= this.getMinY()) {
                return true;
            }
            return false;
        };
        /**自己是否包含指定rect，如果rect完全处于自己内部，则属于包含rect*/
        Rectangle.prototype.containsRect = function (rect) {
            return (rect.x >= this.x) && (rect.x < this.getMaxX()) && (rect.y >= this.y) && (rect.y < this.getMaxY()) && (rect.getMaxX() > this.x) && (rect.getMaxX() <= this.getMaxX()) && (rect.getMaxY() > this.y) && (rect.getMaxY() <= this.getMaxY());
        };
        /**指定矩形与自己是否相交*/
        Rectangle.prototype.intersectsRect = function (rect) {
            return Math.max(this.x, rect.x) <= Math.min(this.getMaxX(), rect.getMaxX()) && Math.max(this.y, rect.y) <= Math.min(this.getMaxY(), rect.getMaxY());
        };
        /**指定矩形rect与自己是否相交<br>
         * 如果相交则返回交集区域 Rectangle 对象。<br>
         * 如果矩形不相交，则此方法返回一个空的 Rectangle 对象，其属性设置为 0。*/
        Rectangle.prototype.intersection = function (rect, toSelf) {
            if (toSelf === void 0) { toSelf = false; }
            var result;
            if (toSelf) {
                result = this;
            }
            else {
                result = this.clone();
            }
            var minx = Math.max(result.x, rect.x);
            var maxx = Math.min(result.getMaxX(), rect.getMaxX());
            if (minx <= maxx) {
                var miny = Math.max(result.y, rect.y);
                var maxy = Math.min(result.getMaxY(), rect.getMaxY());
                if (miny <= maxy) {
                    result.resetToValue(minx, miny, maxx - minx, maxy - miny);
                    return result;
                }
            }
            result.resetToValue(0, 0, 0, 0);
            return result;
        };
        /**通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
         *
         * */
        Rectangle.prototype.union = function (toUnion, toSelf) {
            if (toSelf === void 0) { toSelf = false; }
            var result;
            if (toSelf) {
                result = this;
            }
            else {
                result = this.clone();
            }
            if (toUnion.isEmpty()) {
                return result;
            }
            if (result.isEmpty()) {
                result.resetToRect(toUnion);
                return result;
            }
            var minx = Math.min(result.x, toUnion.x);
            var miny = Math.min(result.y, toUnion.y);
            var maxx = Math.max(result.getMaxX(), toUnion.getMaxX());
            var maxy = Math.max(result.getMaxY(), toUnion.getMaxY());
            result.resetToValue(minx, miny, maxx - minx, maxy - miny);
            return result;
        };
        /**
         *获取两个矩形合并后的面积
         *2015/11/12
         */
        Rectangle.unionArea = function (rect1, rect2) {
            var minx = Math.min(rect1.x, rect2.x);
            var miny = Math.min(rect1.y, rect2.y);
            var maxx = Math.max(rect1.getMaxX(), rect2.getMaxX());
            var maxy = Math.max(rect1.getMaxY(), rect2.getMaxY());
            return (maxx - minx) * (maxy - miny);
        };
        /**
         *获取两个矩形重叠区域的面积
         *2015/11/12
         */
        Rectangle.intersectionArea = function (rect1, rect2) {
            if (rect1.intersectsRect(rect2) == false)
                return 0;
            var minx = Math.max(rect1.x, rect2.x);
            var miny = Math.max(rect1.y, rect2.y);
            var maxx = Math.min(rect1.getMaxX(), rect2.getMaxX());
            var maxy = Math.min(rect1.getMaxY(), rect2.getMaxY());
            return (maxx - minx) * (maxy - miny);
        };
        /**
         *获取面积
         *15/10/25
         */
        Rectangle.prototype.getArea = function () {
            return this.width * this.height;
        };
        /**以字符串的形式输出*/
        Rectangle.prototype.toString = function () {
            return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
        };
        return Rectangle;
    })(RM.HashObject);
    RM.Rectangle = Rectangle;
})(RM || (RM = {}));
///<reference path="Texture.ts"/>
///<reference path="../utils/Rectangle.ts"/>
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var RenderTexture = (function (_super) {
        __extends(RenderTexture, _super);
        function RenderTexture() {
            _super.call(this);
        }
        RenderTexture.createRenderTexture = function () {
            if (RM.RenderTexture._pool.length > 0) {
                return RM.RenderTexture._pool.pop();
            }
            return new RM.RenderTexture();
        };
        /**回收*/
        RenderTexture.prototype.release = function () {
            RM.RenderTexture._pool.push(this);
        };
        RenderTexture.prototype.dispose = function () {
            if (this._bitmapData) {
                this._bitmapData = null;
                this._renderContext = null;
            }
        };
        RenderTexture.prototype.init = function () {
            this._bitmapData = document.createElement("canvas");
            this._bitmapData["loadComplete"] = true;
            this._renderContext = RM.H5CanvasRender.createRenderContext(this._bitmapData, false);
        };
        RenderTexture.prototype.setSize = function (width, height) {
            var cacheCanvas = this._bitmapData;
            cacheCanvas.width = width;
            cacheCanvas.height = height;
            cacheCanvas.style.width = width + "px";
            cacheCanvas.style.height = height + "px";
        };
        RenderTexture.prototype.drawToTexture = function (displayObject) {
            //获取显示边界
            var bounds = displayObject._$getBounds();
            //如果宽高为0 则不缓存
            if (bounds.width == 0 || bounds.height == 0)
                return false;
            if (!this._renderContext) {
                this.init();
            }
            //设置显示边界
            this.setSize(bounds.width, bounds.height);
            //设置偏移
            this._offsetX = bounds.x;
            this._offsetY = bounds.y;
            displayObject._$globalTransform.rightMultiply(1, 0, 0, 1, -this._offsetX, -this._offsetY);
            displayObject._$globalAlpha = 1;
            //如果是容器类，则update子类
            if (displayObject instanceof RM.DisplayObjectContainer) {
                var len = displayObject.getChildrenNum();
                var child;
                for (var idx = 0; idx < len; idx++) {
                    child = displayObject.getChildAt(idx);
                    child._$updateTransform();
                }
            }
            //设置全局变换
            this._renderContext.setTransform(displayObject._$globalTransform);
            this._renderContext.clearScene();
            this._renderContext.onRenderStart();
            RM.MainContext.USE_CACHE_DRAW = true;
            if (displayObject.getScrollRect()) {
                this._renderContext.pushMaskRect(displayObject.getScrollRect());
            }
            //把所有子项绘制到画布
            displayObject._$render(this._renderContext);
            if (displayObject.getScrollRect()) {
                this._renderContext.popMaskRect();
            }
            //还原全局配置
            RM.MainContext.USE_CACHE_DRAW = false;
            //设置绘制区域，绘制画面
            RM.RenderTexture._rect.width = bounds.width;
            RM.RenderTexture._rect.height = bounds.height;
            this._renderContext.onRenderFinish();
            this._sourceW = bounds.width;
            this._sourceH = bounds.height;
            this._textureW = bounds.width;
            this._textureH = bounds.height;
            return true;
        };
        RenderTexture._pool = [];
        RenderTexture._rect = new RM.Rectangle();
        return RenderTexture;
    })(RM.Texture);
    RM.RenderTexture = RenderTexture;
})(RM || (RM = {}));
///<reference path="DisplayObjectContainer.ts"/>
var RM;
(function (RM) {
    /**
     * 精灵类，显示列表中的节点，包含一系列子项的列表
     * @author
     *
     */
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            _super.call(this);
            this.setName("Sprite");
        }
        return Sprite;
    })(RM.DisplayObjectContainer);
    RM.Sprite = Sprite;
})(RM || (RM = {}));
///<reference path="../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/31.
 */
var RM;
(function (RM) {
    /**
     *SpriteSheet是由一个或者多个子图拼合成的纹理图集<br>
     *     图集只存在一份，所有SpriteSheet共享数据，所有子项渲染到画布上的偏移位置不同而已<br>
     *
     *2015/10/31
     *Rich
     */
    var SpriteSheet = (function (_super) {
        __extends(SpriteSheet, _super);
        function SpriteSheet(texture, textureJSON) {
            _super.call(this);
            /** 纹理列表 **/
            this._textureMap = {};
            this._texture = texture;
            this._textureJSON = textureJSON;
        }
        /**
         *
         *2015/10/31
         */
        SpriteSheet.create = function (texture, textureJSON) {
            return new RM.SpriteSheet(texture, textureJSON);
        };
        /**
         * 通过URL创建
         * @param textureUrl
         * @param textureJSONUrl
         * @returns {RM.SpriteSheet}
         */
        SpriteSheet.createByUrl = function (textureUrl, textureJSONUrl) {
            var tex = RM.Texture.getTexture(textureUrl);
            var obj = RM.JsonAnalyzer.getJsonAnalyzer(textureJSONUrl);
            return new RM.SpriteSheet(tex, obj.getJsonTextureFile());
        };
        /**
         *通过名字获取纹理
         *2015/10/31
         */
        SpriteSheet.prototype.getTexture = function (name) {
            if (!name || name.length <= 0)
                return null;
            var texture = this._textureMap[name];
            if (!texture) {
                var frame = this._textureJSON.getJsonFrameformName(name);
                if (!frame)
                    return null;
                texture = this.createTexture(name, frame.x, frame.y, frame.w, frame.h);
            }
            return texture;
        };
        /**
         * @param name
         * @param bitmapX  表示这个纹理从 bitmapData 上的 x 位置开始裁剪
         * @param bitmapY  表示这个纹理从 bitmapData 上的 y 位置开始裁剪
         * @param bitmapWidth 表示这个纹理从 bitmapData 上裁剪的宽度
         * @param bitmapHeight  表示这个纹理在 bitmapData 上裁剪的高度
         * @param offsetX 表示这个纹理显示了之后在 画布 x 方向的渲染偏移量
         * @param offsetY 表示这个纹理显示了之后在 画布 y 方向的渲染偏移量
         * @param textureWidth  纹理渲染宽度（图像裁剪后的实际高度，比_bitmapW大，图像则被拉伸，反之图像则被缩小），若不传入，则使用 bitmapWidth 的值。
         * @param textureHeight 纹理渲染高度（图像裁剪后的实际高度，比_bitmapH大，图像则被拉伸，反之图像则被放小），若不传入，则使用 bitmapHeight 的值。
         *2015/10/31
         */
        SpriteSheet.prototype.createTexture = function (name, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            if (!textureWidth) {
                textureWidth = bitmapWidth;
            }
            if (!textureHeight) {
                textureHeight = bitmapHeight;
            }
            var texture = this._texture.clone();
            texture._bitmapX = bitmapX;
            texture._bitmapY = bitmapY;
            texture._bitmapW = bitmapWidth * RM.GlobalConfig.TEXTURE_SCALE;
            texture._bitmapH = bitmapHeight * RM.GlobalConfig.TEXTURE_SCALE;
            texture._offsetX = offsetX;
            texture._offsetY = offsetY;
            texture._textureW = textureWidth * RM.GlobalConfig.TEXTURE_SCALE;
            texture._textureH = textureHeight * RM.GlobalConfig.TEXTURE_SCALE;
            texture._sourceW = this._texture._sourceW;
            texture._sourceH = this._texture._sourceH;
            this._textureMap[name] = texture;
            return texture;
        };
        return SpriteSheet;
    })(RM.HashObject);
    RM.SpriteSheet = SpriteSheet;
})(RM || (RM = {}));
///<reference path="DisplayObjectContainer.ts"/>
var RM;
(function (RM) {
    /**
     * 舞台，主绘区
     * @author
     *
     */
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage() {
            _super.call(this);
            this.setName("Stage");
            this._DOP_Property._touchEnabled = true;
            this._DOP_Property._stage = this;
        }
        Stage.prototype._$updateTransform = function () {
            var child;
            for (var idx = 0, len = this._$children.length; idx < len; idx++) {
                child = this._$children[idx];
                child._$updateTransform();
            }
        };
        /**
         * 覆盖父类方法，指定舞台坐标是否在对象内<br>
         * */
        Stage.prototype._$hitTest = function (targetX, targetY, isTouchEnabled) {
            if (isTouchEnabled === void 0) { isTouchEnabled = false; }
            if (!this._DOP_Property._touchEnabled)
                return null;
            if (!this._$touchChildren)
                return this;
            var len = this._$children.length;
            var child;
            var matrix;
            var point;
            var result = null;
            var scrollrect;
            for (var idx = len - 1; idx >= 0; idx--) {
                child = this._$children[idx];
                matrix = child.getMatrix();
                scrollrect = child.getScrollRect();
                if (scrollrect) {
                    matrix.rightMultiply(1, 0, 0, 1, -scrollrect.x, -scrollrect.y);
                }
                matrix.invert();
                point = RM.GFunction.transformCoords(matrix, targetX, targetY);
                result = child._$hitTest(point.x, point.y, true);
                point.release();
                if (result) {
                    if (result.getTouchEnabled()) {
                        return result;
                    }
                }
            }
            return this;
        };
        return Stage;
    })(RM.DisplayObjectContainer);
    RM.Stage = Stage;
})(RM || (RM = {}));
///<reference path="../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/30.
 */
var RM;
(function (RM) {
    var ResGroupItem = (function (_super) {
        __extends(ResGroupItem, _super);
        function ResGroupItem(group, callback, thisObj) {
            _super.call(this);
            this._isComplete = true;
            this._loadCompleteNum = 0;
            this._loadAllNum = 0;
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
        ResGroupItem.create = function (group, callback, thisObj) {
            return new RM.ResGroupItem(group, callback, thisObj);
        };
        Object.defineProperty(ResGroupItem.prototype, "group", {
            get: function () {
                return this._group;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResGroupItem.prototype, "isComplete", {
            get: function () {
                return this._isComplete;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResGroupItem.prototype, "loadCompleteNum", {
            get: function () {
                return this._loadCompleteNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResGroupItem.prototype, "loadAllNum", {
            get: function () {
                return this._loadAllNum;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         *2015/10/30
         */
        ResGroupItem.prototype.reset = function () {
            this._callback = null;
            this._group = null;
            this._thisObj = null;
            this._isComplete = true;
            this._loadAllNum = 0;
            this._loadCompleteNum = 0;
        };
        /**
         *
         *2015/10/30
         */
        ResGroupItem.prototype.load = function () {
            for (var idx = 0; idx < this._loadAllNum; idx++) {
                var url = this._group[idx];
                RM.ResLoaderItem.create(url, true, this);
            }
        };
        /**
         *
         *2015/10/30
         */
        ResGroupItem.prototype._loadCompleteOnce = function (tag) {
            if (this._isComplete)
                return;
            this._loadCompleteNum++;
            if (this._loadCompleteNum == this._loadAllNum) {
                this._isComplete = true;
            }
            if (this._callback && this._thisObj) {
                this._callback.apply(this._thisObj, [this]);
            }
        };
        return ResGroupItem;
    })(RM.HashObject);
    RM.ResGroupItem = ResGroupItem;
})(RM || (RM = {}));
///<reference path="ResGroupItem.ts"/>
/**
 * Created by Rich on 2015/10/29.
 */
var RM;
(function (RM) {
    var Res = (function (_super) {
        __extends(Res, _super);
        function Res() {
            _super.call(this);
        }
        /**
         *
         * @param list
         * @param callback function( RM.ResGroupItem )
         * @param list
         *2015/10/30
         */
        Res.loadGroup = function (list, callback, thisObj) {
            RM.ResGroupItem.create(list, callback, thisObj).load();
        };
        //资源文件类型
        Res.RES_TYPE_JPG = ".jpg"; //JPG
        Res.RES_TYPE_PNG = ".png"; //PNG
        Res.RES_TYPE_SWF = ".swf"; //SWF/ZFY
        Res.RES_TYPE_DAT = ".dat"; //DAT
        Res.RES_TYPE_RES = ".res"; //RES
        Res.RES_TYPE_TXT = ".txt"; //TXT
        Res.RES_TYPE_MP3 = ".mp3"; //MP3
        Res.RES_TYPE_JSON = ".json"; //MP3
        return Res;
    })(RM.HashObject);
    RM.Res = Res;
})(RM || (RM = {}));
///<reference path="../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/29.
 */
var RM;
(function (RM) {
    var ResLoaderItem = (function (_super) {
        __extends(ResLoaderItem, _super);
        /**
         *url 加载路径。
         * isStart 是否立即开始加载。
         *2015/10/29
         */
        function ResLoaderItem(url, isStart, useGroup) {
            if (isStart === void 0) { isStart = false; }
            _super.call(this);
            /** 加载路径 **/
            this._url = "";
            /** 是否已经加载 **/
            this._isComplete = false;
            /** 是否正在加载 **/
            this._isLoading = false;
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
        ResLoaderItem.create = function (url, isStart, useGroup) {
            if (isStart === void 0) { isStart = false; }
            return new RM.ResLoaderItem(url, isStart, useGroup);
        };
        /**
         *重置
         *2015/10/29
         */
        ResLoaderItem.prototype.reset = function () {
            this._isComplete = false;
            this._isLoading = false;
            this._loader.reset();
            this._url = "";
            this._useGroup = null;
        };
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
        ResLoaderItem.prototype.load = function (url) {
            if (this._isComplete) {
                this.sendGroupComplete(2);
                return 2;
            }
            if (this._isLoading)
                return 1;
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
            var type = "";
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
        };
        /**
         *
         *2015/10/29
         */
        ResLoaderItem.prototype.onComplete = function (event) {
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
        };
        /**
         *
         *2015/10/29
         */
        ResLoaderItem.prototype.onError = function (event) {
            this.sendGroupComplete(3);
        };
        /**
         *获取加载类型，识别引擎可以家在并处理的文件
         *2015/10/29
         *Rich
         */
        ResLoaderItem.prototype.getLoaderType = function (url) {
            if (!url) {
                RM.Log.warning("暂无解析类型", url);
                return null;
            }
            var typeList = url.split(".");
            var len = typeList.length;
            if (len == 0) {
                RM.Log.warning("暂无解析类型", url);
                return null;
            }
            var type = "." + typeList[typeList.length - 1];
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
        };
        /**
         *对Group对象发送完成
         *2015/10/30
         */
        ResLoaderItem.prototype.sendGroupComplete = function (tag) {
            if (this._useGroup) {
                this._useGroup._loadCompleteOnce(tag);
            }
        };
        return ResLoaderItem;
    })(RM.HashObject);
    RM.ResLoaderItem = ResLoaderItem;
})(RM || (RM = {}));
///<reference path="../events/EventDispatcher.ts"/>
var RM;
(function (RM) {
    /**
     * 网络加载类，通过url进行加载二进制文件、文本文件、图片及数据
     * @author
     *
     */
    var URLLoader = (function (_super) {
        __extends(URLLoader, _super);
        function URLLoader() {
            _super.call(this);
            this.dataFormat = RM.URLLoaderDataFormat.TEXT;
            this.data = null;
            this.request = null;
        }
        /**
         *
         *2015/10/29
         */
        URLLoader.create = function () {
            return new RM.URLLoader();
        };
        URLLoader.prototype.load = function (request) {
            this.request = request;
            this.data = null;
            RM.MainContext.getInstance().netContext.proceed(this);
        };
        URLLoader.prototype.reset = function () {
            this.dataFormat = RM.URLLoaderDataFormat.TEXT;
            this.data = null;
            this.request = null;
        };
        return URLLoader;
    })(RM.EventDispatcher);
    RM.URLLoader = URLLoader;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var URLLoaderDataFormat = (function () {
        function URLLoaderDataFormat() {
        }
        URLLoaderDataFormat.BINARY = "binary";
        URLLoaderDataFormat.TEXT = "text";
        URLLoaderDataFormat.JSON = "json";
        URLLoaderDataFormat.TEXTURE = "texture";
        URLLoaderDataFormat.SOUND = "sound";
        return URLLoaderDataFormat;
    })();
    RM.URLLoaderDataFormat = URLLoaderDataFormat;
})(RM || (RM = {}));
///<reference path="../utils/HashObject.ts"/>
var RM;
(function (RM) {
    /**
     * URLRequest类捕获单个HTTP请求中的所有信息
     * @author
     *
     */
    var URLRequest = (function (_super) {
        __extends(URLRequest, _super);
        /**
         * URLRequest类捕获单个HTTP请求中的所有信息
         * @author
         *
         */
        function URLRequest(url) {
            _super.call(this);
            this._url = "";
            /**
             * 一个对象，它包含将随 URL 请求一起传输的数据。
             * 该属性与 method 属性配合使用。当 method 值为 GET 时，将使用 HTTP 查询字符串语法将 data 值追加到 URLRequest.url 值。
             * 当 method 值为 POST（或 GET 之外的任何值）时，将在 HTTP 请求体中传输 data 值。
             * URLRequest API 支持二进制 POST，并支持 URL 编码变量和字符串。该数据对象可以是 ByteArray、URLVariables 或 String 对象。
             * 该数据的使用方式取决于所用对象的类型：
             * 如果该对象为 ByteArray 对象，则 ByteArray 对象的二进制数据用作 POST 数据。对于 GET，不支持 ByteArray 类型的数据。
             * 如果该对象是 URLVariables 对象，并且该方法是 POST，则使用 x-www-form-urlencoded 格式对变量进行编码，并且生成的字符串会用作 POST 数据。
             * 如果该对象是 URLVariables 对象，并且该方法是 GET，则 URLVariables 对象将定义要随 URLRequest 对象一起发送的变量。
             * 否则，该对象会转换为字符串，并且该字符串会用作 POST 或 GET 数据。
             */
            this.data = null;
            this.method = RM.URLRequestMethod.GET;
            this._url = url;
        }
        /**
         *创建
         *2015/10/28
         */
        URLRequest.create = function (url) {
            return new RM.URLRequest(url);
        };
        URLRequest.prototype.reset = function () {
            this._url = "";
            this.data = null;
            this.method = RM.URLRequestMethod.GET;
        };
        Object.defineProperty(URLRequest.prototype, "url", {
            get: function () {
                return this._url;
            },
            set: function (value) {
                this._url = value;
            },
            enumerable: true,
            configurable: true
        });
        return URLRequest;
    })(RM.HashObject);
    RM.URLRequest = URLRequest;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     * 此类提供一些值给URLRequest，确认将数据发送到服务器时使用POST方法还是GET方法
     * @author
     *
     */
    var URLRequestMethod = (function () {
        function URLRequestMethod() {
        }
        URLRequestMethod.GET = "get";
        URLRequestMethod.POST = "post";
        return URLRequestMethod;
    })();
    RM.URLRequestMethod = URLRequestMethod;
})(RM || (RM = {}));
///<reference path="../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/27.
 */
var RM;
(function (RM) {
    /**
     * 使用 URLVariables 类可以在应用程序和服务器之间传输变量。
     * 将 URLVariables 对象与 URLLoader 类的方法、URLRequest 类的 data 属性一起使用。
     */
    var URLVariables = (function (_super) {
        __extends(URLVariables, _super);
        function URLVariables(data) {
            _super.call(this);
            /** 包含名称/值对的 URL 编码的字符串。 **/
            this.data = "";
            this.data = data;
        }
        return URLVariables;
    })(RM.HashObject);
    RM.URLVariables = URLVariables;
})(RM || (RM = {}));
///<reference path="../utils/HashObject.ts"/>
var RM;
(function (RM) {
    /**
     * 被派发的事件类<br>
     * bindData:携带派发时附加的user数据
     * @author
     *
     */
    var Event = (function (_super) {
        __extends(Event, _super);
        function Event() {
            _super.call(this);
            this.reset();
        }
        /**
         *创建对象，建有内存池
         *2015/10/22
         */
        Event.create = function (EventClass, type, bubbles, bindData) {
            if (!EventClass.PoolUtil) {
                EventClass.PoolUtil = new RM.PoolUtil(EventClass);
            }
            var object = EventClass.PoolUtil.getObject();
            object.create(type, bubbles, bindData);
            return object;
        };
        /**
         *回收
         *2015/10/22
         */
        Event.prototype.release = function () {
            this.reset();
            var EventClass = Object.getPrototypeOf(this).constructor;
            EventClass.PoolUtil.release(this);
        };
        Event.prototype.create = function (type, bubbles, bindData) {
            this._type = type;
            this._bubbles = bubbles;
            this._eventPhase = RM.EventPhase.TARGET_PHASE;
            this._bindData = bindData;
            this._isPropagationStopped = false;
            this._isPropagationImmediateStopped = false;
        };
        /**停止处理时间流中 （当前节点） 中的后续节点的监听处理*/
        Event.prototype.stopImmediatePropagation = function () {
            if (this._bubbles) {
                this._isPropagationImmediateStopped = true;
            }
        };
        Object.defineProperty(Event.prototype, "isPropagationImmediateStopped", {
            /** 是否 停止处理时间流中 （当前节点） 中的后续节点的监听处理*/
            get: function () {
                return this._isPropagationImmediateStopped;
            },
            enumerable: true,
            configurable: true
        });
        /** 停止处理时间流中 （当前节点的后续节点） 中的所有事件监听器的处理 <br>
         *  此方法并不会影响当前节点中的后续节点的监听处理。
         * */
        Event.prototype.stopPropagation = function () {
            if (this._bubbles) {
                this._isPropagationStopped = true;
            }
        };
        Object.defineProperty(Event.prototype, "isPropagationStopped", {
            /** 是否 停止处理时间流中 （当前节点的后续节点） 中的所有事件监听器的处理 */
            get: function () {
                return this._isPropagationStopped;
            },
            enumerable: true,
            configurable: true
        });
        Event.prototype.reset = function () {
            this._target = null;
            this._currentTarget = null;
            this._type = null;
            this._bindData = null;
            this._bubbles = false;
            this._eventPhase = RM.EventPhase.TARGET_PHASE;
            this._isPropagationImmediateStopped = false;
            this._isPropagationStopped = false;
        };
        /**通过EventDispatcher类，或子类派发一个事件*/
        Event.dispatchEvent = function (target, type, bubbles, bindData) {
            var event = RM.Event.create(RM.Event, type, bubbles, bindData);
            target.dispatchEvent(event);
            event.release();
        };
        /** 帧频刷新，在进入帧时进行派发 */
        Event.ENTER_FRAME = "enter_frame";
        /**完成事件，在加载完成后派发*/
        Event.COMPLETE = "complete";
        /** 添加到舞台事件 */
        Event.ADD_TO_STAGE = "add_to_stage";
        /** 从舞台移除事件 */
        Event.REMOVE_FORM_STAGE = "remove_form_stage";
        /** 离开舞台事件 */
        Event.LEAVE_STAGE = "leave_stage";
        return Event;
    })(RM.HashObject);
    RM.Event = Event;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     * 事件列表中的数据项
     * @author
     *
     */
    var EventCallbackData = (function (_super) {
        __extends(EventCallbackData, _super);
        function EventCallbackData(type, listener, thisObject, priority) {
            _super.call(this);
            /**优先级默认为0，数字越大，优先级越高*/
            this.priority = 0;
            this.type = type;
            this.listener = listener;
            this.thisObject = thisObject;
            this.priority = priority;
        }
        return EventCallbackData;
    })(RM.HashObject);
    RM.EventCallbackData = EventCallbackData;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var EventPhase = (function () {
        function EventPhase() {
        }
        /**事件的第一个阶段，捕获阶段*/
        EventPhase.CAPTURE_PHASE = "capture_phase";
        /**事件的第二个阶段，目标阶段*/
        EventPhase.TARGET_PHASE = "target_phase";
        /**事件的第三个阶段，冒泡阶段*/
        EventPhase.BUBBLE_PHASE = "bubble_phase";
        return EventPhase;
    })();
    RM.EventPhase = EventPhase;
})(RM || (RM = {}));
///<reference path="Event.ts"/>
/**
 * Created by Rich on 2015/10/21.
 */
var RM;
(function (RM) {
    var TouchEvent = (function (_super) {
        __extends(TouchEvent, _super);
        function TouchEvent() {
            _super.call(this);
            /** 舞台坐标X轴 **/
            this._stageX = 0;
            /** 舞台坐标Y轴 **/
            this._stageY = 0;
            /** 点击的标识索引 **/
            this._identifier = NaN;
        }
        /**
         *
         *2015/10/22
         */
        TouchEvent.prototype.setData = function (stageX, stageY, identifier) {
            this._stageX = stageX;
            this._stageY = stageY;
            this._identifier = identifier;
        };
        TouchEvent.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this._stageX = 0;
            this._stageY = 0;
            this._identifier = NaN;
        };
        /**
         *获得舞台坐标
         *2015/10/21
         */
        TouchEvent.prototype.getStageX = function () {
            return this._stageX;
        };
        /**
         *获得舞台坐标
         *2015/10/21
         */
        TouchEvent.prototype.getStageY = function () {
            return this._stageY;
        };
        /**
         *获得触摸唯一索引
         *2015/10/21
         */
        TouchEvent.prototype.getIdentifier = function () {
            return this._identifier;
        };
        /**
         *获得目标本地坐标
         *2015/10/21
         */
        TouchEvent.prototype.getLocalPoint = function () {
            return this._currentTarget.globalToLocal(this._stageX, this._stageY);
        };
        /**
         * 派发触碰事件
         *2015/10/22
         */
        TouchEvent.dispatchTouchEvent = function (target, type, bubbles, bindData, stageX, stageY, identifier) {
            if (stageX === void 0) { stageX = 0; }
            if (stageY === void 0) { stageY = 0; }
            if (identifier === void 0) { identifier = NaN; }
            var event = RM.Event.create(RM.TouchEvent, type, bubbles, bindData);
            event.setData(stageX, stageY, identifier);
            target.dispatchEvent(event);
            event.release();
        };
        /** 触摸开始 */
        TouchEvent.TOUCH_BEGIN = "touch_begin";
        /**触摸移动*/
        TouchEvent.TOUCH_MOVE = "touch_move";
        /** 触摸结束*/
        TouchEvent.TOUCH_END = "touch_end";
        return TouchEvent;
    })(RM.Event);
    RM.TouchEvent = TouchEvent;
})(RM || (RM = {}));
/**
 * Created by Rich on 15/12/5.
 */
var RM;
(function (RM) {
    var WebSocket = (function () {
        function WebSocket() {
            if (!window["WebSocket"]) {
                RM.Log.warning("window no supports of WebScoket!");
            }
        }
        /**
         * Create WebSocket.
         * WebSocket's "binaryType" default value is "arraybuffer".
         * "binaryType" can sclect value "arraybuffer" or "blob"
         * @returns {RM.WebSocket}
         */
        WebSocket.create = function () {
            return new RM.WebSocket();
        };
        /**
         * Add Listener Function.
         * @param onConnect
         * @param onError
         * @param onMessage 需要参数(data)
         * @param onClose
         * @param thisObj
         * @returns {RM.WebSocket}
         *
         */
        WebSocket.prototype.addListener = function (onConnect, onError, onMessage, onClose, thisObj) {
            this._onConnect = onConnect;
            this._onError = onError;
            this._onMessage = onMessage;
            this._onClose = onClose;
            this._thisObj = thisObj;
            return this;
        };
        /**
         * Connect webserver by host and post.
         * @param host
         * @param port
         * @returns {RM.WebSocket}
         */
        WebSocket.prototype.connect = function (host, port) {
            this._host = host;
            this._port = port;
            var socketUrl = "ws://" + host + ":" + port;
            this.connectByUrl(socketUrl);
            return this;
        };
        /**
         * Connect websocket by url.
         * @param url
         * @returns {RM.WebSocket}
         */
        WebSocket.prototype.connectByUrl = function (url) {
            this._url = url;
            this._socket = new window["WebSocket"](url);
            this._socket.binaryType = "arraybuffer";
            this.bindListener();
            return this;
        };
        /**
         * 允许应用程序以 UTF-8 文本、ArrayBuffer 或 Blob 的形式将消息发送至 Websocket 服务器。
         * 它将验证 Websocket 的 readyState 是否为 OPEN.
         * @param message
         */
        WebSocket.prototype.send = function (message) {
            if (this.getSocketState() != RM.WebSocket.OPEN)
                return;
            this._socket.send(message);
        };
        /**
         * 关闭连接
         */
        WebSocket.prototype.close = function () {
            if (this._socket) {
                this._socket.close();
            }
        };
        /**
         * 获取网络状态
         * 0 正在连接
         * 1 已连接
         * 2 正在关闭
         * 3 已关闭
         * @returns {number}
         */
        WebSocket.prototype.getSocketState = function () {
            if (this._socket) {
                return this._socket.readyState;
            }
            return RM.WebSocket.CLOSED;
        };
        WebSocket.prototype.bindListener = function () {
            var self = this;
            this._socket.onopen = function () {
                if (self._onConnect) {
                    self._onConnect.call(self._thisObj);
                }
            };
            this._socket.onerror = function (event) {
                if (self._onError) {
                    self._onError.call(self._thisObj);
                }
            };
            this._socket.onmessage = function (event) {
                if (self._onMessage) {
                    self._onMessage.call(self._thisObj, event.data);
                }
            };
            this._socket.onclose = function (event) {
                if (self._onClose) {
                    self._onClose.call(self._thisObj);
                }
            };
        };
        /**
         * 设定websocket的binaryType属性
         * @param type  ｛ 0:blob，1:arraybuffer ｝default：1
         */
        WebSocket.prototype.setBinaryType = function (type) {
            if (!this._socket)
                return;
            var binaryType = "arraybuffer";
            switch (type) {
                case 0:
                    binaryType = "blob";
                    break;
                case 1:
                    binaryType = "arraybuffer";
                    break;
            }
            this._socket.binaryType = binaryType;
        };
        Object.defineProperty(WebSocket.prototype, "host", {
            get: function () {
                return this._host;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebSocket.prototype, "port", {
            get: function () {
                return this._port;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WebSocket.prototype, "url", {
            get: function () {
                return this._url;
            },
            enumerable: true,
            configurable: true
        });
        /** 正在连接 **/
        WebSocket.CONNECTING = 0;
        /** 已连接 **/
        WebSocket.OPEN = 1;
        /** 正在关闭 **/
        WebSocket.CLOSING = 2;
        /** 已关闭 **/
        WebSocket.CLOSED = 3;
        return WebSocket;
    })();
    RM.WebSocket = WebSocket;
})(RM || (RM = {}));
///<reference path="../display/DisplayObject.ts"/>
var RM;
(function (RM) {
    /**
     * 文本类
     * @author
     *
     */
    var TextField = (function (_super) {
        __extends(TextField, _super);
        /**
         * 文本类
         * @author
         *
         */
        function TextField() {
            _super.call(this);
            /**文本行列表*/
            this._$textLineList = [];
            this._TFP_properties = new RM.TFProtection();
            this.setNeedDraw(true);
        }
        //=============================================Set Function===============================================================		
        TextField.prototype.setText = function (text) {
            if (text == this._TFP_properties._text)
                return this;
            this._TFP_properties._text = text;
            this._$setDirty();
            this._updateTextSize();
            return this;
        };
        /** textBaseline 属性设置或返回在绘制文本时的当前文本基线。<br>
         * top    文本基线是 em 方框的顶端。<br>
         * hanging    文本基线是悬挂基线。<br>
         * middle    文本基线是 em 方框的正中。<br>
         * ideographic    文本基线是表意基线。<br>
         * bottom    文本基线是 em 方框的底端。<br>
         * 参见：TextBaselineType
         * 默认为top <br>
         * */
        TextField.prototype.setTextBaseline = function (type) {
            if (type == this._TFP_properties._textBaseline)
                return this;
            this._TFP_properties._textBaseline = type;
            this._$setDirty();
            return this;
        };
        /** textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式。<br>
         * start    默认。文本在指定的位置开始。<br>
         * end    文本在指定的位置结束。<br>
         * center    文本的中心被放置在指定的位置。<br>
         * left    文本左对齐。<br>
         * right    文本右对齐。<br>
         * 参见：TextAlignType
         * 默认为start <br>
         * */
        TextField.prototype.setTextAlign = function (type) {
            if (type == this._TFP_properties._textAlign)
                return this;
            this._TFP_properties._textAlign = type;
            this._$setDirty();
            return this;
        };
        /** 颜色值，十六进制 */
        TextField.prototype.setTextColor = function (value) {
            if (value == this._TFP_properties._textColor)
                return this;
            this._TFP_properties._textColor = value;
            this._$setDirty();
            return this;
        };
        /** 颜色值，十六进制 */
        TextField.prototype.setStrokeColor = function (value) {
            if (value == this._TFP_properties._strokeColor)
                return this;
            this._TFP_properties._strokeColor = value;
            this._$setDirty();
            return this;
        };
        /** font-style 属性定义字体的风格<br>
         * normal    默认值。浏览器显示一个标准的字体样式。<br>
         * italic    浏览器会显示一个斜体的字体样式。<br>
         * oblique    浏览器会显示一个倾斜的字体样式。<br>
         * 参见TextFontStyleType
         * */
        TextField.prototype.setFontStyle = function (type) {
            if (type == this._TFP_properties._fontStyle)
                return this;
            this._TFP_properties._fontStyle = type;
            this._$setDirty();
            return this;
        };
        /** 是否使用异体 <br>
         * font-variant 属性设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。<br>
         * false 默认值。浏览器会显示一个标准的字体normal<br>
         * true 浏览器会显示小型大写字母的字体small-caps<br>
         * */
        TextField.prototype.setFontVariant = function (value) {
            if (value == this._TFP_properties._fontVariant)
                return this;
            this._TFP_properties._fontVariant = value;
            this._$setDirty();
            return this;
        };
        /**该属性用于设置显示元素的文本中所用的字体加粗。<br>
         * 数字值 400 相当于 关键字 normal，700 等价于 bold。<br>
         * 每个数字值对应的字体加粗必须至少与下一个最小数字一样细，而且至少与下一个最大数字一样粗。<br>
         * 注意：为方便，直接选两个值，加粗bold与默认normal
         * 默认为false
         * */
        TextField.prototype.setIsBold = function (value) {
            if (value == this._TFP_properties._isBold)
                return this;
            this._TFP_properties._isBold = value;
            this._$setDirty();
            return this;
        };
        /**
         * font-size 属性可设置字体的尺寸。<br>
         * 该属性设置元素的字体大小。注意，实际上它设置的是字体中字符框的高度；实际的字符字形可能比这些框高或矮（通常会矮）。
         各关键字对应的字体必须比一个最小关键字相应字体要高，并且要小于下一个最大关键字对应的字体。<br>
         *
         * */
        TextField.prototype.setFontSize = function (value) {
            if (value == this._TFP_properties._fontSize)
                return this;
            this._TFP_properties._fontSize = value;
            this._updateTextSize();
            this._$setDirty();
            return this;
        };
        /**
         * font-family 规定元素的字体系列<br>
         * font-family 可以把多个字体名称作为一个“回退”系统来保存。如果浏览器不支持第一个字体，则会尝试下一个。<br>
         * 也就是说，font-family 属性的值是用于某个元素的字体族名称或/及类族名称的一个优先表。浏览器会使用它可识别的第一个值。<br>
         *
         * */
        TextField.prototype.setFontFamily = function (type) {
            if (type == this._TFP_properties._fontFamily)
                return this;
            this._TFP_properties._fontFamily = type;
            this._$setDirty();
            return this;
        };
        /**
         * 设置是否启用镂空样式
         * */
        TextField.prototype.setIsStrokeText = function (value) {
            if (value == this._TFP_properties._isStrokeText)
                return this;
            this._TFP_properties._isStrokeText = value;
            this._$setDirty();
            return this;
        };
        /**
         * 设置垂直距离的行间距
         * */
        TextField.prototype.setLineSpacing = function (value) {
            if (value == this._TFP_properties._lineSpacing)
                return this;
            this._TFP_properties._lineSpacing = value;
            this._$setDirty();
            return this;
        };
        //=============================================Get Function===============================================================
        TextField.prototype.getText = function () {
            return this._TFP_properties._text;
        };
        /** textBaseline 属性设置或返回在绘制文本时的当前文本基线。<br>
         * top    文本基线是 em 方框的顶端。<br>
         * hanging    文本基线是悬挂基线。<br>
         * middle    文本基线是 em 方框的正中。<br>
         * ideographic    文本基线是表意基线。<br>
         * bottom    文本基线是 em 方框的底端。<br>
         * 参见：TextBaselineType
         * 默认为top <br>
         * */
        TextField.prototype.getTextBaseline = function () {
            return this._TFP_properties._textBaseline;
        };
        /** textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式。<br>
         * start    默认。文本在指定的位置开始。<br>
         * end    文本在指定的位置结束。<br>
         * center    文本的中心被放置在指定的位置。<br>
         * left    文本左对齐。<br>
         * right    文本右对齐。<br>
         * 参见：TextAlignType
         * 默认为start <br>
         * */
        TextField.prototype.getTextAlign = function () {
            return this._TFP_properties._textAlign;
        };
        /** 颜色值，十六进制 */
        TextField.prototype.getTextColor = function () {
            return this._TFP_properties._textColor;
        };
        /** 颜色值，十六进制 */
        TextField.prototype.getStrokeColor = function () {
            return this._TFP_properties._strokeColor;
        };
        /** font-style 属性定义字体的风格<br>
         * normal    默认值。浏览器显示一个标准的字体样式。<br>
         * italic    浏览器会显示一个斜体的字体样式。<br>
         * oblique    浏览器会显示一个倾斜的字体样式。<br>
         * 参见TextFontStyleType
         * */
        TextField.prototype.getFontStyle = function () {
            return this._TFP_properties._fontStyle;
        };
        /** 是否使用异体 <br>
         * font-variant 属性设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。<br>
         * false 默认值。浏览器会显示一个标准的字体normal<br>
         * true 浏览器会显示小型大写字母的字体small-caps<br>
         * */
        TextField.prototype.getFontVariant = function () {
            return this._TFP_properties._fontVariant;
        };
        /**该属性用于设置显示元素的文本中所用的字体加粗。<br>
         * 数字值 400 相当于 关键字 normal，700 等价于 bold。<br>
         * 每个数字值对应的字体加粗必须至少与下一个最小数字一样细，而且至少与下一个最大数字一样粗。<br>
         * 注意：为方便，直接选两个值，加粗bold与默认normal
         * 默认为false
         * */
        TextField.prototype.getIsBold = function () {
            return this._TFP_properties._isBold;
        };
        /**
         * font-size 属性可设置字体的尺寸。<br>
         * 该属性设置元素的字体大小。注意，实际上它设置的是字体中字符框的高度；实际的字符字形可能比这些框高或矮（通常会矮）。
         各关键字对应的字体必须比一个最小关键字相应字体要高，并且要小于下一个最大关键字对应的字体。<br>
         *
         * */
        TextField.prototype.getFontSize = function () {
            return this._TFP_properties._fontSize;
        };
        /**
         * font-family 规定元素的字体系列<br>
         * font-family 可以把多个字体名称作为一个“回退”系统来保存。如果浏览器不支持第一个字体，则会尝试下一个。<br>
         * 也就是说，font-family 属性的值是用于某个元素的字体族名称或/及类族名称的一个优先表。浏览器会使用它可识别的第一个值。<br>
         *
         * */
        TextField.prototype.getFontFamily = function () {
            return this._TFP_properties._fontFamily;
        };
        /**
         * 获得垂直距离的行间距
         *
         * */
        TextField.prototype.getLineSpacing = function () {
            return this._TFP_properties._lineSpacing;
        };
        //===========================================Function====================================================
        /**
         * 可以按顺序设置如下属性：<br>
         font-style<br>
         font-variant<br>
         font-weight<br>
         font-size/line-height<br>
         font-family<br>
         * */
        TextField.prototype.getFontToString = function () {
            var style = this.getFontStyle();
            style += this.getFontVariant() ? " small-caps" : " normal";
            style += this.getIsBold() ? " bold" : " normal";
            style += " " + this.getFontSize() + "px";
            style += " " + this.getFontFamily();
            return style;
        };
        /**
         * 更新文本宽高
         * */
        TextField.prototype._updateTextSize = function () {
            var render = RM.MainContext.getInstance().renderContext;
            render.setDrawTextStyle(this.getFontToString(), this.getTextAlign(), this.getTextBaseline(), RM.GFunction.toColorString(this.getTextColor()), RM.GFunction.toColorString(this.getStrokeColor()));
            this._$textLineList = this._TFP_properties._text.split(/(?:\r\n|\r|\n)/);
            var len = this._$textLineList.length;
            var text;
            var textH = 0;
            var textW = 0;
            for (var idx = 0; idx < len; idx++) {
                text = this._$textLineList[idx];
                textH += this._TFP_properties._fontSize + this._TFP_properties._lineSpacing;
                textW = Math.max(textW, render.measureText(text));
            }
            this._TFP_properties._textMaxHeight = textH;
            this._TFP_properties._textMaxWidth = textW;
        };
        //===========================================Render Function====================================================		
        /**子类实现的渲染接口，子类在此接口调用自己的draw函数，以渲染到canvas*/
        TextField.prototype._$render = function (renderContext) {
            renderContext.setDrawTextStyle(this.getFontToString(), this.getTextAlign(), this.getTextBaseline(), RM.GFunction.toColorString(this.getTextColor()), RM.GFunction.toColorString(this.getStrokeColor()));
            var len = this._$textLineList.length;
            var text;
            var textY = 0;
            for (var idx = 0; idx < len; idx++) {
                text = this._$textLineList[idx];
                renderContext.drawText(text, 0, textY, this._TFP_properties._textMaxWidth, this._TFP_properties._isStrokeText);
                textY += this._TFP_properties._fontSize + this._TFP_properties._lineSpacing;
            }
        };
        TextField.prototype._$draw = function (renderContext) {
            _super.prototype._$draw.call(this, renderContext);
        };
        TextField.prototype._$updateTransform = function () {
            _super.prototype._$updateTransform.call(this);
        };
        /** 重写父类方法，计算真实边界 */
        TextField.prototype._$realBounds = function () {
            this._updateTextSize();
            if (this._TFP_properties._textMaxWidth == 0) {
                return this._$rect.resetToValue(0, 0, 0, 0);
            }
            return this._$rect.resetToValue(0, 0, this._TFP_properties._textMaxWidth, this._TFP_properties._textMaxHeight);
        };
        return TextField;
    })(RM.DisplayObject);
    RM.TextField = TextField;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var TFProtection = (function () {
        /**  */
        function TFProtection() {
            /** 显示文本 */
            this._text = "";
            /** textBaseline 属性设置或返回在绘制文本时的当前文本基线。<br>
            * top	文本基线是 em 方框的顶端。<br>
            * hanging	文本基线是悬挂基线。<br>
            * middle	文本基线是 em 方框的正中。<br>
            * ideographic	文本基线是表意基线。<br>
            * bottom	文本基线是 em 方框的底端。<br>
            * 参见：TextBaselineType
            * 默认为top <br>
            * */
            this._textBaseline = "top";
            /** textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式。<br>
            * start	默认。文本在指定的位置开始。<br>
            * end	文本在指定的位置结束。<br>
            * center	文本的中心被放置在指定的位置。<br>
            * left	文本左对齐。<br>
            * right	文本右对齐。<br>
            * 参见：TextAlignType
            * 默认为start <br>
            * */
            this._textAlign = "start";
            /** 文本颜色值，十六进制 */
            this._textColor = 0x000000;
            /** 描边颜色值，十六进制 */
            this._strokeColor = 0x000000;
            /** 是否镂空文字 */
            this._isStrokeText = false;
            /** font-style 属性定义字体的风格<br>
             * 该属性设置使用斜体、倾斜或正常字体。斜体字体通常定义为字体系列中的一个单独的字体。理论上讲，用户代理可以根据正常字体计算一个斜体字体。<br>
             * normal	默认值。浏览器显示一个标准的字体样式。<br>
             * italic	浏览器会显示一个斜体的字体样式。<br>
             * oblique	浏览器会显示一个倾斜的字体样式。<br>
             * 参见TextFontStyleType
             * */
            this._fontStyle = "normal";
            /** 是否使用异体 <br>
             * font-variant 属性设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。<br>
             * false 默认值。浏览器会显示一个标准的字体normal<br>
             * true 浏览器会显示小型大写字母的字体small-caps<br>
             * */
            this._fontVariant = false;
            /**该属性用于设置显示元素的文本中所用的字体加粗。<br>
             * 数字值 400 相当于 关键字 normal，700 等价于 bold。<br>
             * 每个数字值对应的字体加粗必须至少与下一个最小数字一样细，而且至少与下一个最大数字一样粗。<br>
             * 注意：为方便，直接选两个值，加粗bold与默认normal
             * 默认为false
             * */
            this._isBold = false;
            /**
             * font-size 属性可设置字体的尺寸。<br>
             * 该属性设置元素的字体大小。注意，实际上它设置的是字体中字符框的高度；实际的字符字形可能比这些框高或矮（通常会矮）。
             各关键字对应的字体必须比一个最小关键字相应字体要高，并且要小于下一个最大关键字对应的字体。<br>
             *
             * */
            this._fontSize = 12;
            /**
             * font-family 规定元素的字体系列<br>
             * font-family 可以把多个字体名称作为一个“回退”系统来保存。如果浏览器不支持第一个字体，则会尝试下一个。<br>
             * 也就是说，font-family 属性的值是用于某个元素的字体族名称或/及类族名称的一个优先表。浏览器会使用它可识别的第一个值。<br>
             *
             * */
            this._fontFamily = "arial,宋体,微软雅黑";
            /** 行间距，垂直距离 */
            this._lineSpacing = 2;
            /**  */
            this._textMaxWidth = 0;
            /**  */
            this._textMaxHeight = 0;
        }
        return TFProtection;
    })();
    RM.TFProtection = TFProtection;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     * @language zh_CN
     * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
     * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
     * @version Egret 2.4
     * @platform Web,Native
     */
    var Endian = (function () {
        function Endian() {
        }
        /**
         * @language zh_CN
         * 表示多字节数字的最低有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Endian.LITTLE_ENDIAN = "littleEndian";
        /**
         * @language zh_CN
         * 表示多字节数字的最高有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Endian.BIG_ENDIAN = "bigEndian";
        return Endian;
    })();
    RM.Endian = Endian;
    /**
     * @language zh_CN
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    var ByteArray = (function () {
        function ByteArray(buffer) {
            this.BUFFER_EXT_SIZE = 0; //Buffer expansion size
            /**
             * @private
             */
            this.EOF_byte = -1;
            /**
             * @private
             */
            this.EOF_code_point = -1;
            this._setArrayBuffer(buffer || new ArrayBuffer(this.BUFFER_EXT_SIZE));
            this.endian = Endian.BIG_ENDIAN;
        }
        ByteArray.prototype._setArrayBuffer = function (buffer) {
            this.write_position = buffer.byteLength;
            this.data = new DataView(buffer);
            this._position = 0;
        };
        Object.defineProperty(ByteArray.prototype, "buffer", {
            get: function () {
                return this.data.buffer;
            },
            set: function (value) {
                this.data = new DataView(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "dataView", {
            get: function () {
                return this.data;
            },
            set: function (value) {
                this.data = value;
                this.write_position = value.byteLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bufferOffset", {
            get: function () {
                return this.data.byteOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "position", {
            /**
             * @language zh_CN
             * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this._position;
            },
            set: function (value) {
                this._position = value;
                this.write_position = value > this.write_position ? value : this.write_position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "length", {
            /**
             * @language zh_CN
             * ByteArray 对象的长度（以字节为单位）。
             * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
             * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.write_position;
            },
            set: function (value) {
                this.write_position = value;
                var tmp = new Uint8Array(new ArrayBuffer(value));
                var byteLength = this.data.buffer.byteLength;
                if (byteLength > value) {
                    this._position = value;
                }
                var length = Math.min(byteLength, value);
                tmp.set(new Uint8Array(this.data.buffer, 0, length));
                this.buffer = tmp.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bytesAvailable", {
            /**
             * @language zh_CN
             * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
             * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.data.byteLength - this._position;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language zh_CN
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。

         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.clear = function () {
            this._setArrayBuffer(new ArrayBuffer(this.BUFFER_EXT_SIZE));
        };
        /**
         * @language zh_CN
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @return 如果字节不为零，则返回 true，否则返回 false
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readBoolean = function () {
            if (!this.validate(ByteArray.SIZE_OF_BOOLEAN))
                return null;
            return this.data.getUint8(this.position++) != 0;
        };
        /**
         * @language zh_CN
         * 从字节流中读取带符号的字节
         * @return 介于 -128 和 127 之间的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readByte = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT8))
                return null;
            return this.data.getInt8(this.position++);
        };
        /**
         * @language zh_CN
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (length == 0) {
                length = this.bytesAvailable;
            }
            else if (!this.validate(length)) {
                return null;
            }
            if (bytes) {
                bytes.validateBuffer(offset + length);
            }
            else {
                bytes = new ByteArray(new ArrayBuffer(offset + length));
            }
            for (var i = 0; i < length; i++) {
                bytes.data.setUint8(i + offset, this.data.getUint8(this.position++));
            }
        };
        /**
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @return 双精度（64 位）浮点数
         */
        ByteArray.prototype.readDouble = function () {
            if (!this.validate(ByteArray.SIZE_OF_FLOAT64))
                return null;
            var value = this.data.getFloat64(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT64;
            return value;
        };
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @return 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readFloat = function () {
            if (!this.validate(ByteArray.SIZE_OF_FLOAT32))
                return null;
            var value = this.data.getFloat32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT32;
            return value;
        };
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 32 位整数
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readInt = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT32))
                return null;
            var value = this.data.getInt32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT32;
            return value;
        };
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 16 位整数
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readShort = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT16))
                return null;
            var value = this.data.getInt16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT16;
            return value;
        };
        /**
         * @language zh_CN
         * 从字节流中读取无符号的字节
         * @return 介于 0 和 255 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readUnsignedByte = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT8))
                return null;
            return this.data.getUint8(this.position++);
        };
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 32 位整数
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readUnsignedInt = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT32))
                return null;
            var value = this.data.getUint32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT32;
            return value;
        };
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 16 位整数
         * @return 介于 0 和 65535 之间的 16 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readUnsignedShort = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT16))
                return null;
            var value = this.data.getUint16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            return value;
        };
        /**
         * @language zh_CN
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @return UTF-8 编码的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readUTF = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT16))
                return null;
            var length = this.data.getUint16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            if (length > 0) {
                return this.readUTFBytes(length);
            }
            else {
                return "";
            }
        };
        /**
         * @language zh_CN
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length 指明 UTF-8 字节长度的无符号短整型数
         * @return 由指定长度的 UTF-8 字节组成的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readUTFBytes = function (length) {
            if (!this.validate(length))
                return null;
            var bytes = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
            this.position += length;
            return this.decodeUTF8(bytes);
        };
        /**
         * @language zh_CN
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeBoolean = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_BOOLEAN);
            this.data.setUint8(this.position++, value ? 1 : 0);
        };
        /**
         * @language zh_CN
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeByte = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT8);
            this.data.setInt8(this.position++, value);
        };
        /**
         * @language zh_CN
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
         * @param bytes ByteArray 对象
         * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length 一个无符号整数，表示在缓冲区中的写入范围
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            var writeLength;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            }
            else if (length == 0) {
                writeLength = bytes.length - offset;
            }
            else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.validateBuffer(writeLength);
                var tmp_data = new DataView(bytes.buffer);
                for (var i = offset; i < writeLength + offset; i++) {
                    this.data.setUint8(this.position++, tmp_data.getUint8(i));
                }
            }
        };
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeDouble = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_FLOAT64);
            this.data.setFloat64(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT64;
        };
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeFloat = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_FLOAT32);
            this.data.setFloat32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT32;
        };
        /**
         * @language zh_CN
         * 在字节流中写入一个带符号的 32 位整数
         * @param value 要写入字节流的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeInt = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT32);
            this.data.setInt32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT32;
        };
        /**
         * @language zh_CN
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value 32 位整数，该整数的低 16 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeShort = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT16);
            this.data.setInt16(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT16;
        };
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 32 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeUnsignedInt = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_UINT32);
            this.data.setUint32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT32;
        };
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 16 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.5
         * @platform Web,Native
         */
        ByteArray.prototype.writeUnsignedShort = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_UINT16);
            this.data.setUint16(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
        };
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeUTF = function (value) {
            var utf8bytes = this.encodeUTF8(value);
            var length = utf8bytes.length;
            this.validateBuffer(ByteArray.SIZE_OF_UINT16 + length);
            this.data.setUint16(this.position, length, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            this._writeUint8Array(utf8bytes, false);
        };
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeUTFBytes = function (value) {
            this._writeUint8Array(this.encodeUTF8(value));
        };
        ByteArray.prototype.toString = function () {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        };
        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        ByteArray.prototype._writeUint8Array = function (bytes, validateBuffer) {
            if (validateBuffer === void 0) { validateBuffer = true; }
            if (validateBuffer) {
                this.validateBuffer(this.position + bytes.length);
            }
            for (var i = 0; i < bytes.length; i++) {
                this.data.setUint8(this.position++, bytes[i]);
            }
        };
        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        ByteArray.prototype.validate = function (len) {
            if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
                return true;
            }
            else {
                console.warn("ByteArray validate Error!");
                return false;
            }
        };
        /**********************/
        /*  PRIVATE METHODS   */
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        ByteArray.prototype.validateBuffer = function (len, needReplace) {
            if (needReplace === void 0) { needReplace = false; }
            this.write_position = len > this.write_position ? len : this.write_position;
            len += this._position;
            if (this.data.byteLength < len || needReplace) {
                var tmp = new Uint8Array(new ArrayBuffer(len + this.BUFFER_EXT_SIZE));
                var length = Math.min(this.data.buffer.byteLength, len + this.BUFFER_EXT_SIZE);
                tmp.set(new Uint8Array(this.data.buffer, 0, length));
                this.buffer = tmp.buffer;
            }
        };
        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        ByteArray.prototype.encodeUTF8 = function (str) {
            var pos = 0;
            var codePoints = this.stringToCodePoints(str);
            var outputBytes = [];
            while (codePoints.length > pos) {
                var code_point = codePoints[pos++];
                if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                    this.encoderError(code_point);
                }
                else if (this.inRange(code_point, 0x0000, 0x007f)) {
                    outputBytes.push(code_point);
                }
                else {
                    var count, offset;
                    if (this.inRange(code_point, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    }
                    else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    }
                    else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }
                    outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                    while (count > 0) {
                        var temp = this.div(code_point, Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        };
        /**
         * @private
         *
         * @param data
         * @returns
         */
        ByteArray.prototype.decodeUTF8 = function (data) {
            var fatal = false;
            var pos = 0;
            var result = "";
            var code_point;
            var utf8_code_point = 0;
            var utf8_bytes_needed = 0;
            var utf8_bytes_seen = 0;
            var utf8_lower_boundary = 0;
            while (data.length > pos) {
                var _byte = data[pos++];
                if (_byte == this.EOF_byte) {
                    if (utf8_bytes_needed != 0) {
                        code_point = this.decoderError(fatal);
                    }
                    else {
                        code_point = this.EOF_code_point;
                    }
                }
                else {
                    if (utf8_bytes_needed == 0) {
                        if (this.inRange(_byte, 0x00, 0x7F)) {
                            code_point = _byte;
                        }
                        else {
                            if (this.inRange(_byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = _byte - 0xC0;
                            }
                            else if (this.inRange(_byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = _byte - 0xE0;
                            }
                            else if (this.inRange(_byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = _byte - 0xF0;
                            }
                            else {
                                this.decoderError(fatal);
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    }
                    else if (!this.inRange(_byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = this.decoderError(fatal, _byte);
                    }
                    else {
                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        }
                        else {
                            var cp = utf8_code_point;
                            var lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            }
                            else {
                                code_point = this.decoderError(fatal, _byte);
                            }
                        }
                    }
                }
                //Decode string
                if (code_point !== null && code_point !== this.EOF_code_point) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0)
                            result += String.fromCharCode(code_point);
                    }
                    else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        };
        /**
         * @private
         *
         * @param code_point
         */
        ByteArray.prototype.encoderError = function (code_point) {
            console.warn("ByteArray encoderError Error!");
        };
        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        ByteArray.prototype.decoderError = function (fatal, opt_code_point) {
            if (fatal) {
                console.warn("ByteArray decoderError Error!");
            }
            return opt_code_point || 0xFFFD;
        };
        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        ByteArray.prototype.inRange = function (a, min, max) {
            return min <= a && a <= max;
        };
        /**
         * @private
         *
         * @param n
         * @param d
         */
        ByteArray.prototype.div = function (n, d) {
            return Math.floor(n / d);
        };
        /**
         * @private
         *
         * @param string
         */
        ByteArray.prototype.stringToCodePoints = function (string) {
            /** @type {Array.<number>} */
            var cps = [];
            // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
            var i = 0, n = string.length;
            while (i < string.length) {
                var c = string.charCodeAt(i);
                if (!this.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                }
                else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                }
                else {
                    if (i == n - 1) {
                        cps.push(0xFFFD);
                    }
                    else {
                        var d = string.charCodeAt(i + 1);
                        if (this.inRange(d, 0xDC00, 0xDFFF)) {
                            var a = c & 0x3FF;
                            var b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        }
                        else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        };
        ByteArray.SIZE_OF_BOOLEAN = 1;
        ByteArray.SIZE_OF_INT8 = 1;
        ByteArray.SIZE_OF_INT16 = 2;
        ByteArray.SIZE_OF_INT32 = 4;
        ByteArray.SIZE_OF_UINT8 = 1;
        ByteArray.SIZE_OF_UINT16 = 2;
        ByteArray.SIZE_OF_UINT32 = 4;
        ByteArray.SIZE_OF_FLOAT32 = 4;
        ByteArray.SIZE_OF_FLOAT64 = 8;
        return ByteArray;
    })();
    RM.ByteArray = ByteArray;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     * 延迟调用函数，在下次渲染执行之前进行调用。
     * @author
     *
     */
    var DelayedCallback = (function () {
        function DelayedCallback() {
        }
        /**
         * 添加延迟回调函数，在下次渲染执行之前进行回调
         * @param function 延迟函数
         * @param thisObject 延迟回调对象
         * @param args[] 延迟回调函数参数列表
         * */
        DelayedCallback.delayCallback = function (fun, thisObject) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            RM.DelayedCallback._callbackFunctionList.push(fun);
            RM.DelayedCallback._callbackThisObjectList.push(thisObject);
            RM.DelayedCallback._callbackArgsList.push(args);
        };
        /**
         * 执行调用所有延迟函数，会清空延迟调用函数列表
         * */
        DelayedCallback.doCallback = function () {
            var len = RM.DelayedCallback._callbackFunctionList.length;
            if (len == 0)
                return;
            var callfuns = RM.DelayedCallback._callbackFunctionList.concat();
            var thisObjs = RM.DelayedCallback._callbackThisObjectList.concat();
            var args = RM.DelayedCallback._callbackArgsList.concat();
            RM.DelayedCallback.clear();
            var fun;
            for (var idx = 0; idx < len; idx++) {
                fun = callfuns[idx];
                if (fun) {
                    fun.apply(thisObjs[idx], args[idx]);
                }
            }
        };
        /**
         * 清空延迟调用函数列表
         * */
        DelayedCallback.clear = function () {
            RM.DelayedCallback._callbackFunctionList.length = 0;
            RM.DelayedCallback._callbackThisObjectList.length = 0;
            RM.DelayedCallback._callbackArgsList.length = 0;
        };
        DelayedCallback._callbackFunctionList = [];
        DelayedCallback._callbackThisObjectList = [];
        DelayedCallback._callbackArgsList = [];
        return DelayedCallback;
    })();
    RM.DelayedCallback = DelayedCallback;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var GFunction = (function () {
        function GFunction() {
        }
        /**获得自引擎运行以来走过的时间*/
        GFunction.getTimer = function () {
            return Date.now() - RM.MainContext.ENGINE_START_TIME;
        };
        /**角度转换为弧度*/
        GFunction.angle2radian = function (angle) {
            return angle * Math.PI / 180;
        };
        /**弧度转换为角度*/
        GFunction.radian2angle = function (radian) {
            return radian / Math.PI * 180;
        };
        /**颜色值转换，把数字值转换为16进制值*/
        GFunction.toColorString = function (value) {
            if (isNaN(value) || value < 0)
                value = 0;
            if (value > 16777215)
                value = 16777215;
            var color = value.toString(16).toUpperCase();
            while (color.length < 6) {
                color = "0" + color;
            }
            return "#" + color;
        };
        /**获得变换矩形，经过仿射变换后的矩形
         * @param rect 需要进行仿射变换的矩形
         * @param matrix 仿射变换的值
         * @return bounds 返回经过变换后传进来的矩形
         * */
        GFunction.getTransformRectangle = function (rect, matrix) {
            //如果x轴或y轴为非0值，以（x,y）为轴心
            if (rect.x || rect.y) {
                matrix.rightTransform(0, 0, 1, 1, 0, 0, 0, -rect.x, -rect.y);
            }
            var x_a = rect.width * matrix.a;
            var x_b = rect.width * matrix.b;
            var y_c = rect.height * matrix.c;
            var y_d = rect.height * matrix.d;
            var minX = matrix.x;
            var maxX = matrix.x;
            var minY = matrix.y;
            var maxY = matrix.y;
            var x = x_a + matrix.x;
            if (x < minX)
                minX = x;
            else if (x > maxX)
                maxX = x;
            x = x_a + y_c + matrix.x;
            if (x < minX)
                minX = x;
            else if (x > maxX)
                maxX = x;
            x = y_c + matrix.x;
            if (x < minX)
                minX = x;
            else if (x > maxX)
                maxX = x;
            var y = x_b + matrix.y;
            if (y < minY)
                minY = y;
            else if (y > maxY)
                maxY = y;
            y = x_b + y_d + matrix.y;
            if (y < minY)
                minY = y;
            else if (y > maxY)
                maxY = y;
            y = y_d + matrix.y;
            if (y < minY)
                minY = y;
            else if (y > maxY)
                maxY = y;
            return rect.resetToValue(minX, minY, maxX - minX, maxY - minY);
        };
        /**
         * 通过一个矩阵，返回某点在此矩阵上的坐标点
         * */
        GFunction.transformCoords = function (matrix, x, y) {
            var point = RM.Point.create();
            point.x = matrix.a * x + matrix.c * y + matrix.x;
            point.y = matrix.d * y + matrix.b * x + matrix.y;
            return point;
        };
        return GFunction;
    })();
    RM.GFunction = GFunction;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     * 全局配置
     * @author Rich
     */
    var GlobalConfig = (function () {
        function GlobalConfig() {
        }
        /** 缩放比例*/
        GlobalConfig.TEXTURE_SCALE = 1;
        GlobalConfig.FRAME_RATE = 60;
        GlobalConfig.CANVAS_NAME = "canvas";
        GlobalConfig.ROOT_DIV_NAME = "gameDiv";
        GlobalConfig.CANVAS_DIV_NAME = "canvasDiv";
        //脏矩形
        GlobalConfig.IS_OPEN_DIRTY = true;
        GlobalConfig.RESPATH = "resource/";
        return GlobalConfig;
    })();
    RM.GlobalConfig = GlobalConfig;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     * 日志
     * @author
     *
     */
    var Log = (function () {
        function Log() {
        }
        /** 打印日志 */
        Log.print = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (!RM.Log.OPEN_DEBUG)
                return;
            console.log(args.toString());
            RM.Log.STRING += args.toString() + "\n";
        };
        /**错误日志*/
        Log.warning = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (!RM.Log.OPEN_DEBUG)
                return;
            console.warn(args.toString());
            RM.Log.STRING += args.toString();
        };
        /**开启debug*/
        Log.OPEN_DEBUG = true;
        Log.STRING = "";
        return Log;
    })();
    RM.Log = Log;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     *矩阵类
     * @author
     *
     */
    var Matrix = (function () {
        function Matrix() {
            this.reset();
        }
        Matrix.create = function (a, b, c, d, x, y) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var matrix = RM.Matrix.PoolUtil.getObject();
            matrix.resetToValue(a, b, c, d, x, y);
            return matrix;
        };
        Object.defineProperty(Matrix, "PoolUtil", {
            get: function () {
                if (!RM.Matrix._PoolUtil) {
                    RM.Matrix._PoolUtil = new RM.PoolUtil(RM.Matrix);
                }
                return RM.Matrix._PoolUtil;
            },
            enumerable: true,
            configurable: true
        });
        /**释放**/
        Matrix.prototype.release = function () {
            RM.Matrix.PoolUtil.release(this);
        };
        /**重置矩阵数据*/
        Matrix.prototype.reset = function () {
            this.a = this.d = 1;
            this.b = this.c = this.x = this.y = 0;
            return this;
        };
        /**重置为指定值*/
        Matrix.prototype.resetToValue = function (a, b, c, d, x, y) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.x = x;
            this.y = y;
            return this;
        };
        /**平移x，y像素*/
        Matrix.prototype.translate = function (x, y) {
            this.x += x;
            this.y += y;
            return this;
        };
        /**缩放，x、y轴方向缩放*/
        Matrix.prototype.scale = function (scaleX, scaleY) {
            this.a *= scaleX;
            this.b *= scaleY;
            this.c *= scaleX;
            this.d *= scaleY;
            this.x *= scaleX;
            this.y *= scaleY;
            return this;
        };
        /**旋转，单位是角度
         * 旋转矩阵（ cosA, sinA, -sinA, cosA, 0, 0）
         * */
        Matrix.prototype.rotate = function (angle) {
            angle = (angle % 360);
            angle = RM.GFunction.angle2radian(angle);
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var ta = this.a;
            var tc = this.c;
            var tx = this.x;
            this.a = ta * cos - this.b * sin;
            this.b = ta * sin + this.b * cos;
            this.c = tc * cos - this.d * sin;
            this.d = tc * sin + this.d * cos;
            this.x = tx * cos - this.y * sin;
            this.y = tx * sin + this.y * cos;
            return this;
        };
        /**切变，单位是角度
         * 切变矩阵 （ 1, tanAy, tanAx, 1, 0, 0）
         * */
        Matrix.prototype.skew = function (angleX, angleY) {
            angleX = (angleX % 90);
            angleY = (angleY % 90);
            angleX = RM.GFunction.angle2radian(angleX);
            angleY = RM.GFunction.angle2radian(angleY);
            var tanAx = Math.tan(angleX);
            var tanAy = Math.tan(angleY);
            var ta = this.a;
            var tc = this.c;
            var tx = this.x;
            this.a = ta + tanAx * this.b;
            this.b = ta * tanAy + this.b;
            this.c = tc + tanAx * this.d;
            this.d = tc * tanAy + this.d;
            this.x = tx + tanAx * this.y;
            this.y = tx * tanAy + this.y;
            return this;
        };
        /**矩阵左乘*/
        Matrix.prototype.leftMultiply = function (a, b, c, d, x, y) {
            //如果没有旋转、缩放、切变操作，就不需要计算
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                var ta = this.a;
                var tc = this.c;
                this.a = a * ta + c * this.b;
                this.b = b * ta + d * this.b;
                this.c = a * tc + c * this.d;
                this.d = b * tc + d * this.d;
            }
            var tx = this.x;
            this.x = a * tx + c * this.y + x;
            this.y = b * tx + d * this.y + y;
            return this;
        };
        /**矩阵右乘*/
        Matrix.prototype.rightMultiply = function (a, b, c, d, x, y) {
            var ta = this.a;
            var tb = this.b;
            var tc = this.c;
            var td = this.d;
            //如果没有旋转、缩放、切变操作，就不需要计算
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                this.a = ta * a + tc * b;
                this.b = tb * a + td * b;
                this.c = ta * c + tc * d;
                this.d = tb * c + td * d;
            }
            this.x = ta * x + tc * y + this.x;
            this.y = tb * x + td * y + this.y;
            return this;
        };
        /**逆矩阵*/
        Matrix.prototype.invert = function () {
            var ta = this.a;
            var tb = this.b;
            var tc = this.c;
            var td = this.d;
            var tx = this.x;
            var n = ta * td - tb * tc;
            this.a = td / n;
            this.b = -tb / n;
            this.c = -tc / n;
            this.d = ta / n;
            this.x = (tc * this.y - td * tx) / n;
            this.y = -(ta * this.y - tb * tx) / n;
            return this;
        };
        /**拷贝矩阵，拷贝一个矩阵的数据到自己*/
        Matrix.prototype.copyMatrix = function (matrix) {
            this.a = matrix.a;
            this.b = matrix.b;
            this.c = matrix.c;
            this.d = matrix.d;
            this.x = matrix.x;
            this.y = matrix.y;
            return this;
        };
        /**转换矩阵操作，顺序为：缩放、切变、旋转、平移*/
        Matrix.prototype.rightTransform = function (x, y, scaleX, scaleY, skewX, skewY, rotate, offX, offY) {
            if (offX === void 0) { offX = 0; }
            if (offY === void 0) { offY = 0; }
            rotate = (rotate % 360);
            rotate = RM.GFunction.angle2radian(rotate);
            //旋转与切变一起算
            skewX = RM.GFunction.angle2radian(skewX) + rotate;
            skewY = RM.GFunction.angle2radian(skewY) + rotate;
            if (skewX || skewY) {
                this.rightMultiply(Math.cos(skewY) * scaleX, Math.sin(skewY) * scaleX, -Math.sin(skewX) * scaleY, Math.cos(skewX) * scaleY, x, y);
            }
            else {
                this.rightMultiply(scaleX, 0, 0, scaleY, x, y);
            }
            //轴心，坐标都是以相对0,0点为轴心，也可以设置中心点坐标
            if (offX || offY) {
                this.x -= offX * this.a + offY * this.c;
                this.y -= offX * this.b + offY * this.d;
            }
            return this;
        };
        /**转换矩阵操作，顺序为：缩放、切变、旋转、平移*/
        Matrix.prototype.leftTransform = function (x, y, scaleX, scaleY, skewX, skewY, rotate, offX, offY) {
            if (offX === void 0) { offX = 0; }
            if (offY === void 0) { offY = 0; }
            rotate = (rotate % 360);
            rotate = RM.GFunction.angle2radian(rotate);
            //轴心，坐标都是以相对0,0点为轴心，也可以设置中心点坐标
            if (offX || offY) {
                this.x -= offX * this.a + offY * this.c;
                this.y -= offX * this.b + offY * this.d;
            }
            skewX = RM.GFunction.angle2radian(skewX) + rotate;
            skewY = RM.GFunction.angle2radian(skewY) + rotate;
            if (skewX || skewY) {
                this.leftMultiply(Math.cos(skewY) * scaleX, Math.sin(skewY) * scaleX, -Math.sin(skewX) * scaleY, Math.cos(skewX) * scaleY, x, y);
            }
            else {
                this.leftMultiply(scaleX, 0, 0, scaleY, x, y);
            }
            return this;
        };
        return Matrix;
    })();
    RM.Matrix = Matrix;
})(RM || (RM = {}));
///<reference path="HashObject.ts"/>
var RM;
(function (RM) {
    /**
     * 二维空间中的点
     * @author
     *
     */
    var Point = (function (_super) {
        __extends(Point, _super);
        function Point() {
            _super.call(this);
            this.x = 0;
            this.y = 0;
        }
        Point.create = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var point = RM.Point.PoolUtil.getObject();
            point.resetToValue(x, y);
            return point;
        };
        Object.defineProperty(Point, "PoolUtil", {
            get: function () {
                if (!RM.Point._PoolUtil) {
                    RM.Point._PoolUtil = new RM.PoolUtil(RM.Point);
                }
                return RM.Point._PoolUtil;
            },
            enumerable: true,
            configurable: true
        });
        /**释放**/
        Point.prototype.release = function () {
            RM.Point.PoolUtil.release(this);
        };
        Point.prototype.reset = function () {
            this.x = this.y = 0;
        };
        /**克隆，返回新的点，新的点为原点的副本*/
        Point.prototype.clone = function () {
            return RM.Point.create(this.x, this.y);
        };
        /**重置为指定值*/
        Point.prototype.resetToValue = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        /**重置为指定点*/
        Point.prototype.resetToPoint = function (point) {
            this.x = point.x;
            this.y = point.y;
            return this;
        };
        /**加法，不会创建新的值，返回自己*/
        Point.prototype.add = function (point) {
            this.x += point.x;
            this.y += point.y;
            return this;
        };
        /**减法，不会创建新的值，返回自己*/
        Point.prototype.sub = function (point) {
            this.x -= point.x;
            this.y -= point.y;
            return this;
        };
        /**乘法，不会创建新的值，返回自己*/
        Point.prototype.mul = function (value) {
            this.x *= value;
            this.y *= value;
            return this;
        };
        /**除法，不会创建新的值，返回自己*/
        Point.prototype.div = function (value) {
            this.x /= value;
            this.y /= value;
            return this;
        };
        /**确认是否相同的点*/
        Point.prototype.equals = function (point) {
            return (this.x == point.x) && (this.y == point.y);
        };
        /**两点之间的距离*/
        Point.prototype.distance = function (point) {
            return this.clone().sub(point).lenght();
        };
        /**获得向量的长度*/
        Point.prototype.lenght = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        /**向量值是否为0*/
        Point.prototype.isZero = function () {
            return (this.x == 0) && (this.y == 0);
        };
        /**取反操作，相当于乘以-1*/
        Point.prototype.negate = function () {
            this.mul(-1);
            return this;
        };
        /**绕指定点，旋转angle角度*/
        Point.prototype.rotate = function (point, angle) {
            var radian = RM.GFunction.angle2radian((angle % 360));
            var sin = Math.sin(radian);
            var cos = Math.cos(radian);
            if (point.isZero()) {
                var tx = this.x * cos - this.y * sin;
                this.y = this.y * cos + this.x * sin;
                this.x = tx;
            }
            else {
                var tx = this.x - point.x;
                var ty = this.y - point.y;
                this.x = tx * cos - ty * sin + point.x;
                this.y = ty * cos + tx * sin + point.y;
            }
            return this;
        };
        /**限制当前点在指定的区域内，max及min，超过最大和最小值时，将设置为最大值和最小值*/
        Point.prototype.clamp = function (max, min) {
            if (min.x > max.x || min.y > max.y) {
                RM.Log.print("RM.Point.clamp 指定区域错误!", this.toString());
                return this;
            }
            if (this.x < min.x) {
                this.x = min.x;
            }
            if (this.x > max.x) {
                this.x = max.x;
            }
            if (this.y < min.y) {
                this.y = min.y;
            }
            if (this.y > max.y) {
                this.y = max.y;
            }
            return this;
        };
        /**获取自己到另一点的中点，返回新值*/
        Point.prototype.pMidpoint = function (point) {
            return this.clone().add(point).div(2);
        };
        /**以字符串的形式输出*/
        Point.prototype.toString = function () {
            return "(x=" + this.x + ", y=" + this.y + ")";
        };
        return Point;
    })(RM.HashObject);
    RM.Point = Point;
})(RM || (RM = {}));
///<reference path="HashObject.ts"/>
/**
 * Created by Rich on 2015/10/22.
 *
 * 对象池，使用对象池的对象必须实现
 * public reset():void{}函数
 */
var RM;
(function (RM) {
    var PoolUtil = (function (_super) {
        __extends(PoolUtil, _super);
        function PoolUtil(className) {
            _super.call(this);
            this._poolList = [];
            this._poolClassName = className;
            RM.PoolUtil.CLASSLIST.push(className);
        }
        /**
         *
         *2015/10/22
         */
        PoolUtil.prototype.getObject = function () {
            var object;
            if (this._poolList.length > 0) {
                object = this._poolList.shift();
                object.reset();
            }
            else {
                object = new this._poolClassName();
            }
            return object;
        };
        /**
         *
         *2015/10/22
         */
        PoolUtil.prototype.release = function (object) {
            this._poolList.push(object);
        };
        PoolUtil.prototype.getLength = function () {
            return this._poolList.length;
        };
        PoolUtil.toStringClassList = function () {
            var str = "";
            for (var idx = 0; idx < RM.PoolUtil.CLASSLIST.length; idx++) {
                var obj = RM.PoolUtil.CLASSLIST[idx];
                str += obj.name + " Pool: " + obj.PoolUtil.getLength() + "\n";
            }
            return str;
        };
        PoolUtil.CLASSLIST = [];
        return PoolUtil;
    })(RM.HashObject);
    RM.PoolUtil = PoolUtil;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     * 缓存等待渲染的子项渲染到画布的指令，在当前帧渲染所有需要渲染的子项
     * @author
     *
     */
    var RenderCommand = (function () {
        function RenderCommand() {
        }
        RenderCommand.prototype.call = function (renderContext) {
            var self = this;
            if (self.callback) {
                self.callback.call(self.thisObject, renderContext);
            }
        };
        RenderCommand.prototype.dispose = function () {
            this.callback = null;
            this.thisObject = null;
            RenderCommand.cmdPool.push(this);
        };
        RenderCommand.push = function (callback, thisObject) {
            var cmd;
            if (RenderCommand.cmdPool.length > 0) {
                cmd = RenderCommand.cmdPool.pop();
            }
            else {
                cmd = new RM.RenderCommand();
            }
            cmd.callback = callback;
            cmd.thisObject = thisObject;
            RM.MainContext.DRAW_COMMAND_LIST.push(cmd);
        };
        RenderCommand.cmdPool = [];
        return RenderCommand;
    })();
    RM.RenderCommand = RenderCommand;
})(RM || (RM = {}));
///<reference path="HashObject.ts"/>
var RM;
(function (RM) {
    /**
     * 渲染性能监测
     * @author
     *
     */
    var RenderPerformance = (function (_super) {
        __extends(RenderPerformance, _super);
        function RenderPerformance() {
            _super.call(this);
            this._isRun = false;
            this._renderCount = 0;
            this._totalTime = 0;
            this._tick = 0;
            this._lastRect = new RM.Rectangle();
        }
        RenderPerformance.getInstance = function () {
            if (!this._instance) {
                this._instance = new RM.RenderPerformance();
            }
            return this._instance;
        };
        RenderPerformance.prototype.isRun = function () {
            return this._isRun;
        };
        RenderPerformance.prototype.run = function () {
            this._isRun = true;
            this._renderCount = 0;
            this._totalTime = 0;
            this._tick = 0;
            this._text = new RM.TextField();
            this._text.setFontSize(16);
            this._text.setTextAlign(RM.TextAlignType.START);
            this._text.setTextColor(0xff0000);
            this._text.setStrokeColor(0x00ff00);
            this._text.setIsBold(true);
            //this._text.setIsStrokeText(true);
            //            this._text.setFontStyle(RM.TextFontStyleType.OBLIQUE);
            RM.Ticker.getInstance().register(this.addAdvancedTime, this);
        };
        RenderPerformance.prototype.addRenderCount = function () {
            if (this._isRun) {
                this._renderCount++;
            }
        };
        RenderPerformance.prototype.addAdvancedTime = function (advancedtime) {
            this._tick++;
            this._totalTime += advancedtime;
            if (this._totalTime >= 500) {
                var frameStr = Math.floor(this._tick * 1000 / this._totalTime);
                this._renderCount = Math.floor(this._renderCount / this._tick);
                this._text.setText("FPS: " + frameStr +
                    "    \n drawCount:" + this._renderCount);
                this._tick = 0;
                this._totalTime = 0;
                this._renderCount = 0;
            }
        };
        RenderPerformance.prototype.draw = function (renderContext) {
            this._text._$draw(renderContext);
        };
        /**
         *
         *2015/11/2
         */
        RenderPerformance.prototype.getRect = function () {
            var rect = this._text._$getBounds();
            rect = rect.union(this._lastRect, true);
            this._lastRect.resetToRect(rect);
            return rect;
        };
        return RenderPerformance;
    })(RM.HashObject);
    RM.RenderPerformance = RenderPerformance;
})(RM || (RM = {}));
///<reference path="../../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/30.
 */
var RM;
(function (RM) {
    var JsonFrame = (function (_super) {
        __extends(JsonFrame, _super);
        function JsonFrame(data) {
            _super.call(this);
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
        JsonFrame.create = function (data) {
            return new RM.JsonFrame(data);
        };
        Object.defineProperty(JsonFrame.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonFrame.prototype, "y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonFrame.prototype, "w", {
            get: function () {
                return this._w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonFrame.prototype, "h", {
            get: function () {
                return this._h;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonFrame.prototype, "filename", {
            get: function () {
                return this._filename;
            },
            enumerable: true,
            configurable: true
        });
        return JsonFrame;
    })(RM.HashObject);
    RM.JsonFrame = JsonFrame;
})(RM || (RM = {}));
///<reference path="../../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/30.
 */
var RM;
(function (RM) {
    var JsonMeta = (function (_super) {
        __extends(JsonMeta, _super);
        function JsonMeta(data) {
            _super.call(this);
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
        JsonMeta.create = function (data) {
            return new RM.JsonMeta(data);
        };
        Object.defineProperty(JsonMeta.prototype, "image", {
            get: function () {
                return this._image;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonMeta.prototype, "version", {
            get: function () {
                return this._version;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonMeta.prototype, "format", {
            get: function () {
                return this._format;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonMeta.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonMeta.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonMeta.prototype, "scale", {
            get: function () {
                return this._scale;
            },
            enumerable: true,
            configurable: true
        });
        return JsonMeta;
    })(RM.HashObject);
    RM.JsonMeta = JsonMeta;
})(RM || (RM = {}));
///<reference path="../../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/30.
 */
var RM;
(function (RM) {
    var JsonTextureFile = (function (_super) {
        __extends(JsonTextureFile, _super);
        function JsonTextureFile(data) {
            _super.call(this);
            this.fileJson = ["meta", "frames"];
            this.egretFileJson = ["file", "frames"];
            this.egretMCJson = ["mc", "res"];
            this.analyzing(data);
        }
        /**
         *接收通过JSON处理后的纹理文件
         *2015/10/30
         */
        JsonTextureFile.create = function (data) {
            return new RM.JsonTextureFile(data);
        };
        /**
         *
         *15/10/31
         */
        JsonTextureFile.prototype.create = function (data) {
            this._meta = RM.JsonMeta.create(data.meta);
            this._frames = [];
            var len = data.frames.length;
            for (var idx = 0; idx < len; idx++) {
                this._frames.push(RM.JsonFrame.create(data.frames[idx]));
            }
        };
        Object.defineProperty(JsonTextureFile.prototype, "meta", {
            /**
             *TexturePacker导出的Json文件的详情信息
             *2015/10/30
             *Rich
             */
            get: function () {
                return this._meta;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JsonTextureFile.prototype, "frames", {
            /**
             *TexturePacker导出的Json文件的资源信息列表
             *2015/10/30
             *Rich
             */
            get: function () {
                return this._frames;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *通过纹理名字，获取JSON数据
         *2015/10/30
         */
        JsonTextureFile.prototype.getJsonFrameformName = function (name) {
            if (!this._frames)
                return null;
            var len = this._frames.length;
            for (var idx = 0; idx < len; idx++) {
                var frame = this._frames[idx];
                if (frame.filename == name) {
                    return frame;
                }
            }
            return null;
        };
        /**
         *解析JSON，转换为引擎支持的数据
         *15/10/31
         */
        JsonTextureFile.prototype.analyzing = function (data) {
            if (this.fileJsonAnalyzing(data))
                return;
            if (this.egretFileJsonAnalyzing(data))
                return;
            RM.Log.warning("引擎不支持的JSON纹理文件！");
        };
        /**
         *引擎解析
         *15/10/31
         */
        JsonTextureFile.prototype.fileJsonAnalyzing = function (data) {
            var len = this.fileJson.length;
            for (var idx = 0; idx < len; idx++) {
                if (!data.hasOwnProperty(this.fileJson[idx])) {
                    return false;
                }
            }
            this.create(data);
            return true;
        };
        /**
         *白鹭Json文件解析
         *15/10/31
         */
        JsonTextureFile.prototype.egretFileJsonAnalyzing = function (data) {
            var len = this.egretFileJson.length;
            for (var idx = 0; idx < len; idx++) {
                if (!data.hasOwnProperty(this.egretFileJson[idx])) {
                    return false;
                }
            }
            var frames = [];
            for (var key in data.frames) {
                var obj = data.frames[key];
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
            var fileData = {
                meta: { image: data.file },
                frames: frames
            };
            this.create(fileData);
            return true;
        };
        return JsonTextureFile;
    })(RM.HashObject);
    RM.JsonTextureFile = JsonTextureFile;
})(RM || (RM = {}));
///<reference path="../../utils/HashObject.ts"/>
var RM;
(function (RM) {
    /**
     * 设备控制器，负责帧率及刷新
     * @author
     *
     */
    var DeviceContext = (function (_super) {
        __extends(DeviceContext, _super);
        function DeviceContext() {
            _super.call(this);
        }
        DeviceContext.prototype.executeMainLoop = function (callback, thisObject) { };
        DeviceContext.prototype.setFrameRate = function (frameRate) { };
        return DeviceContext;
    })(RM.HashObject);
    RM.DeviceContext = DeviceContext;
})(RM || (RM = {}));
///<reference path="DeviceContext.ts"/>
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var H5DeviceContext = (function (_super) {
        __extends(H5DeviceContext, _super);
        function H5DeviceContext() {
            _super.call(this);
            this._time = 0;
            if (!H5DeviceContext.requestAnimationFrame) {
                H5DeviceContext.requestAnimationFrame = function (callback) {
                    return window.setTimeout(callback, 1000 / RM.GlobalConfig.FRAME_RATE);
                };
            }
            if (!H5DeviceContext.cancelAnimationFrame) {
                H5DeviceContext.cancelAnimationFrame = function (id) {
                    return window.clearTimeout(id);
                };
            }
            RM.H5DeviceContext.instance = this;
        }
        H5DeviceContext.prototype.executeMainLoop = function (callback, thisObject) {
            RM.H5DeviceContext._thisObject = thisObject;
            RM.H5DeviceContext._callback = callback;
            this.enterFrame();
        };
        H5DeviceContext.prototype.enterFrame = function () {
            var context = RM.H5DeviceContext.instance;
            var thisObject = RM.H5DeviceContext._thisObject;
            var callback = RM.H5DeviceContext._callback;
            var startTime = RM.GFunction.getTimer();
            var advancedTime = startTime - context._time;
            RM.H5DeviceContext.requestAnimationFrame.call(window, RM.H5DeviceContext.prototype.enterFrame);
            callback.call(thisObject, advancedTime);
            context._time = startTime;
        };
        return H5DeviceContext;
    })(RM.DeviceContext);
    RM.H5DeviceContext = H5DeviceContext;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var RenderLoopPhase = (function () {
        function RenderLoopPhase() {
        }
        /**渲染初始阶段*/
        RenderLoopPhase.DEFAULT_RENDER_PHASE = "default_render_phase";
        /**渲染的第一阶段，清理渲染区域*/
        RenderLoopPhase.CLEAR_AREA_PHASE = "clear_area_phase";
        /**渲染的第二阶段，刷新updateTransform*/
        RenderLoopPhase.UPDATE_TRANSFORM_PHASE = "update_transform";
        /**渲染的第三阶段，draw*/
        RenderLoopPhase.DRAW_PHASE = "draw_phase";
        /**渲染的第四阶段，完成渲染*/
        RenderLoopPhase.COMPLETE_PHASE = "complete_phase";
        return RenderLoopPhase;
    })();
    RM.RenderLoopPhase = RenderLoopPhase;
})(RM || (RM = {}));
///<reference path="../../utils/HashObject.ts"/>
/**
 * Created by Rich on 15/10/20.
 */
var RM;
(function (RM) {
    var TouchContext = (function (_super) {
        __extends(TouchContext, _super);
        function TouchContext() {
            _super.call(this);
            /** 最后的点 **/
            this._lastTouchPoint = new RM.Point();
            /** 触碰点的ID列表 **/
            this._identifierList = [];
        }
        /**
         * 启动
         *15/10/20
         */
        TouchContext.prototype.run = function () {
        };
        /**
         *
         *2015/10/21
         */
        TouchContext.prototype._dispatchTouchEvent = function (result, type, x, y, identifier) {
            RM.TouchEvent.dispatchTouchEvent(result, type, true, null, x, y, identifier);
        };
        /**
         *当按下时触发
         *15/10/20
         */
        TouchContext.prototype.onTouchBegin = function (x, y, identifier) {
            //判断多点触碰是否超过最大处理点数
            if (this._identifierList.length == RM.TouchContext.MAX_TOUCHES)
                return;
            this._lastTouchPoint.resetToValue(x, y);
            //获得触摸按下的对象
            var point = this.transformStagePoint(x, y);
            var result = RM.MainContext.getInstance().stage._$hitTest(point.x, point.y);
            if (result) {
                this._dispatchTouchEvent(result, RM.TouchEvent.TOUCH_BEGIN, point.x, point.y, identifier);
            }
            this._identifierList.push(identifier);
            point.release();
        };
        /**
         *当移动时触发,只有当按下去的时候才会触发移动事件，如拖动
         *2015/10/21
         */
        TouchContext.prototype.onTouchMove = function (x, y, identifier) {
            var index = this._identifierList.indexOf(identifier);
            //如果为-1则不在按下的触摸列表中，不处理移动事件。
            if (index == -1)
                return;
            //如果移动位置等于上一次的触碰位置，则不处理移动。
            if (x == this._lastTouchPoint.x && y == this._lastTouchPoint.y)
                return;
            this._lastTouchPoint.resetToValue(x, y);
            var point = this.transformStagePoint(x, y);
            var result = RM.MainContext.getInstance().stage._$hitTest(point.x, point.y);
            if (result) {
                this._dispatchTouchEvent(result, RM.TouchEvent.TOUCH_MOVE, point.x, point.y, identifier);
            }
            point.release();
        };
        /**
         *弹起时触发
         *2015/10/21
         */
        TouchContext.prototype.onTouchEnd = function (x, y, identifier) {
            var index = this._identifierList.indexOf(identifier);
            //如果为-1则不在按下的触摸列表中，不处理弹起事件。
            if (index == -1)
                return;
            //从列表中删除一项
            this._identifierList.splice(index, 1);
            var point = this.transformStagePoint(x, y);
            var result = RM.MainContext.getInstance().stage._$hitTest(point.x, point.y);
            if (result) {
                this._dispatchTouchEvent(result, RM.TouchEvent.TOUCH_END, point.x, point.y, identifier);
            }
            point.release();
        };
        /**
         * 派发离开舞台事件
         *2015/10/21
         */
        TouchContext.prototype.onDispatchLeaveStageEvent = function () {
            //清空触点列表
            this._identifierList.length = 0;
            RM.Event.dispatchEvent(RM.MainContext.getInstance().stage, RM.Event.LEAVE_STAGE);
        };
        /**
         *转换成舞台坐标，涉及舞台缩放参数
         *2015/11/5
         */
        TouchContext.prototype.transformStagePoint = function (x, y) {
            x = x / RM.StageViewPort.getInstance().stageViewScaleX;
            y = y / RM.StageViewPort.getInstance().stageViewScaleY;
            return RM.Point.create(x, y);
        };
        /** 最大触碰点 **/
        TouchContext.MAX_TOUCHES = 2;
        return TouchContext;
    })(RM.HashObject);
    RM.TouchContext = TouchContext;
})(RM || (RM = {}));
///<reference path="TouchContext.ts"/>
/**
 * Created by Administrator on 2015/10/16.
 */
var RM;
(function (RM) {
    /**
     * 触摸事件处理<br>
     *
     * */
    var H5TouchContext = (function (_super) {
        __extends(H5TouchContext, _super);
        function H5TouchContext() {
            _super.call(this);
            this._rootDiv = RM.StageViewPort.getInstance().getStageDiv();
        }
        /**
         *����
         *2015/10/16
         */
        H5TouchContext.prototype.run = function () {
            var self = this;
            this.addTouchEventListener();
            self.addMouseEventListener();
            //超出舞台的侦听
            window.addEventListener("mousedown", function (event) {
                if (self._isOutOfStage(event)) {
                    self.onDispatchLeaveStageEvent();
                }
            });
            window.addEventListener("mouseup", function (event) {
                if (self._isOutOfStage(event)) {
                    self.onDispatchLeaveStageEvent();
                }
                else {
                    self._onTouchEnd(event);
                }
            });
        };
        //=======================鼠标事件处理===========================================
        /**
         *侦听鼠标事件
         *2015/10/16
         */
        H5TouchContext.prototype.addMouseEventListener = function () {
            var self = this;
            this._rootDiv.addEventListener("mousedown", function (event) {
                self._onTouchBegin(event);
                self._eventPrevent(event);
            });
            this._rootDiv.addEventListener("mouseup", function (event) {
                self._onTouchEnd(event);
                self._eventPrevent(event);
            });
            this._rootDiv.addEventListener("mousemove", function (event) {
                self._onTouchMove(event);
                self._eventPrevent(event);
            });
        };
        //=======================触摸事件处理===========================================
        /**
         *侦听触摸事件
         *15/10/20
         */
        H5TouchContext.prototype.addTouchEventListener = function () {
            var self = this;
            this._rootDiv.addEventListener("touchstart", function (event) {
                var list = event.changedTouches;
                var len = list.length;
                for (var idx = 0; idx < len; idx++) {
                    self._onTouchBegin(list[idx]);
                }
                self._eventPrevent(event);
            }, false);
            this._rootDiv.addEventListener("touchmove", function (event) {
                var list = event.changedTouches;
                var len = list.length;
                for (var idx = 0; idx < len; idx++) {
                    self._onTouchMove(list[idx]);
                }
                self._eventPrevent(event);
            }, false);
            this._rootDiv.addEventListener("touchend", function (event) {
                var list = event.changedTouches;
                var len = list.length;
                for (var idx = 0; idx < len; idx++) {
                    self._onTouchEnd(list[idx]);
                }
                self._eventPrevent(event);
            }, false);
        };
        /**
         *按下
         *15/10/20
         */
        H5TouchContext.prototype._onTouchBegin = function (event) {
            var point = this._getLocalPoint(event);
            var identifier = -1;
            if (event.hasOwnProperty("identifier")) {
                identifier = event.identifier;
            }
            this.onTouchBegin(point.x, point.y, identifier);
            point.release();
        };
        /**
         *弹起
         *15/10/20
         */
        H5TouchContext.prototype._onTouchEnd = function (event) {
            var point = this._getLocalPoint(event);
            var identifier = -1;
            if (event.hasOwnProperty("identifier")) {
                identifier = event.identifier;
            }
            this.onTouchEnd(point.x, point.y, identifier);
            point.release();
        };
        /**
         *移动
         *15/10/20
         */
        H5TouchContext.prototype._onTouchMove = function (event) {
            var point = this._getLocalPoint(event);
            var identifier = -1;
            if (event.hasOwnProperty("identifier")) {
                identifier = event.identifier;
            }
            this.onTouchMove(point.x, point.y, identifier);
            point.release();
        };
        /**
         * 停止继续冒泡处理<br>
         *阻止特定事件的默认行为,如点击链接跳转
         *2015/10/21
         */
        H5TouchContext.prototype._eventPrevent = function (event) {
            event.stopPropagation();
            //阻止特定事件的默认行为,如点击链接跳转
            event.preventDefault();
        };
        /**
         *获得在canvas上的坐标
         *2015/10/19
         */
        H5TouchContext.prototype._getLocalPoint = function (event) {
            var tx = event.pageX - this._rootDiv.getBoundingClientRect().left;
            var ty = event.pageY - this._rootDiv.getBoundingClientRect().top;
            return RM.Point.create(tx, ty);
        };
        /**
         * 判断触碰点是否超出舞台
         *2015/10/21
         */
        H5TouchContext.prototype._isOutOfStage = function (event) {
            var point = this._getLocalPoint(event);
            if (RM.StageViewPort.getInstance().getRect().containsPoint(point)) {
                point.release();
                return false;
            }
            point.release();
            return true;
        };
        return H5TouchContext;
    })(RM.TouchContext);
    RM.H5TouchContext = H5TouchContext;
})(RM || (RM = {}));
///<reference path="../../utils/HashObject.ts"/>
var RM;
(function (RM) {
    /**
     *
     * @author
     *
     */
    var NetContext = (function (_super) {
        __extends(NetContext, _super);
        function NetContext() {
            _super.call(this);
        }
        NetContext.prototype.proceed = function (loader) {
        };
        return NetContext;
    })(RM.HashObject);
    RM.NetContext = NetContext;
})(RM || (RM = {}));
///<reference path="NetContext.ts"/>
var RM;
(function (RM) {
    /**
     * 网络加载类，根据不同的类型进行加载数据
     * @author
     *
     */
    var H5NetContext = (function (_super) {
        __extends(H5NetContext, _super);
        function H5NetContext() {
            _super.call(this);
        }
        H5NetContext.prototype.proceed = function (loader) {
            var H5XHR;
            if (loader.dataFormat == RM.URLLoaderDataFormat.TEXTURE) {
                this.loadTexture(loader);
            }
            else if (loader.dataFormat == RM.URLLoaderDataFormat.TEXT
                || loader.dataFormat == RM.URLLoaderDataFormat.JSON
                || loader.dataFormat == RM.URLLoaderDataFormat.BINARY) {
                H5XHR = RM.H5XMLHttpRequest.create();
                H5XHR.addCompleteFunc(this, this.onComplete, [loader], this.onError);
                H5XHR.sendByURLRequest(loader.request);
            }
            else if (loader.dataFormat == RM.URLLoaderDataFormat.SOUND) {
            }
        };
        H5NetContext.prototype.loadTexture = function (loader) {
            RM.Texture.createBitmapData(loader.request.url, function (code, bitmapData) {
                if (code != 0) {
                    RM.Log.warning("H5NetContext.loadTexture is IOError,path:", loader.request.url);
                    return;
                }
                var texture = RM.Texture.create(bitmapData);
                loader.data = texture;
                RM.DelayedCallback.delayCallback(RM.Event.dispatchEvent, RM.Event, loader, RM.Event.COMPLETE);
            });
        };
        /**
         * 加载完成
         *2015/10/28
         */
        H5NetContext.prototype.onComplete = function (XHR, loader) {
            switch (loader.dataFormat) {
                case RM.URLLoaderDataFormat.TEXT:
                    loader.data = XHR.responseText;
                    break;
                case RM.URLLoaderDataFormat.BINARY:
                    loader.data = XHR.response;
                    break;
                case RM.URLLoaderDataFormat.JSON:
                    loader.data = XHR.responseText;
                    break;
            }
            RM.DelayedCallback.delayCallback(RM.Event.dispatchEvent, RM.Event, loader, RM.Event.COMPLETE);
        };
        /**
         * 加载失败
         *2015/10/28
         */
        H5NetContext.prototype.onError = function (XHR) {
            RM.Log.warning("H5NetContext:loader error!", XHR.statusText);
        };
        return H5NetContext;
    })(RM.NetContext);
    RM.H5NetContext = H5NetContext;
})(RM || (RM = {}));
///<reference path="../../utils/HashObject.ts"/>
/**
 * Created by Rich on 2015/10/27.
 */
var RM;
(function (RM) {
    /**
     * 表示XMLHttpRequest对象的状态：<br>
     * 0：未初始化。对象已创建，未调用open；<br>
     * 1：open方法成功调用，但Sendf方法未调用；<br>
     * 2：send方法已经调用，尚未开始接受数据；<br>
     * 3：正在接受数据。Http响应头信息已经接受，但尚未接收完成；<br>
     * 4：完成，即响应数据接受完成。
     * **/
    var READY_STATE;
    (function (READY_STATE) {
        READY_STATE[READY_STATE["state_0"] = 0] = "state_0";
        READY_STATE[READY_STATE["state_1"] = 1] = "state_1";
        READY_STATE[READY_STATE["state_2"] = 2] = "state_2";
        READY_STATE[READY_STATE["state_3"] = 3] = "state_3";
        READY_STATE[READY_STATE["state_4"] = 4] = "state_4";
    })(READY_STATE || (READY_STATE = {}));
    /**
     *引擎的XMLHttpRequest封装<br>
     *2015/10/27
     *Rich
     */
    var H5XMLHttpRequest = (function (_super) {
        __extends(H5XMLHttpRequest, _super);
        function H5XMLHttpRequest() {
            _super.call(this);
            this._XHR = this.createXMLHttpRequest();
            var self = this;
            /** 请求状态改变的事件触发器（readyState变化时会调用这个属性上注册的javascript函数）。
             *2015/10/27
             */
            this._XHR.onreadystatechange = function () {
                if (self._XHR.readyState == READY_STATE.state_0) {
                }
                else if (self._XHR.readyState == READY_STATE.state_1) {
                }
                else if (self._XHR.readyState == READY_STATE.state_2) {
                }
                else if (self._XHR.readyState == READY_STATE.state_3) {
                }
                else if (self._XHR.readyState == READY_STATE.state_4) {
                    //200正确的数据返回
                    if (self._XHR.status == 200) {
                        if (self._onCompleteFunc) {
                            self._onCompleteFunc.apply(self._thisObj, self._onCompleteFuncArgs);
                        }
                    }
                    else {
                        if (self._onErrorFunc) {
                            self._onErrorFunc.apply(self._thisObj, self._onErrorFuncArgs);
                        }
                    }
                }
            };
        }
        /**
         * 创建
         *2015/10/27
         */
        H5XMLHttpRequest.create = function () {
            return new RM.H5XMLHttpRequest();
        };
        Object.defineProperty(H5XMLHttpRequest.prototype, "responseText", {
            /** 服务器响应的文本内容 **/
            get: function () {
                return this._XHR.responseText;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(H5XMLHttpRequest.prototype, "response", {
            /** 服务器响应的BINARY内容 **/
            get: function () {
                return this._XHR.response;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(H5XMLHttpRequest.prototype, "responseXML", {
            /** 服务器响应的XML内容对应的DOM对象 **/
            get: function () {
                return this._XHR.responseXML;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(H5XMLHttpRequest.prototype, "status", {
            /** 服务器返回的http状态码。200表示“成功”，404表示“未找到”，500表示“服务器内部错误”等。 **/
            get: function () {
                return this._XHR.status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(H5XMLHttpRequest.prototype, "statusText", {
            /** 服务器返回状态的文本信息。 **/
            get: function () {
                return this._XHR.statusText;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(H5XMLHttpRequest.prototype, "readyState", {
            /**
             * 表示XMLHttpRequest对象的状态：<br>
             * 0：未初始化。对象已创建，未调用open；<br>
             * 1：open方法成功调用，但Sendf方法未调用；<br>
             * 2：send方法已经调用，尚未开始接受数据；<br>
             * 3：正在接受数据。Http响应头信息已经接受，但尚未接收完成；<br>
             * 4：完成，即响应数据接受完成。
             * **/
            get: function () {
                return this._XHR.readyState;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取一个XMLHttpRequest请求（兼容IE）
         *2015/10/27
         */
        H5XMLHttpRequest.prototype.createXMLHttpRequest = function () {
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            }
            else if (window["ActiveXObject"]) {
                var activeNameList = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
                var len = activeNameList.length;
                for (var idx = 0; idx < len; idx++) {
                    try {
                        return new ActiveXObject(activeNameList[idx]);
                    }
                    catch (e) {
                    }
                }
            }
            else {
                RM.Log.warning("H5XMLHttpRequest:创建XMLHttpRequest失败！！");
                return null;
            }
        };
        /**
         *注册响应完成回调
         * 第一个参数为H5XMLHttpRequest，后续为传入的参数列表
         *2015/10/27
         */
        H5XMLHttpRequest.prototype.addCompleteFunc = function (thisObj, callFunc, callFuncArgs, errorFunc, errorFuncArgs) {
            this._thisObj = thisObj;
            this._onCompleteFunc = callFunc;
            this._onErrorFunc = errorFunc;
            this._onCompleteFuncArgs = callFuncArgs;
            this._onErrorFuncArgs = errorFuncArgs;
            if (!this._onCompleteFuncArgs) {
                this._onCompleteFuncArgs = [];
            }
            if (!this._onErrorFuncArgs) {
                this._onErrorFuncArgs = [];
            }
            this._onCompleteFuncArgs.unshift(this);
            this._onErrorFuncArgs.unshift(this);
        };
        /**
         *指定和服务器端交互的HTTP方法，URL地址，即其他请求信息；
         * Method:表示http请求方法，一般使用"GET","POST".
         * url：表示请求的服务器的地址；
         * asynch：表示是否采用异步方法，true为异步，表示脚本会在 send() 方法之后继续执行，而不等待来自服务器的响应。
         *         false为同步，需要在等待服务器响应。
         * username：用户名，提供http认证机制需要的用户名和密码
         * password：密码，提供http认证机制需要的用户名和密码
         *2015/10/27
         */
        H5XMLHttpRequest.prototype.open = function (httpMethod, url, asynch, username, password) {
            if (asynch === void 0) { asynch = true; }
            this._XHR.open(httpMethod, url, asynch);
        };
        /**
         * 向服务器发出请求，如果采用异步方式，该方法会立即返回。
         * data可以指定为null表示不发送数据，其内容可以是DOM对象，输入流或字符串。
         *2015/10/27
         */
        H5XMLHttpRequest.prototype.send = function (data) {
            if (data === void 0) { data = null; }
            this._XHR.send(data);
        };
        /**
         *停止当前http请求。对应的XMLHttpRequest对象会复位到未初始化的状态。
         *2015/10/27
         */
        H5XMLHttpRequest.prototype.abort = function () {
            this._XHR.abort();
        };
        /**
         *设置HTTP请求中的指定头部header的值为value.
         *此方法需在open方法以后调用，一般在post方式中使用。
         *2015/10/27
         */
        H5XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
            this._XHR.setRequestHeader(header, value);
        };
        /**
         *返回包含Http的所有响应头信息，其中相应头包括Content-length,date,uri等内容。
         *返回值是一个字符串，包含所有头信息，其中每个键名和键值用冒号分开，每一组键之间用CR和LF（回车加换行符）来分隔！
         *2015/10/27
         */
        H5XMLHttpRequest.prototype.getAllResponseHeaders = function () {
            return this._XHR.getAllResponseHeaders();
        };
        /**
         *返回HTTP响应头中指定的键名header对应的值
         *2015/10/27
         */
        H5XMLHttpRequest.prototype.getResponseHeader = function (header) {
            return this._XHR.getResponseHeader(header);
        };
        /**
         *通过指定的RM.URLRequest与服务器端交互<br>
         *会先执行open再send方法。
         *2015/10/27
         */
        H5XMLHttpRequest.prototype.sendByURLRequest = function (request, asynch, username, password) {
            if (asynch === void 0) { asynch = true; }
            var url = request.url;
            if (url.indexOf("?") == -1 && request.method == RM.URLRequestMethod.GET
                && request.data && (request.data instanceof RM.URLVariables)) {
                url += "?" + request.data.toString();
            }
            this.open(request.method, url, asynch, username, password);
            if (request.method == RM.URLRequestMethod.GET || !request.data) {
                this._XHR.send();
            }
            else if (request.data instanceof RM.URLVariables) {
                this._XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                this._XHR.send(request.data.toString());
            }
            else {
                this._XHR.setRequestHeader("Content-Type", "multipart/form-data");
                this._XHR.send(request.data);
            }
        };
        return H5XMLHttpRequest;
    })(RM.HashObject);
    RM.H5XMLHttpRequest = H5XMLHttpRequest;
})(RM || (RM = {}));
///<reference path="../../utils/HashObject.ts"/>
var RM;
(function (RM) {
    /**
     * 渲染对象的基类，根据不同的环境有不同的渲染对象<br>
     * 因此作为接口
     * @author
     *
     */
    var RenderContext = (function (_super) {
        __extends(RenderContext, _super);
        function RenderContext() {
            _super.call(this);
        }
        /**创建渲染对象*/
        RenderContext.createRenderContext = function () {
            return null;
        };
        /**
         * 重复绘制image到画布，渲染类型可选renderType：<br>
         * （repeat：。该模式在水平和垂直方向重复。铺满画布<br>
         *  repeat-x：该模式只在水平方向重复。横向铺满<br>
         *  repeat-y：该模式只在垂直方向重复。纵向铺满<br>
         *  no-repeat 默认：该模式只显示一次（不重复）。）
         */
        RenderContext.prototype.drawImage = function (texture, offsetX, offsetY, sourceW, sourceH, destX, destY, destW, destH, renderType) {
            RM.RenderPerformance.getInstance().addRenderCount();
        };
        /** 渲染文本 */
        RenderContext.prototype.drawText = function (text, x, y, maxWidth, isStrokeText) {
            RM.RenderPerformance.getInstance().addRenderCount();
        };
        /** 设置渲染文本的样式 */
        RenderContext.prototype.setDrawTextStyle = function (font, textAlign, textBaseline, fillStyle, strokeStyle) {
        };
        /** 测量text宽度 */
        RenderContext.prototype.measureText = function (text) {
            return 0;
        };
        //暂时为了方便直接写方法
        RenderContext.prototype.onResize = function () {
        };
        RenderContext.prototype.onRenderStart = function () {
        };
        /**渲染完毕，把渲染结果刷新到画布呈现*/
        RenderContext.prototype.onRenderFinish = function () {
        };
        RenderContext.prototype.clearScene = function () {
        };
        RenderContext.prototype.setTransform = function (matrix) {
        };
        RenderContext.prototype.setAlpha = function (alpha) {
        };
        /**
         * 压入遮罩矩形，调用此方法后，后续的绘制将以此矩形范围开始渲染
         * @param mask
         */
        RenderContext.prototype.pushMaskRect = function (mask) {
        };
        /**
         * 从栈顶移除遮罩矩形，如果栈内还存在遮罩矩形，则继续以栈顶矩形渲染
         */
        RenderContext.prototype.popMaskRect = function () {
        };
        return RenderContext;
    })(RM.HashObject);
    RM.RenderContext = RenderContext;
})(RM || (RM = {}));
///<reference path="RenderContext.ts"/>
var RM;
(function (RM) {
    /**
     *  渲染
     * @author
     *
     */
    var H5CanvasRender = (function (_super) {
        __extends(H5CanvasRender, _super);
        /** 创建渲染器，默认情况下使用双层渲染器，即缓存渲染器。<br>
         * 缓存渲染器完成所有的显示对象的渲染，渲染完毕后，<br>
         * canvasContext在舞台中的渲染器将会把缓存渲染器绘制到舞台。<br>
         * 缓存渲染器不会直接显示在舞台中。
         *
         *  */
        function H5CanvasRender(canvas, useCacheCanvas) {
            if (useCacheCanvas === void 0) { useCacheCanvas = true; }
            _super.call(this);
            this.useCacheCanvas = useCacheCanvas;
            this.canvas = canvas || this.createCanvasRender();
            this.canvasContext = this.canvas.getContext("2d");
            if (useCacheCanvas) {
                this.cacheCanvas = document.createElement("canvas");
                this.cacheCanvas.width = this.canvas.width;
                this.cacheCanvas.height = this.canvas.height;
                this.cacheCanvasContext = this.cacheCanvas.getContext("2d");
                this.drawCanvasContext = this.cacheCanvasContext;
            }
            else {
                this.drawCanvasContext = this.canvasContext;
            }
        }
        H5CanvasRender.prototype.createCanvasRender = function () {
            var canvas = document.createElement("canvas");
            canvas.id = RM.GlobalConfig.CANVAS_NAME;
            RM.StageViewPort.getInstance().getStageDiv().appendChild(canvas);
            return canvas;
        };
        H5CanvasRender.prototype.onResize = function () {
            if (!this.canvas)
                return;
            var canvas = RM.StageViewPort.getInstance().getStageDiv();
            this.canvas.width = RM.StageViewPort.getInstance().stageViewProtW;
            this.canvas.height = RM.StageViewPort.getInstance().stageViewProtH;
            this.canvas.style.width = canvas.style.width;
            this.canvas.style.height = canvas.style.height;
            if (this.useCacheCanvas) {
                this.cacheCanvas.width = this.canvas.width;
                this.cacheCanvas.height = this.canvas.height;
            }
        };
        H5CanvasRender.prototype.drawImage = function (texture, offsetX, offsetY, sourceW, sourceH, destX, destY, destW, destH, renderType) {
            if (!texture)
                return;
            texture.drawForCanvas(this.drawCanvasContext, offsetX, offsetY, sourceW, sourceH, destX, destY, destW, destH, renderType);
            _super.prototype.drawImage.call(this, texture, offsetX, offsetY, sourceW, sourceH, destX, destY, destW, destH);
        };
        H5CanvasRender.createRenderContext = function (canvas, useCacheCanvas) {
            return new RM.H5CanvasRender(canvas, useCacheCanvas);
        };
        H5CanvasRender.prototype.onRenderStart = function () {
            this.drawCanvasContext.save();
        };
        /**渲染完毕，把渲染结果刷新到画布呈现*/
        H5CanvasRender.prototype.onRenderFinish = function () {
            this.drawCanvasContext.restore();
            this.drawCanvasContext.setTransform(1, 0, 0, 1, 0, 0);
            if (this.useCacheCanvas) {
                var rect;
                if (RM.GlobalConfig.IS_OPEN_DIRTY) {
                    var list = RM.RenderFilter.getInstance().getDefaultDrawAreaList();
                    var len = list.length;
                    for (var idx = 0; idx < len; idx++) {
                        rect = list[idx];
                        //获取渲染区域与舞台的相交矩形
                        var result = rect.intersection(RM.StageViewPort.getInstance().getRect(), true);
                        if (result.width > 0 && result.height > 0) {
                            //绘制缓存渲染器的一部分到舞台
                            this.canvasContext.drawImage(this.cacheCanvas, result.x, result.y, result.width, result.height, result.x, result.y, result.width, result.height);
                        }
                    }
                    RM.RenderFilter.getInstance().clearDrawList();
                }
                else {
                    rect = RM.StageViewPort.getInstance().getRect();
                    this.canvasContext.drawImage(this.cacheCanvas, rect.x, rect.y, rect.width, rect.height, rect.x, rect.y, rect.width, rect.height);
                }
            }
        };
        /**清除需要渲染的指定区域列表的像素*/
        H5CanvasRender.prototype.clearScene = function () {
            //不实用缓存画布的方式，在制作缓存位图的时候才使用，正常渲染是使用缓存画布的
            if (this.useCacheCanvas && RM.GlobalConfig.IS_OPEN_DIRTY) {
                var list = RM.RenderFilter.getInstance().getDefaultDrawAreaList();
                var len = list.length;
                var rect;
                for (var idx = 0; idx < len; idx++) {
                    rect = list[idx];
                    this.clearRect(rect.x, rect.y, rect.width, rect.height);
                }
            }
            else {
                this.clearRect(0, 0, RM.StageViewPort.getInstance().stageViewProtW, RM.StageViewPort.getInstance().stageViewProtH);
            }
            //清除缓存cacheCanvasContext的全屏
            if (this.useCacheCanvas) {
                this.cacheCanvasContext.clearRect(0, 0, RM.StageViewPort.getInstance().stageViewProtW, RM.StageViewPort.getInstance().stageViewProtH);
            }
        };
        /**清除指定区域的像素(清除的是显示在舞台中的canvasContext的区域，而非cacheCanvasContext)*/
        H5CanvasRender.prototype.clearRect = function (x, y, width, height) {
            this.canvasContext.clearRect(x, y, width, height);
        };
        H5CanvasRender.prototype.setTransform = function (matrix) {
            this.drawCanvasContext.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.x, matrix.y);
        };
        H5CanvasRender.prototype.setAlpha = function (alpha) {
            this.drawCanvasContext.globalAlpha = alpha;
        };
        H5CanvasRender.prototype.drawText = function (text, x, y, maxWidth, isStrokeText) {
            if (maxWidth === void 0) { maxWidth = 0xffff; }
            if (isStrokeText === void 0) { isStrokeText = false; }
            if (isStrokeText)
                this.drawCanvasContext.strokeText(text, x, y, maxWidth);
            else
                this.drawCanvasContext.fillText(text, x, y, maxWidth);
            _super.prototype.drawText.call(this, text, x, y, maxWidth, isStrokeText);
        };
        /** 设置渲染文本的样式 */
        H5CanvasRender.prototype.setDrawTextStyle = function (font, textAlign, textBaseline, fillStyle, strokeStyle) {
            var canvas = this.drawCanvasContext;
            canvas.font = font;
            canvas.textAlign = textAlign;
            canvas.textBaseline = textBaseline;
            canvas.fillStyle = fillStyle;
            canvas.strokeStyle = strokeStyle;
        };
        /** 测量text宽度 */
        H5CanvasRender.prototype.measureText = function (text) {
            return this.drawCanvasContext.measureText(text).width;
        };
        /**
         * 压入遮罩矩形，调用此方法后，后续的绘制将以此矩形范围开始渲染
         * @param mask
         */
        H5CanvasRender.prototype.pushMaskRect = function (mask) {
            this.drawCanvasContext.save();
            this.drawCanvasContext.beginPath();
            this.drawCanvasContext.rect(mask.x, mask.y, mask.width, mask.height);
            this.drawCanvasContext.clip();
            this.drawCanvasContext.closePath();
        };
        /**
         * 从栈顶移除遮罩矩形，如果栈内还存在遮罩矩形，则继续以栈顶矩形渲染
         */
        H5CanvasRender.prototype.popMaskRect = function () {
            this.drawCanvasContext.restore();
            this.drawCanvasContext.setTransform(1, 0, 0, 1, 0, 0);
        };
        return H5CanvasRender;
    })(RM.RenderContext);
    RM.H5CanvasRender = H5CanvasRender;
})(RM || (RM = {}));
///<reference path="../../utils/HashObject.ts"/>
var RM;
(function (RM) {
    /**
     * 渲染过滤器，计算和需要渲染的矩形范围
     * @author
     *
     */
    var RenderFilter = (function (_super) {
        __extends(RenderFilter, _super);
        function RenderFilter() {
            _super.call(this);
            /**需要渲染的区域矩形列表*/
            this._drawAreaList = [];
            this._isFullScreenRender = false;
        }
        RenderFilter.getInstance = function () {
            if (!this._instance) {
                this._instance = new RM.RenderFilter();
            }
            return this._instance;
        };
        /**添加重绘区域*/
        RenderFilter.prototype.addDrawArea = function (area) {
            if (area.isEmpty())
                return;
            this._drawAreaList.push(area);
            this.clearContainsRect();
        };
        RenderFilter.prototype._addArea = function (area) {
            if (area.isEmpty())
                return;
            this._drawAreaList.push(area);
        };
        Object.defineProperty(RenderFilter.prototype, "isFullScreenRender", {
            /**
             * 是否达到全屏渲染
             * @returns {boolean}
             */
            get: function () {
                return this._isFullScreenRender;
            },
            enumerable: true,
            configurable: true
        });
        /**清除重绘列表*/
        RenderFilter.prototype.clearDrawList = function () {
            var len = this._drawAreaList.length;
            for (var idx = 0; idx < len; idx++) {
                var rect = this._drawAreaList.shift();
                rect.release();
            }
        };
        /**
         *只有在计算脏矩形区域后才可使用
         *15/10/26
         */
        RenderFilter.prototype.getDefaultDrawAreaList = function () {
            return this._drawAreaList;
        };
        /**
         *在引擎渲染阶段对比
         *15/10/26
         */
        RenderFilter.prototype.isHasDrawAreaList = function (rect) {
            var len = this._drawAreaList.length;
            for (var idx = 0; idx < len; idx++) {
                var item = this._drawAreaList[idx];
                if (item.intersectsRect(rect)) {
                    return true;
                }
            }
            return false;
        };
        /**
         *排除相互包含的矩形区域，减少渲染区域次数。<br>
         *并合并相交矩形。
         *2015/11/5
         */
        RenderFilter.prototype.clearContainsRect = function () {
            this._drawAreaList.sort(this.sortFunc);
            var array = this._drawAreaList.concat();
            array.sort(this.sortFunc);
            this._drawAreaList = [];
            for (var idx = 0; idx < array.length - 1; idx++) {
                for (var idy = idx + 1; idy < array.length; idy++) {
                    var rect1 = array[idx];
                    var rect2 = array[idy];
                    if (rect1.containsRect(rect2)) {
                        array.splice(idy, 1);
                        rect2.release();
                        --idy;
                    }
                }
            }
            //循环合并相交矩形
            while (this.mergeDirtyRect(array)) {
            }
            var maxArea = 0;
            //出现边框1像素的残留，暂时这样解决！！
            array.forEach(function (item, index, list) {
                item.x = Math.max(0, item.x - 1);
                item.y = Math.max(0, item.y - 1);
                item.width = Math.max(0, item.width + 2);
                item.height = Math.max(0, item.height + 2);
                maxArea += item.getArea();
            });
            var value = maxArea / RM.StageViewPort.getInstance().getRect().getArea();
            this._isFullScreenRender = value > 0.9;
            this._drawAreaList = array;
        };
        /**
         * 从大到小排序
         *2015/11/5
         */
        RenderFilter.prototype.sortFunc = function (a, b) {
            return b.getArea() - a.getArea();
        };
        /**
         *根据合并后的多余面积的大小来次序，<br>
         *优先合并相近的矩形。<br>
         *采用三分矩形算法，超过三个矩形则合并。
         *2015/11/12
         */
        RenderFilter.prototype.mergeDirtyRect = function (list) {
            var len = list.length;
            if (len < 3)
                return false;
            var indexA = 0;
            var indexB = 0;
            var intersectArea = 0; //如果相交，则有相交处的面积。
            var area;
            var rectA;
            var rectB;
            //最大脏面积
            var dirtyArea = Number.POSITIVE_INFINITY;
            for (var idx = 0; idx < len - 1; idx++) {
                rectA = list[idx];
                for (var idy = idx + 1; idy < len; idy++) {
                    rectB = list[idy];
                    area = RM.Rectangle.unionArea(rectA, rectB)
                        + RM.Rectangle.intersectionArea(rectA, rectB)
                        + intersectArea - rectA.getArea()
                        - rectB.getArea();
                    //只合并最小面积的矩形
                    if (dirtyArea > area) {
                        indexA = idx;
                        indexB = idy;
                        dirtyArea = area;
                    }
                    if (dirtyArea == 0)
                        break;
                }
                if (dirtyArea == 0)
                    break;
            }
            if (indexA != indexB) {
                list[indexA].union(list[indexB], true);
                list[indexB].release();
                list.splice(indexB, 1);
                return true;
            }
            return false;
        };
        return RenderFilter;
    })(RM.HashObject);
    RM.RenderFilter = RenderFilter;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     *textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式
     * @author
     *
     */
    var TextAlignType = (function () {
        function TextAlignType() {
        }
        /** 文本在指定的位置开始,默认*/
        TextAlignType.START = "start";
        /** 文本在指定的位置结束 */
        TextAlignType.END = "end";
        /** 文本的中心被放置在指定的位置 */
        TextAlignType.CENTER = "center";
        /** 文本左对齐*/
        TextAlignType.LEFT = "left";
        /** 文本右对齐 */
        TextAlignType.RIGHT = "right";
        return TextAlignType;
    })();
    RM.TextAlignType = TextAlignType;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     *textBaseline 属性设置或返回在绘制文本时的当前文本基线
     * @author
     *
     */
    var TextBaselineType = (function () {
        function TextBaselineType() {
        }
        /** 文本基线是 em 方框的顶端 引擎默认*/
        TextBaselineType.TOP = "top";
        /** 文本基线是悬挂基线 */
        TextBaselineType.HANGING = "hanging";
        /** 文本基线是 em 方框的正中 */
        TextBaselineType.MIDDLE = "middle";
        /** 文本基线是表意基线 */
        TextBaselineType.IDEOGRAPHIC = "ideographic";
        /** 文本基线是 em 方框的底端 */
        TextBaselineType.BOTTOM = "bottom";
        /** 文本基线是普通的字母基线，H5中默认是这个 */
        TextBaselineType.ALPHABETIC = "alphabetic";
        return TextBaselineType;
    })();
    RM.TextBaselineType = TextBaselineType;
})(RM || (RM = {}));
var RM;
(function (RM) {
    /**
     *font-style 属性定义字体的风格。
     * @author
     *
     */
    var TextFontStyleType = (function () {
        function TextFontStyleType() {
        }
        /** 默认值。浏览器显示一个标准的字体样式*/
        TextFontStyleType.NORMAL = "normal";
        /** 浏览器会显示一个斜体的字体样式 */
        TextFontStyleType.ITALIC = "italic";
        /** 浏览器会显示一个倾斜的字体样式 */
        TextFontStyleType.OBLIQUE = "oblique";
        return TextFontStyleType;
    })();
    RM.TextFontStyleType = TextFontStyleType;
})(RM || (RM = {}));

//# sourceMappingURL=engine.js.map
