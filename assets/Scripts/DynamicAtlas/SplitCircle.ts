/*
 * @Author: 1148299682@qq.com
 * @Date: 2022-07-07 11:01:51
 * @LastEditors: 1148299682@qq.com
 * @LastEditTime: 2022-07-07 11:33:07
 */
export default class SplitCircle {
    /**画布 */
    private static _canvas = null;

    public static getCircleHeadTexture(headTexture: cc.Texture2D) {
        let originalPixels = this._getOriginalPixels(headTexture);
        let rgbaList = this._formateOriginalPixelsRGBA(originalPixels);
        let circlePixelsData = this._getCirclePixelsData(rgbaList, headTexture.width, headTexture.height);
        let resultTexturePixelsData = this._formateToUint8Array(circlePixelsData);
        let url = this.toImageUrl(headTexture.width, headTexture.height, resultTexturePixelsData);
        return url;
    }

    /**
   * 生成图片链接
   */
    private static toImageUrl(width, height, pixelData) {
        var width = width, height = height, url: string;
        if (cc.sys.isNative) {
            let data = pixelData, filePath = jsb.fileUtils.getWritablePath() + 'tmpImg.png';
            jsb['saveImageData'](data, width, height, filePath);
            url = filePath;
        }
        else {
            // 通用模式，只要确保能创建一个2d canvas即可
            let canvas = SplitCircle.getCanvas(), ctx = canvas.getContext('2d'), data = pixelData, rowBytes = width * 4, row = 0;
            // 调整画布成当前纹理大小
            canvas.width = width;
            canvas.height = height;
            // 写入canvas            
            while (row < height) {
                let srow = row, imageData = ctx.createImageData(width, 1), start = srow * width * 4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = data[start + i];
                }
                ctx.putImageData(imageData, 0, row++);
            }
            url = canvas.toDataURL('image/png');
            // 用完立即清空数据
            ctx.clearRect(0, 0, width, height);
        }
        return url;
    }

    protected static getCanvas(): HTMLCanvasElement {
        return SplitCircle._canvas || (SplitCircle._canvas = document.createElement('canvas'));
    }


    /**
     * 获取原始的texture像素
     * @param headTexture 原始texture
     */
    private static _getOriginalPixels(headTexture: cc.Texture2D) {
        let tempTexture = new cc.RenderTexture();
        tempTexture.initWithSize(headTexture.width, headTexture.height);
        //@ts-ignore
        cc.renderer.device.setFrameBuffer(tempTexture._framebuffer);
        //@ts-ignore
        tempTexture.drawTextureAt(headTexture, 0, 0);
        let originalPixels = tempTexture.readPixels();
        return originalPixels;
    }

    /**
     * 格式化原始数据整理为RGBA格式
     * @param originalPixels 原始像素数据
     */
    private static _formateOriginalPixelsRGBA(originalPixels: any) {
        let listCount = originalPixels.length / 4;
        let rgbaList = [];
        for (let i = 0; i < listCount; i++) {
            let temp = originalPixels.slice(i * 4, i * 4 + 4);
            rgbaList.push(temp);
        }        
        return rgbaList;
    }

    /**
     * 获取整理好的Uint8Array的数据
     * @param texturePixelsData 
     * @param width 
     * @param height 
     */
    private static _formateToUint8Array(texturePixelsData: any) {
        let result = [];
        for (let i = 0; i < texturePixelsData.length; i++) {
            result.push(texturePixelsData[i][0], texturePixelsData[i][1], texturePixelsData[i][2], texturePixelsData[i][3]);
        }
        return new Uint8Array(result);
    }

    /**
     * 获取圆形头像的数据
     * @param rgbaList 
     * @param width 
     * @param height 
     */
    private static _getCirclePixelsData(rgbaList: any, width: number, height: number) {
        let resultList = rgbaList;
        let circleCenter = new cc.Vec2(width / 2, height / 2);
        let radius = width / 2 > height / 2 ? height / 2 : width / 2;
        let isQuadrate: boolean = height === width;
        for (let hIndex = 0; hIndex < height; hIndex++) {
            for (let wIndex = 0; wIndex < width; wIndex++) {
                let curData = resultList[hIndex * width + wIndex];
                //是否是正方形
                if (isQuadrate) {
                    let dx = wIndex - circleCenter.x;
                    let dy = hIndex - circleCenter.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    //let distance = Math.sqrt(Math.pow(wIndex - circleCenter.x, 2) + Math.pow(hIndex - circleCenter.y, 2))
                    if (distance > radius) {
                        curData[3] = 0;
                    }
                } else {
                    if (Math.abs(wIndex - circleCenter.x) > radius) {
                        curData[3] = 0;
                    } else {
                        let currentPos = new cc.Vec2(wIndex, hIndex);
                        let distance = Math.sqrt(Math.pow(currentPos.x - circleCenter.x, 2) + Math.pow(currentPos.y - circleCenter.y, 2))
                        if (distance > radius) {
                            curData[3] = 0;
                        }
                    }
                }
            }
        }

        // var endIndex = resultList.length - 1;
        // for (let hIndex = 0; hIndex < height / 2; hIndex++) {
        //     for (let wIndex = 0; wIndex < width; wIndex++) {
        //         let dx = wIndex - circleCenter.x;
        //         let dy = hIndex - circleCenter.y;
        //         let distance = Math.sqrt(dx * dx + dy * dy);
        //         if (distance > radius) {
        //             let currentIndex = hIndex * width + wIndex;
        //             let front = resultList[currentIndex];
        //             let back = resultList[endIndex - currentIndex];
        //             front[3] = 0;
        //             back[3] = 0;
        //         }
        //     }
        // }
        return resultList;
    }
}