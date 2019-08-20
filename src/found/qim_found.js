import React, {Component, PureComponent} from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    Dimensions,
    Alert,
    NativeModules,
    DeviceEventEmitter,
    StatusBar,
    Platform,
    NativeAppEventEmitter,
    AsyncStorage,
    PermissionsAndroid,
} from 'react-native';
import HttpTools from "../common/HttpTools";
import AppConfig from "../common/AppConfig";
import native from "../webView/native";

const {height, width} = Dimensions.get('window');

class FoundItemContent extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            itemList: this.props.items,
        };
    }

    drawItemList() {
        return this.props.items.map(function (item, index) {
            return this.renderItem(item, index);
        }.bind(this));
    }

    renderItemIcon(item) {
        // if (item.icon_type == 1){
        //
        // } else {
        return (
            <View>
                <Image style={styles.itemImage} source={{uri: item.memberIcon}}/>
                {/*<Text style={styles.iconStyle}>{String.fromCharCode(parseInt("0x" + item.icon))}</Text>*/}
            </View>
        );
        // }
    }

    initPropertiesArray(params) {
        let result = [];
        for (let index = 0, len = params.length; index < len; index++) {
            let param = params[index];
            let key = param['key'];
            let type = param['type'];
            let value = param['value'];
            if (type == 'array') {
                properties[type] = this.initPropertiesArray(value);
            } else if (type == 'map') {
                properties[type] = this.initProperties(value);
            } else if (type == 'string') {
                properties[type] = value;
            } else if (type == 'bool') {
                properties[type] = (value == 'true' ? true : false);
            }
        }
        return result;
    }

    initProperties(params) {
        let properties = {};
        for (let index = 0, len = params.length; index < len; index++) {
            let param = params[index];
            // let key = param['key'];
            // let type = param['type'];
            // let value = param['value'];
            // if (type == 'array') {
            //     properties[key] = this.initPropertiesArray(value);
            // } else if (type == 'map') {
            //     properties[key] = this.initProperties(value);
            // } else if (type == 'string') {
            //     properties[key] = value;
            // } else if (type == 'bool') {
            //     properties[key] = (value == 'true' ? true : false);
            // }
        }
        return properties;
    }

    itemClick(item) {

        try {
            // mem.putString("Entrance","index.android");
            // mem.putString("Bundle","test");
            // mem.putString("Version","1.0");
            // mem.putString("BundleUrls","https://qim.qunar.com/file/v2/download/temp/new/656627aeff616337c1e7d528d8ba2b7e?name=656627aeff616337c1e7d528d8ba2b7e.jsbundle&file=file/656627aeff616337c1e7d528d8ba2b7e.jsbundle&filename=file/656627aeff616337c1e7d528d8ba2b7e.jsbundle");
            // mem.putString("Module","ComponentsDemo");
            // mem.putString("AppType","2");
            //mem.putBoolean("showNav",true);
            //mem.putString("navTitle","测试RN");
            switch (item.AppType) {
                case "2":
                    // let appParams = JSON.parse(item['appParams']);
                    let bundleName = item['Bundle'];
                    let moduleName = item['Module'];
                    let EntranceName = item['Entrance'];
                    let initProps = item['appParams'];
                    //
                    // for (let index = 0, len = appParams.length; index < len; index++) {
                    //     let appParam = appParams[index];
                    //
                    //         initProps = this.initProperties(appParam['value']);
                    //
                    // }

                    // initProps['111', '111'];
                    // initProps['222', 222];
                    let params = {};
                    params["Bundle"] = bundleName;
                    params["Module"] = moduleName;
                    params['Entrance'] = EntranceName;
                    params["Version"] = item['Version'];
                    params["BundleUrls"] = item['BundleUrls'];
                    params["AppType"] = item['AppType'];
                    params['showNativeNav'] = item['showNativeNav'];
                    params['navTitle'] = item['navTitle'];
                    params["Properties"] = initProps;
                    NativeModules.QimRNBModule.openRNPage(params, function () {

                    });
                    break;

                case "3":

                    // mem.putString("memberAction", membersBean.getMemberAction());
                    // mem.putString("memberIcon", membersBean.getMemberIcon());
                    // mem.putString("memberName", membersBean.getMemberName());
                    // mem.putInt("memberId", membersBean.getMemberId());
                    let webparams = {}
                    webparams["AppType"] = item['AppType'];
                    webparams['memberAction'] = item['memberAction'];
                    webparams['showNativeNav'] = item['showNativeNav'];

                    NativeModules.QimRNBModule.openRNPage(webparams, function () {

                    });

                    break;

                default:

                    break;
            }

        }catch (e){

        }


        if(true){
            return;
        }



        if(true){
            return;
        }
        // alert(item.title);
        // var success = function () {
        // };
        var error = function () {
            Alert.alert('提示', '踩到坑了，重启下qtalk试试');
        };
        if (item.type == 'package') {
            // 内部模块
            let bundleName = 'clock_in.ios';
            let moduleName = 'FoundPage';
            let initProps = {};
            initProps["AppList"] = item.list;
            initProps["Screen"] = "AppList";
            initProps["Title"] = item.title;
            let params = {};
            params["Bundle"] = bundleName;
            params["Module"] = moduleName;
            params["Properties"] = initProps;
            NativeModules.QimRNBModule.openRNPage(params, function () {

            });
        } else {
            if (item.appType == 1) {
                // 内部模块
                // console.log("内部模块");
                let appParams = JSON.parse(item.appParams);
                let bundleName = '';
                let moduleName = '';
                let initProps = null;
                for (let index = 0, len = appParams.length; index < len; index++) {
                    let appParam = appParams[index];
                    if (appParam['key'] == 'BundleName') {
                        bundleName = appParam['value'];
                    } else if (appParam['key'] == 'ModuleName') {
                        moduleName = appParam['value'];
                    } else if (appParam['key'] == 'InitProps') {
                        initProps = this.initProperties(appParam['value']);
                    }
                }
                let params = {};
                params["Bundle"] = bundleName;
                params["Module"] = moduleName;
                params["Version"] = item.appVersion;
                params["Properties"] = initProps;
                params["AppType"] = item.appType;
                NativeModules.QimRNBModule.openRNPage(params, function () {

                });
                // if (item.appUrl == "clock_in") {
                //     let params = {};
                //     params["Bundle"] = "clock_in.ios";
                //     params["Module"] = "ClockIn";
                //     params["Properties"] = {};
                //     params["Properties"]["Screen"] = "ClockIn";
                //     NativeModules.QimRNBModule.openRNPage(params, function () {
                //
                //     });
                // } else if (item.appUrl == "Totp_Token") {
                //     let params = {};
                //     params["Bundle"] = "clock_in.ios";
                //     params["Module"] = "TOTP";
                //     params["Properties"] = {};
                //     params["Properties"]["Screen"] = "Totp";
                //     NativeModules.QimRNBModule.openRNPage(params, function () {
                //
                //     });
                // } else {
                //     Alert.alert("提示", "打开应用失败，请尝试升级。")
                // }
            } else if (item.appType == 2) {
                // console.log("外部应用");
                let appParams = JSON.parse(item.appParams);
                let bundleName = '';
                let moduleName = '';
                let EntranceName = '';
                let initProps = null;
                for (let index = 0, len = appParams.length; index < len; index++) {
                    let appParam = appParams[index];
                    if (appParam['key'] == 'BundleName') {
                        bundleName = appParam['value'];
                    } else if (appParam['key'] == 'ModuleName') {
                        moduleName = appParam['value'];
                    } else if (appParam['key'] == 'EntranceName') {
                        EntranceName = appParam['value'];
                    }
                    else if (appParam['key'] == 'InitProps') {
                        initProps = this.initProperties(appParam['value']);
                    }
                }

                // console.log(item);
                let params = {};
                params["Bundle"] = bundleName;
                params["Module"] = moduleName;
                params['Entrance'] = EntranceName;
                params["Version"] = item.appVersion;
                params["Properties"] = initProps;
                params["BundleUrls"] = item.appUrl;
                params["AppType"] = item.appType;
                NativeModules.QimRNBModule.openRNPage(params, function () {

                });
                // RN应用
            } else {
                // H5应用
                // console.log("H5应用");
                let params = {};
                params["Bundle"] = "clock_in.ios";
                params["Module"] = "WebView";
                params["Properties"] = {};
                params["Properties"]["Screen"] = "WebView";
                params["Properties"]["AppId"] = 2;
                params["Properties"]["Url"] = item.appUrl;
                params["AppType"] = item.appType;
                // console.log(item);
                NativeModules.QimRNBModule.openRNPage(params, function () {

                });
            }
        }
    }

    renderItem(item, index) {
        return (
            <TouchableOpacity key={this.props.id + "_" + index} style={styles.item}
                              onPress={this.itemClick.bind(this, item)}>
                <View style={{alignItems: "center",justifyContent:'center',backgroundColor:'#ffffff'}}>
                    {this.renderItemIcon(item)}
                    <Text style={styles.itemTitle}  ellipsizeMod={'tail'}>{item.memberName}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.itemContainer}>
                {this.drawItemList()}
            </View>
        );
    };
}

class FoundGroup extends PureComponent {

    constructor(props) {
        super(props);
        // this.state = {
        //     groupInfo: this.props.info,
        // };
    }

    componentWillUnmount() {

    }

    render() {
        // console.log(this.props.id);
        let group = this.props.info;
        if (group.length > 0) {
            return (
                <View key={this.props.id} style={styles.groupContainer}>
                    {/*<View style={styles.groupTitleContainer}>*/}
                        {/*<Text style={styles.groupTitle}>{group.group}</Text>*/}
                    {/*</View>*/}
                    {/*<View style={styles.line}></View>*/}
                    <FoundItemContent id={this.props.id} items={group} navigator={this.props.navigator}/>
                </View>
            );
        } else {
            return (
                <View key={this.props.id} style={styles.groupContainer}>
                    <FoundItemContent id={this.props.id} items={group} navigator={this.props.navigator}/>
                </View>
            );
        }
    };
}

export default class FoundPage extends PureComponent {

    static navigationOptions = {
        header: null,
    }

    static routeInfo() {
        return {
            name: "Found",
            title: "发现",
            component: FoundPage
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            domain: this.props.navigation.state.params.domain,
            foundSetting: null,
        };
        // this.state = {domain: "test1.com"};
    }

    componentDidMount() {
        this.loadFoundSetting();
        this.willShow = DeviceEventEmitter.addListener(
            'QIM_RN_Will_Show',
            function (params) {

                this.loadFoundSetting();
            }.bind(this)
        );

        this.updateFound = DeviceEventEmitter.addListener('updateFound', function (params) {
            this.parseFound(params)
        }.bind(this));
    }

    componentWillUnmount() {
        this.willShow.remove();
        this.updateFound.remove();
    }

    parseFound(params) {
        if (params['isOk']) {
            this.setState({
                foundSetting: params['data'],
            })
        }
    }

    loadFoundSetting() {

        NativeModules.QtalkPlugin.getFoundInfo(
            function (response) {
                this.parseFound(response)
            }.bind(this)
        )

        // console.log("sss");
        // AsyncStorage.getItem("aaa",function(errs,result){
        //     //TODO:错误处理
        //     console.log("aaaa");
        // }.bind(this));
        // console.log("asddd");


        // console.log("开始获取数据")
        // try {
        //     let foundKey = 'FoundPage_' + 'apple.com';
        //     let result = await AsyncStorage.get(foundKey);
        //     console.log("获取数据成功"+result);
        //     if (value !== null){
        //         if (result) {
        //             result = JSON.parse(result);
        //             if (result.ok) {
        //                 let configJson = result.data.f_config;
        //                 this.version = result.data.f_version;
        //                 this.setState({foundSetting: configJson});
        //             }
        //         }
        //     }
        // } catch (error) {
        //     console.log(error);
        //     AsyncStorage.removeItem(foundKey);
        // } finally {
        //     console.log("搜索撒大多")
        //     this.updateFoundSetting(this.version);
        // }
        // let key = 'FoundPage_' + this.state.domain;
        // console.log("开始");
        // AsyncStorage.getItem(key, (error, result) => {
        //     let version = 0;
        //     if (result) {
        //         console.log("1")
        //     } else {
        //         console.log("2");
        //     }
        //     if (error) {
        //         console.log("3")
        //     } else {
        //         console.log("4")
        //         try {
        //             if (result) {
        //                 result = JSON.parse(result);
        //                 if (result.ok) {
        //                     let configJson = result.data.f_config;
        //                     this.version = result.data.f_version;
        //                     this.setState({foundSetting: configJson});
        //                 }
        //             }
        //         } catch (e) {
        //             // console.log(e);
        //         }
        //     }
        //     this.updateFoundSetting(this.version);
        // });
    }

    updateFoundSetting(version) {
        var url = AppConfig.FOUND_SETTING + "&host=" + this.state.domain + "&version=" + version;
        console.log(url);
        HttpTools.get(url).then(function (responce) {
                console.log(responce);
                if (responce.ok) {
                    console.log("获取配置信息成功");
                    AsyncStorage.setItem('FoundPage_' + this.state.domain, JSON.stringify(responce), function (error) {
                        if (!error) {
                            // console.log("缓存成功");
                            // console.log(responce.data.f_config);
                            this.version = responce.data.f_version;
                            this.setState({foundSetting: responce.data.f_config});
                        } else {
                            console.log("缓存失败" + error);
                        }
                    }.bind(this));
                } else {
                    console.log("获取配置信息失败33");
                }
            }.bind(this),
            function (error) {
                // console.log("获取配置信息失败");
                // console.log(error);
            }.bind(this));
    }

    // _keyExtractor = (item, index) => this.version + "_" + index;
    _keyExtractor = (item, index) => item['groupId'] + "_" + index;
    _keyExtractorchild = (item, index) => item['groupId'] + "_" + index;


    childItem(item) {

    }

    testApp = (info) => {
        return (
            <View style={{height:200}}>
                <Text>测试数据</Text>
            </View>
        );
    };



    foundGroupRow(item) {

        return (
            <View>
                <View style={styles.groupRow}>
                    {/*这个是图标?*/}
                    {/*<Image style={styles.itemImage} source={{uri: item.item.groupIcon}}/>*/}
                    {/*这个就是旁边的字了把*/}
                    <Text style={styles.groupText}>{item.item['groupName']}</Text>
                </View>
                <FoundGroup id={item.item['groupId'] + "_" + item.index} info={item.item.members}/>
            </View>
        )


        // if (item.item.type == 'group') {
        //     return (
        //         <FoundGroup id={this.version + "_" + item.index} info={item.item}/>
        //     );
        // } else if (item.item.type == 'image') {
        //     return (
        //         <Image source={{uri: item.item.image}} style={styles.adImage}/>
        //     );
        // }


    }

    openNativeScan(){
        try {
            let param = {};
            if (Platform.OS == 'ios') {
                // this.takePhoto();
                NativeModules.QtalkPlugin.openScan(param);
            } else {
                this.requestCameraPermission(PermissionsAndroid.PERMISSIONS.CAMERA, function (response) {
                    if (response.ok) {
                        // this.takePhoto();
                        NativeModules.QtalkPlugin.openScan(param);
                    }
                }.bind(this));
            }
        }catch (e){

        }



    }

    openNativeNoteBook(){
        try {
            let param = {};
            NativeModules.QtalkPlugin.openNoteBook(param);
        }catch (e){}

    }

    openNativeFileTransfer(){
        try {
            let param = {};
            NativeModules.QtalkPlugin.openFileTransfer(param);
        }catch (e){

        }
    }

    openNativeTravelCalendar(){
        try {
            let param = {};
            NativeModules.QtalkPlugin.openTravelCalendar(param);
        }catch (e){}
    }


    async requestCameraPermission(permissions,callback) {
        try {
            const granted = await PermissionsAndroid.request(
                permissions,
                {
                    'title': '请求授予摄像头权限',
                    'message': '请授予摄像头权限进行拍照操作!'
                }
            )
            if (granted=== PermissionsAndroid.RESULTS.GRANTED) {
                callback({"ok":true})
            } else {
                callback({"ok":false})
            }
        } catch (err) {
            // console.warn(err)
            callback({"ok":false})
        }
    }

    _showSettingFound(){
        if (this.state.foundSetting) {
            // let configs = JSON.parse(this.state.foundSetting);




            return (



                    <FlatList
                        style={styles.list}
                        data={this.state.foundSetting}
                        //extraData={this.state}
                        // extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this.foundGroupRow.bind(this)}
                    />


            );
        } else {
            return (
                //  <View style={[styles.container, containerStyle]}>
                //    <View style={styles.loadFaildContentView}>
                //       {/*<Image style={styles.loadFaildImageStyle} source={require('../images/EmptyNotFound.png')}></Image>*/}
                <Text style={styles.loadFaildTextStyle}>
                    功能还未配置,请先进行配置后重启客户端!
                </Text>
                //  </View>
                //</View>
            );
        }
    }


    render() {

        // console.log("刷新页面");
        let containerStyle = {flex: 1,backgroundColor:'#ffffff'};
        if (Platform.OS == 'android') {
            containerStyle = {height: (height - 105 - StatusBar.currentHeight)};
        }

        return (
            <View style={[ containerStyle]}>
                {/*<TouchableOpacity*/}

                {/*onPress={() => {*/}
                {/*this.loadFoundSetting();*/}
                {/*}}*/}

                {/*>*/}
                {/*<Text>测试</Text>*/}
                {/*</TouchableOpacity>*/}
                <View style={{height:100,backgroundColor:'#ffffff'}}>
                    <View style={NewFoundStyles.appointSearchItem}>
                        <TouchableOpacity onPress={() => {
                            this.openNativeNoteBook();
                        }}>
                            <View style={NewFoundStyles.searhItemView}>
                                <Text style={NewFoundStyles.iconStyle1}>{String.fromCharCode(parseInt("0xe7e8;"))}</Text>
                                <Text style={NewFoundStyles.searchItemText}>笔记本</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {

                            this.openNativeTravelCalendar();
                        }}>
                            <View style={NewFoundStyles.searhItemView}>
                                <Text style={NewFoundStyles.iconStyle2}>{String.fromCharCode(parseInt("0xe7eb;"))}</Text>
                                <Text style={NewFoundStyles.searchItemText}>行程</Text>
                            </View>


                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            this.openNativeFileTransfer();
                        }}>

                            <View style={NewFoundStyles.searhItemView}>
                                <Text style={NewFoundStyles.iconStyle3}>{String.fromCharCode(parseInt("0xe7ea;"))}</Text>
                                <Text style={NewFoundStyles.searchItemText}>文件传输助手</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            this.openNativeScan();
                        }}>

                            <View style={NewFoundStyles.searhItemView}>
                                <Text style={NewFoundStyles.iconStyle4}>{String.fromCharCode(parseInt("0xe7e9;"))}</Text>
                                <Text style={NewFoundStyles.searchItemText}>扫一扫</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {this._showSettingFound()}

            </View>

        );



    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    list: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    line:{
      height:1,
      flex:1,
      marginLeft:20,
        backgroundColor:'#999999'
    },
    groupContainer: {
        backgroundColor: "#FFF",
        marginBottom: 15,

    },
    groupTitleContainer: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
    },
    groupTitle: {
        marginLeft: 15,
        fontWeight: "400",
        fontSize: 15,
        lineHeight: 40,
    },
    itemContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        paddingLeft: 5,
        alignItems: "center",
    },
    item: {
        width: (width - 5 * 5) / 4.0,
        height: 80,
        // marginBottom: 5,
        marginTop:7,
        marginRight: 5,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor:"#FF0000",
    },
    iconStyle: {
        color: '#333333',
        fontFamily: 'ops_opsapp',
        fontSize: 32,
    },
    itemTitle: {
        // marginTop: 10,
        fontSize: 12,
        color: "#666666",
        marginTop:7,

    },
    adImage: {
        height: 200,
    },
    loadFaildContentView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    loadFaildImageStyle: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    loadFaildTextStyle: {
        marginTop: 10,
        color: '#999999',
        fontSize: 14,
    },
    itemImage: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor:'#ffffff',
        alignItems: "center",
        justifyContent: "center",
    },
    groupRow: {
        flex: 1,
        paddingLeft:10,
        height: 30,
        flexDirection: "row",
        // justifyContent:"center",
        alignItems:"center",
        backgroundColor: "#F7F7F7",
        // backgroundColor:"red"
    },
    groupText: {
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        lineHeight: 30,
        fontSize: 13,
       // fontWeight: "400",
        color: "#999999",
        marginLeft: 10,
    },
});


const NewFoundStyles = StyleSheet.create({

    wrapper: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    appointSearch: {
        flex: 1,
        backgroundColor: '#ffffff',

        alignItems: 'center',
    },
    appointSearchItem: {
        flex: 1,
        width: '100%',
        backgroundColor:'#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    container: {
        backgroundColor:'#ffffff',
        flexDirection: 'row',   // 水平排布
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
        height: Platform.OS === 'ios' ? 68 : 48,   // 处理iOS状态栏
        // alignItems: 'center'  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
    },
    searchBox: {//搜索框
        height: 35,
        flexDirection: 'row',   // 水平排布
        flex: 1,
        borderRadius: 3,  // 设置圆角边
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
    },
    inputText: {
        backgroundColor: 'transparent',
        flex: 1,
        height: 35,
        lineHeight: 30,
        fontSize: 15,
        padding: 0,
        paddingLeft: 20,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    renderItem: {
        flex: 1,
        flexDirection: "row",
        height: 60,
        padding: 5,
        backgroundColor: 'white',
        alignItems: "center",
    },
    renderItemAppoint: {
        flex: 1,
        flexDirection: "row",
        height: 180,
        padding: 5,
        backgroundColor: 'white',
    },
    renderItemTextCenter: {
        flex: 1,
        marginRight: 5,
    },
    renderItemTextRight: {
        color: '#9E9E9E',
        fontSize: 12,
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    iconStyle1: {
        color: '#F2A83F',
        fontFamily: 'QTalk-QChat',
        fontSize: 32,
    },
    iconStyle2: {
        color: '#628DEA',
        fontFamily: 'QTalk-QChat',
        fontSize: 32,
    },
    iconStyle3: {
        color: '#5CBAA3',
        fontFamily: 'QTalk-QChat',
        fontSize: 32,
    },
    iconStyle4: {
        color: '#9E9EBB',
        fontFamily: 'QTalk-QChat',
        fontSize: 32,
    },
    searhItemView: {
        width:width/4,
        backgroundColor:'#ffffff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchItemText: {
        marginTop: 10,
        fontSize: 12,
        color: '#666666'
    }
});
