import SplitCircle from "./DynamicAtlas/SplitCircle";

/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-07 10:58:43
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-07 11:09:52
 */
export default class Utils {
    static loadUrlImage(url: string, spriteNode: cc.Node | cc.Sprite) {
        if (!url || url == "") {
            console.error("whellOfDestiny 加载图片的链接为：", url);
            return;
        }

        cc.loader.load(Utils.getUrlAndType(url), function (err, tex) {
            if (err || !(tex instanceof (cc.Texture2D))) {

            } else if (!spriteNode || !spriteNode.getComponent(cc.Sprite)) {
                console.error("whellOfDestiny 传入的加载的图片的节点不存在或者节点上没有Sprite组件")
            } else {
                spriteNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex, cc.rect(0, 0, tex.width, tex.height));
            }
        })
    }


    static loadUrlImageAtlas(url: string, spriteNode: cc.Node | cc.Sprite) {
        if (!url || url == "") {
            console.error("whellOfDestiny 加载图片的链接为：", url);
            return;
        }

        cc.loader.load(Utils.getUrlAndType(url), function (err, tex) {
            if (err || !(tex instanceof (cc.Texture2D))) {

            } else if (!spriteNode || !spriteNode.getComponent(cc.Sprite)) {
                console.error("whellOfDestiny 传入的加载的图片的节点不存在或者节点上没有Sprite组件")
            } else {
                let url = SplitCircle.getCircleHeadTexture(tex as cc.Texture2D);
                cc.assetManager.loadRemote(url, { ext: '.png' }, function (err, res) {
                    if (err) return;
                    let resTexture: cc.Texture2D = (res as cc.Texture2D);
                    spriteNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(resTexture, cc.rect(0, 0, resTexture.width, resTexture.height));
                })
            }
        })
    }


    static getUrlAndType(url: string): any {
        let slashIdx = url.lastIndexOf('/');

        let dotIdx = url.lastIndexOf('.');

        if (slashIdx == -1 || dotIdx == -1 || slashIdx >= dotIdx) {
            return { url: url, type: 'png' };
        } else {
            return url;
        }
    }
}