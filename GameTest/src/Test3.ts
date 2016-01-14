/**
 * 矩阵操作
 * Created by Rich on 2015/11/16.
 */
class Test3 extends RM.DisplayObjectContainer {
	public constructor() {
		super();
		this.addEventListener( RM.Event.ADD_TO_STAGE, this.init, this );
	}
	
	/**
	 *
	 *2015/11/16
	 */
	public init( event:RM.Event ):void {
		this.removeEventListener( RM.Event.ADD_TO_STAGE, this.init, this );
		RM.Res.loadGroup( [ "resource/rectangle.png",
			"resource/rect_xu.png",
			"resource/syebg.jpg",
			"resource/zuobiao.png"
		], this.onComplete, this );
	}
	
	/**
	 *
	 *2015/11/16
	 */
	private onComplete( res:RM.ResGroupItem ):void {
		if ( ! res.isComplete )return;

		var sp:RM.Sprite = new RM.Sprite();
		sp.addTo(this)
			//.setRotate(60)
			//.setScaleY(0.5)
			.setPoint(240, 400);

		RM.Bitmap.create( RM.Texture.getTexture( "resource/zuobiao.png" ) )
			.addTo(this);
		RM.Bitmap.create( RM.Texture.getTexture( "resource/rect_xu.png" ) )
			.addTo( this )
			.setPoint( 240, 400 );
		RM.Bitmap.create( RM.Texture.getTexture( "resource/rect_xu.png" ) )
			.addTo( this )
			.setScaleX(0.5)
			.setScaleY(0.5)
			.setPoint( 240, 400 );
		RM.Bitmap.create( RM.Texture.getTexture( "resource/rectangle.png" ) )
			.addTo( sp )
			//.setRotate( 10 )
			.setSkewX( 30 )
			.setSkewY( 30 )
			//.setScaleX(0.5)
			//.setScaleY(0.5)
			//.setPoint( 10, 20 );
		RM.Bitmap.create( RM.Texture.getTexture( "resource/rectangle.png" ) )
			.addTo( sp )
			.setRotate( 30 )
			//.setSkewX( 30 )
			.setScaleX(0.5)
			.setScaleY(0.5)
			//.setPoint( 240, 400 );
	}
}