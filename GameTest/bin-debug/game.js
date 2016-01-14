///<reference path="../lib/engine.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball() {
        _super.call(this);
        this.speedX = 10;
        this.speedY = 10;
        this.addEventListener(RM.Event.REMOVE_FORM_STAGE, this.dispose, this);
    }
    Ball.prototype.init = function () {
        this.speedX *= Math.random();
        this.speedY *= Math.random();
        var texx = RM.Texture.getTexture("resource/sb.png");
        RM.Bitmap.create(texx).addTo(this);
    };
    Ball.prototype.update = function () {
        var rect = RM.StageViewPort.getInstance().getRect();
        var w = rect.getMaxX() - this.getWidth();
        var h = rect.getMaxY() - this.getHeight();
        if (this.getX() > w || this.getX() < rect.getMinX())
            this.speedX *= -1;
        if (this.getY() > h || this.getY() < rect.getMinY())
            this.speedY *= -1;
        this.setPoint(this.getX() + this.speedX, this.getY() + this.speedY);
    };
    Ball.prototype.dispose = function (event) {
        this.removeEventListener(RM.Event.REMOVE_FORM_STAGE, this.dispose, this);
        RM.Log.print("remove countID:" + this.hasCount);
    };
    return Ball;
})(RM.Sprite);
/**
 * 启动引擎，设置舞台及引擎数据初始化<br>
 * 执行user自定义主文件
 * @author
 *
 */
var Main = (function () {
    function Main() {
    }
    Main.prototype.onInitEngine = function () {
        RM.StageViewPort.getInstance().setStageSize(480, 800);
        RM.StageViewPort.getInstance().onFullScreen(true);
        RM.StageViewPort.getInstance().setStageBackgroundColor("#ffffff");
        var stage = new RM.Stage();
        RM.MainContext.getInstance().stage = stage;
    };
    Main.prototype.onStartPort = function () {
        RM.MainContext.getInstance().run();
        RM.RenderPerformance.getInstance().run();
        RM.MainContext.getInstance().stage.addChild(new Test5());
    };
    return Main;
})();
var Test = (function (_super) {
    __extends(Test, _super);
    function Test() {
        _super.call(this);
        this.posx = 0;
        this.posy = 0;
        this.ballArr = [];
        this.speedX = Math.random() * 10;
        this.addEventListener(RM.Event.ADD_TO_STAGE, this.addStage, this);
    }
    Test.prototype.addStage = function (event) {
        this.removeEventListener(RM.Event.ADD_TO_STAGE, this.addStage, this);
        RM.Res.loadGroup(["resource/boom.json",
            "resource/boom.png",
            "resource/sb.png",
            "resource/syebg.jpg"
        ], this.onComplete, this);
    };
    Test.prototype.onComplete = function (event) {
        if (!event.isComplete)
            return;
        this._rect1 = RM.StageViewPort.getInstance().getRect();
        this.bg = new RM.Sprite();
        RM.Bitmap.create(RM.Texture.getTexture("resource/syebg.jpg")).addTo(this.bg);
        RM.Bitmap.create(RM.Texture.getTexture("resource/syebg.jpg")).addTo(this.bg)
            .setY(-800);
        this.addChild(this.bg);
        this.init1();
        this.init2();
    };
    Test.prototype.init1 = function () {
        var loader = new RM.URLLoader();
        loader.dataFormat = RM.URLLoaderDataFormat.TEXTURE;
        loader.addEventListener(RM.Event.COMPLETE, this.callback, this);
        for (var idx = 0; idx < 1; idx++) {
            loader.load(new RM.URLRequest("resource/hr.png"));
        }
    };
    Test.prototype.init2 = function () {
        var ball;
        var rect = RM.StageViewPort.getInstance().getRect();
        for (var idx = 0; idx < 10; idx++) {
            ball = new Ball();
            ball.setPoint(Math.random() * (rect.width - 50), Math.random() * (rect.height - 50));
            this.ballArr.push(ball);
            this.addChild(ball);
            ball.init();
        }
        this.addEventListener(RM.Event.ENTER_FRAME, this.enterFrame, this);
    };
    Test.prototype.callback = function (event) {
        var text = new RM.TextField();
        text.setText("守夜人的荣耀\n守夜人的荣耀啊哈哈哈");
        text.setFontSize(16);
        text.setX(100);
        text.setY(100);
        this.addChild(text);
    };
    Test.prototype.enterFrame = function (dt) {
        var len = this.ballArr.length;
        var ball;
        for (var idx = 0; idx < len; idx++) {
            ball = this.ballArr[idx];
            ball.update();
        }
        var h = this.bg.getHeight() / 2;
        if (this.bg.getY() > h || this.bg.getY() < 0)
            this.speedX *= -1;
        this.bg.setY(this.bg.getY() + this.speedX);
    };
    return Test;
})(RM.DisplayObjectContainer);
var Test1 = (function (_super) {
    __extends(Test1, _super);
    function Test1() {
        _super.call(this);
        this.num = 100;
        this._isTouchDown = false;
        this._speed = 0;
        this.addEventListener(RM.Event.ADD_TO_STAGE, this.addStage, this);
    }
    Test1.prototype.addStage = function (event) {
        this.removeEventListener(RM.Event.ADD_TO_STAGE, this.addStage, this);
        RM.Res.loadGroup(["resource/boom.json",
            "resource/boom.png",
            "resource/syebg.jpg",
            "resource/sb.png"
        ], this.onComplete, this);
    };
    Test1.prototype.onComplete = function (event) {
        if (!event.isComplete)
            return;
        var sp = new RM.Sprite();
        var bitmap = RM.Bitmap.create(RM.Texture.getTexture("resource/syebg.jpg"));
        sp.addChild(bitmap);
        this.addChild(sp);
        for (var idx = 0; idx < 10; idx++) {
            var ball = new Ball();
            ball.setPoint(Math.random() * 400, Math.random() * 500);
            ball.init();
            sp.addChild(ball);
        }
        this._ball = new Ball();
        this._ball.setPoint(Math.random() * 400, Math.random() * 500);
        this.addChild(this._ball);
        this._ball.init();
        this._ball.setTouchEnabled(true);
        this.addEventListener(RM.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
        this.addEventListener(RM.TouchEvent.TOUCH_MOVE, this.onMove, this);
        this.addEventListener(RM.TouchEvent.TOUCH_END, this.onEnd, this);
        this.addEventListener(RM.Event.ENTER_FRAME, this.update, this);
    };
    Test1.prototype.onBegin = function (event) {
        this._isTouchDown = true;
        this._speed = 0;
    };
    Test1.prototype.onMove = function (event) {
        var point = event.getLocalPoint();
        this._ball.setPoint(point.x - this._ball.getWidth() / 2, point.y - this._ball.getHeight() / 2);
        point.release();
    };
    Test1.prototype.onEnd = function (event) {
        this._isTouchDown = false;
    };
    Test1.prototype.update = function (num) {
        if (this._isTouchDown)
            return;
        var y = this._ball.getY() + this._ball.getHeight();
        if (y > 0 && y < RM.StageViewPort.getInstance().stageViewProtH) {
            this._speed += 0.5;
            this._ball.setY(this._ball.getY() + this._speed);
        }
        else {
            this._speed = 0;
            this._ball.setY(RM.StageViewPort.getInstance().stageViewProtH - this._ball.getHeight());
        }
    };
    return Test1;
})(RM.DisplayObjectContainer);
var Test2 = (function (_super) {
    __extends(Test2, _super);
    function Test2() {
        _super.call(this);
        this.addEventListener(RM.Event.ADD_TO_STAGE, this.init, this);
    }
    Test2.prototype.init = function (event) {
        RM.Res.loadGroup(["resource/boom.json",
            "resource/boom.png",
            "resource/bg.png",
            "resource/bg.json",
            "resource/bg2.png",
            "resource/bg2.json"
        ], this.onComplete, this);
    };
    Test2.prototype.onComplete = function (event) {
        if (event.isComplete) {
            var tex = RM.Texture.getTexture("resource/bg.png");
            var obj = RM.JsonAnalyzer.getJsonAnalyzer("resource/bg.json");
            var spriteSheet = RM.SpriteSheet.create(tex, obj.getJsonTextureFile());
            var texx = spriteSheet.getTexture("pingyuanjinjing");
            this.addChild(RM.Bitmap.create(texx));
            var tex2 = RM.Texture.getTexture("resource/bg2.png");
            var obj2 = RM.JsonAnalyzer.getJsonAnalyzer("resource/bg2.json");
            var spriteSheet2 = RM.SpriteSheet.create(tex2, obj2.getJsonTextureFile());
            var texx2 = spriteSheet2.getTexture("chengshijinjing");
            RM.Bitmap.create(texx2).addTo(this).setY(texx._bitmapH + 50);
        }
    };
    return Test2;
})(RM.DisplayObjectContainer);
var Test3 = (function (_super) {
    __extends(Test3, _super);
    function Test3() {
        _super.call(this);
        this.addEventListener(RM.Event.ADD_TO_STAGE, this.init, this);
    }
    Test3.prototype.init = function (event) {
        this.removeEventListener(RM.Event.ADD_TO_STAGE, this.init, this);
        RM.Res.loadGroup(["resource/rectangle.png",
            "resource/rect_xu.png",
            "resource/syebg.jpg",
            "resource/zuobiao.png"
        ], this.onComplete, this);
    };
    Test3.prototype.onComplete = function (res) {
        if (!res.isComplete)
            return;
        var sp = new RM.Sprite();
        sp.addTo(this)
            .setPoint(240, 400);
        RM.Bitmap.create(RM.Texture.getTexture("resource/zuobiao.png"))
            .addTo(this);
        RM.Bitmap.create(RM.Texture.getTexture("resource/rect_xu.png"))
            .addTo(this)
            .setPoint(240, 400);
        RM.Bitmap.create(RM.Texture.getTexture("resource/rect_xu.png"))
            .addTo(this)
            .setScaleX(0.5)
            .setScaleY(0.5)
            .setPoint(240, 400);
        RM.Bitmap.create(RM.Texture.getTexture("resource/rectangle.png"))
            .addTo(sp)
            .setSkewX(30)
            .setSkewY(30);
        RM.Bitmap.create(RM.Texture.getTexture("resource/rectangle.png"))
            .addTo(sp)
            .setRotate(30)
            .setScaleX(0.5)
            .setScaleY(0.5);
    };
    return Test3;
})(RM.DisplayObjectContainer);
/**
 * Created by Rich on 2015/12/15.
 */
var Test4 = (function (_super) {
    __extends(Test4, _super);
    function Test4() {
        _super.call(this);
        this.addEventListener(RM.Event.ADD_TO_STAGE, this.onAddstage, this);
    }
    Test4.prototype.onAddstage = function (event) {
        this.removeEventListener(RM.Event.ADD_TO_STAGE, this.onAddstage, this);
        RM.Res.loadGroup([
            "resource/bg.png",
            "resource/bg.json"
        ], this.oncomplete, this);
    };
    Test4.prototype.oncomplete = function (item) {
        if (item.isComplete == false)
            return;
        var ss = RM.SpriteSheet.createByUrl("resource/bg.png", "resource/bg.json");
        this.sp = new RM.Sprite();
        this.sp.addTo(this);
        RM.Bitmap.create(ss.getTexture("pingyuanjinjing")).addTo(this.sp);
        this.setTouchEnabled(true);
        this.addEventListener(RM.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
        this.addEventListener(RM.TouchEvent.TOUCH_END, this.onEnd, this);
        this.setScrollRect(RM.Rectangle.create(0, 0, 200, 200));
    };
    Test4.prototype.onBegin = function (event) {
        if (this.sp.getScrollRect()) {
            this.sp.setScrollRect(null);
            this.sp.setPoint(0, 0);
        }
        else {
            this.sp.setScrollRect(RM.Rectangle.create(30, 0, 100, 50));
            this.sp.setPoint(100, 100);
            this.sp.setRotate(30);
        }
    };
    Test4.prototype.onEnd = function (event) {
    };
    return Test4;
})(RM.DisplayObjectContainer);
var Test5 = (function (_super) {
    __extends(Test5, _super);
    function Test5() {
        _super.call(this);
        this.list1 = ["walk-", "stand-"];
        this.list2 = ["l", "r", "ru", "lu", "rd", "ld", "u", "d"];
        this.addEventListener(RM.Event.ADD_TO_STAGE, this.addStage, this);
    }
    Test5.prototype.addStage = function (event) {
        this.removeEventListener(RM.Event.ADD_TO_STAGE, this.addStage, this);
        RM.Res.loadGroup(["resource/jianke.json",
            "resource/jianke.png",
        ], this.onComplete, this);
    };
    Test5.prototype.onComplete = function (event) {
        if (!event.isComplete)
            return;
        var tex = RM.Texture.getTexture("resource/jianke.png");
        var obj = RM.JsonAnalyzer.getJsonAnalyzer("resource/jianke.json");
        var spriteSheet = RM.SpriteSheet.create(tex, obj.getJsonTextureFile());
        var len = 300;
        var posy = 0;
        var posx = 0;
        for (var idx = 0; idx < len; idx++) {
            this.mc = new RM.MovieClip(spriteSheet);
            this.mc.setPlayLable(this.randomAction(), 0.2);
            this.mc.play();
            this.mc.setTouchEnabled(true);
            this.mc.setPoint(posx, posy).addTo(this);
            var value = idx % 30;
            if (idx != 0 && value == 0) {
                posy += 100;
                posx = 0;
            }
            else {
                posx += 50;
            }
        }
        this.addEventListener(RM.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
        this.addEventListener(RM.TouchEvent.TOUCH_END, this.onEnd, this);
    };
    Test5.prototype.onBegin = function (event) {
        event._target.setPlayLable(this.randomAction(), 0.2);
    };
    Test5.prototype.onEnd = function (event) {
    };
    Test5.prototype.randomAction = function () {
        var str = "";
        var value = Math.round(Math.random() * (this.list1.length - 1));
        str = this.list1[value];
        value = Math.round(Math.random() * (this.list2.length - 1));
        str += this.list2[value];
        return str;
    };
    return Test5;
})(RM.DisplayObjectContainer);

//# sourceMappingURL=game.js.map
