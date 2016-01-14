module RM
{
    /**
     * 全局配置
     * @author Rich
     */
    export class GlobalConfig
    {
        /** 缩放比例*/
        public static TEXTURE_SCALE: number = 1;
        public static FRAME_RATE: number = 60;
        public static CANVAS_NAME: string = "canvas";
        public static ROOT_DIV_NAME: string = "gameDiv";
        public static CANVAS_DIV_NAME: string = "canvasDiv";

        //脏矩形
        public static IS_OPEN_DIRTY:boolean = true;

        public static RESPATH:string="resource/";

        public constructor()
        {
        }
    }
}
