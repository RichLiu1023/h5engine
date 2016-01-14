module RM {
	/**
	 *
	 * @author 
	 *
	 */
	export class EventPhase {
    	/**事件的第一个阶段，捕获阶段*/
        public static CAPTURE_PHASE: string = "capture_phase";
        /**事件的第二个阶段，目标阶段*/
        public static TARGET_PHASE: string = "target_phase";
        /**事件的第三个阶段，冒泡阶段*/
        public static BUBBLE_PHASE: string = "bubble_phase";
    	
		public constructor() {
		}
	}
}
