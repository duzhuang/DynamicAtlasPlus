/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-07 11:17:16
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-07 11:21:41
 */
const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@menu("渲染组件/头像遮罩")
@executeInEditMode
export default class MaskAvatarTexture2d extends cc.Sprite {
    @property({ tooltip: '是否是静态合图' })
    cleanUp: boolean = false;


    private sprite: cc.Sprite;
    private material: cc.MaterialVariant;

    start() {
        if (this.cleanUp) this._setUVLocal();
    }

    update() {
        if (this.cleanUp) return;
        this._setUVLocal();
    }

    /**获取图片在图集中的UV并将其设置到shader中 */
    private _setUVLocal() {
        this.sprite = this.node.getComponent(cc.Sprite);
        this.material = this.sprite.getMaterial(0); //获取材质             
        //@ts-ignore
        if (String(this.material.material._name) != "MaskAvatarTexture2d") {
            Editor.error("MaskAvatarTexture2d 需要绑定 MaskAvatarTexture2d 材质，请检查");
            return;
        }
        let frame = this.sprite.spriteFrame;
        if (!frame) return;
        // xMin
        //@ts-ignore
        let l = frame.uv[0];
        // yMin
        //@ts-ignore
        let t = frame.uv[5];

        // xMax
        //@ts-ignore
        let r = frame.uv[6];
        // yMax
        //@ts-ignore
        let b = frame.uv[3];
        // 纹理在合图中的四个边界 uv 坐标
        let u_uvOffset = new cc.Vec4(l, t, r, b);
        // 纹理是否旋转
        let u_uvRotated = frame.isRotated() ? 1.0 : 0.0;
        // 设置材质的属性
        this.material.setProperty("u_uvOffset", u_uvOffset);
        this.material.setProperty("u_uvRotated", u_uvRotated);
    }
}
