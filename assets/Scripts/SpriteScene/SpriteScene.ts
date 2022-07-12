/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-07 10:05:24
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-12 11:54:35
 */

import DynamicAtlas from "../DynamicAtlas/DynamicAtlas";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpriteScene extends cc.Component {

    @property({ type: cc.Node, tooltip: '' })
    dynamicPanel: cc.Node = null;

    @property({ type: cc.Node, tooltip: '' })
    cocosPanel: cc.Node = null;

    protected onLoad(): void {      
        cc.dynamicAtlasManager.enabled = false;   
    }

    onClickCocos() {       
        cc.dynamicAtlasManager.enabled = true;   
        this.cocosPanel.active = true;
        this.scheduleOnce(_ => {
            cc.dynamicAtlasManager.showDebug(true);
        }, 1)
    }

    onClickDynamic() {
        DynamicAtlas.getInstance();
        this.dynamicPanel.active = true;
        this.scheduleOnce(_ => {
            DynamicAtlas.getInstance().showDebug(true);
        }, 1)
    }
}
