module RM {
	/**
	 * 缓存等待渲染的子项渲染到画布的指令，在当前帧渲染所有需要渲染的子项
	 * @author 
	 *
	 */
	export class RenderCommand {
        public static cmdPool: Array<RenderCommand> = [];
        public callback: Function;
        public thisObject: any;
		public constructor() {
		}
        public call( renderContext: RM.RenderContext ): void
		{
            var self: any = this;
            if( self.callback )
            {
                self.callback.call( self.thisObject, renderContext );
            }
		}
        public dispose(): void
        {
            this.callback = null;
            this.thisObject = null;
            RenderCommand.cmdPool.push( this );
        }
        public static push( callback:Function,thisObject:any ):void
        {
            var cmd: RenderCommand;
            if( RenderCommand.cmdPool.length > 0 )
            {
                cmd = RenderCommand.cmdPool.pop();
            }
            else
            {
                cmd = new RM.RenderCommand();
            }
            cmd.callback = callback;
            cmd.thisObject = thisObject;
            RM.MainContext.DRAW_COMMAND_LIST.push( cmd );
        }
        
		
	}
}
