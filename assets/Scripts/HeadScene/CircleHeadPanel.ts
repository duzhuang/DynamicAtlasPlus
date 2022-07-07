/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-07 11:45:43
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-07 12:17:22
 */
import DynamicAtlas from "../DynamicAtlas/DynamicAtlas";
import { DynamicName } from "../DynamicAtlas/DynamicTools";
import PlayerAvatar from "./PlayerAvatar";

const { ccclass, property } = cc._decorator;
@ccclass
export default class CircleHeadPanel extends cc.Component {

    @property({ type: cc.Prefab, tooltip: '' })
    prefabAvatarCircle: cc.Prefab = null;

    @property({ type: cc.Node, tooltip: '' })
    headParent: cc.Node = null;

    initPanel(userList: any) {
        for (let i = 0; i < userList.length; i++) {
            let tempAvatar = cc.instantiate(this.prefabAvatarCircle);
            tempAvatar.parent = this.headParent;
            tempAvatar.getComponent(PlayerAvatar).initCircleAvatar(userList[i]);
        }
        this.scheduleOnce(_ => {
            DynamicAtlas.getInstance().showDebug(true);
        }, 1)
    }

    onClickMask() {
        this.node.destroy();
        DynamicAtlas.getInstance().deleteSpriteFrame(DynamicName.level2 + "");
    }

}
