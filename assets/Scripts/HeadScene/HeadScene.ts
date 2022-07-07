import DynamicAtlas from "../DynamicAtlas/DynamicAtlas";
import CircleHeadPanel from "./CircleHeadPanel";
import HeadPanel from "./HeadPanel";

/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-06 20:17:48
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-07 13:42:17
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class HeadScene extends cc.Component {

    @property({ type: cc.Prefab, tooltip: '' })
    CircleHeadPanel: cc.Prefab = null;

    @property({ type: cc.Prefab, tooltip: '' })
    HeadPanel: cc.Prefab = null;

    private _userList = [
        // {
        //     "uid": "45967870",
        //     "avatarUrl": "https://qiniustatic.wodidashi.com/picture/k0QTYkPfj2ob7?imageView/2/w/200/h/200",
        //     "name": "abㄭdef",
        // }
        // , {
        //     "uid": "121078219",
        //     "avatarUrl": "https://qiniustatic.wodidashi.com/picture/B7WvxMDv9gMLN?imageView/2/w/200/h/200",
        //     "name": "一修测试",
        // }, {
        //     "uid": "30971516",
        //     "avatarUrl": "https://qiniustatic.wodidashi.com/picture/Zq3ELkbbh6RE8?imageView/2/w/200/h/200",
        //     "name": "小明",
        // }, {
        //     "uid": "107429611",
        //     "avatarUrl": "https://qiniustatic.wodidashi.com/user/icon/3_3x.png?imageView/2/w/200/h/200",
        //     "name": "002",
        // }, {
        //     "uid": "107112886",
        //     "avatarUrl": "https://qiniustatic.wodidashi.com/picture/JfmjRYIWm2bDA?imageView/2/w/200/h/200",
        //     "name": "0113",
        // }, {
        //     "uid": "106288727",
        //     "avatarUrl": "https://qiniustatic.wodidashi.com/user/icon/1_3x.png?imageView/2/w/200/h/200",
        //     "name": "玩吧用户3872",
        // }, {
        //     "uid": "26331199",
        //     "avatarUrl": "https://qiniustatic.wodidashi.com/head/uYQ4f5Z5AHFKY?imageView/2/w/200/h/200",
        //     "name": "11045",
        // }, {
        //     "uid": "63996494",
        //     "avatarUrl": "https://qiniustatic.wodidashi.com/head/7WHTjoWEA4rL2?imageView/2/w/200/h/200",
        //     "name": "东直门地铁站33",
        // }, {
        //     "uid": "145410482",
        //     "avatarUrl": "https://qiniustatic.wodidashi.com/picture/JAWkRmrY0eQzi?imageView/2/w/200/h/200",
        //     "name": "ffffour",
        // }, {
        //     "uid": "129624962",
        //     "avatarUrl": "https://qiniustatic.wodidashi.com/spamer/user.png?imageView/2/w/200/h/200",
        //     "name": "520011",
        // }
    ]

    protected onLoad(): void {
        cc.dynamicAtlasManager.enabled = false;
        DynamicAtlas.getInstance();
    }

    protected start(): void {

    }

    onClickLoadHead() {
        let tempPanel = cc.instantiate(this.HeadPanel);
        tempPanel.getComponent(HeadPanel).initPanel(this._userList);
        tempPanel.parent = this.node;
    }

    onClickLoadCircleHead() {
        let tempPanel = cc.instantiate(this.CircleHeadPanel);
        tempPanel.getComponent(CircleHeadPanel).initPanel(this._userList);
        tempPanel.parent = this.node;
    }
}
