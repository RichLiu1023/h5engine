///<reference path="../lib/engine.d.ts"/>

class Ball extends RM.Sprite {

	speedX:number = 10;
	speedY:number = 10;

	public constructor() {
		super();
		this.addEventListener( RM.Event.REMOVE_FORM_STAGE, this.dispose, this );
	}

	public init():void {

		this.speedX *= Math.random();
		this.speedY *= Math.random();

		//var tex:RM.Texture = RM.Texture.getTexture("resource/boom.png");
		//var obj:RM.JsonAnalyzer = RM.JsonAnalyzer.getJsonAnalyzer("resource/boom.json");
		//var spriteSheet:RM.SpriteSheet = RM.SpriteSheet.create(tex, obj.getJsonTextureFile());

		var texx:RM.Texture = RM.Texture.getTexture( "resource/sb.png" );//spriteSheet.getTexture("BM01");
		RM.Bitmap.create( texx ).addTo( this );
	}

	public update():void {
		var rect:RM.Rectangle = RM.StageViewPort.getInstance().getRect();
		var w:number = rect.getMaxX() - this.getWidth();
		var h:number = rect.getMaxY() - this.getHeight();
		if ( this.getX() > w || this.getX() < rect.getMinX() ) this.speedX *= -1;
		if ( this.getY() > h || this.getY() < rect.getMinY() ) this.speedY *= -1;
		this.setPoint( this.getX() + this.speedX, this.getY() + this.speedY );
	}

	public dispose( event:RM.Event ):void {
		this.removeEventListener( RM.Event.REMOVE_FORM_STAGE, this.dispose, this );
		RM.Log.print( "remove countID:" + this.hasCount );
	}
}
