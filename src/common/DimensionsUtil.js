/*************************************************************************************************
 * <pre>
 * @包路径：
 *
 * @类描述:
 * @版本:       V3.0.0
 * @作者        bigwhite
 * @创建时间    2019-05-24 16:03
 *
 * @修改记录：
 -----------------------------------------------------------------------------------------------
 ----------- 时间      |   修改人    |     修改的方法       |         修改描述   ---------------
 -----------------------------------------------------------------------------------------------
 </pre>
 ************************************************************************************************/
import React, {Component, PureComponent} from "react";
import {

    Dimensions,
} from 'react-native';
import AppConfig from "./AppConfig";
const {height, width}= Dimensions.get("window")
export class DimensionsUtil extends React.Component {

    static getSize(){
        let a = AppConfig.isIosIpad();
        if(a){
            let ipadWidth = AppConfig.getiPadWidth();
            return{height,ipadWidth}
        }else{
           return {height,width}
        }
    }

}


