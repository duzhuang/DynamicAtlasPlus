import DynamicAtlas from "../DynamicAtlas/DynamicAtlas";
import DynamicTools, { DynamicName } from "../DynamicAtlas/DynamicTools";
import PlayerAvatar from "./PlayerAvatar";

/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-07 11:50:02
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-07 12:16:34
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class HeadPanel extends cc.Component {

    @property({ type: cc.Prefab, tooltip: '' })
    prefabAvatarCircle: cc.Prefab = null;

    @property({ type: cc.Node, tooltip: '' })
    headParent: cc.Node = null;

    initPanel(userList: any) {
        for (let i = 0; i < userList.length; i++) {
            let tempAvatar = cc.instantiate(this.prefabAvatarCircle);
            tempAvatar.parent = this.headParent;
            tempAvatar.getComponent(PlayerAvatar).init(userList[i]);
        }
        this.scheduleOnce(_ => {
            DynamicAtlas.getInstance().showDebug(true);
        }, 1)
    }

    onClickMask() {
        DynamicAtlas.getInstance().deleteSpriteFrame(DynamicName.level2 + "");
        this.node.destroy();
       
    }
}
