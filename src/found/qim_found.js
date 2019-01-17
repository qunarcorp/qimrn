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
        return this.state.itemList.map(function (item, index) {
            return this.renderItem(item, index);
        }.bind(this));
    }

    renderItemIcon(item) {
        // if (item.icon_type == 1){
        //
        // } else {
        return (
            <View>
                <Text style={styles.iconStyle}>{String.fromCharCode(parseInt("0x" + item.icon))}</Text>
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
            let key = param['key'];
            let type = param['type'];
            let value = param['value'];
            if (type == 'array') {
                properties[key] = this.initPropertiesArray(value);
            } else if (type == 'map') {
                properties[key] = this.initProperties(value);
            } else if (type == 'string') {
                properties[key] = value;
            } else if (type == 'bool') {
                properties[key] = (value == 'true' ? true : false);
            }
        }
        return properties;
    }

    itemClick(item) {
        // alert(item.title);
        var success = function () {
        };
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
                params['Entrance'] =EntranceName;
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
                <View style={{alignItems: "center"}}>
                    {this.renderItemIcon(item)}
                    <Text style={styles.itemTitle}>{item.title}</Text>
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
        this.state = {
            groupInfo: this.props.info,
        };
    }

    componentWillUnmount() {

    }

    render() {
        // console.log(this.props.id);
        let group = this.state.groupInfo;
        if (group.group.length > 0) {
            return (
                <View key={this.props.id} style={styles.groupContainer}>
                    <View style={styles.groupTitleContainer}>
                        <Text style={styles.groupTitle}>{group.group}</Text>
                    </View>
                    <FoundItemContent id={this.props.id} items={group.items} navigator={this.props.navigator}/>
                </View>
            );
        } else {
            return (
                <View key={this.props.id} style={styles.groupContainer}>
                    <FoundItemContent id={this.props.id} items={group.items} navigator={this.props.navigator}/>
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

    }

    componentWillUnmount() {
        this.willShow.remove();
    }

    loadFoundSetting() {
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
        let key = 'FoundPage_' + this.state.domain;
        console.log("开始");
        AsyncStorage.getItem(key, (error, result) => {
            let version = 0;
            if (result) {
                console.log("1")
            } else {
                console.log("2");
            }
            if (error) {
                console.log("3")
            } else {
                console.log("4")
                try {
                    if (result) {
                        result = JSON.parse(result);
                        if (result.ok) {
                            let configJson = result.data.f_config;
                            this.version = result.data.f_version;
                            this.setState({foundSetting: configJson});
                        }
                    }
                } catch (e) {
                    // console.log(e);
                }
            }
            this.updateFoundSetting(this.version);
        });
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

    _keyExtractor = (item, index) => this.version + "_" + index;

    foundGroupRow(item) {

        if (item.item.type == 'group') {
            return (
                <FoundGroup id={this.version + "_" + item.index} info={item.item}/>
            );
        } else if (item.item.type == 'image') {
            return (
                <Image source={{uri: item.item.image}} style={styles.adImage}/>
            );
        }


    }

    render() {
        // console.log("刷新页面");
        if (this.state.foundSetting) {
            // console.log(this.state.foundSetting);
            let configs = JSON.parse(this.state.foundSetting);
            // console.log(configs);

            let containerStyle = {flex: 1};
            if (Platform.OS == 'android') {
                containerStyle = {height: (height - 105 - StatusBar.currentHeight)};
            }
            return (
                <View style={[styles.container, containerStyle]}>
                    <FlatList
                        style={styles.list}
                        data={configs}
                        // extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this.foundGroupRow.bind(this)}
                    />
                </View>

            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.loadFaildContentView}>
                        <Image style={styles.loadFaildImageStyle} source={require('../images/EmptyNotFound.png')}></Image>
                        <Text style={styles.loadFaildTextStyle}>
                            功能开发中，敬请期待
                        </Text>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAEAEA',
    },
    list: {
        flex: 1,
        backgroundColor: "#EAEAEA"
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
        fontSize: 11,
        color: "#333333"
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
        resizeMode:'contain'
    },
    loadFaildTextStyle: {
        marginTop: 10,
        color: '#999999',
        fontSize: 14,
    }
});
