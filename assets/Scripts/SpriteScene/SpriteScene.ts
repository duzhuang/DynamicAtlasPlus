/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-07 10:05:24
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-07 10:28:04
 */

import DynamicAtlas from "../DynamicAtlas/DynamicAtlas";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpriteScene extends cc.Component {

    @property({type:cc.Node,tooltip:''})
    secondPanel:cc.Node = null;

    protected onLoad(): void {
        cc.dynamicAtlasManager.enabled = false;
        DynamicAtlas.getInstance();       
    }

    onClickShowSecond(){
        this.secondPanel.active = true;
        this.scheduleOnce(_=>{
            DynamicAtlas.getInstance().showDebug(true);
        },0)
    }

    onClickMask() {
        this.secondPanel.active = false;    
        DynamicAtlas.getInstance().deleteSpriteFrame("level2");    
    }
}
