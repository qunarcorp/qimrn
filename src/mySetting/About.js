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
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import AppConfig from "../common/AppConfig";

export default class Setting extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "设置";
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
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
        this.state = {};
        this.unMount = false;
        this.AppVersion = "";
    }

    componentDidMount() {
        NativeModules.QimRNBModule.getAppVersion(function (response) {
            // console.log("getAppVersion " + response);
            let appVersion = response.AppVersion;
            this.AppVersion = "版本" + appVersion;
        }.bind(this));

        NativeModules.QimRNBModule.getMyInfo(function (responce) {
            let userInfo = responce.MyInfo;
            this.setState({userInfo: userInfo});
        }.bind(this));
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    //App评分
    rateApp() {
        let AppStr = "";
        if (AppConfig.getProjectType() === 0) {     //QTalk
            AppStr = "itms-apps://itunes.apple.com/cn/app/qchat/id994868843?mt=8";
        } else if (AppConfig.getProjectType() === 1) {  //QChat
            AppStr = "itms-apps://itunes.apple.com/cn/app/qtalk/id1000198342?mt=8";
        } else {

        }
        let params = {};
        params["AppStr"] = AppStr;
        NativeModules.QimRNBModule.rateApp(params, function () {

        });
    }

    render() {

        var appIcon = (AppConfig.getProjectType() === 0) ? require('../images/qtalk_icon.png') : require('../images/qchat_icon.png');
        let AppVersion = this.AppVersion;
        return (
            <View style={styles.wrapper}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.logoHeader}>
                        <Image source={appIcon} style={styles.logoImage}/>
                        <Text style={styles.versionLabel}>{AppVersion}</Text>
                    </View>
                    <View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>新功能介绍</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>升级新版本</Text>
                            <Text style={styles.cellValue}>已是最新版本</Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>版本历史</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </View>
                    </View>
                    <View style={styles.line}></View>
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.rateApp();
                        }}>
                            <Text style={styles.cellTitle}>去评分</Text>
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
        fontSize:14,
    },
    cellValue: {
        flex: 1,
        textAlign: "right",
        color: "#999999",
        marginRight:5,
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
    logoHeader: {
        height: 146,
        alignItems:"center",
        justifyContent:"center",
    },
    logoImage:{
        width:64,
        height:64,
        backgroundColor:"#FF0000"
    },
    versionLabel:{
        marginTop:5,
        fontSize:12,
        color:"#212121",
    },
});