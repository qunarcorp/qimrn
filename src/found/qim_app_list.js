import React, {Component, PureComponent} from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    Alert,
    NativeModules,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";

const {height, width} = Dimensions.get('window');

export default class AppList extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = navigation.state.params.Title;
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"FoundPage"}/>);
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
            appList: this.props.navigation.state.params.AppList,
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
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
        if (item.appType == 1) {
            // 内部模块
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
            NativeModules.QimRNBModule.openRNPage(params, function () {

            });
        } else if (item.appType == 2) {
            // RN应用
        } else {
            // H5应用
            let params = {};
            params["Bundle"] = "clock_in.ios";
            params["Module"] = "WebView";
            params["Properties"] = {};
            params["Properties"]["Screen"] = "WebView";
            params["Properties"]["AppId"] = 2;
            params["Properties"]["Url"] = item.appUrl;
            // console.log(item);
            NativeModules.QimRNBModule.openRNPage(params, function () {

            });
        }
    }

    renderItemIcon(item) {
        return (
            <View>
                <Text style={styles.iconStyle}>{String.fromCharCode(parseInt("0x" + item.icon))}</Text>
            </View>
        );
    }

    renderAppList() {
        return this.state.appList.map(function (item, index) {
            return (
                <TouchableOpacity key={this.props.id + "_" + index} style={styles.item}
                                  onPress={this.itemClick.bind(this, item)}>
                    <View style={{alignItems: "center"}}>
                        {this.renderItemIcon(item)}
                        <Text style={styles.itemTitle}>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            );
        }.bind(this));
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.itemContainer}>
                    {this.renderAppList()}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
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
    }
});
