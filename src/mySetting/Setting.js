import
    React, {
    Component
}
    from
        'react';
import {
    ScrollView,
    View,
    Image,
    Text,

    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Switch,
    Platform,
    Alert, NativeAppEventEmitter,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import AppConfig from "../common/AppConfig";

export default class Setting extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "设置";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"MySetting"}/>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            // onLinePushState: false,
            // notifySoundState: false,
            // notifyVibrationState: false,
            // startPushState: false,
            // notifyPushDetailsState: false,
            waterMarkState:true,
            userModState: false,
            AppCache: "",
            ServiceState: "",
        };
        this.unMount = false;
        this.AppVersion = "";
    }

    componentWillMount() {

    }

    componentDidMount() {

        // //获取用户在线状态
        // NativeModules.QimRNBModule.syncOnLineNotifyState(function (response) {
        //     let state = response.state;
        //     this.setState({onLinePushState: state});
        // }.bind(this));
        //
        // //获取用户通知声音状态
        // NativeModules.QimRNBModule.getNotifySoundState(function (response) {
        //     let state = response.state;
        //     this.setState({notifySoundState: state});
        // }.bind(this));
        //
        //
        // //获取用户是否显示通知详情
        // NativeModules.QimRNBModule.getNotifyPushDetailsState(function (response) {
        //     let state = response.state;
        //     this.setState({notifyPushDetailsState: state});
        // }.bind(this));
        //
        // //获取消息推送状态
        // NativeModules.QimRNBModule.getStartPushState(function (response) {
        //     let state = response.state;
        //     this.setState({startPushState: state});
        // }.bind(this));
        //
        // //获取用户通知震动状态
        // NativeModules.QimRNBModule.getNotifyVibrationState(function (response) {
        //     let state = response.state;
        //     this.setState({notifyVibrationState: state});
        // }.bind(this));

        //获取用户签名状态
        NativeModules.QimRNBModule.getShowUserModState(function (response) {
            let state = response.state;
            this.setState({userModState: state});
        }.bind(this));

        if (AppConfig.getShowServiceState()) {
            //获取客服服务模式
            NativeModules.QimRNBModule.getServiceState(function (response) {
                let serviceState = response.ServiceState;
                this.setState({ServiceState: serviceState});
            }.bind(this));
        }

        //获取App缓存大小
        NativeModules.QimRNBModule.getAppCache(function (response) {
            let appCache = response.AppCache;
            this.setState({AppCache: appCache});
        }.bind(this));

        //获取App版本号
        NativeModules.QimRNBModule.getAppVersion(function (response) {
            let appVersion = response.AppVersion;
            this.AppVersion = "V" + appVersion;
        }.bind(this));

        if (Platform.OS !== 'ios') {
            //获取是否开启聊天背景水印
            NativeModules.QimRNBModule.getWaterMark(function (isOpen) {
                this.setState({
                    waterMarkState:isOpen,
                });
            }.bind(this));
        }

        this.willShow = NativeAppEventEmitter.addListener(
            'QIM_AppCache_Will_Update',
            () => {
                NativeModules.QimRNBModule.getAppCache(function (response) {
                    // console.log("QimRNBModule.getAppCache" + response.AppCache);
                    let appCache = response.AppCache;
                    this.setState({AppCache: appCache});
                }.bind(this));
            }
        );
    }

    componentWillUnmount() {
        this.unMount = true;
    }


    //优先显示心情短语
    showUserModState(userModState) {
        NativeModules.QimRNBModule.updateShowUserModState(userModState, function (response) {
                if (response.ok) {

                } else {
                    Alert.alert("提示", "修改优先展示心情短语状态失败");
                    this.setState({userModState: !userModState});
                }
            }.bind(this)
        );
    }

    //打开个性装扮
    openDressUpVC() {
        if (Platform.OS == 'android') {
            let params = {};
            params["NativeName"] = "DressUpVc";
            NativeModules.QimRNBModule.openNativePage(params);
        } else if (Platform.OS == 'ios') {
            NativeModules.QimRNBModule.openDressUpVc();
        }
    }

    //历史消息查询
    openSearchHistoryVc() {
        if (Platform.OS == 'ios') {
            NativeModules.QimRNBModule.openSearchHistoryVc();
        } else if (Platform.OS == 'android') {
            let params = {};
            params['NativeName'] = 'searchChatHistory';
            NativeModules.QimRNBModule.openNativePage(params);
        }
    }

    //清空消息列表
    clearSessionList() {
        Alert.alert('提示', '该操作将会删除所有会话及消息,确定要继续么?',
            [
                {text: "确定", onPress: this._clearSessionListPressOk},
                {text: "取消", onPress: this._clearSessionListPressCancel},
            ]
        )
    }

    _clearSessionListPressOk() {
        NativeModules.QimRNBModule.clearSessionList();
    }

    _clearSessionListPressCancel() {

    }


    //打开账号管理
    openMcConfig() {
        if (Platform.OS == 'android') {
            let params = {};
            params["NativeName"] = "McConfig";
            NativeModules.QimRNBModule.openNativePage(params);
        } else if (Platform.OS == 'ios') {
            NativeModules.QimRNBModule.openMcConfig();
        }
    }

    //账号切换
    openAccountSwitch() {
        if (Platform.OS == 'android') {
            let params = {};
            params["NativeName"] = "AccountSwitch";
            NativeModules.QimRNBModule.openNativePage(params);
        } else if (Platform.OS == 'ios') {
            NativeModules.QimRNBModule.openSwitchAccount();
        }
    }

    //更新第三方配置
    updateCheckConfig() {

        NativeModules.QimRNBModule.updateCheckConfig();
    }

    //清除缓存 ，应该回调通知刷新界面
    clearAppCache() {
        if (Platform.OS == 'android') {
            NativeModules.QimRNBModule.clearAndroidAppCache(function (response) {
                if (response.ok) {
                    let appCache = '0.00kb';
                    this.setState({AppCache: appCache});
                } else {
                    Alert.alert("提示", "清空缓存失败");
                }
            }.bind(this));
        } else if (Platform.OS == 'ios') {
            NativeModules.QimRNBModule.clearAppCache();
        }
    }

    //打开系统设置
    openSysSetting() {
        let params = {};
        params["NativeName"] = "SystemSetting";
        NativeModules.QimRNBModule.openNativePage(params);
    }

    //打开服务状态设置
    openServiceStateSetting(){
        this.props.navigation.navigate("ServiceState")
    }

    //打开反馈
    openAdviceAndFeedback() {
        if (Platform.OS === 'ios') {
            let params = {};
            params["Bundle"] = "clock_in.ios";
            params["Module"] = "MySetting";
            params["Properties"] = {};
            params["Properties"]["Screen"] = "AdviceAndFeedback";
            NativeModules.QimRNBModule.openRNPage(params, function () {

            });
        } else {

        }
    }

    //关于我们
    openAbout() {
        if (AppConfig.getRNAboutView() == 1) {
            this.props.navigation.navigate('About', {
                'backTitle': "设置",
            });
        } else {

            if (Platform.OS == 'android') {
                let params = {};
                params["NativeName"] = "About";
                NativeModules.QimRNBModule.openNativePage(params);
            } else if (Platform.OS == 'ios') {
                NativeModules.QimRNBModule.openAbout();
            }
        }
    }
    //更改水印背景设置（仅限本地）
    changeWaterMarkState(value){
        NativeModules.QimRNBModule.setWaterMark(value);
    }

    _renderModSetting() {
        if (Platform.OS == 'ios') {
            return (<View>
                <View>
                    <View style={styles.cellContentView}>
                        <Text style={styles.cellTitle}>优先显示心情短语</Text>
                        <View style={styles.cellValue2}>
                            <Switch style={{transform: [{scaleX: .8}, {scaleY: .8}]}} value={this.state.userModState}
                                    onValueChange={(value) => {
                                        this.setState({userModState: value});
                                        this.showUserModState(value);
                                    }}/>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.cellContentView} onPress={() => {
                        this.openDressUpVC();
                    }}>
                        <Text style={styles.cellTitle}>个性装扮</Text>
                        <Text style={styles.cellValue}></Text>
                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.line}>
                </View>
            </View>);
        }
    }


    //退出登录
    logout() {
        Alert.alert('提示', '确定退出么?',
            [
                {text: "确定", onPress: this._logoutOnPressOK},
                {text: "取消", onPress: this._logoutOnPressCancel},

            ]
        );
    }

    _logoutOnPressOK() {
        NativeModules.QimRNBModule.logout();
    }

    _logoutOnPressCancel() {

    }

    _showCheckConfig() {
        if (Platform.OS == 'ios') {
            return (
                <View>
                    <TouchableOpacity style={styles.cellContentView} onPress={() => {
                        this.updateCheckConfig();
                    }}>
                        <Text style={styles.cellTitle}>更新第三方配置</Text>
                        <Text style={styles.cellValue}></Text>
                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                </View>
            );
        } else {

        }
    }

    _showSysSetting() {
        if (Platform.OS == 'android') {
            return (
                <View>
                    <TouchableOpacity style={styles.cellContentView} onPress={() => {
                        this.openSysSetting();
                    }}>
                        <Text style={styles.cellTitle}>系统设置</Text>
                        <Text style={styles.cellValue}></Text>
                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                </View>
            );
        } else  {

        }
    }

    _showWaterMark() {
        if (Platform.OS == 'android') {
            return (
                <View style={styles.cellContentView}>
                    <Text style={styles.cellTitle}>水印背景</Text>
                    <View style={styles.cellValue2}>
                        <Switch style={{transform: [{scaleX: .8}, {scaleY: 0.8}]}}
                                value={this.state.waterMarkState}
                                onValueChange={(value) => {
                                    this.setState({
                                        waterMarkState:value,
                                    });
                                    this.changeWaterMarkState(value);
                                }}/>
                    </View>
                </View>
            );
        } else  {

        }
    }

    _showServiceState() {
        if (AppConfig.getShowServiceState()) {
            return (
                <View>
                    <TouchableOpacity style={styles.cellContentView} onPress={() => {
                        this.openServiceStateSetting();
                    }}>
                        <Text style={styles.cellTitle}>服务状态</Text>
                        <Text style={styles.cellValue}></Text>
                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                </View>
            );
        }

    }

    _showAccountManager() {
        if (AppConfig.isQtalk()) {
            return (
                <View>
                    <TouchableOpacity style={styles.cellContentView} onPress={() => {
                        this.openMcConfig();
                    }}>
                        <Text style={styles.cellTitle}>账号管理</Text>
                        <Text style={styles.cellValue}></Text>
                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    _showAccountSwitch(){
        if (AppConfig.isQtalk()) {
            return (
                <View>
                    <TouchableOpacity style={styles.cellContentView} onPress={() => {
                        this.openAccountSwitch();
                    }}>
                        <Text style={styles.cellTitle}>切换账号</Text>
                        <Text style={styles.cellValue}></Text>
                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    _showClearButton() {
        if (AppConfig.isQtalk()) {
            return (
                <View>
                    <TouchableOpacity style={styles.cellContentView} onPress={() => {
                        this.clearSessionList();
                    }}>
                        <Text style={[styles.cellTitle, {color: "#FB4656"}]}>清空消息列表</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    openNotificationSetting(){
        this.props.navigation.navigate('NotificationSetting', {
            'innerVC': true,
        });
    }

    openPrivacySetting(){
        this.props.navigation.navigate('PrivacySetting', {
            'innerVC': true,
        });
    }

    render() {

        let AppCache = this.state.AppCache;
        let AppVersion = this.AppVersion;
        return (
            <View style={styles.wrapper}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.sectionHeader}>
                        通用
                    </Text>
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openNotificationSetting();
                        }}>
                            <Text style={styles.cellTitle}>通知</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openPrivacySetting();
                        }}>
                            <Text style={styles.cellTitle}>隐私设置</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>


                    <Text style={styles.sectionHeader}>
                        对话
                    </Text>


                    {this._renderModSetting()}


                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openSearchHistoryVc();
                        }}>
                            <Text style={[styles.cellTitle, {color: "#03A9F4"}]}>历史消息查询</Text>
                        </TouchableOpacity>
                        {this._showClearButton()}
                    </View>

                    <View style={styles.line}>
                    </View>
                    <View>

                        {this._showAccountManager()}
                        {this._showAccountSwitch()}
                        {this._showCheckConfig()}
                        {this._showServiceState()}

                    </View>

                    <Text style={styles.sectionHeader}>
                        通用设置
                    </Text>
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.clearAppCache();
                        }}>
                            <Text style={styles.cellTitle}>清除缓存</Text>
                            <Text style={styles.cellValue}>{AppCache}</Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>

                        {this._showSysSetting()}
                        {this._showWaterMark()}

                    </View>
                    <Text style={styles.sectionHeader}>
                        其他
                    </Text>
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openAbout();
                        }}>
                            <Text style={styles.cellTitle}>关于我们</Text>
                            <Text style={styles.cellValue}>{AppVersion}</Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}>

                    </View>
                    <View style={{marginBottom: 60}}>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.logout();
                        }}>
                            <Text
                                style={[styles.cellTitle, {flex: 1, color: "#FB4656", textAlign: "center"}]}>退出登录</Text>
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
    scrollView: {
        flex: 1,
        backgroundColor: "#EAEAEA",
    },
    contentContainer: {
        // paddingVertical: 20
    },
    line: {
        height: 20,
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: 44,
        borderBottomWidth: 1,
        borderColor: "#EAEAEA",
        paddingLeft: 10,
        alignItems: "center",
        flex: 1,
    },
    cellIcon: {
        width: 24,
        height: 24,
        lineHeight: 24,
        fontFamily: "QTalk-QChat",
        fontSize: 22,
        color: "#888888",
        marginRight: 5,
    },
    cellTitle: {
        width: 200,
        color: "#212121",
        fontSize: 14,
    },
    cellValue: {
        flex: 1,
        textAlign: "right",
        color: "#999999",
        marginRight: 5,
    },
    cellValue2: {
        flex: 1,
        alignItems: "flex-end",
        paddingRight: 5,
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    sectionHeader: {
        height: 40,
        lineHeight: 40,
        paddingLeft: 10,
        color: "#616161",
        fontSize: 12,
    },
});