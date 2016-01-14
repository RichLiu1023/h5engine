/**
 * Created by Rich on 2015/12/15.
 */

//测试滚动矩形，遮罩矩形
class Test4 extends RM.DisplayObjectContainer {
	public constructor() {
		super();
		this.addEventListener( RM.Event.ADD_TO_STAGE, this.onAddstage, this )
	}

	public onAddstage( event:RM.Event ):void {
		this.removeEventListener( RM.Event.ADD_TO_STAGE, this.onAddstage, this );
		RM.Res.loadGroup( [
			"resource/bg.png",
			"resource/bg.json"
		], this.oncomplete, this );
	}

	private sp:RM.Sprite;

	public oncomplete( item:RM.ResGroupItem ):void {
		if ( item.isComplete == false )return;
		var ss:RM.SpriteSheet = RM.SpriteSheet.createByUrl( "resource/bg.png", "resource/bg.json" );
		this.sp = new RM.Sprite();
		this.sp.addTo( this );
		RM.Bitmap.create( ss.getTexture( "pingyuanjinjing" ) ).addTo( this.sp );
		this.setTouchEnabled( true );
		this.addEventListener( RM.TouchEvent.TOUCH_BEGIN, this.onBegin, this );
		this.addEventListener( RM.TouchEvent.TOUCH_END, this.onEnd, this );

		this.setScrollRect(RM.Rectangle.create(0,0,200,200));
	}

	public onBegin( event:RM.TouchEvent ):void {
		if ( this.sp.getScrollRect() ) {
			this.sp.setScrollRect( null );
			this.sp.setPoint( 0, 0 );
		}
		else {
			this.sp.setScrollRect( RM.Rectangle.create( 30, 0, 100, 50 ) );
			this.sp.setPoint( 100, 100 );
			this.sp.setRotate( 30 );
		}
	}

	public onEnd( event:RM.TouchEvent ):void {
	}
}