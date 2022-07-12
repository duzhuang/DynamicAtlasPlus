import SplitCircle from "./DynamicAtlas/SplitCircle";

/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-07 10:58:43
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-12 10:55:01
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
                let nativeUrl =  Utils.getImageName(url);
                let urlCircle = SplitCircle.getCircleHeadTexture(tex as cc.Texture2D, nativeUrl);
                cc.assetManager.loadRemote(urlCircle, { ext: '.png' }, function (err, res) {
                    if (err) return;
                    let resTexture: cc.Texture2D = (res as cc.Texture2D);                                     
                    spriteNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(resTexture, cc.rect(0, 0, resTexture.width, resTexture.height));                                    
                })
            }
        })
    }
    
    /**
     * 拼装url在本地存储时的结果
     * @param url 路径
     * @returns 
     */
    static getImageName(url: string) {            
        let urlOne =  url.split("//")[1];
        let urlTwo =  urlOne.split("?")[0];
        let urlThree = urlTwo.split("/");        
        let result =  urlThree.join("");
        return result;        
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