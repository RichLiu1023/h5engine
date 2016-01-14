declare module RM {
    /**
     * 所有对象的基类，赋予hasCount属性，对象计数
     * @author Rich
     *
     */
    class HashObject {
        static hasCount: number;
        private _hasCount;
        constructor();
        hasCount: number;
    }
}
/**
 * Created by Rich on 2015/11/1.
 */
declare module RM {
    class JsonAnalyzer extends RM.HashObject {
        /** JSON文件缓存 **/
        private static _jsonResMap;
        /** 原始json数据 **/
        private _json;
        /** textureJson数据 **/
        private _jsonTextureFile;
        /**
         * 创建,如果传入url参数则会缓存。可根据url再次获得（RM.JsonAnalyzer.getJsonAnalyzer）<br>
         *     相同的url将会覆盖旧的缓存。
         *2015/10/29
         */
        constructor(data: any, url?: string);
        /**
         * 创建,如果传入url参数则会缓存。可根据url再次获得（RM.JsonAnalyzer.getJsonAnalyzer）<br>
         *     相同的url将会覆盖旧的缓存。
         *2015/10/29
         */
        static create(data: any, url?: string): RM.JsonAnalyzer;
        /**
         *通过URL获取RM.JsonAnalyzer
         *2015/11/1
         */
        static getJsonAnalyzer(url: string): RM.JsonAnalyzer;
        /**
         * 获取原始JSON数据
         *2015/11/1
         */
        getJson(): any;
        /**
         * 获取TextureJSON数据
         *2015/11/1
         */
        getJsonTextureFile(): RM.JsonTextureFile;
    }
}
declare module RM {
    /**
     * 事件类，负责事件的派发和监听<br>
     * 1、事件的三个阶段分为捕获、目标、冒泡。可以根据使用的方式，设置在捕获阶段触发，或者在目标或冒泡阶段触发<br>
     * 2、事件的三个阶段只在显示列表中才有效，具体工作机制可以可以参见DisplayObject.dispatchEvent
     * @author
     *
     */
    class EventDispatcher extends RM.HashObject {
        /**事件监听列表，目标及冒泡阶段<br>
         * key：事件类型<br>
         * value：EventCallbackData <br>
         * */
        private eventListenerMap;
        /**事件监听列表，捕获阶段<br>
        * key：事件类型<br>
        * value：EventCallbackData <br>
        * */
        private eventListenerCaptureMap;
        /**事件抛出对象*/
        private _eventTarget;
        constructor();
        /**添加监听事件(自动排除重复添加的监听：type、listener、thisObject相同则不再添加)<br>
         * type：事件类型<br>
         * listener：事件回调函数<br>
         * thisObject：事件回调函数的this对象<br>
         * useCupture：是否运行于捕获还是运行与目标或冒泡阶段<br>
         * priority:事件的优先级，默认为0，数字越大优先级越高；
         * */
        addEventListener(type: string, listener: Function, thisObject: any, useCupture?: boolean, priority?: number): void;
        /**插入事件到列表*/
        protected insertEventToList(list: Array<RM.EventCallbackData>, type: string, listener: Function, thisObject: any, priority?: number): boolean;
        /**删除事件监听器<br>
        * type：事件类型<br>
        * listener：事件回调函数<br>
        * thisObject：事件回调函数的this对象<br>
        * useCupture：是否运行于捕获还是运行与目标或冒泡阶段，由于捕获与目标及冒泡的事件列表是分离开的，
        * 因此谨慎起见必须确定事件是否在捕获事件列表中<br>
         * */
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**删除事件，从列表中删除*/
        protected removeEventForList(list: Array<RM.EventCallbackData>, type: string, listener: Function, thisObject: any, startIndex?: number): boolean;
        /**派发事件，此事件接收一个RM.Event 对象并根据RM.Event对象的isPropagationImmediateStopped属性来决定是否阻止冒泡*/
        dispatchEvent(event: RM.Event): boolean;
        /**在配发事件时，如果响应事件内部删除后续某个侦听，则后续某个侦听在当前事件全部响应后，才生效，因此后续某个侦听在本次事件中会继续触发*/
        _$notifyListener(event: RM.Event): boolean;
    }
}
declare module RM {
    /**
     * 主控器，引擎结构中的中枢，包含各种控制器，如渲染、网络等控制器
     * @author
     *
     */
    class MainContext extends RM.EventDispatcher {
        /**
         * 渲染cache位图时设置为true。
         * */
        static USE_CACHE_DRAW: boolean;
        /**当前帧需要渲染的子项列表*/
        static DRAW_COMMAND_LIST: Array<RM.RenderCommand>;
        /**引擎启动的时间*/
        static ENGINE_START_TIME: number;
        /**当前渲染阶段*/
        static RENDER_PHASE: string;
        /**渲染*/
        renderContext: RM.RenderContext;
        /**网络*/
        netContext: RM.NetContext;
        /**设备*/
        deviceContext: RM.DeviceContext;
        /**触摸控制*/
        touchContext: RM.H5TouchContext;
        /**舞台*/
        stage: RM.Stage;
        /**进入帧时回调函数列表*/
        static ENTER_FRAME_CALLBACK_LIST: Array<RM.EventCallbackData>;
        /**进入帧事件*/
        private _enterFrameEvent;
        /**添加到舞台回调函数列表*/
        static ADD_TO_STAGE_CALLBACK_LIST: Array<RM.DisplayObject>;
        /**从舞台移除回调函数列表*/
        static REMOVE_FORM_STAGE_CALLBACK_LIST: Array<RM.DisplayObject>;
        constructor();
        /**启动引擎*/
        run(): void;
        /**帧跑道模型，渲染部分*/
        private renderLoop(frameRate);
        /**新的渲染机制，通过updateTransform整理所有需要渲染的子项，在此时开始回调渲染*/
        private _draw(context);
        /**广播进入帧事件*/
        private broadcastEnterFrame(time);
        /**
         * 广播添加入舞台事件
         * */
        broadcastAddToStage(): void;
        /**
         * 广播从舞台删除事件
         * */
        broadcastRemoveFormStage(): void;
        onResize(): void;
        private static _instance;
        static getInstance(): RM.MainContext;
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class StageViewPort extends RM.HashObject {
        private _stageViewProtW;
        private _stageViewProtH;
        private _stageViewProtX;
        private _stageViewProtY;
        private _stageViewScaleX;
        private _stageViewScaleY;
        constructor();
        stageViewProtW: number;
        stageViewProtH: number;
        stageViewProtX: number;
        stageViewProtY: number;
        stageViewScaleX: number;
        stageViewScaleY: number;
        setStageSize(w: number, h: number, styleW?: number, styleH?: number): void;
        setStagePoint(x: number, y: number): void;
        setStageBackgroundColor(color: string): void;
        getStageDiv(): any;
        /**获得视口矩形，起始坐标为0，0*/
        getRect(): RM.Rectangle;
        /**
         * 显示区域的分辨率宽度
         *  */
        getClientWidth(): number;
        /**
         * 显示区域的分辨率高度
         *  */
        getClientHeight(): number;
        /**
         * 自适应分辨率
         * @param isScale ｛true:自动适应屏幕，按照480X800等比缩放。false:充满全屏，不缩放。｝ default true
         */
        onFullScreen(isScale?: boolean): void;
        private static _instance;
        static getInstance(): RM.StageViewPort;
    }
}
declare module RM {
    /**
     * 帧刷新控制器,引擎心跳控制器，唯一时间入口<br>
     * 1、主渲染跑道的循环，引擎优先级最高Number.NEGATIVE_INFINITY<br>
     * 2、进入帧事件的派发，引擎优先级最低Number.POSITIVE_INFINITY<br>
     * 最先执行渲染跑道，当派发进入帧事件后才会进入逻辑跑道。因此，引擎内部执行监听选中间值，
     * @author
     *
     */
    class Ticker extends RM.EventDispatcher {
        private static EVENT_TYPE;
        /** 暂停*/
        private _paused;
        /**时间回调函数列表*/
        private _callBackList;
        /**时间回调函数在执行中时的缓存执行列表*/
        private _callList;
        /**时间回调函数在执行过程中，如果删除了其他定时器函数，就必须在缓存列表中即时的删除掉，
         * 这个索引值代表当前定时器回调函数在缓存列表中的位置，从这个位置的下一位开始，
         * 至道缓存列表的末尾，在这个区间内查找需要删除的定时器函数，如果找到则删除。*/
        private _callIndex;
        private static _instance;
        constructor();
        static getInstance(): RM.Ticker;
        paused(): void;
        resume(): void;
        /**添加侦听，如果在事件内部调用，则在下一帧才会触发*/
        register(listener: Function, thisObject: any, priority?: number): void;
        /**取消监听*/
        unregister(listener: Function, thisObject: any): void;
        /**帧刷新定时器函数*/
        _update(advancedTime: number): void;
        /**启动心跳控制器，此函数只在启动引擎时执行一次。*/
        run(): void;
    }
}
declare module RM {
    /**
     * 显示对象的基类，在显示列表树中属于叶节点
     * @author
     *
     */
    class DisplayObject extends RM.EventDispatcher {
        protected _DOP_Property: RM.DOProtection;
        /**渲染对象*/
        _$texture_to_render: RM.Texture;
        /**全局transform属性*/
        _$globalTransform: RM.Matrix;
        /**全局透明度属性*/
        _$globalAlpha: number;
        /** 用于引擎内部计算 **/
        protected _$matrix: RM.Matrix;
        /** 用于引擎内部计算 **/
        protected _$rect: RM.Rectangle;
        /** 旧的矩形位置，记录下一次改变之前的位置，用于清除自己的位置，以便脏矩形渲染 **/
        _$againRect: RM.Rectangle;
        /**缓存位图*/
        private _$renderTexture;
        /** 在引擎处于渲染阶段时，只计算一次边界范围，减少计算量 **/
        private _$cacheBound;
        /** 是否需要重新计算边界 **/
        private _$isChangeBound;
        constructor();
        /**添加监听事件(自动排除重复添加的监听：type、listener、thisObject相同则不再添加)<br>
         * type：事件类型<br>
         * listener：事件回调函数<br>
         * thisObject：事件回调函数的this对象<br>
         * useCupture：是否运行于捕获还是运行与目标或冒泡阶段<br>
         * priority:事件的优先级，默认为0，数字越大优先级越高；
         * */
        addEventListener(type: string, listener: Function, thisObject: any, useCupture?: boolean, priority?: number): void;
        /**删除事件监听器<br>
         * type：事件类型<br>
         * listener：事件回调函数<br>
         * thisObject：事件回调函数的this对象<br>
         * useCupture：是否运行于捕获还是运行与目标或冒泡阶段，由于捕获与目标及冒泡的事件列表是分离开的，
         * 因此谨慎起见必须确定事件是否在捕获事件列表中<br>
         * */
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**派发事件，此事件接收一个RM.Event 对象<br>
         * */
        dispatchEvent(event: RM.Event): boolean;
        /**
         * 事件流开始派发事件<br>
         * 根据事件流的三个阶段进行响应
         * */
        private _displayPropagationEvent(event, list);
        getName(): string;
        getX(): number;
        getY(): number;
        getWidth(): number;
        getHeight(): number;
        getAlpha(): number;
        getIsContainer(): boolean;
        getVisible(): boolean;
        getParent(): RM.DisplayObjectContainer;
        getNeedDraw(): boolean;
        getSkewX(): number;
        getSkewY(): number;
        getScaleX(): number;
        getScaleY(): number;
        getRotate(): number;
        getCacheAsBitmap(): boolean;
        getStage(): RM.Stage;
        /**
         * 获取是否可以触摸
         * */
        getTouchEnabled(): boolean;
        /**
         *是否已脏
         *15/10/25
         */
        getDirty(): boolean;
        /**
         *
         *获取滚动矩形，遮罩矩形
         */
        getScrollRect(): RM.Rectangle;
        setName(value: string): RM.DisplayObject;
        setParent(value: DisplayObjectContainer): RM.DisplayObject;
        /**强制每帧执行渲染*/
        setNeedDraw(value: boolean): RM.DisplayObject;
        setWidth(value: number): RM.DisplayObject;
        setHeight(value: number): RM.DisplayObject;
        setSize(w: number, h: number): RM.DisplayObject;
        setX(value: number): RM.DisplayObject;
        setY(value: number): RM.DisplayObject;
        setPoint(x: number, y: number): RM.DisplayObject;
        /**X轴斜切，以角度为单位*/
        setSkewX(value: number): RM.DisplayObject;
        /**Y轴斜切，以角度为单位*/
        setSkewY(value: number): RM.DisplayObject;
        /**X轴缩放*/
        setScaleX(value: number): RM.DisplayObject;
        /**Y轴缩放*/
        setScaleY(value: number): RM.DisplayObject;
        /**旋转，单位为角度*/
        setRotate(value: number): RM.DisplayObject;
        /**透明度，此值为0~1之间的值*/
        setAlpha(value: number): RM.DisplayObject;
        /**是否显示*/
        setVisible(value: boolean): RM.DisplayObject;
        /**设置遮罩矩形，滚动矩形，设置为null则取消遮罩矩形*/
        setScrollRect(value: RM.Rectangle): RM.DisplayObject;
        /**是否缓存为位图*/
        setCacheAsBitmap(value: boolean): RM.DisplayObject;
        /**
         * 设置是否可以触摸
         * */
        setTouchEnabled(value: boolean): void;
        /** 引擎内部调用，在从舞台删除后调用，清空stage属性 */
        _$clearStage(): void;
        /** 显示对象加入舞台，引擎内部调用 */
        _$onAddToStage(): void;
        /** 显示对象从舞台中移除，引擎内部调用 <br>
         * 在移除回调时，stage属性会不设置为null，回调结束才置null
         * */
        _$onRemoveFormStage(): void;
        /**
         *设置为脏
         *2015/11/4
         *Rich
         */
        _$setDirty(): void;
        /**
         *清理脏
         *2015/11/4
         *Rich
         */
        _$clearDirty(): void;
        /**
         *添加到RM.DisplayObjectContainer，并返回自己
         *15/10/30
         */
        addTo(parent: RM.DisplayObjectContainer): RM.DisplayObject;
        /**子类实现的渲染接口，子类在此接口调用自己的draw函数，以渲染到canvas*/
        _$render(renderContext: RM.RenderContext): void;
        /**渲染前准备渲染的各种数据，如透明度、transform等数据，在此函数调用_render函数*/
        _$draw(renderContext: RM.RenderContext): void;
        private _drawCacheTexture(renderContext);
        /**制作缓存图像*/
        private _madeBitmapCache();
        /**
         *更新全局属性，并判断是否需要渲染
         *2015/11/4
         *Rich
         */
        _$updateTransform(): void;
        /**
         *是否需要绘制，脏矩形的判断，如果去掉则全部绘制
         *2015/11/3
         */
        private _isNeedRender();
        /**
         *更新全局属性
         *2015/11/4
         *Rich
         */
        private _updateGlobalTransform();
        /**获取变换矩阵
         * 可以传入一个矩阵与self属性叠加，返回叠加矩阵
         * */
        getMatrix(matrix?: RM.Matrix): RM.Matrix;
        /**
         *检测脏矩形
         *15/10/25
         */
        _$checkDirtyRectangle(): void;
        /**合并所有父代全局tansform综合属性*/
        getConcatenatedMatrix(): RM.Matrix;
        /**本地坐标转换为全局坐标
         * @param x:本地坐标x轴
         * @param y:本地坐标y轴
         * */
        localToGlobal(x?: number, y?: number): RM.Point;
        /**全局坐标转换为本地坐标
         * @param x:全局坐标x轴
         * @param y:全局坐标y轴
         * */
        globalToLocal(x?: number, y?: number): RM.Point;
        /**获取真实的边界，与显示边界不同，此方法根据子类的不同，需要子类实现重写*/
        _$realBounds(): RM.Rectangle;
        /**获得显示边界（不包含x,y属性），不同于真实边界，不需要子类重写，此方法根据是否设置过显示宽高来决定返回的显示边界
         * <br>后续增加描点功能
         * @return 返回新的矩形
         * */
        _$getShowBounds(rect?: RM.Rectangle): RM.Rectangle;
        /**
         *获取显示范围（包含x,y属性），也就是有效的位置
         *2015/11/16
         */
        _$getBounds(rect?: RM.Rectangle): RM.Rectangle;
        /**
         * 获取宽高尺寸<br>
         * 如果this._DOP_Property._hasSize 为true，则重新计算尺寸<br>
         * 否则使用上一次计算的结果，以减少计算量。如果设置过宽高属性，则按设置的<br>
         * 宽高属性返回。如果未设置过，则返回包含所有孩子的最大矩形尺寸。
         * 注意：宽高属性与缩放属性单独分开。设置缩放属性不影响宽高属性，例如宽度为100时scaleX设置为0.5，<br>
         * 则图像被缩放，但实际宽度依旧为100。
         * */
        private _$getSize();
        /**
         * 指定舞台坐标是否在对象内
         * @param isTouchEnabled 是否忽略touchEnabled属性，当容器类可触摸时，忽略子项的属性
         * */
        _$hitTest(targetX: number, targetY: number, isTouchEnabled?: boolean): RM.DisplayObject;
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class Bitmap extends RM.DisplayObject {
        private _texture;
        private _fillMode;
        constructor(value?: RM.Texture);
        /**
         *
         *2015/10/30
         */
        static create(value?: RM.Texture): RM.Bitmap;
        setTexture(value: RM.Texture): RM.Bitmap;
        getTexture(): RM.Texture;
        _$render(context: RM.RenderContext): void;
        static _drawBitmap(context: RM.RenderContext, destW: number, destH: number, thisObject: RM.Bitmap): void;
        /** 重写父类方法，计算真实边界 */
        _$realBounds(): RM.Rectangle;
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class BitmapFillMode {
        /**绘制平铺位图*/
        static REPEAT: string;
        /**绘制拉伸位图*/
        static SCALE: string;
        constructor();
    }
}
declare module RM {
    /**
     * DisplayObject 的保护属性
     * @author
     *
     */
    class DOProtection {
        /** 名字 */
        _name: string;
        /** x轴偏移值 */
        _x: number;
        /** y轴偏移值 */
        _y: number;
        /** 显示对象的宽度 */
        _width: number;
        /** 显示对象的高度 */
        _height: number;
        /** x轴缩放*/
        _scaleX: number;
        /** y轴缩放 */
        _scaleY: number;
        /** x轴切变 */
        _skewX: number;
        /** y轴切变 */
        _skewY: number;
        /** 旋转弧度 */
        _rotate: number;
        /** 滚动矩形，遮罩矩形 */
        _scrollRect: RM.Rectangle;
        /** 显示对象的透明度 */
        _alpha: number;
        /** 对象是否显示 */
        _visible: boolean;
        /** 对象是否是显示容器 */
        _isContainer: boolean;
        /** 父容器 */
        _parent: RM.DisplayObjectContainer;
        /** 舞台 */
        _stage: RM.Stage;
        /**是否需要绘制*/
        _needDraw: boolean;
        /**是否设置了宽度*/
        _hasWidthSet: boolean;
        /**是否设置了高度*/
        _hasHeightSet: boolean;
        /** 尺寸是否改变 */
        _hasSize: boolean;
        /**缓存为位图*/
        _cacheAsBitmap: boolean;
        /**是否接收触摸事件*/
        _touchEnabled: boolean;
        /**是否为脏*/
        _isDirty: boolean;
        constructor();
    }
}
declare module RM {
    /**
     * 显示对象容器类的基类，在显示列表树中属于父节点<br>
     * @author
     *
     */
    class DisplayObjectContainer extends RM.DisplayObject {
        protected _$children: Array<RM.DisplayObject>;
        /**子对象是否接收触摸事件*/
        protected _$touchChildren: boolean;
        constructor();
        /**
         * 获取是否可以触摸子对象
         * */
        /**
         * 设置是否可以触摸子对象
         * */
        touchChildren: boolean;
        /** 不要设置宽高属性 **/
        setWidth(value: number): RM.DisplayObject;
        /** 不要设置宽高属性 **/
        setHeight(value: number): RM.DisplayObject;
        /** 不要设置宽高属性 **/
        setSize(w: number, h: number): RM.DisplayObject;
        /**
         * 添加DisplayObject子类的实例到显示列表容器，被添加至显示显示列表容器的末尾。
         * @param child 子项
         * @param index 索引位置
         * */
        addChild(child: RM.DisplayObject): RM.DisplayObject;
        /**
         * 添加DisplayObject子类的实例到显示列表容器，被添加至显示显示列表容器的index指定的位置。
         * @param child 子项
         * @param index 索引位置
         * */
        addChildAt(child: RM.DisplayObject, index: number): RM.DisplayObject;
        private _doAddChild(child, index);
        /**
         * 改变DisplayObject子类的实例在显示列表容器中的坐标。
         * @param child 子项
         * @param index 索引位置
         * */
        setChildIndex(child: RM.DisplayObject, index: number): void;
        private _doSetChildIndex(child, index);
        /**
         * 移除DisplayObject子类的实例，从显示列表容器中。
         * @param child 子项
         * */
        removeChild(child: RM.DisplayObject): RM.DisplayObject;
        /**
         * 移除DisplayObject子类的实例，从显示列表容器中的指定位置。
         * @param index 索引位置
         * */
        removeChildAt(index: number): RM.DisplayObject;
        /**
         * 移除DisplayObject子类的所有孩子
         * */
        removeAllChild(): void;
        private _doRemoveChildAt(index);
        /**
         * 获取DisplayObject子类的实例，从显示列表容器中的指定位置。
         * @param index 索引位置
         * */
        getChildAt(index: number): RM.DisplayObject;
        /**
         * 获取DisplayObject子类的实例，从指定的名字name。
         * @param name 显示对象的名字
         * */
        getChildByName(name: string): RM.DisplayObject;
        /**
         * 获取指定DisplayObject对象在父类显示列表中的位置index。
         * @param child 显示对象
         * */
        getChildIndex(child: RM.DisplayObject): number;
        /**
         * 在子级列表中两个指定的位置，交换子对象的Z轴顺序
         * @param index1 第一个索引位置
         * @param index2 第二个索引位置
         * */
        swapChildrenAt(index1: number, index2: number): void;
        /**
         * 在子级列表中两个指定的子项，交换子对象的Z轴顺序
         * @param child1 第一个索引位置
         * @param child2 第二个索引位置
         * */
        swapChildren(child1: RM.DisplayObject, child2: RM.DisplayObject): void;
        private _doSwapChildrenAt(index1, index2);
        /**
         * 获得子项的数量
         * */
        getChildrenNum(): number;
        /** 显示对象加入舞台，引擎内部调用 */
        _$onAddToStage(): void;
        /** 显示对象从舞台中移除，引擎内部调用 <br>
         * 在移除回调时，stage属性会不设置为null，回调结束才置null
         * */
        _$onRemoveFormStage(): void;
        pushMaskRect(renderContext: RM.RenderContext): void;
        popMaskRect(renderContext: RM.RenderContext): void;
        _$render(renderContext: RM.RenderContext): void;
        _$updateTransform(): void;
        /**
         *检测脏矩形
         *15/10/25
         */
        _$checkDirtyRectangle(): void;
        /**
         * 清理脏标记
         *15/10/25
         */
        _$clearDirty(): void;
        /** 重写父类方法，计算真实边界 */
        _$realBounds(): RM.Rectangle;
        /**
         * 覆盖父类方法，指定舞台坐标是否在对象内<br>
         * 容器是透明的矩形，是否触摸到容器的判断，要通过判断是否触摸在容器内部的子对象来确定。<br>
         * 如果触摸到可触摸的子对象，那么就说明触摸到了容器。<br>
         * 就算是缓存位图对象也会触发子对象的检测。
         *
         * */
        _$hitTest(targetX: number, targetY: number, isTouchEnabled?: boolean): RM.DisplayObject;
    }
}
/**
 * Created by Rich on 2015/12/10.
 */
declare module RM {
    class MovieClip extends RM.DisplayObject {
        /** 纹理集 **/
        private _spriteSheet;
        /** 当前播放的bitmap **/
        private _currentTexture;
        /** 当前帧 **/
        private _currentFrame;
        /** 当前播放的label **/
        private _currentLabel;
        /** 帧频 **/
        private _frameRate;
        /** 总帧数 **/
        private _totalFrames;
        /** 播放次数 **/
        private _playTimes;
        /** 已播放次数 **/
        private _playedTimes;
        /** 计数器 **/
        private _tick;
        /** 是否暂停 **/
        private _ispause;
        /** 帧列表 **/
        private _frameList;
        constructor(spriteSheet: RM.SpriteSheet);
        currentFrame: number;
        currentLabel: string;
        frameRate: number;
        totalFrames: number;
        playTimes: number;
        playedTimes: number;
        ispause: boolean;
        /**
         * 设置纹理集，如果已设置过setPlayLable那么会从当前帧
         * @param spriteSheet
         */
        setSpriteSheet(spriteSheet: RM.SpriteSheet): void;
        /**
         * 设置要播放的标签,会重新开始播放
         * @param label
         * @param time 秒值
         */
        setPlayLable(label: string, time: number): void;
        parseSpriteSheet(): void;
        /**
         * 是否可以播放
         * @returns {boolean}
         */
        isCanPlay(): boolean;
        /**
         * 播放准备
         * @returns {boolean}
         * @private
         */
        private _readyPlay();
        /**
         * 播放
         * @param times
         */
        play(times?: number): void;
        /**
         * 暂停
         */
        pause(): void;
        /**
         * 恢复播放，只有在暂停的情况下 才可以继续播放
         */
        replay(): void;
        /**
         * 停止
         */
        stop(): void;
        /**
         * 下一帧
         */
        nextFrame(): void;
        private enterFrame(dt);
        _$render(context: RM.RenderContext): void;
        /** 重写父类方法，计算真实边界 */
        _$realBounds(): RM.Rectangle;
    }
}
declare module RM {
    /**
     * 纹理类
     * @author Rich
     *
     */
    class Texture extends RM.HashObject {
        static _bitmapDataFactoryMap: {};
        static _bitmapDataCallBackMap: {};
        /**纹理bitmapData*/
        _bitmapData: any;
        /**bitmapData原始宽度*/
        _sourceW: number;
        /**bitmapData资源原始高度*/
        _sourceH: number;
        /**表示这个纹理从 bitmapData 上的 x 位置开始裁剪*/
        _bitmapX: number;
        /**表示这个纹理从 bitmapData 上的 y 位置开始裁剪*/
        _bitmapY: number;
        /**表示这个纹理从 bitmapData 上裁剪的宽度*/
        _bitmapW: number;
        /**表示这个纹理在 bitmapData 上裁剪的高度*/
        _bitmapH: number;
        /**表示这个纹理显示了之后在 画布 x 方向的渲染偏移量*/
        _offsetX: number;
        /**表示这个纹理显示了之后在 画布 y 方向的渲染偏移量*/
        _offsetY: number;
        /**纹理渲染宽度（图像裁剪后的实际高度，比_bitmapW大，图像则被拉伸，反之图像则被缩小）*/
        _textureW: number;
        /**纹理渲染高度（图像裁剪后的实际高度，比_bitmapH大，图像则被拉伸，反之图像则被放小）*/
        _textureH: number;
        constructor(bitmapData?: any);
        /**
         *
         *2015/10/30
         */
        static create(bitmapData?: any): RM.Texture;
        setBitmapData(value: any): void;
        /**纹理渲染宽度（图像裁剪后的实际高度，比_bitmapW大，图像则被拉伸，反之图像则被缩小）*/
        textureW: number;
        /**纹理渲染高度（图像裁剪后的实际高度，比_bitmapH大，图像则被拉伸，反之图像则被放小）*/
        textureH: number;
        /**表示这个纹理从 bitmapData 上裁剪的宽度*/
        bitmapW: number;
        /**表示这个纹理在 bitmapData 上裁剪的高度*/
        bitmapH: number;
        /**表示这个纹理从 bitmapData 上的 x 位置开始裁剪*/
        bitmapX: number;
        /**表示这个纹理从 bitmapData 上的 y 位置开始裁剪*/
        bitmapY: number;
        /**bitmapData原始宽度*/
        sourceW: number;
        /**bitmapData原始高度*/
        sourceH: number;
        /**表示这个纹理显示了之后在 画布 x 方向的渲染偏移量*/
        offsetX: number;
        /**表示这个纹理显示了之后在 画布 y 方向的渲染偏移量*/
        offsetY: number;
        drawForCanvas(context: any, sourceX: number, sourceY: number, sourceW: number, sourceH: number, destX: number, destY: number, destW: number, destH: number, renderType?: string): void;
        /**
         * 重复绘制image到画布，渲染类型可选renderType：<br>
         * （repeat：默认。该模式在水平和垂直方向重复。铺满画布<br>
         *  repeat-x：该模式只在水平方向重复。横向铺满<br>
         *  repeat-y：该模式只在垂直方向重复。纵向铺满<br>
         *  no-repeat：该模式只显示一次（不重复）。）
         */
        private drawRepeatImageForCanvas(context, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH, renderType);
        clone(): RM.Texture;
        dispose(): void;
        /**
         * 通过url，创建bitmapdata纹理<br>
         * url：资源路径<br>
         * callback：加载完成或加载失败回调函数，包含｛是否成功（0成功、1失败），bitmapData对象｝<br>
         * return
         */
        static createBitmapData(url: string, callback: Function): void;
        /**
         *通过url获取缓存中的纹理，如果未加载则返回null
         *2015/10/30
         */
        static getTexture(url: string): RM.Texture;
        private static onloadResult(result, url, bitmapData);
        static addToBitmapDataCallBackMap(url: string, callback: Function): void;
    }
}
declare module RM {
    /**
     * 矩形类
     * @author
     *
     */
    class Rectangle extends RM.HashObject {
        x: number;
        y: number;
        width: number;
        height: number;
        private static _PoolUtil;
        constructor();
        static create(x?: number, y?: number, width?: number, height?: number): RM.Rectangle;
        static PoolUtil: RM.PoolUtil;
        /**释放**/
        release(): void;
        reset(): void;
        /**克隆，制作自己的分身，值的拷贝，产生新值*/
        clone(): RM.Rectangle;
        /**重置为指定值*/
        resetToValue(x: number, y: number, width: number, height: number): RM.Rectangle;
        /**重置为指定Rect*/
        resetToRect(rect: RM.Rectangle): RM.Rectangle;
        /**对比两个矩形是否是相同的值*/
        equals(rect: RM.Rectangle): boolean;
        /**获取最大X轴的值*/
        getMaxX(): number;
        /**获取最小X轴的值*/
        getMinX(): number;
        /**获取在X轴的中间值*/
        getMidX(): number;
        /**获取最大Y轴的值*/
        getMaxY(): number;
        /**获取最小Y轴的值*/
        getMinY(): number;
        /**获取在Y轴的中间值*/
        getMidY(): number;
        /** 是否为空矩形 **/
        isEmpty(): boolean;
        /**指定点是否在矩形内*/
        containsPoint(point: RM.Point): boolean;
        /**指定坐标是否在矩形内*/
        containsXY(x: number, y: number): boolean;
        /**自己是否包含指定rect，如果rect完全处于自己内部，则属于包含rect*/
        containsRect(rect: RM.Rectangle): boolean;
        /**指定矩形与自己是否相交*/
        intersectsRect(rect: RM.Rectangle): boolean;
        /**指定矩形rect与自己是否相交<br>
         * 如果相交则返回交集区域 Rectangle 对象。<br>
         * 如果矩形不相交，则此方法返回一个空的 Rectangle 对象，其属性设置为 0。*/
        intersection(rect: RM.Rectangle, toSelf?: boolean): RM.Rectangle;
        /**通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
         *
         * */
        union(toUnion: RM.Rectangle, toSelf?: boolean): RM.Rectangle;
        /**
         *获取两个矩形合并后的面积
         *2015/11/12
         */
        static unionArea(rect1: RM.Rectangle, rect2: RM.Rectangle): number;
        /**
         *获取两个矩形重叠区域的面积
         *2015/11/12
         */
        static intersectionArea(rect1: RM.Rectangle, rect2: RM.Rectangle): number;
        /**
         *获取面积
         *15/10/25
         */
        getArea(): number;
        /**以字符串的形式输出*/
        toString(): string;
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class RenderTexture extends RM.Texture {
        private static _pool;
        private _renderContext;
        private static _rect;
        constructor();
        static createRenderTexture(): RM.RenderTexture;
        /**回收*/
        release(): void;
        dispose(): void;
        init(): void;
        setSize(width: number, height: number): void;
        drawToTexture(displayObject: RM.DisplayObject): boolean;
    }
}
declare module RM {
    /**
     * 精灵类，显示列表中的节点，包含一系列子项的列表
     * @author
     *
     */
    class Sprite extends RM.DisplayObjectContainer {
        constructor();
    }
}
/**
 * Created by Rich on 2015/10/31.
 */
declare module RM {
    /**
     *SpriteSheet是由一个或者多个子图拼合成的纹理图集<br>
     *     图集只存在一份，所有SpriteSheet共享数据，所有子项渲染到画布上的偏移位置不同而已<br>
     *
     *2015/10/31
     *Rich
     */
    class SpriteSheet extends RM.HashObject {
        /** 纹理图集 **/
        private _texture;
        /** 纹理图集JSON **/
        private _textureJSON;
        /** 纹理列表 **/
        private _textureMap;
        constructor(texture: RM.Texture, textureJSON: RM.JsonTextureFile);
        /**
         *
         *2015/10/31
         */
        static create(texture: RM.Texture, textureJSON: RM.JsonTextureFile): RM.SpriteSheet;
        /**
         * 通过URL创建
         * @param textureUrl
         * @param textureJSONUrl
         * @returns {RM.SpriteSheet}
         */
        static createByUrl(textureUrl: string, textureJSONUrl: string): RM.SpriteSheet;
        /**
         *通过名字获取纹理
         *2015/10/31
         */
        getTexture(name: string): RM.Texture;
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
        createTexture(name: string, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX?: number, offsetY?: number, textureWidth?: number, textureHeight?: number): RM.Texture;
    }
}
declare module RM {
    /**
     * 舞台，主绘区
     * @author
     *
     */
    class Stage extends RM.DisplayObjectContainer {
        constructor();
        _$updateTransform(): void;
        /**
         * 覆盖父类方法，指定舞台坐标是否在对象内<br>
         * */
        _$hitTest(targetX: number, targetY: number, isTouchEnabled?: boolean): RM.DisplayObject;
    }
}
declare module RM {
    /**
     * 被派发的事件类<br>
     * bindData:携带派发时附加的user数据
     * @author
     *
     */
    class Event extends RM.HashObject {
        /** 帧频刷新，在进入帧时进行派发 */
        static ENTER_FRAME: string;
        /**完成事件，在加载完成后派发*/
        static COMPLETE: string;
        /** 添加到舞台事件 */
        static ADD_TO_STAGE: string;
        /** 从舞台移除事件 */
        static REMOVE_FORM_STAGE: string;
        /** 离开舞台事件 */
        static LEAVE_STAGE: string;
        _type: string;
        _target: any;
        _currentTarget: any;
        /**表示事件是否参与冒泡，如果可以则为true，默认为false*/
        _bubbles: boolean;
        /**停止处理事件流中 （当前节点） 中的后续节点的监听处理*/
        private _isPropagationImmediateStopped;
        /** 停止处理事件流中 （当前节点的后续节点） 中的所有事件监听器的处理 */
        private _isPropagationStopped;
        /**代表事件的三个阶段，分别是<br>
         * 捕获、目标、冒泡，对应EventPhase类的三个值<br>
         * 默认为目标阶段。
         * */
        _eventPhase: string;
        _bindData: any;
        constructor();
        /**
         *创建对象，建有内存池
         *2015/10/22
         */
        static create(EventClass: any, type?: string, bubbles?: boolean, bindData?: any): any;
        /**
         *回收
         *2015/10/22
         */
        release(): void;
        create(type?: string, bubbles?: boolean, bindData?: any): void;
        /**停止处理时间流中 （当前节点） 中的后续节点的监听处理*/
        stopImmediatePropagation(): void;
        /** 是否 停止处理时间流中 （当前节点） 中的后续节点的监听处理*/
        isPropagationImmediateStopped: boolean;
        /** 停止处理时间流中 （当前节点的后续节点） 中的所有事件监听器的处理 <br>
         *  此方法并不会影响当前节点中的后续节点的监听处理。
         * */
        stopPropagation(): void;
        /** 是否 停止处理时间流中 （当前节点的后续节点） 中的所有事件监听器的处理 */
        isPropagationStopped: boolean;
        reset(): void;
        /**通过EventDispatcher类，或子类派发一个事件*/
        static dispatchEvent(target: RM.EventDispatcher, type?: string, bubbles?: boolean, bindData?: any): void;
    }
}
declare module RM {
    /**
     * 事件列表中的数据项
     * @author
     *
     */
    class EventCallbackData extends RM.HashObject {
        type: string;
        listener: Function;
        thisObject: any;
        /**优先级默认为0，数字越大，优先级越高*/
        priority: number;
        constructor(type: string, listener: Function, thisObject: any, priority: number);
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class EventPhase {
        /**事件的第一个阶段，捕获阶段*/
        static CAPTURE_PHASE: string;
        /**事件的第二个阶段，目标阶段*/
        static TARGET_PHASE: string;
        /**事件的第三个阶段，冒泡阶段*/
        static BUBBLE_PHASE: string;
        constructor();
    }
}
/**
 * Created by Rich on 2015/10/21.
 */
declare module RM {
    class TouchEvent extends RM.Event {
        /** 触摸开始 */
        static TOUCH_BEGIN: string;
        /**触摸移动*/
        static TOUCH_MOVE: string;
        /** 触摸结束*/
        static TOUCH_END: string;
        /** 舞台坐标X轴 **/
        private _stageX;
        /** 舞台坐标Y轴 **/
        private _stageY;
        /** 点击的标识索引 **/
        private _identifier;
        constructor();
        /**
         *
         *2015/10/22
         */
        setData(stageX: number, stageY: number, identifier: number): void;
        reset(): void;
        /**
         *获得舞台坐标
         *2015/10/21
         */
        getStageX(): number;
        /**
         *获得舞台坐标
         *2015/10/21
         */
        getStageY(): number;
        /**
         *获得触摸唯一索引
         *2015/10/21
         */
        getIdentifier(): number;
        /**
         *获得目标本地坐标
         *2015/10/21
         */
        getLocalPoint(): RM.Point;
        /**
         * 派发触碰事件
         *2015/10/22
         */
        static dispatchTouchEvent(target: RM.EventDispatcher, type?: string, bubbles?: boolean, bindData?: any, stageX?: number, stageY?: number, identifier?: number): void;
    }
}
/**
 * Created by Rich on 2015/10/30.
 */
declare module RM {
    class ResGroupItem extends RM.HashObject {
        private _group;
        private _isComplete;
        private _loadCompleteNum;
        private _loadAllNum;
        private _callback;
        private _thisObj;
        constructor(group: Array<string>, callback?: Function, thisObj?: any);
        /**
         *加载一个url列表
         * 进度回调必须传递callback与thisObj
         *2015/10/30
         */
        static create(group: Array<string>, callback?: Function, thisObj?: any): RM.ResGroupItem;
        group: Array<string>;
        isComplete: boolean;
        loadCompleteNum: number;
        loadAllNum: number;
        /**
         *
         *2015/10/30
         */
        reset(): void;
        /**
         *
         *2015/10/30
         */
        load(): void;
        /**
         *
         *2015/10/30
         */
        _loadCompleteOnce(tag: number): void;
    }
}
/**
 * Created by Rich on 2015/10/29.
 */
declare module RM {
    class Res extends RM.HashObject {
        static RES_TYPE_JPG: string;
        static RES_TYPE_PNG: string;
        static RES_TYPE_SWF: string;
        static RES_TYPE_DAT: string;
        static RES_TYPE_RES: string;
        static RES_TYPE_TXT: string;
        static RES_TYPE_MP3: string;
        static RES_TYPE_JSON: string;
        constructor();
        /**
         *
         * @param list
         * @param callback function( RM.ResGroupItem )
         * @param list
         *2015/10/30
         */
        static loadGroup(list: Array<string>, callback?: Function, thisObj?: any): void;
    }
}
/**
 * Created by Rich on 2015/10/29.
 */
declare module RM {
    class ResLoaderItem extends RM.HashObject {
        /** 加载器 **/
        private _loader;
        /** 加载路径 **/
        private _url;
        /** 是否已经加载 **/
        private _isComplete;
        /** 是否正在加载 **/
        private _isLoading;
        /** 使用的Group **/
        private _useGroup;
        /**
         *url 加载路径。
         * isStart 是否立即开始加载。
         *2015/10/29
         */
        constructor(url: string, isStart?: boolean, useGroup?: RM.ResGroupItem);
        /**
         *url 加载路径。
         * isStart 是否立即开始加载。
         *2015/10/29
         */
        static create(url: string, isStart?: boolean, useGroup?: RM.ResGroupItem): RM.ResLoaderItem;
        /**
         *重置
         *2015/10/29
         */
        reset(): void;
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
        load(url?: string): number;
        /**
         *
         *2015/10/29
         */
        private onComplete(event);
        /**
         *
         *2015/10/29
         */
        private onError(event);
        /**
         *获取加载类型，识别引擎可以家在并处理的文件
         *2015/10/29
         *Rich
         */
        private getLoaderType(url);
        /**
         *对Group对象发送完成
         *2015/10/30
         */
        private sendGroupComplete(tag);
    }
}
declare module RM {
    /**
     * 网络加载类，通过url进行加载二进制文件、文本文件、图片及数据
     * @author
     *
     */
    class URLLoader extends RM.EventDispatcher {
        dataFormat: string;
        data: any;
        request: RM.URLRequest;
        constructor();
        /**
         *
         *2015/10/29
         */
        static create(): RM.URLLoader;
        load(request: RM.URLRequest): void;
        reset(): void;
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class URLLoaderDataFormat {
        static BINARY: string;
        static TEXT: string;
        static JSON: string;
        static TEXTURE: string;
        static SOUND: string;
        constructor();
    }
}
declare module RM {
    /**
     * URLRequest类捕获单个HTTP请求中的所有信息
     * @author
     *
     */
    class URLRequest extends RM.HashObject {
        private _url;
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
        data: any;
        method: string;
        /**
         * URLRequest类捕获单个HTTP请求中的所有信息
         * @author
         *
         */
        constructor(url: string);
        /**
         *创建
         *2015/10/28
         */
        static create(url: string): RM.URLRequest;
        reset(): void;
        url: string;
    }
}
declare module RM {
    /**
     * 此类提供一些值给URLRequest，确认将数据发送到服务器时使用POST方法还是GET方法
     * @author
     *
     */
    class URLRequestMethod {
        static GET: string;
        static POST: string;
        constructor();
    }
}
/**
 * Created by Rich on 2015/10/27.
 */
declare module RM {
    /**
     * 使用 URLVariables 类可以在应用程序和服务器之间传输变量。
     * 将 URLVariables 对象与 URLLoader 类的方法、URLRequest 类的 data 属性一起使用。
     */
    class URLVariables extends RM.HashObject {
        /** 包含名称/值对的 URL 编码的字符串。 **/
        data: string;
        constructor(data: string);
    }
}
/**
 * Created by Rich on 15/12/5.
 */
declare module RM {
    class WebSocket {
        /** 正在连接 **/
        static CONNECTING: number;
        /** 已连接 **/
        static OPEN: number;
        /** 正在关闭 **/
        static CLOSING: number;
        /** 已关闭 **/
        static CLOSED: number;
        private _socket;
        private _thisObj;
        private _onConnect;
        private _onError;
        private _onMessage;
        private _onClose;
        private _host;
        private _port;
        private _url;
        constructor();
        /**
         * Create WebSocket.
         * WebSocket's "binaryType" default value is "arraybuffer".
         * "binaryType" can sclect value "arraybuffer" or "blob"
         * @returns {RM.WebSocket}
         */
        static create(): RM.WebSocket;
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
        addListener(onConnect: Function, onError: Function, onMessage: any, onClose: Function, thisObj: any): RM.WebSocket;
        /**
         * Connect webserver by host and post.
         * @param host
         * @param port
         * @returns {RM.WebSocket}
         */
        connect(host: string, port: number): RM.WebSocket;
        /**
         * Connect websocket by url.
         * @param url
         * @returns {RM.WebSocket}
         */
        connectByUrl(url: string): RM.WebSocket;
        /**
         * 允许应用程序以 UTF-8 文本、ArrayBuffer 或 Blob 的形式将消息发送至 Websocket 服务器。
         * 它将验证 Websocket 的 readyState 是否为 OPEN.
         * @param message
         */
        send(message: any): void;
        /**
         * 关闭连接
         */
        close(): void;
        /**
         * 获取网络状态
         * 0 正在连接
         * 1 已连接
         * 2 正在关闭
         * 3 已关闭
         * @returns {number}
         */
        getSocketState(): number;
        private bindListener();
        /**
         * 设定websocket的binaryType属性
         * @param type  ｛ 0:blob，1:arraybuffer ｝default：1
         */
        setBinaryType(type: number): void;
        host: string;
        port: number;
        url: string;
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class TFProtection {
        /** 显示文本 */
        _text: string;
        /** textBaseline 属性设置或返回在绘制文本时的当前文本基线。<br>
        * top	文本基线是 em 方框的顶端。<br>
        * hanging	文本基线是悬挂基线。<br>
        * middle	文本基线是 em 方框的正中。<br>
        * ideographic	文本基线是表意基线。<br>
        * bottom	文本基线是 em 方框的底端。<br>
        * 参见：TextBaselineType
        * 默认为top <br>
        * */
        _textBaseline: string;
        /** textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式。<br>
        * start	默认。文本在指定的位置开始。<br>
        * end	文本在指定的位置结束。<br>
        * center	文本的中心被放置在指定的位置。<br>
        * left	文本左对齐。<br>
        * right	文本右对齐。<br>
        * 参见：TextAlignType
        * 默认为start <br>
        * */
        _textAlign: string;
        /** 文本颜色值，十六进制 */
        _textColor: number;
        /** 描边颜色值，十六进制 */
        _strokeColor: number;
        /** 是否镂空文字 */
        _isStrokeText: boolean;
        /** font-style 属性定义字体的风格<br>
         * 该属性设置使用斜体、倾斜或正常字体。斜体字体通常定义为字体系列中的一个单独的字体。理论上讲，用户代理可以根据正常字体计算一个斜体字体。<br>
         * normal	默认值。浏览器显示一个标准的字体样式。<br>
         * italic	浏览器会显示一个斜体的字体样式。<br>
         * oblique	浏览器会显示一个倾斜的字体样式。<br>
         * 参见TextFontStyleType
         * */
        _fontStyle: string;
        /** 是否使用异体 <br>
         * font-variant 属性设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。<br>
         * false 默认值。浏览器会显示一个标准的字体normal<br>
         * true 浏览器会显示小型大写字母的字体small-caps<br>
         * */
        _fontVariant: boolean;
        /**该属性用于设置显示元素的文本中所用的字体加粗。<br>
         * 数字值 400 相当于 关键字 normal，700 等价于 bold。<br>
         * 每个数字值对应的字体加粗必须至少与下一个最小数字一样细，而且至少与下一个最大数字一样粗。<br>
         * 注意：为方便，直接选两个值，加粗bold与默认normal
         * 默认为false
         * */
        _isBold: boolean;
        /**
         * font-size 属性可设置字体的尺寸。<br>
         * 该属性设置元素的字体大小。注意，实际上它设置的是字体中字符框的高度；实际的字符字形可能比这些框高或矮（通常会矮）。
         各关键字对应的字体必须比一个最小关键字相应字体要高，并且要小于下一个最大关键字对应的字体。<br>
         *
         * */
        _fontSize: number;
        /**
         * font-family 规定元素的字体系列<br>
         * font-family 可以把多个字体名称作为一个“回退”系统来保存。如果浏览器不支持第一个字体，则会尝试下一个。<br>
         * 也就是说，font-family 属性的值是用于某个元素的字体族名称或/及类族名称的一个优先表。浏览器会使用它可识别的第一个值。<br>
         *
         * */
        _fontFamily: string;
        /** 行间距，垂直距离 */
        _lineSpacing: number;
        /**  */
        _textMaxWidth: number;
        /**  */
        _textMaxHeight: number;
        /**  */
        constructor();
    }
}
declare module RM {
    /**
     * 文本类
     * @author
     *
     */
    class TextField extends RM.DisplayObject {
        private _TFP_properties;
        /**文本行列表*/
        private _$textLineList;
        /**
         * 文本类
         * @author
         *
         */
        constructor();
        setText(text: string): RM.TextField;
        /** textBaseline 属性设置或返回在绘制文本时的当前文本基线。<br>
         * top    文本基线是 em 方框的顶端。<br>
         * hanging    文本基线是悬挂基线。<br>
         * middle    文本基线是 em 方框的正中。<br>
         * ideographic    文本基线是表意基线。<br>
         * bottom    文本基线是 em 方框的底端。<br>
         * 参见：TextBaselineType
         * 默认为top <br>
         * */
        setTextBaseline(type: string): RM.TextField;
        /** textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式。<br>
         * start    默认。文本在指定的位置开始。<br>
         * end    文本在指定的位置结束。<br>
         * center    文本的中心被放置在指定的位置。<br>
         * left    文本左对齐。<br>
         * right    文本右对齐。<br>
         * 参见：TextAlignType
         * 默认为start <br>
         * */
        setTextAlign(type: string): RM.TextField;
        /** 颜色值，十六进制 */
        setTextColor(value: number): RM.TextField;
        /** 颜色值，十六进制 */
        setStrokeColor(value: number): RM.TextField;
        /** font-style 属性定义字体的风格<br>
         * normal    默认值。浏览器显示一个标准的字体样式。<br>
         * italic    浏览器会显示一个斜体的字体样式。<br>
         * oblique    浏览器会显示一个倾斜的字体样式。<br>
         * 参见TextFontStyleType
         * */
        setFontStyle(type: string): RM.TextField;
        /** 是否使用异体 <br>
         * font-variant 属性设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。<br>
         * false 默认值。浏览器会显示一个标准的字体normal<br>
         * true 浏览器会显示小型大写字母的字体small-caps<br>
         * */
        setFontVariant(value: boolean): RM.TextField;
        /**该属性用于设置显示元素的文本中所用的字体加粗。<br>
         * 数字值 400 相当于 关键字 normal，700 等价于 bold。<br>
         * 每个数字值对应的字体加粗必须至少与下一个最小数字一样细，而且至少与下一个最大数字一样粗。<br>
         * 注意：为方便，直接选两个值，加粗bold与默认normal
         * 默认为false
         * */
        setIsBold(value: boolean): RM.TextField;
        /**
         * font-size 属性可设置字体的尺寸。<br>
         * 该属性设置元素的字体大小。注意，实际上它设置的是字体中字符框的高度；实际的字符字形可能比这些框高或矮（通常会矮）。
         各关键字对应的字体必须比一个最小关键字相应字体要高，并且要小于下一个最大关键字对应的字体。<br>
         *
         * */
        setFontSize(value: number): RM.TextField;
        /**
         * font-family 规定元素的字体系列<br>
         * font-family 可以把多个字体名称作为一个“回退”系统来保存。如果浏览器不支持第一个字体，则会尝试下一个。<br>
         * 也就是说，font-family 属性的值是用于某个元素的字体族名称或/及类族名称的一个优先表。浏览器会使用它可识别的第一个值。<br>
         *
         * */
        setFontFamily(type: string): RM.TextField;
        /**
         * 设置是否启用镂空样式
         * */
        setIsStrokeText(value: boolean): RM.TextField;
        /**
         * 设置垂直距离的行间距
         * */
        setLineSpacing(value: number): RM.TextField;
        getText(): string;
        /** textBaseline 属性设置或返回在绘制文本时的当前文本基线。<br>
         * top    文本基线是 em 方框的顶端。<br>
         * hanging    文本基线是悬挂基线。<br>
         * middle    文本基线是 em 方框的正中。<br>
         * ideographic    文本基线是表意基线。<br>
         * bottom    文本基线是 em 方框的底端。<br>
         * 参见：TextBaselineType
         * 默认为top <br>
         * */
        getTextBaseline(): string;
        /** textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式。<br>
         * start    默认。文本在指定的位置开始。<br>
         * end    文本在指定的位置结束。<br>
         * center    文本的中心被放置在指定的位置。<br>
         * left    文本左对齐。<br>
         * right    文本右对齐。<br>
         * 参见：TextAlignType
         * 默认为start <br>
         * */
        getTextAlign(): string;
        /** 颜色值，十六进制 */
        getTextColor(): number;
        /** 颜色值，十六进制 */
        getStrokeColor(): number;
        /** font-style 属性定义字体的风格<br>
         * normal    默认值。浏览器显示一个标准的字体样式。<br>
         * italic    浏览器会显示一个斜体的字体样式。<br>
         * oblique    浏览器会显示一个倾斜的字体样式。<br>
         * 参见TextFontStyleType
         * */
        getFontStyle(): string;
        /** 是否使用异体 <br>
         * font-variant 属性设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。<br>
         * false 默认值。浏览器会显示一个标准的字体normal<br>
         * true 浏览器会显示小型大写字母的字体small-caps<br>
         * */
        getFontVariant(): boolean;
        /**该属性用于设置显示元素的文本中所用的字体加粗。<br>
         * 数字值 400 相当于 关键字 normal，700 等价于 bold。<br>
         * 每个数字值对应的字体加粗必须至少与下一个最小数字一样细，而且至少与下一个最大数字一样粗。<br>
         * 注意：为方便，直接选两个值，加粗bold与默认normal
         * 默认为false
         * */
        getIsBold(): boolean;
        /**
         * font-size 属性可设置字体的尺寸。<br>
         * 该属性设置元素的字体大小。注意，实际上它设置的是字体中字符框的高度；实际的字符字形可能比这些框高或矮（通常会矮）。
         各关键字对应的字体必须比一个最小关键字相应字体要高，并且要小于下一个最大关键字对应的字体。<br>
         *
         * */
        getFontSize(): number;
        /**
         * font-family 规定元素的字体系列<br>
         * font-family 可以把多个字体名称作为一个“回退”系统来保存。如果浏览器不支持第一个字体，则会尝试下一个。<br>
         * 也就是说，font-family 属性的值是用于某个元素的字体族名称或/及类族名称的一个优先表。浏览器会使用它可识别的第一个值。<br>
         *
         * */
        getFontFamily(): string;
        /**
         * 获得垂直距离的行间距
         *
         * */
        getLineSpacing(): number;
        /**
         * 可以按顺序设置如下属性：<br>
         font-style<br>
         font-variant<br>
         font-weight<br>
         font-size/line-height<br>
         font-family<br>
         * */
        getFontToString(): string;
        /**
         * 更新文本宽高
         * */
        private _updateTextSize();
        /**子类实现的渲染接口，子类在此接口调用自己的draw函数，以渲染到canvas*/
        _$render(renderContext: RM.RenderContext): void;
        _$draw(renderContext: RM.RenderContext): void;
        _$updateTransform(): void;
        /** 重写父类方法，计算真实边界 */
        _$realBounds(): RM.Rectangle;
    }
}
declare module RM {
    /**
     * @language zh_CN
     * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
     * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
     * @version Egret 2.4
     * @platform Web,Native
     */
    class Endian {
        /**
         * @language zh_CN
         * 表示多字节数字的最低有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static LITTLE_ENDIAN: string;
        /**
         * @language zh_CN
         * 表示多字节数字的最高有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static BIG_ENDIAN: string;
    }
    /**
     * @language zh_CN
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    class ByteArray {
        private static SIZE_OF_BOOLEAN;
        private static SIZE_OF_INT8;
        private static SIZE_OF_INT16;
        private static SIZE_OF_INT32;
        private static SIZE_OF_UINT8;
        private static SIZE_OF_UINT16;
        private static SIZE_OF_UINT32;
        private static SIZE_OF_FLOAT32;
        private static SIZE_OF_FLOAT64;
        private BUFFER_EXT_SIZE;
        private data;
        private _position;
        /**
         * @private
         */
        private write_position;
        /**
         * @language zh_CN
         * 更改或读取数据的字节顺序；egret.Endian.BIG_ENDIAN 或 egret.Endian.LITTLE_ENDIAN。
         * @default egret.Endian.BIG_ENDIAN
         * @version Egret 2.4
         * @platform Web,Native
         */
        endian: string;
        constructor(buffer?: ArrayBuffer);
        private _setArrayBuffer(buffer);
        buffer: ArrayBuffer;
        dataView: DataView;
        bufferOffset: number;
        /**
         * @language zh_CN
         * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
         * @version Egret 2.4
         * @platform Web,Native
         */
        position: number;
        /**
         * @language zh_CN
         * ByteArray 对象的长度（以字节为单位）。
         * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
         * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
         * @version Egret 2.4
         * @platform Web,Native
         */
        length: number;
        /**
         * @language zh_CN
         * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
         * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        bytesAvailable: number;
        /**
         * @language zh_CN
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。

         * @version Egret 2.4
         * @platform Web,Native
         */
        clear(): void;
        /**
         * @language zh_CN
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @return 如果字节不为零，则返回 true，否则返回 false
         * @version Egret 2.4
         * @platform Web,Native
         */
        readBoolean(): boolean;
        /**
         * @language zh_CN
         * 从字节流中读取带符号的字节
         * @return 介于 -128 和 127 之间的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readByte(): number;
        /**
         * @language zh_CN
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        /**
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @return 双精度（64 位）浮点数
         */
        readDouble(): number;
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @return 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readFloat(): number;
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 32 位整数
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readInt(): number;
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 16 位整数
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readShort(): number;
        /**
         * @language zh_CN
         * 从字节流中读取无符号的字节
         * @return 介于 0 和 255 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUnsignedByte(): number;
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 32 位整数
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUnsignedInt(): number;
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 16 位整数
         * @return 介于 0 和 65535 之间的 16 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUnsignedShort(): number;
        /**
         * @language zh_CN
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @return UTF-8 编码的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUTF(): string;
        /**
         * @language zh_CN
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length 指明 UTF-8 字节长度的无符号短整型数
         * @return 由指定长度的 UTF-8 字节组成的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUTFBytes(length: number): string;
        /**
         * @language zh_CN
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeBoolean(value: boolean): void;
        /**
         * @language zh_CN
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeByte(value: number): void;
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
        writeBytes(bytes: ByteArray, offset?: number, length?: number): void;
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeDouble(value: number): void;
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeFloat(value: number): void;
        /**
         * @language zh_CN
         * 在字节流中写入一个带符号的 32 位整数
         * @param value 要写入字节流的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeInt(value: number): void;
        /**
         * @language zh_CN
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value 32 位整数，该整数的低 16 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeShort(value: number): void;
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 32 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeUnsignedInt(value: number): void;
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 16 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.5
         * @platform Web,Native
         */
        writeUnsignedShort(value: number): void;
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeUTF(value: string): void;
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeUTFBytes(value: string): void;
        toString(): string;
        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        _writeUint8Array(bytes: Uint8Array, validateBuffer?: boolean): void;
        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        validate(len: number): boolean;
        /**********************/
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        private validateBuffer(len, needReplace?);
        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        private encodeUTF8(str);
        /**
         * @private
         *
         * @param data
         * @returns
         */
        private decodeUTF8(data);
        /**
         * @private
         *
         * @param code_point
         */
        private encoderError(code_point);
        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        private decoderError(fatal, opt_code_point?);
        /**
         * @private
         */
        private EOF_byte;
        /**
         * @private
         */
        private EOF_code_point;
        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        private inRange(a, min, max);
        /**
         * @private
         *
         * @param n
         * @param d
         */
        private div(n, d);
        /**
         * @private
         *
         * @param string
         */
        private stringToCodePoints(string);
    }
}
declare module RM {
    /**
     * 延迟调用函数，在下次渲染执行之前进行调用。
     * @author
     *
     */
    class DelayedCallback {
        private static _callbackFunctionList;
        private static _callbackThisObjectList;
        private static _callbackArgsList;
        /**
         * 添加延迟回调函数，在下次渲染执行之前进行回调
         * @param function 延迟函数
         * @param thisObject 延迟回调对象
         * @param args[] 延迟回调函数参数列表
         * */
        static delayCallback(fun: Function, thisObject: any, ...args: any[]): void;
        /**
         * 执行调用所有延迟函数，会清空延迟调用函数列表
         * */
        static doCallback(): void;
        /**
         * 清空延迟调用函数列表
         * */
        static clear(): void;
        constructor();
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class GFunction {
        constructor();
        /**获得自引擎运行以来走过的时间*/
        static getTimer(): number;
        /**角度转换为弧度*/
        static angle2radian(angle: number): number;
        /**弧度转换为角度*/
        static radian2angle(radian: number): number;
        /**颜色值转换，把数字值转换为16进制值*/
        static toColorString(value: number): string;
        /**获得变换矩形，经过仿射变换后的矩形
         * @param rect 需要进行仿射变换的矩形
         * @param matrix 仿射变换的值
         * @return bounds 返回经过变换后传进来的矩形
         * */
        static getTransformRectangle(rect: RM.Rectangle, matrix: RM.Matrix): RM.Rectangle;
        /**
         * 通过一个矩阵，返回某点在此矩阵上的坐标点
         * */
        static transformCoords(matrix: RM.Matrix, x: number, y: number): RM.Point;
    }
}
declare module RM {
    /**
     * 全局配置
     * @author Rich
     */
    class GlobalConfig {
        /** 缩放比例*/
        static TEXTURE_SCALE: number;
        static FRAME_RATE: number;
        static CANVAS_NAME: string;
        static ROOT_DIV_NAME: string;
        static CANVAS_DIV_NAME: string;
        static IS_OPEN_DIRTY: boolean;
        static RESPATH: string;
        constructor();
    }
}
declare module RM {
    /**
     * 日志
     * @author
     *
     */
    class Log {
        /**开启debug*/
        static OPEN_DEBUG: boolean;
        static STRING: string;
        constructor();
        /** 打印日志 */
        static print(...args: any[]): void;
        /**错误日志*/
        static warning(...args: any[]): void;
    }
}
declare module RM {
    /**
     *矩阵类
     * @author
     *
     */
    class Matrix {
        a: number;
        b: number;
        c: number;
        d: number;
        x: number;
        y: number;
        private static _PoolUtil;
        constructor();
        static create(a?: number, b?: number, c?: number, d?: number, x?: number, y?: number): RM.Matrix;
        static PoolUtil: RM.PoolUtil;
        /**释放**/
        release(): void;
        /**重置矩阵数据*/
        reset(): RM.Matrix;
        /**重置为指定值*/
        resetToValue(a?: number, b?: number, c?: number, d?: number, x?: number, y?: number): RM.Matrix;
        /**平移x，y像素*/
        translate(x: number, y: number): RM.Matrix;
        /**缩放，x、y轴方向缩放*/
        scale(scaleX: number, scaleY: number): RM.Matrix;
        /**旋转，单位是角度
         * 旋转矩阵（ cosA, sinA, -sinA, cosA, 0, 0）
         * */
        rotate(angle: number): RM.Matrix;
        /**切变，单位是角度
         * 切变矩阵 （ 1, tanAy, tanAx, 1, 0, 0）
         * */
        skew(angleX: number, angleY: number): RM.Matrix;
        /**矩阵左乘*/
        leftMultiply(a: number, b: number, c: number, d: number, x: number, y: number): RM.Matrix;
        /**矩阵右乘*/
        rightMultiply(a: number, b: number, c: number, d: number, x: number, y: number): RM.Matrix;
        /**逆矩阵*/
        invert(): RM.Matrix;
        /**拷贝矩阵，拷贝一个矩阵的数据到自己*/
        copyMatrix(matrix: RM.Matrix): RM.Matrix;
        /**转换矩阵操作，顺序为：缩放、切变、旋转、平移*/
        rightTransform(x: number, y: number, scaleX: number, scaleY: number, skewX: number, skewY: number, rotate: number, offX?: number, offY?: number): RM.Matrix;
        /**转换矩阵操作，顺序为：缩放、切变、旋转、平移*/
        leftTransform(x: number, y: number, scaleX: number, scaleY: number, skewX: number, skewY: number, rotate: number, offX?: number, offY?: number): RM.Matrix;
    }
}
declare module RM {
    /**
     * 二维空间中的点
     * @author
     *
     */
    class Point extends RM.HashObject {
        x: number;
        y: number;
        private static _PoolUtil;
        constructor();
        static create(x?: number, y?: number): RM.Point;
        static PoolUtil: RM.PoolUtil;
        /**释放**/
        release(): void;
        reset(): void;
        /**克隆，返回新的点，新的点为原点的副本*/
        clone(): RM.Point;
        /**重置为指定值*/
        resetToValue(x: number, y: number): RM.Point;
        /**重置为指定点*/
        resetToPoint(point: RM.Point): RM.Point;
        /**加法，不会创建新的值，返回自己*/
        add(point: RM.Point): RM.Point;
        /**减法，不会创建新的值，返回自己*/
        sub(point: RM.Point): RM.Point;
        /**乘法，不会创建新的值，返回自己*/
        mul(value: number): RM.Point;
        /**除法，不会创建新的值，返回自己*/
        div(value: number): RM.Point;
        /**确认是否相同的点*/
        equals(point: RM.Point): boolean;
        /**两点之间的距离*/
        distance(point: RM.Point): number;
        /**获得向量的长度*/
        lenght(): number;
        /**向量值是否为0*/
        isZero(): boolean;
        /**取反操作，相当于乘以-1*/
        negate(): RM.Point;
        /**绕指定点，旋转angle角度*/
        rotate(point: RM.Point, angle: number): RM.Point;
        /**限制当前点在指定的区域内，max及min，超过最大和最小值时，将设置为最大值和最小值*/
        clamp(max: RM.Point, min: RM.Point): RM.Point;
        /**获取自己到另一点的中点，返回新值*/
        pMidpoint(point: RM.Point): RM.Point;
        /**以字符串的形式输出*/
        toString(): string;
    }
}
/**
 * Created by Rich on 2015/10/22.
 *
 * 对象池，使用对象池的对象必须实现
 * public reset():void{}函数
 */
declare module RM {
    class PoolUtil extends RM.HashObject {
        private _poolList;
        private _poolClassName;
        static CLASSLIST: Array<any>;
        constructor(className: any);
        /**
         *
         *2015/10/22
         */
        getObject(): any;
        /**
         *
         *2015/10/22
         */
        release(object: any): void;
        getLength(): number;
        static toStringClassList(): string;
    }
}
declare module RM {
    /**
     * 缓存等待渲染的子项渲染到画布的指令，在当前帧渲染所有需要渲染的子项
     * @author
     *
     */
    class RenderCommand {
        static cmdPool: Array<RenderCommand>;
        callback: Function;
        thisObject: any;
        constructor();
        call(renderContext: RM.RenderContext): void;
        dispose(): void;
        static push(callback: Function, thisObject: any): void;
    }
}
declare module RM {
    /**
     * 渲染性能监测
     * @author
     *
     */
    class RenderPerformance extends RM.HashObject {
        private static _instance;
        private _isRun;
        private _renderCount;
        private _totalTime;
        private _tick;
        private _text;
        private _lastRect;
        constructor();
        static getInstance(): RM.RenderPerformance;
        isRun(): boolean;
        run(): void;
        addRenderCount(): void;
        addAdvancedTime(advancedtime: number): void;
        draw(renderContext: RM.RenderContext): void;
        /**
         *
         *2015/11/2
         */
        getRect(): RM.Rectangle;
    }
}
/**
 * Created by Rich on 2015/10/30.
 */
declare module RM {
    class JsonFrame extends RM.HashObject {
        private _x;
        private _y;
        private _w;
        private _h;
        private _filename;
        constructor(data: any);
        /**
         *
         *2015/10/30
         */
        static create(data: any): RM.JsonFrame;
        x: number;
        y: number;
        w: number;
        h: number;
        filename: string;
    }
}
/**
 * Created by Rich on 2015/10/30.
 */
declare module RM {
    class JsonMeta extends RM.HashObject {
        private _image;
        private _version;
        private _format;
        private _width;
        private _height;
        private _scale;
        constructor(data: any);
        /**
         *
         *2015/10/30
         */
        static create(data: any): RM.JsonMeta;
        image: string;
        version: string;
        format: string;
        width: number;
        height: number;
        scale: number;
    }
}
/**
 * Created by Rich on 2015/10/30.
 */
declare module RM {
    class JsonTextureFile extends RM.HashObject {
        private _meta;
        private _frames;
        private fileJson;
        private egretFileJson;
        private egretMCJson;
        constructor(data: any);
        /**
         *接收通过JSON处理后的纹理文件
         *2015/10/30
         */
        static create(data: any): RM.JsonTextureFile;
        /**
         *
         *15/10/31
         */
        private create(data);
        /**
         *TexturePacker导出的Json文件的详情信息
         *2015/10/30
         *Rich
         */
        meta: RM.JsonMeta;
        /**
         *TexturePacker导出的Json文件的资源信息列表
         *2015/10/30
         *Rich
         */
        frames: Array<RM.JsonFrame>;
        /**
         *通过纹理名字，获取JSON数据
         *2015/10/30
         */
        getJsonFrameformName(name: string): RM.JsonFrame;
        /**
         *解析JSON，转换为引擎支持的数据
         *15/10/31
         */
        private analyzing(data);
        /**
         *引擎解析
         *15/10/31
         */
        private fileJsonAnalyzing(data);
        /**
         *白鹭Json文件解析
         *15/10/31
         */
        private egretFileJsonAnalyzing(data);
    }
}
declare module RM {
    /**
     * 设备控制器，负责帧率及刷新
     * @author
     *
     */
    class DeviceContext extends RM.HashObject {
        constructor();
        executeMainLoop(callback: Function, thisObject: any): void;
        setFrameRate(frameRate: number): void;
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class H5DeviceContext extends RM.DeviceContext {
        static instance: RM.H5DeviceContext;
        static _callback: Function;
        static _thisObject: any;
        static requestAnimationFrame: Function;
        static cancelAnimationFrame: Function;
        private _time;
        constructor();
        executeMainLoop(callback: Function, thisObject: any): void;
        private enterFrame();
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class RenderLoopPhase {
        /**渲染初始阶段*/
        static DEFAULT_RENDER_PHASE: string;
        /**渲染的第一阶段，清理渲染区域*/
        static CLEAR_AREA_PHASE: string;
        /**渲染的第二阶段，刷新updateTransform*/
        static UPDATE_TRANSFORM_PHASE: string;
        /**渲染的第三阶段，draw*/
        static DRAW_PHASE: string;
        /**渲染的第四阶段，完成渲染*/
        static COMPLETE_PHASE: string;
        constructor();
    }
}
/**
 * Created by Rich on 15/10/20.
 */
declare module RM {
    class TouchContext extends RM.HashObject {
        /** 最后的点 **/
        private _lastTouchPoint;
        /** 最大触碰点 **/
        static MAX_TOUCHES: number;
        /** 触碰点的ID列表 **/
        private _identifierList;
        constructor();
        /**
         * 启动
         *15/10/20
         */
        run(): void;
        /**
         *
         *2015/10/21
         */
        private _dispatchTouchEvent(result, type, x, y, identifier);
        /**
         *当按下时触发
         *15/10/20
         */
        onTouchBegin(x: number, y: number, identifier: number): void;
        /**
         *当移动时触发,只有当按下去的时候才会触发移动事件，如拖动
         *2015/10/21
         */
        onTouchMove(x: number, y: number, identifier: number): void;
        /**
         *弹起时触发
         *2015/10/21
         */
        onTouchEnd(x: number, y: number, identifier: number): void;
        /**
         * 派发离开舞台事件
         *2015/10/21
         */
        onDispatchLeaveStageEvent(): void;
        /**
         *转换成舞台坐标，涉及舞台缩放参数
         *2015/11/5
         */
        private transformStagePoint(x, y);
    }
}
/**
 * Created by Administrator on 2015/10/16.
 */
declare module RM {
    /**
     * 触摸事件处理<br>
     *
     * */
    class H5TouchContext extends RM.TouchContext {
        /** ��̨��DIV **/
        private _rootDiv;
        constructor();
        /**
         *����
         *2015/10/16
         */
        run(): void;
        /**
         *侦听鼠标事件
         *2015/10/16
         */
        private addMouseEventListener();
        /**
         *侦听触摸事件
         *15/10/20
         */
        private addTouchEventListener();
        /**
         *按下
         *15/10/20
         */
        private _onTouchBegin(event);
        /**
         *弹起
         *15/10/20
         */
        private _onTouchEnd(event);
        /**
         *移动
         *15/10/20
         */
        private _onTouchMove(event);
        /**
         * 停止继续冒泡处理<br>
         *阻止特定事件的默认行为,如点击链接跳转
         *2015/10/21
         */
        private _eventPrevent(event);
        /**
         *获得在canvas上的坐标
         *2015/10/19
         */
        private _getLocalPoint(event);
        /**
         * 判断触碰点是否超出舞台
         *2015/10/21
         */
        private _isOutOfStage(event);
    }
}
declare module RM {
    /**
     *
     * @author
     *
     */
    class NetContext extends RM.HashObject {
        constructor();
        proceed(loader: RM.URLLoader): void;
    }
}
declare module RM {
    /**
     * 网络加载类，根据不同的类型进行加载数据
     * @author
     *
     */
    class H5NetContext extends RM.NetContext {
        constructor();
        proceed(loader: RM.URLLoader): void;
        private loadTexture(loader);
        /**
         * 加载完成
         *2015/10/28
         */
        private onComplete(XHR, loader);
        /**
         * 加载失败
         *2015/10/28
         */
        private onError(XHR);
    }
}
/**
 * Created by Rich on 2015/10/27.
 */
declare module RM {
    /**
     *引擎的XMLHttpRequest封装<br>
     *2015/10/27
     *Rich
     */
    class H5XMLHttpRequest extends RM.HashObject {
        /** 响应数据接收完成回调 **/
        private _onCompleteFunc;
        /** 响应数据接收完成回调参数列表 **/
        private _onCompleteFuncArgs;
        /** 响应数据接收错误时回调 **/
        private _onErrorFunc;
        /** 响应数据接收错误时回调参数列表 **/
        private _onErrorFuncArgs;
        /** XMLHttpRequest请求对象 **/
        private _XHR;
        /** thisObj接收完成回调的this对象 **/
        private _thisObj;
        constructor();
        /**
         * 创建
         *2015/10/27
         */
        static create(): RM.H5XMLHttpRequest;
        /** 服务器响应的文本内容 **/
        responseText: string;
        /** 服务器响应的BINARY内容 **/
        response: string;
        /** 服务器响应的XML内容对应的DOM对象 **/
        responseXML: any;
        /** 服务器返回的http状态码。200表示“成功”，404表示“未找到”，500表示“服务器内部错误”等。 **/
        status: number;
        /** 服务器返回状态的文本信息。 **/
        statusText: string;
        /**
         * 表示XMLHttpRequest对象的状态：<br>
         * 0：未初始化。对象已创建，未调用open；<br>
         * 1：open方法成功调用，但Sendf方法未调用；<br>
         * 2：send方法已经调用，尚未开始接受数据；<br>
         * 3：正在接受数据。Http响应头信息已经接受，但尚未接收完成；<br>
         * 4：完成，即响应数据接受完成。
         * **/
        readyState: number;
        /**
         * 获取一个XMLHttpRequest请求（兼容IE）
         *2015/10/27
         */
        private createXMLHttpRequest();
        /**
         *注册响应完成回调
         * 第一个参数为H5XMLHttpRequest，后续为传入的参数列表
         *2015/10/27
         */
        addCompleteFunc(thisObj: any, callFunc: Function, callFuncArgs?: Array<any>, errorFunc?: Function, errorFuncArgs?: Array<any>): void;
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
        open(httpMethod: string, url: string, asynch?: boolean, username?: string, password?: string): void;
        /**
         * 向服务器发出请求，如果采用异步方式，该方法会立即返回。
         * data可以指定为null表示不发送数据，其内容可以是DOM对象，输入流或字符串。
         *2015/10/27
         */
        send(data?: any): void;
        /**
         *停止当前http请求。对应的XMLHttpRequest对象会复位到未初始化的状态。
         *2015/10/27
         */
        abort(): void;
        /**
         *设置HTTP请求中的指定头部header的值为value.
         *此方法需在open方法以后调用，一般在post方式中使用。
         *2015/10/27
         */
        setRequestHeader(header: string, value: string): void;
        /**
         *返回包含Http的所有响应头信息，其中相应头包括Content-length,date,uri等内容。
         *返回值是一个字符串，包含所有头信息，其中每个键名和键值用冒号分开，每一组键之间用CR和LF（回车加换行符）来分隔！
         *2015/10/27
         */
        getAllResponseHeaders(): string;
        /**
         *返回HTTP响应头中指定的键名header对应的值
         *2015/10/27
         */
        getResponseHeader(header: string): string;
        /**
         *通过指定的RM.URLRequest与服务器端交互<br>
         *会先执行open再send方法。
         *2015/10/27
         */
        sendByURLRequest(request: RM.URLRequest, asynch?: boolean, username?: string, password?: string): void;
    }
}
declare module RM {
    /**
     * 渲染对象的基类，根据不同的环境有不同的渲染对象<br>
     * 因此作为接口
     * @author
     *
     */
    class RenderContext extends RM.HashObject {
        constructor();
        /**创建渲染对象*/
        static createRenderContext(): any;
        /**
         * 重复绘制image到画布，渲染类型可选renderType：<br>
         * （repeat：。该模式在水平和垂直方向重复。铺满画布<br>
         *  repeat-x：该模式只在水平方向重复。横向铺满<br>
         *  repeat-y：该模式只在垂直方向重复。纵向铺满<br>
         *  no-repeat 默认：该模式只显示一次（不重复）。）
         */
        drawImage(texture: RM.Texture, offsetX: number, offsetY: number, sourceW: number, sourceH: number, destX: number, destY: number, destW: number, destH: number, renderType?: string): void;
        /** 渲染文本 */
        drawText(text: string, x: number, y: number, maxWidth: number, isStrokeText: boolean): void;
        /** 设置渲染文本的样式 */
        setDrawTextStyle(font: string, textAlign: string, textBaseline: string, fillStyle: string, strokeStyle: string): void;
        /** 测量text宽度 */
        measureText(text: string): number;
        onResize(): void;
        onRenderStart(): void;
        /**渲染完毕，把渲染结果刷新到画布呈现*/
        onRenderFinish(): void;
        clearScene(): void;
        setTransform(matrix: RM.Matrix): void;
        setAlpha(alpha: number): void;
        /**
         * 压入遮罩矩形，调用此方法后，后续的绘制将以此矩形范围开始渲染
         * @param mask
         */
        pushMaskRect(mask: RM.Rectangle): void;
        /**
         * 从栈顶移除遮罩矩形，如果栈内还存在遮罩矩形，则继续以栈顶矩形渲染
         */
        popMaskRect(): void;
    }
}
declare module RM {
    /**
     *  渲染
     * @author
     *
     */
    class H5CanvasRender extends RM.RenderContext {
        /**渲染器*/
        private canvasContext;
        /**渲染控件*/
        private canvas;
        /**是否使用缓存渲染器*/
        private useCacheCanvas;
        /**缓存渲染控件*/
        private cacheCanvas;
        /**缓存渲染器*/
        private cacheCanvasContext;
        /**渲染器代表*/
        private drawCanvasContext;
        /** 创建渲染器，默认情况下使用双层渲染器，即缓存渲染器。<br>
         * 缓存渲染器完成所有的显示对象的渲染，渲染完毕后，<br>
         * canvasContext在舞台中的渲染器将会把缓存渲染器绘制到舞台。<br>
         * 缓存渲染器不会直接显示在舞台中。
         *
         *  */
        constructor(canvas?: any, useCacheCanvas?: boolean);
        private createCanvasRender();
        onResize(): void;
        drawImage(texture: Texture, offsetX: number, offsetY: number, sourceW: number, sourceH: number, destX: number, destY: number, destW: number, destH: number, renderType?: string): void;
        static createRenderContext(canvas?: any, useCacheCanvas?: boolean): any;
        onRenderStart(): void;
        /**渲染完毕，把渲染结果刷新到画布呈现*/
        onRenderFinish(): void;
        /**清除需要渲染的指定区域列表的像素*/
        clearScene(): void;
        /**清除指定区域的像素(清除的是显示在舞台中的canvasContext的区域，而非cacheCanvasContext)*/
        private clearRect(x, y, width, height);
        setTransform(matrix: RM.Matrix): void;
        setAlpha(alpha: number): void;
        drawText(text: string, x: number, y: number, maxWidth?: number, isStrokeText?: boolean): void;
        /** 设置渲染文本的样式 */
        setDrawTextStyle(font: string, textAlign: string, textBaseline: string, fillStyle: string, strokeStyle: string): void;
        /** 测量text宽度 */
        measureText(text: string): number;
        /**
         * 压入遮罩矩形，调用此方法后，后续的绘制将以此矩形范围开始渲染
         * @param mask
         */
        pushMaskRect(mask: RM.Rectangle): void;
        /**
         * 从栈顶移除遮罩矩形，如果栈内还存在遮罩矩形，则继续以栈顶矩形渲染
         */
        popMaskRect(): void;
    }
}
declare module RM {
    /**
     * 渲染过滤器，计算和需要渲染的矩形范围
     * @author
     *
     */
    class RenderFilter extends RM.HashObject {
        private static _instance;
        /**需要渲染的区域矩形列表*/
        private _drawAreaList;
        private _isFullScreenRender;
        constructor();
        static getInstance(): RM.RenderFilter;
        /**添加重绘区域*/
        addDrawArea(area: RM.Rectangle): void;
        _addArea(area: RM.Rectangle): void;
        /**
         * 是否达到全屏渲染
         * @returns {boolean}
         */
        isFullScreenRender: boolean;
        /**清除重绘列表*/
        clearDrawList(): void;
        /**
         *只有在计算脏矩形区域后才可使用
         *15/10/26
         */
        getDefaultDrawAreaList(): Array<RM.Rectangle>;
        /**
         *在引擎渲染阶段对比
         *15/10/26
         */
        isHasDrawAreaList(rect: RM.Rectangle): boolean;
        /**
         *排除相互包含的矩形区域，减少渲染区域次数。<br>
         *并合并相交矩形。
         *2015/11/5
         */
        clearContainsRect(): void;
        /**
         * 从大到小排序
         *2015/11/5
         */
        private sortFunc(a, b);
        /**
         *根据合并后的多余面积的大小来次序，<br>
         *优先合并相近的矩形。<br>
         *采用三分矩形算法，超过三个矩形则合并。
         *2015/11/12
         */
        private mergeDirtyRect(list);
    }
}
declare module RM {
    /**
     *textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式
     * @author
     *
     */
    class TextAlignType {
        /** 文本在指定的位置开始,默认*/
        static START: string;
        /** 文本在指定的位置结束 */
        static END: string;
        /** 文本的中心被放置在指定的位置 */
        static CENTER: string;
        /** 文本左对齐*/
        static LEFT: string;
        /** 文本右对齐 */
        static RIGHT: string;
        constructor();
    }
}
declare module RM {
    /**
     *textBaseline 属性设置或返回在绘制文本时的当前文本基线
     * @author
     *
     */
    class TextBaselineType {
        /** 文本基线是 em 方框的顶端 引擎默认*/
        static TOP: string;
        /** 文本基线是悬挂基线 */
        static HANGING: string;
        /** 文本基线是 em 方框的正中 */
        static MIDDLE: string;
        /** 文本基线是表意基线 */
        static IDEOGRAPHIC: string;
        /** 文本基线是 em 方框的底端 */
        static BOTTOM: string;
        /** 文本基线是普通的字母基线，H5中默认是这个 */
        static ALPHABETIC: string;
        constructor();
    }
}
declare module RM {
    /**
     *font-style 属性定义字体的风格。
     * @author
     *
     */
    class TextFontStyleType {
        /** 默认值。浏览器显示一个标准的字体样式*/
        static NORMAL: string;
        /** 浏览器会显示一个斜体的字体样式 */
        static ITALIC: string;
        /** 浏览器会显示一个倾斜的字体样式 */
        static OBLIQUE: string;
        constructor();
    }
}
