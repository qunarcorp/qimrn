'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image, NativeModules, DeviceEventEmitter,
} from 'react-native';
import NavCBtn from './../common/NavCBtn'

const kBlackList = "kBlackList";

export default class BlackContacts extends Component{
    static navigationOptions = ({navigation}) => {
        let headerTitle = "黑名单";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"Contacts"}/>);

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
        };
    };

    constructor(props) {
        super(props);
        this.state={
            blackContacts:[],//星标联系人
        };
    }

    componentDidMount() {

        this.selectBlackContacts();
    }


    componentWillUnmount() {
        // this.reloadData.remove();
        // DeviceEventEmitter.removeAllListeners();
    }

    selectBlackContacts(){
        NativeModules.QimRNBModule.selectStarOrBlackContacts(kBlackList,function (response) {
            if(response.data != null && response.data.length>0){
                this.setState({
                    blackContacts : response.data,
                });
            }
        }.bind(this));
    }


    onListItemClick(xmppid){
        //跳转到名片页
        let params = {};
        params["Bundle"] = 'clock_in.ios';
        params["Module"] = 'UserCard';
        params["Properties"] = {'UserId': xmppid};
        params["Version"] = "1.0.0";
        NativeModules.QimRNBModule.openRNPage(params, function () {

        });
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
                    data={this.state.blackContacts}>
                </FlatList>
            </View>
        );
    }

    _renderItem = ({item,index}) => {
        return <TouchableOpacity style={styles.renderItem} onPress={() => {
            this.onListItemClick(item.XmppId);
        }}>
            <Image style={styles.itemImage} source={{uri: item.HeaderUri}}/>
            <Text style={{flex:1}}>{item.Name}</Text>
        </TouchableOpacity>

    };

    _footer = () => {
        return <View></View>;
    }

    _separator = () => {
        return <View style={{height:0.5,backgroundColor:'#ccc'}}/>;
    }
}
var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        marginRight:10,
        alignItems:"center",
        justifyContent:"center",
    },
    renderItem:{
        flex:1,
        flexDirection:"row",
        height:60,
        padding:5,
        backgroundColor:'white',
        alignItems:"center",
    },
});