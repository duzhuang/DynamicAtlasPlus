/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-06 21:08:32
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-07 12:22:29
 */

export const DynamicName = cc.Enum({
    level1: 0,
    level2: 1,
    level3: 2,
    level4: 3,
    level5: 4,
})

const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("动态合图组件/让图片可以动态合图")
export default class DynamicTools extends cc.Component {

    @property({ type: DynamicName, tooltip: '动态图集的名字' })
    atlasName = DynamicName.level1;

    public static _atlasName: number = null;

    onLoad() {
        DynamicTools._atlasName = this.atlasName;
    }
}