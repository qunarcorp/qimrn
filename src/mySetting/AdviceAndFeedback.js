import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TextInput,
    NativeModules,
    Alert,
    Platform,
    TouchableOpacity,
    BackHandler, DeviceEventEmitter,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import LoadingView from "../common/LoadingView";
import AppConfig from "../common/AppConfig";
import QIMCheckBox from '../common/QIMCheckBox';
import {QIMProgress} from '../common/QIMProgress';
import {QIMLoading} from "../common/QIMLoading";

export default class AdviceAndFeedback extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "建议和反馈";
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
            userId: this.props.navigation.state.params.userId,
            chooseLocalLog: true,
        }
        this.unMount = false;
    }

    componentDidMount() {
        this.feedBackProgress = DeviceEventEmitter.addListener('updateFeedBackProgress', function (params) {
            this.updateFeedBackProgress(params);
        }.bind(this));
    }

    componentWillUnmount() {
        this.unMount = true;
        DeviceEventEmitter.removeAllListeners();
    }

    updateFeedBackProgress(params) {
        console.log("上传进度" + params);
        let progress = params["progress"];
        // QIMProgress.updateProgress(progress);
    }

    openDeveloperChat() {
        if (Platform.OS == 'android') {
            let params = {};
            params["NativeName"] = "DeveloperChat";
            NativeModules.QimRNBModule.openNativePage(params);
        } else if (Platform.OS == 'ios') {
            NativeModules.QimRNBModule.openDeveloperChat();
        }

    }

    sendAdviceMsg() {
        if (this.state.adviceText && Platform.OS != 'ios') {
            LoadingView.show('发送中,请稍后');
            NativeModules.QimRNBModule.sendAdviceMessage(this.state.adviceText,function (response) {
                LoadingView.hidden();
                if(response.ok){
                    let moduleName = "MySetting";
                    if (Platform.OS === 'ios') {
                        AppConfig.exitApp(moduleName);
                    } else {
                        BackHandler.exitApp();
                    }
                }　else  {
                    console.log("发送日志失败");
                }
            }.bind(this));
        } else if (this.state.adviceText && Platform.OS == 'ios') {

            let param = {};
            param["adviceText"] = this.state.adviceText;
            param["logSelected"] = this.state.chooseLocalLog;
            NativeModules.QimRNBModule.sendAdviceMessage(param, function (response) {
                if(response.ok){
                    let moduleName = "MySetting";
                    if (Platform.OS === 'ios') {
                        AppConfig.exitApp(moduleName);
                        QIMLoading.hidden();
                    } else {
                        BackHandler.exitApp();
                    }
                }　else  {
                    console.log("发送日志失败");
                }
            }.bind(this));

        } else {
            Alert.alert("提示", "请输入要反馈的内容");
        }
    }

    showChooseLogView() {
        if (Platform.OS === 'ios') {
            return (
                <View style={styles.checkBox}>
                    <QIMCheckBox style={styles.ckBox} size={16} checked={this.state.chooseLocalLog} onValueChange={(value) => {
                        console.log("更改checkBox状态 : "+ value);
                        this.setState({
                            chooseLocalLog:value,
                        });
                    }}
                    />
                    <Text style={styles.uploadLocalLog}>上传日志</Text>
                </View>
            );
        }
    }

    render() {
        return (

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <Text>建议和反馈：</Text>
                <TextInput
                    style={styles.textInput}
                    multiline={true}
                    placeholder="请简要描述一下问题"
                    onChangeText={(text) => this.setState({adviceText: text})}
                    underlineColorAndroid='transparent'
                    clearButtonMode="while-editing"
                    // defaultValue="请简要描述一下问题"
                    textAlignVertical='top'
                />
                <TouchableOpacity style={styles.sendBtn} onPress={() => {
                    this.sendAdviceMsg();
                }}>
                    <Text style={styles.sendBtnText}>发送</Text>
                </TouchableOpacity>
                {this.showChooseLogView()}
                <View style={styles.developerBtnView}>
                    <Text style={styles.developerLabel}>点击联系开发人员：</Text>
                    <TouchableOpacity style={{justifyContent: "center", alignItems: "center"}} onPress={() => {
                        this.openDeveloperChat();
                    }}>
                        <Text style={styles.developerBtn}>开发人员</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
var styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#EAEAEA",
    },
    contentContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    line: {
        height: 10,
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: 44,
        borderBottomWidth: 1,
        borderColor: "#EAEAEA",
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
        flex: 1,
    },
    textInput: {
        flex: 1,
        height: 100,
        backgroundColor: "#FFF",
        marginTop: 10,
        marginLeft: -15,
        marginRight: -15,
        paddingLeft: 15,
        paddingRight: 15,
    },
    sendBtn: {
        backgroundColor: "#41CF94",
        flex: 1,
        height: 44,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    sendBtnText: {
        fontSize: 16,
        color: "#FFF",
    },
    uploadLocalLog: {
        height: 16,
        lineHeight: 16,
        fontSize: 14,
        color: "#000000",
    },
    developerBtnView: {
        marginTop: 15,
        height: 30,
        flexDirection: "row",
        alignItems: "flex-start",
    },
    developerLabel: {
        height: 30,
        lineHeight: 30,
        fontSize: 16,
        color: "#666666",
    },
    developerBtn: {
        height: 30,
        lineHeight: 30,
        fontSize: 16,
        color: "#41CF94",
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    circles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ckBox: {
        marginTop: 15,
        marginLeft:15,
        marginRight: 15,
    },
    checkBox: {
        marginTop: 10,
        height: 20,
        flexDirection: "row",
        alignItems: "flex-start",
    }
});
