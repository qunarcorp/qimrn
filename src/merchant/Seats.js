'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity, Alert,
} from 'react-native';
import NavCBtn from './../common/NavCBtn'
import HttpTools from './../common/HttpTools';
import AppConfig from "../common/AppConfig";
import TransferReason from "./TransferReason";
import QIMCheckBox from '../common/QIMCheckBox';

let deaultHeaderUrl = '/file/v2/download/perm/3ca05f2d92f6c0034ac9aee14d341fc7.png';
export default class Seats extends Component{
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
        this.fileUrl = AppConfig._fileUrl;

        this.shopJid = this.props.navigation.state.params.shopJid;//店铺id
        this.customerName = this.props.navigation.state.params.customerName;//客人id

        this.state = {
            seatsData:[],
            selectSeatIndex:-1,
        };
    }

    componentDidMount() {
        this._getSeatsList();
        this.props.navigation.setParams({
            onSavePress: this.nextStep.bind(this),
        });
    }


    componentWillUnmount() {
    }

    nextStep(){
        if(this.state.selectSeatIndex === -1){
            return;
        }
        this.props.navigation.navigate('TransferReason', {
            'shopJid': this.shopJid,
            'customerName': this.customerName,
            'newCsrName':this.newCsrName,
        });
    }

    _getSeatsList() {
        this.getSeatsUrl = AppConfig.getQCAdminHost() + "/seat/getSeatList.json";
        let data = {
            shopJid: this.shopJid,
            currentCsrName:AppConfig.getUserId(),
            domain:AppConfig.getDomain(),
        };
        HttpTools.get(this.getSeatsUrl,data).then(function (response) {
                if (response.ret) {
                    this.setState({
                        seatsData:response.data,
                    });
                } else {
                    Alert.alert("提示","请求数据失败：" + response.errmsg);
                }
            }.bind(this),
            function (error) {
                Alert.alert("提示","请求数据失败：" + error);
            }.bind(this)
        );
    }

    render(){
        return (
            <View style={styles.wrapper}>
                <FlatList
                    ref={(ref)=>this._flatList = ref}
                    ListFooterComponent={this._footer}
                    ItemSeparatorComponent={this._separator}
                    renderItem={this._renderItem}
                    refreshing={false}
                    extraData={this.state}
                    data={this.state.seatsData}>
                </FlatList>
            </View>
        );
    }

    _parseHeaderUri(uri){
        if(uri == null || uri ==''){
            return this.fileUrl + deaultHeaderUrl;
        }
        if(uri.indexOf("http") == 0) {
            return uri;
        }else if(uri.indexOf("/") == 0) {
            return this.fileUrl + uri;
        }else {
            return this.fileUrl + "/" +  uri;
        }
    }

    _renderItem = ({item,index}) => {
        return (
            <TouchableOpacity style={styles.renderItem} onPress={() => {
                this.setState({
                    selectSeatIndex:index,
                });
                this.newCsrName = item.qunarName.node;
            }}>
                <QIMCheckBox style={styles.ckBox} size={24} checked={index === this.state.selectSeatIndex}
                             onValueChange={() => {
                                 this.setState({
                                     selectSeatIndex:index,
                                 });
                                 this.newCsrName = item.qunarName.node;
                             }}/>
                <Image style={styles.itemImage} source={{uri: this._parseHeaderUri(item.faceLink)}}/>
                <Text>{item.webName===null?item.nickName:item.webName}</Text>
            </TouchableOpacity>
        );
    };

    _footer = () => {
        return <View></View>;
    }

    _separator = () => {
        return <View style={{height:1,backgroundColor:'#ccc'}}/>;
    }
}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    renderItem:{
        flex:1,
        flexDirection:"row",
        height:50,
        padding:5,
        alignItems:"center",
    },
    itemImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        marginLeft: 5,
        marginRight:10,
        alignItems:"center",
        justifyContent:"center",
    },
    ckBox: {
        marginLeft:15,
        marginRight: 15,
    },
});