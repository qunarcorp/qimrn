import {
    PixelRatio,
    TouchableWithoutFeedback,

    processColor,
    Dimensions
} from 'react-native';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
import { PropTypes } from 'react';

//const toPixels = PixelRatio.getPixelSizeForLayoutSize.bind(PixelRatio);
const pix = PixelRatio.get();

const defultWidth = 750;
const defultHeight = 1334;

//换算 字体，尺寸，行距
function toDips(px) {


  // if (pix == 2) {
  //     return px * screenWidth / defultWidth
  // }

  return px*pix/4;

}



//fontSize, left, right, width   使用对象
function toDipsWidth(px) {
    return px * screenWidth / defultWidth;

}


//top, bottom, height   使用对象
function toDipsHeight(px) {
  return px * screenHeight / defultHeight;
}



export {
    toDips,
    toDipsWidth,
    toDipsHeight,

};