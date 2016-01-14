/**
 * 运动的方块
 * @author
 *
 */
class Test extends RM.DisplayObjectContainer {
	private posx:number = 0;
	private posy:number = 0;
	private _sp1:RM.Sprite;
	private _sp2:RM.Sprite;
	private _rect1:RM.Rectangle;

	public constructor() {
		super();
		this.addEventListener( RM.Event.ADD_TO_STAGE, this.addStage, this );
	}

	public addStage( event:RM.Event ):void {
		this.removeEventListener( RM.Event.ADD_TO_STAGE, this.addStage, this );
		RM.Res.loadGroup( [ "resource/boom.json",
			"resource/boom.png",
			"resource/sb.png",
			"resource/syebg.jpg"
		], this.onComplete, this );
	}

	private bg:RM.Sprite;

	/**
	 *
	 *2015/10/21
	 */
	private onComplete( event:RM.ResGroupItem ):void {
		if ( !event.isComplete )return;
		this._rect1 = RM.StageViewPort.getInstance().getRect();
		this.bg = new RM.Sprite();
		RM.Bitmap.create( RM.Texture.getTexture( "resource/syebg.jpg" ) ).addTo( this.bg );
		RM.Bitmap.create( RM.Texture.getTexture( "resource/syebg.jpg" ) ).addTo( this.bg )
			.setY( -800 );
		this.addChild( this.bg );
		this.init1();
		this.init2();
	}

	private init1():void {
		var loader:RM.URLLoader = new RM.URLLoader();
		loader.dataFormat = RM.URLLoaderDataFormat.TEXTURE;
		loader.addEventListener( RM.Event.COMPLETE, this.callback, this );
		for ( var idx:number = 0; idx < 1; idx++ ) {
			loader.load( new RM.URLRequest( "resource/hr.png" ) );
		}
	}

	private ballArr:Array<Ball> = [];

	private init2():void {
		var ball:Ball;
		var rect = RM.StageViewPort.getInstance().getRect();
		for ( var idx:number = 0; idx < 10; idx++ ) {
			ball = new Ball();
			ball.setPoint( Math.random() * ( rect.width - 50),
				Math.random() * ( rect.height - 50) );
			//if ( Math.random() > 0.5 ) {
			//	this.ballArr.push( ball );
			//}
			this.ballArr.push( ball );
			//ball.setRotate(120);
			//ball.setSkewX(50);
			//ball.setScaleX(1.6);
			//ball.setAlpha( Math.random() );
			this.addChild( ball );
			ball.init();
		}
		this.addEventListener( RM.Event.ENTER_FRAME, this.enterFrame, this );
	}

	private callback( event:RM.Event ):void {
		var text:RM.TextField = new RM.TextField();
		text.setText( "守夜人的荣耀\n守夜人的荣耀啊哈哈哈" );
		text.setFontSize( 16 );
		text.setX( 100 );
		text.setY( 100 );
		this.addChild( text );
	}

	private speedX = Math.random() * 10;

	private enterFrame( dt:number ):void {
		var len:number = this.ballArr.length;
		var ball:Ball;
		for ( var idx:number = 0; idx < len; idx++ ) {
			ball = this.ballArr[ idx ];
			ball.update();
		}
		var h:number = this.bg.getHeight() / 2;
		if ( this.bg.getY() > h || this.bg.getY() < 0 ) this.speedX *= -1;
		this.bg.setY( this.bg.getY() + this.speedX );
	}
}
