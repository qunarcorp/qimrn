// import React from 'react';
// import {
//     Text,
//     View,
// } from 'react-native';
// import Toast from 'react-native-root-toast';
// import {Bars} from 'react-native-loader';

var ToastUtil = {};

ToastUtil.show = function (message) {
    // Toast.show(message);
    // toast = Toast.show(content.toString(), {
    //     duration: Toast.durations.SHORT,
    //     position: Toast.positions.CENTER,
    //     shadow: true,
    //     animation: true,
    //     hideOnPress: true,
    //     delay: 0
    // });
    // if (ToastUtil.toast){
    //     Toast.hide(ToastUtil.toast);
    //     ToastUtil.toast = null;
    // }
    // // (<View style={{flex:1,width:90,height:90,alignItems: 'center',paddingTop:10}}><Bars size={15} color="#FFFFF"/><Text style={{marginTop:15,fontSize:16,color:"white"}}>{message}</Text></View>)
    // ToastUtil.toast = Toast.show(message, {
    //     duration: 999999999,
    //     position: Toast.positions.CENTER,
    //     shadow: true,
    //     animation: true,
    //     hideOnPress: true,
    //     delay: 0,
    //     onShow: () => {
    //         // calls on toast\`s appear animation start
    //     },
    //     onShown: () => {
    //         // calls on toast\`s appear animation end.
    //     },
    //     onHide: () => {
    //         // calls on toast\`s hide animation start.
    //     },
    //     onHidden: () => {
    //         // calls on toast\`s hide animation end.
    //     }
    // });
};

ToastUtil.hide = function () {
    if (ToastUtil.toast) {
        Toast.hide(ToastUtil.toast);
        ToastUtil.toast = null;
    }
};

export default ToastUtil;