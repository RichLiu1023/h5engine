/**
 * Created by Rich on 2015/12/10.
 * 测试MovieClip
 */
class Test5 extends RM.DisplayObjectContainer {
	public constructor() {
		super();
		this.addEventListener( RM.Event.ADD_TO_STAGE, this.addStage, this );
	}

	private addStage( event:RM.Event ):void {
		this.removeEventListener( RM.Event.ADD_TO_STAGE, this.addStage, this );
		RM.Res.loadGroup( [ "resource/jianke.json",
			"resource/jianke.png",
		], this.onComplete, this );
	}

	private mc:RM.MovieClip;

	private onComplete( event:RM.ResGroupItem ):void {
		if ( ! event.isComplete )return;
		var tex:RM.Texture = RM.Texture.getTexture( "resource/jianke.png" );
		var obj:RM.JsonAnalyzer = RM.JsonAnalyzer.getJsonAnalyzer( "resource/jianke.json" );
		var spriteSheet:RM.SpriteSheet = RM.SpriteSheet.create( tex, obj.getJsonTextureFile() );
		var len:number = 300;
		var posy:number = 0;
		var posx:number = 0;
		for ( var idx = 0; idx < len; idx ++ ) {
			this.mc = new RM.MovieClip( spriteSheet );
			this.mc.setPlayLable( this.randomAction(), 0.2 );
			this.mc.play();
			this.mc.setTouchEnabled( true );
			this.mc.setPoint( posx, posy ).addTo( this );
			var value = idx % 30;
			if ( idx != 0 && value == 0 ) {
				posy += 100;
				posx = 0;
			}
			else {
				posx += 50;
			}
		}
		this.addEventListener( RM.TouchEvent.TOUCH_BEGIN, this.onBegin, this );
		this.addEventListener( RM.TouchEvent.TOUCH_END, this.onEnd, this );
	}

	private list1:Array<string> = [ "walk-", "stand-" ];
	private list2:Array<string> = [ "l", "r", "ru", "lu", "rd", "ld", "u", "d" ];

	private onBegin( event:RM.TouchEvent ):void {
		event._target.setPlayLable( this.randomAction(), 0.2 );
	}

	private onEnd( event:RM.TouchEvent ):void {
	}

	private randomAction():string {
		var str:string = "";
		var value = Math.round( Math.random() * (this.list1.length - 1) );
		str = this.list1[ value ];
		value = Math.round( Math.random() * (this.list2.length - 1) );
		str += this.list2[ value ];
		return str;
	}
}