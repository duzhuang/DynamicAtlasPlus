/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-07 10:03:55
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-07 10:04:11
 */

import DynamicAtlas from "../DynamicAtlas/DynamicAtlas";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LabelScene extends cc.Component {
    protected onLoad(): void {
        cc.dynamicAtlasManager.enabled = false;
        DynamicAtlas.getInstance();
        this.scheduleOnce(_=>{
            DynamicAtlas.getInstance().showDebug(true);
        },0)
    }
}
