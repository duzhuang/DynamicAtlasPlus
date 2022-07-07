import Utils from "../Utils";

/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-07 10:56:10
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-07 11:03:19
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class PlayerAvatar extends cc.Component {
    @property({ type: cc.Node, tooltip: '' })
    playerIcon: cc.Node = null;

    @property({ type: cc.Label, tooltip: '' })
    playerName: cc.Label = null;

    init(playerData) {
        this.playerName.string = playerData.name;
        Utils.loadUrlImage(playerData.avatarUrl, this.playerIcon);
    }

    initCircleAvatar(playerData) {
        this.playerName.string = playerData.name;
        Utils.loadUrlImageAtlas(playerData.avatarUrl, this.playerIcon);
    }
}