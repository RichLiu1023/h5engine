///<reference path="HashObject.ts"/>
module RM {
	/**
	 * 渲染性能监测
	 * @author 
	 *
	 */
    export class RenderPerformance extends RM.HashObject
    {

        private static _instance: RM.RenderPerformance;
        private _isRun: boolean = false;
        private _renderCount: number = 0;
        private _totalTime: number = 0;
        private _tick: number = 0;
        
        private _text: RM.TextField;

        private _lastRect:RM.Rectangle = new RM.Rectangle();
        
        public constructor()
        {
            super();
        }
        public static getInstance(): RM.RenderPerformance
        {
            if ( !this._instance )
            {
                this._instance = new RM.RenderPerformance();
            }
            return this._instance;
        }
        
        public isRun(): boolean
        {
            return this._isRun;
        }
        
        public run(): void
        {
            this._isRun = true;
            this._renderCount = 0;
            this._totalTime = 0;
            this._tick = 0;
            this._text = new RM.TextField();
            this._text.setFontSize( 16 );
            this._text.setTextAlign(RM.TextAlignType.START);
            this._text.setTextColor(0xff0000);
            this._text.setStrokeColor(0x00ff00);
            this._text.setIsBold(true);
            //this._text.setIsStrokeText(true);
//            this._text.setFontStyle(RM.TextFontStyleType.OBLIQUE);
            
            RM.Ticker.getInstance().register( this.addAdvancedTime, this );
        }
        
        public addRenderCount():void
        {
            if( this._isRun )
            {
                this._renderCount++;
            }
        }
        
        public addAdvancedTime( advancedtime:number ):void
        {
            this._tick++;
            this._totalTime += advancedtime;
            if( this._totalTime >=500 )
            {
                var frameStr = Math.floor( this._tick * 1000 / this._totalTime );
                this._renderCount = Math.floor( this._renderCount / this._tick );
                this._text.setText( "FPS: " + frameStr +
                    "    \n drawCount:" + this._renderCount
                    //+"\n"+RM.Log.STRING
                    //+"\n"+RM.PoolUtil.toStringClassList()
                );
                this._tick = 0;
                this._totalTime = 0;
                this._renderCount = 0;
            }
        }
        
        public draw( renderContext: RM.RenderContext ): void
        {
            this._text._$draw( renderContext );
        }

        /**
         *
         *2015/11/2
         */
        public getRect():RM.Rectangle {

            var rect:RM.Rectangle = this._text._$getBounds();
            rect = rect.union(this._lastRect,true);
            this._lastRect.resetToRect(rect);
            return rect;
        }
        
    }
}
