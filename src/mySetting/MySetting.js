import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Platform,
    NativeAppEventEmitter,
    DeviceEventEmitter,
    Dimensions,
    StatusBar,
} from 'react-native';
import ScreenUtils from './../common/ScreenUtils';
import AppConfig from "../common/AppConfig";
import LoadingView from "../common/LoadingView";
import RNRestart from 'react-native-restart';

import checkVersion from "./../conf/CheckUpdate";

const {height, width} = Dimensions.get('window');

export default class UserCard extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        };
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.unMount = false;
    }

    componentDidMount() {
       this.init();
        this.willShow = DeviceEventEmitter.addListener(
            'QIM_RN_Will_Show',
           function (params) {
               this.init();
           }.bind(this)
        );
        this.imageUpdateEndAttribute = DeviceEventEmitter.addListener('imageUpdateEnd', function (params) {
            this.imageUpdateEnd(params);
        }.bind(this));
        this.updatePSignature = DeviceEventEmitter.addListener('updatePersonalSignature', function (params) {
            this.updatePersonalSignature(params);
        }.bind(this));
    }

    init(){
        NativeModules.QimRNBModule.getMyInfo(function (responce) {
            let userInfo = responce.MyInfo;
            this.setState({userInfo: userInfo});
            // RNRestart.Restart();
        }.bind(this));
        NativeModules.QimRNBModule.getMyMood(function(responce){
            let mood = responce.mood;
            this.setState({userMood:mood});
        }.bind(this));
    }

    componentWillUnmount() {
        this.unMount = true;
        this.willShow.remove();
        this.imageUpdateEndAttribute.remove();
        this.updatePSignature.remove();
    }


    updatePersonalSignature(params) {
        let userId = params["UserId"];
        let pSignature = params["PersonalSignature"];
        if (userId == this.state.userInfo["UserId"]) {
            // this.state.userMood =pSignature;
            // let userInfo = this.state.userInfo;
            // userInfo["Mood"] = pSignature;
            this.setState({userMood: pSignature});
        }
    }
    //结束显示
    imageUpdateEnd(params) {
        if (params.ok) {
            let headerUrl = params.headerUrl;
            this.state.userInfo["HeaderUri"] = headerUrl;
            this.setState({userInfo: this.state.userInfo});

        }else{
            // Alert.alert('提示','更新失败');
        }
        // LoadingView.hidden();
    }

    //打开设置
    openSetting() {
        let params = {};
        params["Bundle"] = "clock_in.ios";
        params["Module"] = "MySetting";
        params["Properties"] = {};
        params["Properties"]["Screen"] = "Setting";
        params["Version"] = "1.0.0";
        NativeModules.QimRNBModule.openRNPage(params, function () {

        });
    }

    //打开我的名片
    openPersonalData() {
        // if (Platform.OS === 'ios') {
        let params = {};
        params["Bundle"] = "clock_in.ios";
        params["Module"] = "MySetting";
        params["Properties"] = {};
        params["Properties"]["Screen"] = "MyCard";
        params["Version"] = "1.0.0";
        NativeModules.QimRNBModule.openRNPage(params, function () {

        });
        // } else {

        // }
    }

    //打开我的红包
    openMyRedBag() {
        let params = {};
        params["NativeName"] = "MyRedBag";
        NativeModules.QimRNBModule.openNativePage(params);
    }

    //打开我的余额
    openBalanceInquiry() {
        let params = {};
        params["NativeName"] = "BalanceInquiry";
        NativeModules.QimRNBModule.openNativePage(params);
    }

    //打开我的账号信息
    openAccountInfo() {
        let params = {};
        params["NativeName"] = "AccountInfo";
        NativeModules.QimRNBModule.openNativePage(params);
    }

    //打开我的文件
    openMyFiles() {
        let params = {};
        params["NativeName"] = "MyFile";
        NativeModules.QimRNBModule.openNativePage(params);
    }

    //打开反馈
    openAdviceAndFeedback() {
        // if (Platform.OS === 'ios') {
        let params = {};
        params["Bundle"] = "clock_in.ios";
        params["Module"] = "MySetting";
        params["Properties"] = {};
        params["Properties"]["Screen"] = "AdviceAndFeedback";
        params["Version"] = "1.0.0";
        NativeModules.QimRNBModule.openRNPage(params, function () {

        });
        // } else {
        // }
    }

    _renderFileCell() {
        // if (Platform.OS == 'ios') {
            return (
                <View>
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openMyFiles();
                        }}>
                            <Text style={styles.cellIcon}>{String.fromCharCode(0xe213)}</Text>
                            <Text style={styles.cellTitle}>我的文件</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}/>
                </View>
            );
        // } else {
        //
        // }
    }

    _showAccountInfo() {
        if (AppConfig.isQtalk()) {
            return (
                <View>
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openAccountInfo();
                        }}>
                            <Text style={styles.cellIcon}>{String.fromCharCode(0xf0e2)}</Text>
                            <Text style={styles.cellTitle}>账号信息</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}>

                    </View>
                </View>
            );
        }
    }

    render() {
        let nickName = "";
        let mood = "这家伙很懒什么都没留"; //'/Users/admin/Documents/big_image.gif'
        let headerUri = "../images/singleHeaderDefault.png";
        if (this.state.userInfo) {
            nickName = this.state.userInfo["Name"];
            headerUri = this.state.userInfo["HeaderUri"];
            // mood = this.state.userInfo["Mood"];
        }
        if(this.state.userMood){
            mood = this.state.userMood
        }
        let containerStyle = {flex: 1};
        if (Platform.OS == 'android') {
            containerStyle = {height: (height - 105 - StatusBar.currentHeight)};
        }
        return (
            <View style={[styles.wrapper,containerStyle]}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    <TouchableOpacity style={styles.userHeader} onPress={() => {
                        this.openPersonalData();
                    }}>
                        <Image source={{uri: headerUri}} style={styles.userHeaderImage}/>
                        <View style={styles.userNameInfo}>
                            <Text style={styles.userName}>{nickName}</Text>
                            <Text style={styles.userMood} numberOfLines={1}>{mood}</Text>
                        </View>
                        <View style={styles.cellQRCode}>
                            <Image source={require('../images/qrcode.png')} style={styles.qrCodeIcon}/>
                        </View>
                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                    <View style={styles.line}/>
                    <View style={styles.walletInfo}>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openMyRedBag();
                        }}>
                            <Text style={styles.cellIcon}>{String.fromCharCode(0xf0e4)}</Text>
                            <Text style={styles.cellTitle}>我的红包</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openBalanceInquiry();
                        }}>
                            <Text style={styles.cellIcon}>{String.fromCharCode(0xf0f1)}</Text>
                            <Text style={styles.cellTitle}>余额查询</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}>

                    </View>

                    {/*{this._showAccountInfo()}*/}
                    {this._renderFileCell()}
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openAdviceAndFeedback();
                        }}>
                            <Text style={styles.cellIcon}>{String.fromCharCode(0xf0ef)}</Text>
                            <Text style={styles.cellTitle}>建议反馈</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openSetting();
                        }}>
                            <Text style={styles.cellIcon}>{String.fromCharCode(0xf0ed)}</Text>
                            <Text style={styles.cellTitle}>设置</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    // tabBar: {
    //     height: ScreenUtils.scaleSize(64),
    //     flexDirection: "row",
    //     backgroundColor: "#EAEAEA",
    // },
    // leftTab: {
    //     flex: 1,
    // },
    // rightTab: {
    //     flex: 1,
    // },
    scrollView: {
        flex: 1,
        backgroundColor: "#EAEAEA",
    },
    contentContainer: {
        // paddingVertical: 20
    },
    line: {
        height: ScreenUtils.scaleSize(10),
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: ScreenUtils.scaleSize(44),
        borderBottomWidth: 1,
        borderColor: "#EAEAEA",
        paddingLeft: ScreenUtils.scaleSize(10),
        alignItems: "center",
        flex: 1,
    },
    cellIcon: {
        width: ScreenUtils.scaleSize(24),
        height: ScreenUtils.scaleSize(24),
        lineHeight: ScreenUtils.scaleSize(24),
        fontFamily: "QTalk-QChat",
        fontSize: ScreenUtils.setSpText(22),
        color: "#888888",
        marginRight: ScreenUtils.scaleSize(5),
    },
    cellTitle: {
        width: ScreenUtils.scaleSize(100),
        color: "#333333",
    },
    cellValue: {
        flex: 1,
        textAlign: "right",
        color: "#999999",
    },
    rightArrow: {
        width: ScreenUtils.scaleSize(20),
        height: ScreenUtils.scaleSize(20),
        marginRight: ScreenUtils.scaleSize(5),
    },
    userHeader: {
        height: ScreenUtils.scaleSize(80),
        backgroundColor: "#FFF",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#EAEAEA",
        alignItems: "center",
    },
    userHeaderImage: {
        width: ScreenUtils.scaleSize(58),
        height: ScreenUtils.scaleSize(58),
        borderRadius: ScreenUtils.scaleSize(30),
        borderColor: "#D1D1D1",
        borderWidth: 1,
        marginLeft: ScreenUtils.scaleSize(11),
    },
    userNameInfo: {
        height: ScreenUtils.scaleSize(60),
        marginLeft: ScreenUtils.scaleSize(15),
        marginRight: ScreenUtils.scaleSize(15),
    },
    userName: {
        marginTop: ScreenUtils.scaleSize(10),
        fontSize: ScreenUtils.setSpText(18),
        color: "#333333",
    },
    userMood: {
        marginTop: ScreenUtils.scaleSize(10),
        width: ScreenUtils.scaleSize(width - 130),
        fontSize: ScreenUtils.setSpText(14),
        color: "#999999",
    },
    cellQRCode: {
        flex: 1,
        alignItems: "flex-end",
    },
    qrCodeIcon: {
        width: ScreenUtils.scaleSize(24),
        height: ScreenUtils.scaleSize(24),
    },
    walletInfo: {},
});
