'use strict';

import React, {Component} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert, Platform, BackHandler,
} from 'react-native';
import NavCBtn from './../common/NavCBtn'
import HttpTools from './../common/HttpTools';
import AppConfig from "../common/AppConfig";
export default class TransferReason extends Component{
    static navigationOptions = ({navigation}) => {
        let headerTitle = "会话转移";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"Merchant"}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
            if (navigation.state.params.onSavePress) {
                navigation.state.params.onSavePress();
            }
        }}>确定</NavCBtn>);
        if (navigation.state.params.innerVC) {
            let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
            leftBtn = (<NavCBtn {...props}/>);
        }
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

        this.shopJid = this.props.navigation.state.params.shopJid;//店铺id
        this.customerName = this.props.navigation.state.params.customerName;//客人id
        this.newCsrName = this.props.navigation.state.params.newCsrName;//新客服id


        this.state = {
            transferReason:"",
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress: this.nextStep.bind(this),
        });
    }


    componentWillUnmount() {
    }

    nextStep(){
        if(this.state.transferReason === ""){
            Alert.alert("提示","请输入转移原因");
            return;
        }
        this._transferCsr();
    }

    _transferCsr(){
        this.transferCsrUrl = AppConfig.getQCAdminHost() + "/seat/transformCsr.json"
            // + this.shopJid +
            // "&currentCsrName=" + AppConfig._userId + "&domain=" + AppConfig._domain + "&customerName=" + this.customerName +
            // "&newCsrName=" + this.newCsrName + "&reason=" + this.state.transferReason;
        let data = {
            shopJid: this.shopJid,
            currentCsrName:AppConfig.getUserId(),
            domain:AppConfig.getDomain(),
            customerName: this.customerName,
            newCsrName: this.newCsrName,
            reason: this.state.transferReason
        };
        HttpTools.get(this.transferCsrUrl,data).then(function (response) {
            if (response.ret) {
                this.closeActivity();
            } else {
                Alert.alert("提示","请求数据失败：" + response.errmsg);
            }
        }.bind(this), function (error) {
            Alert.alert("提示","请求数据失败：" + error);
        });
    }

    closeActivity(){
        //关闭activi
        let moduleName = "Merchant";
        if (Platform.OS === 'ios') {
            AppConfig.exitApp(moduleName);
        } else {
            BackHandler.exitApp();
        }
    }



    render(){
        return (
            <View style={styles.wrapper}>
                <TextInput style={styles.textInput}
                           multiline={true}
                           placeholder=" 请输入转移原因"
                           onChangeText={(text) => this.setState({transferReason: text})}
                           underlineColorAndroid='transparent'
                           clearButtonMode="while-editing"
                           textAlignVertical='top'>
                </TextInput>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#EAEAEA",
    },
    textInput: {
        flex: 1,
        height: 240,
        backgroundColor: "#FFF",
        marginTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
});