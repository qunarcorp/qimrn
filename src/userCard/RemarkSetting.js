import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TextInput,
    NativeModules,
    DeviceEventEmitter,
    Alert,
    Platform,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";

export default class RemarkSetting extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "修改备注";
        // console.log(headerTitle);
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
            if (navigation.state.params.onSavePress) {
                navigation.state.params.onSavePress();
            }
        }}>保存</NavCBtn>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
            headerRight: rightBtn,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.navigation.state.params.userId,
            remark: this.props.navigation.state.params.remark,
            name: this.props.navigation.state.params.name,
        }
        this.unMount = false;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress: this.onSaveRemark.bind(this),
        });
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    onSaveRemark() {
        let parma = {};
        if (this.state.userId === '' || this.state.userId === null) {
            return;
        }
        parma["UserId"] = this.state.userId;
        parma["Remark"] = this.state.remark;
        parma["Name"] = this.state.name;
        if (Platform.OS === 'ios') {
            parma["Remark"] = this.remarkText;
        }
        NativeModules.QimRNBModule.saveRemark(parma, function (responce) {

            if (responce.ok) {
                DeviceEventEmitter.emit("updateRemark", parma);
                this.props.navigation.goBack();
            } else {
                Alert.alert("提示", "设置失败");
            }


        }.bind(this));
    }

    personalRemarkChangeText(text) {
        if (Platform.OS === 'ios') {
            this.remarkText = text;
        } else {
            this.setState({remark:text});
        }
    }
    render() {
        return (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <View style={styles.line}/>
                <View style={styles.remarks}>
                    <View style={styles.cellContentView}>
                        <Text>备注：</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="请输入要设置的备注名"
                            defaultValue={this.state.remark}
                            onChangeText={(text) => this.personalRemarkChangeText(text)}
                            underlineColorAndroid='transparent'
                            clearButtonMode="while-editing"
                        />
                    </View>
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
        // paddingVertical: 20
    },
    remarks: {
        height: 50
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
        height: 40,
        backgroundColor: "#FFF",
    }
});