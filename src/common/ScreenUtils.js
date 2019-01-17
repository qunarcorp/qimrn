/**
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */
var ReactNative = require('react-native');
var Dimensions = require('Dimensions');

const r2 = 2;
const w2 = 750 / r2;
const h2 = 1334 / r2;
const DEFAULT_DENSITY = 1;

var ScreenUtils = {};
ScreenUtils.screenW = Dimensions.get('window').width;
ScreenUtils.screenH = Dimensions.get('window').height;
ScreenUtils.fontScale = ReactNative.PixelRatio.getFontScale();
ScreenUtils.pixelRatio = ReactNative.PixelRatio.get();

ScreenUtils.setSpText = function (size) {
    if (ReactNative.Platform.OS == 'android') {
        var scaleWidth = ScreenUtils.screenW / w2;
        var scaleHeight = ScreenUtils.screenH / h2;
        var scale = Math.min(scaleWidth, scaleHeight);
        size = Math.round((size * scale + 0.5) /** ScreenUtils.pixelRatio / ScreenUtils.fontScale*/);
        return size;
    } else {
        return size;
    }
}

/**
 * 屏幕适配,缩放size
 * @param size
 * @returns {Number}
 * @constructor
 */
ScreenUtils.scaleSize = function (size) {
    if (ReactNative.Platform.OS == 'android') {
        // console.log("计算前高度:" + size);
        var scaleWidth = ScreenUtils.screenW / w2;
        var scaleHeight = ScreenUtils.screenH / h2;
        var scale = Math.min(scaleWidth, scaleHeight);
        size = Math.round((size * scale + 0.5));

        let aa = size / DEFAULT_DENSITY;
        // console.log("计算后高度:" + size + ",deft:" + DEFAULT_DENSITY + ",aa:" + aa);
        return size / DEFAULT_DENSITY;
    } else {
        return size;
    }
}

export default ScreenUtils;