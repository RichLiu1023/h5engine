/**
 *
 * 拖动的方块
 * Created by Rich on 2015/10/21.
 */
class Test1 extends RM.DisplayObjectContainer {
	private _ball:Ball;

	public constructor() {
		super();
		this.addEventListener( RM.Event.ADD_TO_STAGE, this.addStage, this );
	}

	/**
	 *
	 *15/10/22
	 */
	private addStage( event:RM.Event ):void {
		this.removeEventListener( RM.Event.ADD_TO_STAGE, this.addStage, this );
		RM.Res.loadGroup( [ "resource/boom.json",
			"resource/boom.png",
			"resource/syebg.jpg",
			"resource/sb.png"
		], this.onComplete, this );
	}

	/**
	 *
	 *2015/10/21
	 */
	private onComplete( event:RM.ResGroupItem ):void {
		if ( ! event.isComplete )return;
		var sp:RM.Sprite = new RM.Sprite();
		var bitmap:RM.Bitmap = RM.Bitmap.create( RM.Texture.getTexture( "resource/syebg.jpg" ) );
		sp.addChild( bitmap );
		this.addChild( sp );
		for ( var idx = 0; idx < 10; idx ++ ) {
			var ball:Ball = new Ball();
			ball.setPoint( Math.random() * 400, Math.random() * 500 );
			ball.init();
			sp.addChild( ball );
		}
		//sp.setCacheAsBitmap( true );

		this._ball = new Ball();
		this._ball.setPoint( Math.random() * 400, Math.random() * 500 );
		this.addChild( this._ball );
		//this._ball.setScaleX(0.5);
		//this._ball.setRotate(30);
		this._ball.init();
		this._ball.setTouchEnabled( true );
		this.addEventListener( RM.TouchEvent.TOUCH_BEGIN, this.onBegin, this );
		this.addEventListener( RM.TouchEvent.TOUCH_MOVE, this.onMove, this );
		this.addEventListener( RM.TouchEvent.TOUCH_END, this.onEnd, this );
		this.addEventListener( RM.Event.ENTER_FRAME, this.update, this );
	}

	private num:number = 100;

	/**
	 *
	 *2015/10/21
	 */
	private onBegin( event:RM.TouchEvent ):void {
		this._isTouchDown = true;
		this._speed = 0;
	}

	/**
	 *
	 *2015/10/21
	 */
	private onMove( event:RM.TouchEvent ):void {
		var point:RM.Point = event.getLocalPoint();
		this._ball.setPoint( point.x - this._ball.getWidth() / 2, point.y - this._ball.getHeight() / 2 );
		point.release();
	}

	/**
	 *
	 *2015/10/21
	 */
	private onEnd( event:RM.TouchEvent ):void {
		this._isTouchDown = false;
	}

	private _isTouchDown:boolean = false;
	private _speed:number = 0;

	/**
	 *
	 *2015/10/21
	 */
	private update( num:number ):void {
		if ( this._isTouchDown ) return;
		var y:number = this._ball.getY() + this._ball.getHeight();
		if ( y > 0 && y < RM.StageViewPort.getInstance().stageViewProtH ) {
			this._speed += 0.5;
			this._ball.setY( this._ball.getY() + this._speed );
		}
		else {
			this._speed = 0;
			this._ball.setY( RM.StageViewPort.getInstance().stageViewProtH - this._ball.getHeight() );
		}
	}
}
