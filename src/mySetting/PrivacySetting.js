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
    Switch, Alert,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import AppConfig from "../common/AppConfig";

export default class PrivacySetting extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "隐私设置";
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

    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.unMount = true;
    }

    openBlackContacts(){
        //跳转到黑名单
        let params = {};
        params["Bundle"] = 'clock_in.ios';
        params["Module"] = 'Contacts';
        params["Properties"] = {};
        params["Properties"]["Screen"] = "BlackContacts";
        params["Version"] = "1.0.0";
        NativeModules.QimRNBModule.openRNPage(params, function () {

        });
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>

                    <View>
                        <View style={styles.line}/>

                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openBlackContacts();
                        }}>
                            <Text style={styles.cellTitle}>我的黑名单</Text>
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