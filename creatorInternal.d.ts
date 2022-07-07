/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-06 21:02:42
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-06 21:05:32
 */
/**
 * 对creator.d.ts 的补充
 * 有一些引擎的方法没有给出ts的扩展
 * 需要自己对其补充
 */
declare namespace cc {
    /**追加Assembler2D 的扩充*/
    export class Assembler2D {
        /**
         * 将图片打入动态图集
         * @param comp 渲染组件
         * @param frame uv
         */
        public packToDynamicAtlas(comp, frame);
    }
}