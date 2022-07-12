/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-06 20:20:09
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-12 16:42:23
 */
/**
 * 图集的类
 */
/**每张图之间的间距 */
const space = 2;
export default class Atlas {
    private _texture: cc.RenderTexture = null;
    private _x = null;
    private _y = null;
    private _nexty = null;
    private _width = null;
    private _height = null;
    private _innerTextureInfos = null;

    /**
   * 构造函数
   * @param width 宽
   * @param height 高
   * @param name 图集的名字
   */
    constructor(width: number, height: number, name?: string) {
        let texture = new cc.RenderTexture();
        texture.initWithSize(width, height);                
        this._texture = texture;
        //@ts-ignore
        texture.update();
        this._x = space;
        this._y = space;
        this._nexty = space;
        this._width = width;
        this._height = height;
        this._innerTextureInfos = {};
         //@ts-ignore
        texture._name = name;
    }

    /**
     * 向合图中插入一张纹理
     * @param spriteFrame 插入的纹理
     * @returns 
     */
    public insertSpriteFrame(spriteFrame: cc.SpriteFrame) {
         //@ts-ignore
        let rect = spriteFrame._rect;
         //@ts-ignore
        let texture = spriteFrame._texture;
        //查询spriteFrame是否已经被缓存
        let info = this._innerTextureInfos[texture._flagId];
        let sx = rect.x, sy = rect.y;

        if (info) {
            sx += info.x;
            sy += info.y;
        }
        else {
            let width = texture.width, height = texture.height;

            if ((this._x + width + space) > this._width) {
                this._x = space;
                this._y = this._nexty;
            }

            if ((this._y + height + space) > this._nexty) {
                this._nexty = this._y + height + space;
            }

            if (this._nexty > this._height) {
                return null;
            }

            // texture bleeding
            if (cc.dynamicAtlasManager.textureBleeding) {
                // Smaller frame is more likely to be affected by linear filter
                if (width <= 8 || height <= 8) {
                     //@ts-ignore
                    this._texture.drawTextureAt(texture, this._x - 1, this._y - 1);
                     //@ts-ignore
                    this._texture.drawTextureAt(texture, this._x - 1, this._y + 1);
                     //@ts-ignore
                    this._texture.drawTextureAt(texture, this._x + 1, this._y - 1);
                     //@ts-ignore
                    this._texture.drawTextureAt(texture, this._x + 1, this._y + 1);
                }
                 //@ts-ignore
                this._texture.drawTextureAt(texture, this._x - 1, this._y);
                 //@ts-ignore
                this._texture.drawTextureAt(texture, this._x + 1, this._y);
                 //@ts-ignore
                this._texture.drawTextureAt(texture, this._x, this._y - 1);
                 //@ts-ignore
                this._texture.drawTextureAt(texture, this._x, this._y + 1);
            }
            //@ts-ignore
            this._texture.drawTextureAt(texture, this._x, this._y);

            this._innerTextureInfos[texture._flagId] = {
                x: this._x,
                y: this._y,
                texture: texture,
            };
            sx += this._x;
            sy += this._y;

            this._x += width + space;            
        }

        let frame = {
            x: sx,
            y: sy,
            texture: this._texture
        }

        return frame;
    }


    public destroy() {
        this._x = space;
        this._y = space;
        this._nexty = space;
        this._innerTextureInfos = {};
        this._texture.destroy();
    }
}