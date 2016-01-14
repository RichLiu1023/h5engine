/**
 * 启动引擎，设置舞台及引擎数据初始化<br>
 * 执行user自定义主文件
 * @author
 *
 */

class Main {
	public constructor() {
	}

	public onInitEngine():void {
		RM.StageViewPort.getInstance().setStageSize( 480, 800 );
		//RM.StageViewPort.getInstance().setStageSize( 800, 480 );
		RM.StageViewPort.getInstance().onFullScreen(true);
		RM.StageViewPort.getInstance().setStageBackgroundColor( "#ffffff" );
		var stage:RM.Stage = new RM.Stage();
		RM.MainContext.getInstance().stage = stage;
	}

	public onStartPort():void {
		RM.MainContext.getInstance().run();
		RM.RenderPerformance.getInstance().run();
		RM.MainContext.getInstance().stage.addChild( new Test5() );
	}
}
