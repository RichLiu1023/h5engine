///<reference path="../../utils/HashObject.ts"/>
module RM {
	/**
	 * 设备控制器，负责帧率及刷新
	 * @author 
	 *
	 */
	export class DeviceContext extends RM.HashObject{
		public constructor() {
            super();
		}
        public executeMainLoop( callback: Function, thisObject: any ): void { }
        public setFrameRate( frameRate: number ): void { }
	}
}
