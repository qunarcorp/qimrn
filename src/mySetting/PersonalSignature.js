import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    Alert,
    StyleSheet,
    TextInput,
    NativeModules,
    DeviceEventEmitter,
    Platform,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";

export default class PersonalSignature extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "个性签名设置";
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON}  onPress={() => {
            if (navigation.state.params.onSavePress){
                navigation.state.params.onSavePress();
            }
        }}>保存</NavCBtn>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 18
            },
            headerLeft: leftBtn,
            headerRight: rightBtn,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            userId:this.props.navigation.state.params.userId,
            personalSignature:this.props.navigation.state.params.personalSignature,
            oldPersonalSignature:this.props.navigation.state.params.personalSignature,
        }
        this.unMount = false;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress:this.onSavePersonalSignature.bind(this),
        });
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    onSavePersonalSignature(){
        if (this.state.oldPersonalSignature != this.state.personalSignature || this.state.oldPersonalSignature != this.personalSignature) {
            let parma = {};
            parma["UserId"] = this.state.userId;
            parma["PersonalSignature"] = this.state.personalSignature;
            if (Platform.OS === 'ios') {
                parma["PersonalSignature"] = this.personalSignature;
            }
            NativeModules.QimRNBModule.savePersonalSignature(parma,function (responce) {
                if(responce.ok){
                    DeviceEventEmitter.emit("updatePersonalSignature",parma);
                    this.props.navigation.goBack();
                }else{
                    Alert.alert("提示", "修改个性签名失败!");
                }


            }.bind(this));
        } else {
            Alert.alert("提示", "没有对个性签名做出修改!");
        }
    }

    personalSignatureChangeText(text) {
        if (Platform.OS === 'ios') {
            this.personalSignature = text;
        } else {
            this.setState({personalSignature:text});
        }
    }

    render() {
        return (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <Text>个性签名：</Text>
                <TextInput
                    style={styles.textInput}
                    multiline={true}
                    placeholder="请输入要设置的个性签名"
                    defaultValue={this.state.personalSignature}
                    onChangeText={(text) => this.personalSignatureChangeText(text)}
                    underlineColorAndroid='transparent'

                    clearButtonMode="while-editing"
                />
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
        paddingHorizontal:15,
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
    textInput:{
        flex:1,
        height:120,
        backgroundColor:"#FFF",
        marginTop:10,
        marginLeft:-15,
        marginRight:-15,
        paddingLeft:15,
        paddingRight:15,
    }
});