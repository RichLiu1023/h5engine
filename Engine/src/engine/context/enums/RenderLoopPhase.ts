module RM {
	/**
	 *
	 * @author 
	 *
	 */
	export class RenderLoopPhase {
    	
    	/**渲染初始阶段*/
        public static DEFAULT_RENDER_PHASE: string = "default_render_phase";
    	/**渲染的第一阶段，清理渲染区域*/
        public static CLEAR_AREA_PHASE: string = "clear_area_phase";
        /**渲染的第二阶段，刷新updateTransform*/
        public static UPDATE_TRANSFORM_PHASE: string = "update_transform";
        /**渲染的第三阶段，draw*/
        public static DRAW_PHASE: string = "draw_phase";
        /**渲染的第四阶段，完成渲染*/
        public static COMPLETE_PHASE: string = "complete_phase";
    	
		public constructor() {
		}
	}
}
