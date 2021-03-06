/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-06 20:20:18
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-12 17:58:47
 */

import Atlas from "./Atlas";
import DynamicTools from "./DynamicTools";

/**动态图集的控制类 */
export default class DynamicAtlas {
    private static _instance: DynamicAtlas = null;
    public static getInstance() {
        if (!DynamicAtlas._instance) {
            DynamicAtlas._instance = new DynamicAtlas();
        }
        return this._instance;
    }

    /**是否初始化 */
    private _isInit = false;

    private constructor() {
        this.init()
    }

    init() {
        if (this._isInit) return;
        let assembler2D = new cc.Assembler2D();
        //@ts-ignore        
        let assembler = assembler2D.__proto__;
        assembler.packToDynamicAtlas = function (comp, frame) {
            if (comp.node.getComponent(DynamicTools)) {
                let atlasName = DynamicTools._atlasName;
                let packedFrame = DynamicAtlas.getInstance().insertSpriteFrame(frame, comp, atlasName);
                if (packedFrame) {
                    frame._setDynamicAtlasFrame(packedFrame);
                }
            }

            let material = comp._materials[0];
            if (!material) return;
            // 当图片被放入动态图集时, 应该更新uv
            if (material.getProperty('texture') !== frame._texture) {
                comp._vertsDirty = true;
                comp._updateMaterial();
            }
        }
        this._isInit = true;
    }



    /**图集的合集 */
    private static _atlasMap: Map<string, Atlas> = new Map<string, Atlas>();
    /**动态图集的尺寸 */
    private static _textureSize: number = 1024;
    /**动态合图的最大个数 */
    private static _maxAtlasCount = 5;
    /**是否开启动态合图 */
    public static _isEnable: Boolean = true;
    /**调试的节点 */
    private static _debugNode: cc.Node = null;


    /**
    * 是否开启合图
    * @param isShow  false 不开启  true  开启
    */
    public static setDynamicEnable(isShow: boolean) {
        DynamicAtlas._isEnable = isShow;
    }

    /**
     * 设置支持合图的最大张数，默认是五张
     * @param maxCount 
     */
    public static setDynamicMaxAtlasCount(maxCount: number) {
        DynamicAtlas._maxAtlasCount = maxCount;
    }


    /**
    * 向合图插入一张纹理
    * @param spriteFrame uv
    * @param comp 对应的渲染组件
    * @param atlasName 合图的名字
    */
    public insertSpriteFrame(spriteFrame: cc.SpriteFrame, comp: any, atlasNumber: number = 0) {
        //@ts-ignore
        if (!DynamicAtlas._isEnable || DynamicAtlas._atlasMap.size === DynamicAtlas._maxAtlasCount || !spriteFrame) return null;

        let atlasName = atlasNumber + "";
        //@ts-ignore
        if (!spriteFrame._texture.packable) {
            //如果图片参与过合图则特殊处理
            //@ts-ignore
            let textureName: string = spriteFrame._texture._name;
            let isAlreadyInAtlas = DynamicAtlas._atlasMap.get(textureName);
            //如果不在当前需要合图的大图里，则再次进行合图 || 如果uv已经销毁需要再次合图
            //@ts-ignore
            if ((isAlreadyInAtlas != undefined && textureName != atlasName) || (spriteFrame._texture != spriteFrame._original._texture && textureName == "")) {
                //@ts-ignore
                spriteFrame._texture = spriteFrame._original._texture;
                //@ts-ignore
                spriteFrame.uv = [0, 1, 1, 1, 0, 0, 1, 0];
                //@ts-ignore
                spriteFrame._rect.x = 0;
                //@ts-ignore
                spriteFrame._rect.y = 0;
            } else {
                return null;
            }
        }

        let atlas: Atlas = DynamicAtlas._atlasMap.get(atlasName);
        if (!atlas) {
            atlas = DynamicAtlas.initAtlas(atlasName);
        }
        this.generateFlagId(spriteFrame, comp);
        let frame = atlas.insertSpriteFrame(spriteFrame);       
        return frame;
    }

    /**
     * 删除一张合图
     * @param spriteFrame uv
     */
    public deleteSpriteFrame(atlasName: string = "default") {
        let debugNode = cc.director.getScene().getChildByName("DYNAMIC_ATLAS_DEBUG_NODE");
        if (debugNode || debugNode.isValid) {
            let content = DynamicAtlas._debugNode.getComponent(cc.ScrollView).content;
            for (let i = 0; i < content.childrenCount; i++) {
                let atlasNode: cc.Node = content.children[i];
                if (atlasNode.name == atlasName) {
                    atlasNode.destroy();
                }
            }
            content.getComponent(cc.Layout).updateLayout();
        }

        let atlas: Atlas = DynamicAtlas._atlasMap.get(atlasName);
        if (!atlas) return;
        atlas.destroy();
        DynamicAtlas._atlasMap.delete(atlasName);
    }

    /**
     * 展示当前的合图调试节点
     * @param show 展示合图     
     */
    public showDebug(show: boolean) {
        if (show) {
            let contentNode: cc.Node = null;
            if(!DynamicAtlas._debugNode || !DynamicAtlas._debugNode){
                let width = cc.visibleRect.width;
                let height = cc.visibleRect.height;
                DynamicAtlas._debugNode = new cc.Node('DYNAMIC_ATLAS_DEBUG_NODE');
                DynamicAtlas._debugNode.width = width;
                DynamicAtlas._debugNode.height = height;
                DynamicAtlas._debugNode.x = width / 2;
                DynamicAtlas._debugNode.y = height / 2;
                DynamicAtlas._debugNode.zIndex = cc.macro.MAX_ZINDEX;
                DynamicAtlas._debugNode.parent = cc.director.getScene();
                DynamicAtlas._debugNode.scale = 0.5;
    
                let scroll = DynamicAtlas._debugNode.addComponent(cc.ScrollView);
                contentNode = new cc.Node('CONTENT');
                let layout = contentNode.addComponent(cc.Layout);
                layout.type = cc.Layout.Type.VERTICAL;
                layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
                contentNode.parent = DynamicAtlas._debugNode;
                contentNode.width = DynamicAtlas._textureSize;
                contentNode.anchorY = 1;
                contentNode.x = DynamicAtlas._textureSize;
                scroll.content = contentNode;
            }else{
                contentNode = DynamicAtlas._debugNode.getChildByName("CONTENT");
            }
                    
            for (let i = 0; i < contentNode.childrenCount; i++) {                
                contentNode.children[i].destroy();
            }
            
            DynamicAtlas._atlasMap.forEach((atlas: Atlas, atlasName: string) => {
                let node = new cc.Node('ATLAS');
                let spriteFrame = new cc.SpriteFrame();
                //@ts-ignore
                spriteFrame.setTexture(atlas._texture);
                let sprite = node.addComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
                node.name = atlasName;
                node.parent = contentNode;
            })
            return DynamicAtlas._debugNode;
        } else {
            if (DynamicAtlas._debugNode) {
                DynamicAtlas._debugNode.parent = null;
                DynamicAtlas._debugNode = null;
            }
        }
    }



    /**
   * 初始化Atlas
   * @param atlasName atlas的名字
   * @returns 
   */
    private static initAtlas(atlasName: string) {
        let atlas: Atlas = DynamicAtlas._atlasMap.get(atlasName);
        if (!atlas) {
            atlas = new Atlas(DynamicAtlas._textureSize, DynamicAtlas._textureSize, atlasName);
            DynamicAtlas._atlasMap.set(atlasName, atlas);
        }
        return atlas;
    }

    /**
   * 生成每张纹理的唯一标识
   * @spriteFrame 纹理
   * @comp 渲染组件
   */
    private generateFlagId(spriteFrame: cc.SpriteFrame, comp: any) {
        if (!spriteFrame || !comp) return;
        let _flagId: string = null;
        //@ts-ignore
        if (!spriteFrame._texture._flagId) {
            if (comp instanceof cc.Label) {
                _flagId = comp.string + "_" + comp.node.color + "_" + comp.fontSize + "_" + comp.fontFamily + "_" + comp.enableBold + "_" + comp.enableItalic + "_" + comp.enableUnderline;
            } else if (comp instanceof cc.Sprite) {
                //@ts-ignore
                _flagId = spriteFrame._texture._uuid;
            }
        } else {
            //@ts-ignore
            _flagId = spriteFrame._texture._flagId;
        }    
        //@ts-ignore
        spriteFrame._texture._flagId = _flagId;
    }
}