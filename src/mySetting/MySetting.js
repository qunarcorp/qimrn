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
    ImageBackground,
    Dimensions,
    StatusBar,
} from 'react-native';
import ScreenUtils from './../common/ScreenUtils';
import AppConfig from "../common/AppConfig";
import {DimensionsUtil} from "../common/DimensionsUtil";
import LoadingView from "../common/LoadingView";
import RNRestart from 'react-native-restart';

import checkVersion from "./../conf/CheckUpdate";

const {height, width} = DimensionsUtil.getSize();
// const {height, width} = Dimensions.get('window');
export default class UserCard extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
        };
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

    init() {
        NativeModules.QimRNBModule.getMyInfo(function (responce) {
            let userInfo = responce.MyInfo;
            this.setState({userInfo: userInfo});
            this.setState({userMood: userInfo["Mood"]});
            // RNRestart.Restart();
        }.bind(this));
        NativeModules.QimRNBModule.getMyMood(function (responce) {
            if (responce) {
                let mood = responce.mood;
                this.setState({userMood: mood});
            }
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

        } else {
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

    //打开管理后台
    openToCManager(){
        let params = {};
        params["NativeName"] = "OpenToCManager";
        NativeModules.QimRNBModule.openNativePage(params);
    }

    //打开我的朋友圈
    openUserWorkWorld() {
        let param = {};
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return
        }
        param["UserId"] = this.state.userInfo["UserId"];
        NativeModules.QimRNBModule.openUserWorkWorld(param);
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

    _renderWorkWorld() {
        if (AppConfig.isShowWorkWorld()) {
            return (
                <View>
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openUserWorkWorld();
                        }}>
                            <Text style={styles.cellIcon}>{String.fromCharCode(0xe213)}</Text>
                            <Text style={styles.cellTitle}>我的驼圈</Text>
                            <Text style={styles.cellValue}></Text>
                            {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                            <Text style={[styles.rightArrow, {color: '#C4C4C5'}]}>{String.fromCharCode(0xe7e0)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}/>
                </View>
            );
        }
    }

    _renderRedPackage() {
        if (AppConfig.isShowRedPackage()) {
            return (
                <View>
                    {/*<View style={styles.line}/>*/}
                    <View style={styles.walletInfo}>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openMyRedBag();
                        }}>
                            <Text style={[styles.cellIcon, {color: '#e88270'}]}>{String.fromCharCode(0xe741)}</Text>
                            <Text style={styles.cellTitle}>我的红包</Text>
                            <Text style={styles.cellValue}></Text>
                            {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                            <Text style={[styles.rightArrow, {color: '#C4C4C5'}]}>{String.fromCharCode(0xe7e0)}</Text>
                        </TouchableOpacity>
                        {this.showLins()}
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openBalanceInquiry();
                        }}>
                            <Text style={[styles.cellIcon, {color: '#F4B56B'}]}>{String.fromCharCode(0xe743)}</Text>
                            <Text style={styles.cellTitle}>我的余额</Text>
                            <Text style={styles.cellValue}></Text>
                            {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                            <Text style={[styles.rightArrow, {color: '#C4C4C5'}]}>{String.fromCharCode(0xe7e0)}</Text>
                        </TouchableOpacity>
                        {this.showLins()}

                    </View>
                </View>
            );
        }
    }

    _renderFileCell() {
        return (
            <View>
                <View>
                    <TouchableOpacity style={styles.cellContentView} onPress={() => {
                        this.openMyFiles();
                    }}>
                        <Text style={[styles.cellIcon, {color: '#67B576'}]}>{String.fromCharCode(0xe742)}</Text>
                        <Text style={styles.cellTitle}>我的文件</Text>
                        <Text style={styles.cellValue}></Text>
                        {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                        <Text style={[styles.rightArrow, {color: '#C4C4C5'}]}>{String.fromCharCode(0xe7e0)}</Text>
                    </TouchableOpacity>
                </View>
                {this.showLins()}
            </View>
        );
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
                            {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                            <Text style={[styles.rightArrow, {color: '#C4C4C5'}]}>{String.fromCharCode(0xe7e0)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}>

                    </View>
                </View>
            );
        }
    }

    _showToCManager(){
        if(AppConfig.isToCManager()){
            return(
                <View>
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openToCManager();
                        }}>
                            <Text style={[styles.cellIcon, {color: '#F4B56B'}]}>{String.fromCharCode(0xe894)}</Text>
                            <Text style={styles.cellTitle}>管理后台</Text>
                            <Text style={styles.cellValue}></Text>
                            <Text style={[styles.rightArrow, {color: '#C4C4C5'}]}>{String.fromCharCode(0xe7e0)}</Text>
                        </TouchableOpacity>
                    </View>
                    {this.showLins()}
                </View>
            );
        }
    }


    _showPersonalCard2(headerUri, nickName, mood, Department) {

        let  req;
        let iosr = require('../images/back_shadow_ios.png');
        let andr = require('../images/back_shadow.png');

        let qr;
        let iosqr = require('../images/qrcode_ios.png');
        let andqr = require('../images/qrcode.png');
        if(Platform.OS == 'ios'){
            req = iosr
            qr = iosqr
        }else{
            req = andr
            qr = andqr
        }

        return (
            <View>
                <ImageBackground style={styles.backHeaderup}
                                 source={req}
                    //enum('cover', 'contain', 'stretch', 'repeat', 'center')
                    //resizeMode="contain"
                >
                    <View style={styles.userHeader2}>
                        <TouchableOpacity style={{backgroundColor: '#00000000', flex: 115, flexDirection: 'row'}}
                                          onPress={() => {
                                              this.openPersonalData();
                                          }}
                        >
                            <View style={{
                                backgroundColor: '#00000000',
                                flex: 232,
                                flexDirection: 'column',
                            }}>

                                <View style={{
                                    backgroundColor: '#00000000', flex: 75, flexDirection: 'row',
                                    marginTop: ScreenUtils.scaleSize(25)
                                }}>
                                    <Text style={{
                                        marginLeft: ScreenUtils.scaleSize(19),
                                        color: '#3B424F',
                                        fontSize: ScreenUtils.setSpText(21),
                                        fontWeight: 'bold',
                                    }}>{nickName}</Text>
                                </View>
                                <View style={{backgroundColor: '#00000000', flex: 138}}>
                                    <Text
                                        style={{
                                            marginLeft: ScreenUtils.scaleSize(19),
                                            color: '#999999',
                                            fontSize: ScreenUtils.setSpText(13),
                                            lineHeight: 18,
                                        }}
                                        numberOfLines={2} ellipsizeMode={'tail'}
                                    >{mood}</Text>
                                </View>
                            </View>
                            <View style={{
                                backgroundColor: '#00000000',
                                flex: 114,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image source={{uri: headerUri}} style={styles.userHeaderImage2}/>
                            </View>
                        </TouchableOpacity>
                        <View style={{backgroundColor:Platform.OS=='ios'?'#f5f5f5':'#eeeeee', height:Platform.OS=='ios'?1:0.7}}/>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#00000000',
                                flex: 41,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}

                            onPress={() => {
                                this.openUserQRCode();
                            }}
                        >
                            <Text
                                style={{
                                    marginLeft: ScreenUtils.scaleSize(19),
                                    fontSize: ScreenUtils.setSpText(14),
                                    color: '#bfbfbf',
                                }}
                            >二维码名片</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: ScreenUtils.scaleSize(6)}}>
                                <Image source={qr} style={styles.qrCodeIcon}/>
                                <Text style={[styles.rightArrow, {color: '#C4C4C5',marginRight:ScreenUtils.scaleSize(10)}]}>{String.fromCharCode(0xe7e0)}</Text>
                                {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow2}/>*/}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

            </View>

        )
    }


    openUserQRCode() {
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        // this.props.navigation.navigate('UserQRCode', {
        //     'backTitle': "个人资料",
        //     'userId': this.state.userInfo["UserId"],
        //     'userName': this.state.userInfo["Name"],
        //     'userHeader': this.state.userInfo["HeaderUri"],
        // });


        let params = {};
        params["Bundle"] = "clock_in.ios";
        params["Module"] = "MySetting";
        params["Properties"] = {};
        params["Properties"]["Screen"] = "UserQRCode";
        params["Properties"]["userId"] = this.state.userInfo["UserId"];
        params["Properties"]["userName"] = this.state.userInfo["Name"];
        params["Properties"]["userHeader"] = this.state.userInfo["HeaderUri"];
        params["Version"] = "1.0.0";
        NativeModules.QimRNBModule.openRNPage(params, function () {

        });
        // } else {
        // }



    }

    showLins() {
        return (<View style={{
            height: Platform.OS=='ios'?1:0.7,
            marginLeft: ScreenUtils.scaleSize(25),
            backgroundColor: Platform.OS=='ios'?"#f5f5f5":"#eeeeee",
        }}/>)
    }

    _showPersonalCard(headerUri, nickName, mood) {
        return (
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
                <Text style={[styles.rightArrow, {color: '#C4C4C5'}]}>{String.fromCharCode(0xe7e0)}</Text>

                {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
            </TouchableOpacity>
        )
    }

    render() {
        let nickName = "";
        let mood = "这家伙很懒什么都没留"; //'/Users/admin/Documents/big_image.gif'
        let headerUri = "../images/singleHeaderDefault.png";
        let Department = "未知";
        if (this.state.userInfo) {
            nickName = this.state.userInfo["Name"];
            headerUri = this.state.userInfo["HeaderUri"];
            Department = this.state.userInfo["Department"];
            // mood = this.state.userInfo["Mood"];
        }
        if (this.state.userMood) {
            mood = this.state.userMood
        }
        let containerStyle = {flex: 1};
        if (Platform.OS == 'android') {
            containerStyle = {height: (height - 105 - StatusBar.currentHeight)};
        }
        return (
            <View style={[styles.wrapper, containerStyle]}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    {this._showPersonalCard2(headerUri, nickName, mood, Department)}
                    {/*<View style={styles.line}>*/}

                    {/*</View>*/}
                    {this._renderRedPackage()}

                    {/*{this._showAccountInfo()}*/}
                    {this._renderFileCell()}
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openAdviceAndFeedback();
                        }}>
                            <Text style={[styles.cellIcon, {color: '#839DDB'}]}>{String.fromCharCode(0xe744)}</Text>
                            <Text style={styles.cellTitle}>意见反馈</Text>
                            <Text style={styles.cellValue}></Text>
                            <Text style={[styles.rightArrow, {color: '#C4C4C5'}]}>{String.fromCharCode(0xe7e0)}</Text>
                            {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                        </TouchableOpacity>

                        {/*<TouchableOpacity style={styles.cellContentView} onPress={() => {*/}
                        {/*this.openSetting();*/}
                        {/*}}>*/}
                        {/*<Text style={styles.cellIcon}>{String.fromCharCode(0xf0ed)}</Text>*/}
                        {/*<Text style={styles.cellTitle}>设置</Text>*/}
                        {/*<Text style={styles.cellValue}></Text>*/}
                        {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    {this.showLins()}
                    {this._showToCManager()}
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
        backgroundColor: "#ffffff",
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
        height: ScreenUtils.scaleSize(61),

        paddingLeft: ScreenUtils.scaleSize(26),
        alignItems: "center",
        flex: 1,
    },
    cellIcon: {
        fontFamily: "QTalk-QChat",
        fontSize: ScreenUtils.setSpText(28),
        color: "#fc3da4",
        marginRight: ScreenUtils.scaleSize(5),
    },
    cellTitle: {
        width: ScreenUtils.scaleSize(100),
        fontSize: ScreenUtils.setSpText(16),
        marginLeft: ScreenUtils.scaleSize(12),
        color: "#333333",
    },
    cellValue: {
        flex: 1,

        textAlign: "right",
        color: "#999999",
    },
    rightArrow: {
        fontFamily: "QTalk-QChat",
        fontSize: ScreenUtils.setSpText(15),
        width: ScreenUtils.scaleSize(20),
        height: ScreenUtils.scaleSize(20),
        marginRight: ScreenUtils.scaleSize(16),
        color: '#333333',
    },
    rightArrow2: {
        width: ScreenUtils.scaleSize(20),
        height: ScreenUtils.scaleSize(20),
        marginRight: ScreenUtils.scaleSize(5),
    },
    backHeaderup: {
        //enum('cover', 'contain', 'stretch', 'repeat', 'center')
        backgroundColor: Platform.OS=='ios'?'#fafafa':'#f6f6f6',
        height: ScreenUtils.scaleSize(197),
        width: width,
        resizeMode: 'stretch',
        flexDirection: "row",
        alignItems: "center",

    },
    backHeaderdown: {
        //enum('cover', 'contain', 'stretch', 'repeat', 'center')

        paddingLeft: ScreenUtils.scaleSize(15),
        paddingRight: ScreenUtils.scaleSize(15),
        height: ScreenUtils.scaleSize(62),
        width: width,
        backgroundColor: 'blue',
        resizeMode: 'stretch',
        flexDirection: "row",
        alignItems: "center",

    },
    userHeader2: {
        height: ScreenUtils.scaleSize(157),
        flex: 1,
        borderRadius: 6,
        marginLeft: ScreenUtils.scaleSize(15),
        marginRight: ScreenUtils.scaleSize(15),
        backgroundColor: "#ffffff",
        flexDirection: "column",
    },
    userHeader: {
        height: ScreenUtils.scaleSize(80),
        backgroundColor: "#FFF",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#EAEAEA",
        alignItems: "center",
    },
    userHeaderImage2: {
        width: ScreenUtils.scaleSize(65),
        height: ScreenUtils.scaleSize(65),
        borderRadius: ScreenUtils.scaleSize(13),
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
    qrCodeIcon2: {
        width: ScreenUtils.scaleSize(17),
        height: ScreenUtils.scaleSize(17),
    },
    walletInfo: {},
});
