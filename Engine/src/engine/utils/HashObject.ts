module RM
{
    /**
     * 所有对象的基类，赋予hasCount属性，对象计数
     * @author Rich
     *
     */
    export class HashObject
    {
        public static hasCount: number = 1;
        private _hasCount: number;
        public constructor()
        {
            this._hasCount = HashObject.hasCount++;
        }
        public get hasCount(): number
        {
            return this._hasCount;
        }
    }
}