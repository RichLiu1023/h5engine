/**
 *
 * 文件加载
 *
 * Created by Rich on 2015/10/28.
 */
class Test2 extends RM.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(RM.Event.ADD_TO_STAGE, this.init, this);
    }

    /**
     *
     *2015/10/28
     */
    private init(event:RM.Event):void {

        RM.Res.loadGroup(["resource/boom.json",
            "resource/boom.png",
            "resource/bg.png",
            "resource/bg.json",
            "resource/bg2.png",
            "resource/bg2.json"
        ],this.onComplete,this);
    }

    /**
     *
     *2015/10/28
     */
    private onComplete(event:RM.ResGroupItem):void {
        if( event.isComplete )
        {
            //var tex:RM.Texture = RM.Texture.getTexture("resource/boom.png");
            //var obj:RM.JsonAnalyzer = RM.JsonAnalyzer.getJsonAnalyzer("resource/boom.json");
            //var spriteSheet:RM.SpriteSheet = RM.SpriteSheet.create(tex,obj.getJsonTextureFile());
            //
            //var texx:RM.Texture = spriteSheet.getTexture("BM14");
            //this.addChild(RM.Bitmap.create(texx));

            var tex:RM.Texture = RM.Texture.getTexture("resource/bg.png");
            var obj:RM.JsonAnalyzer = RM.JsonAnalyzer.getJsonAnalyzer("resource/bg.json");
            var spriteSheet:RM.SpriteSheet = RM.SpriteSheet.create(tex,obj.getJsonTextureFile());

            var texx:RM.Texture = spriteSheet.getTexture("pingyuanjinjing");
            this.addChild(RM.Bitmap.create(texx));

            var tex2:RM.Texture = RM.Texture.getTexture("resource/bg2.png");
            var obj2:RM.JsonAnalyzer = RM.JsonAnalyzer.getJsonAnalyzer("resource/bg2.json");
            var spriteSheet2:RM.SpriteSheet = RM.SpriteSheet.create(tex2,obj2.getJsonTextureFile());

            var texx2:RM.Texture = spriteSheet2.getTexture("chengshijinjing");
            RM.Bitmap.create(texx2).addTo(this).setY(texx._bitmapH+50);
        }
    }

}