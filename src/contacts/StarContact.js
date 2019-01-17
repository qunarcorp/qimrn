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

const kStarContact = "kStarContact";

export default class StarContact extends Component{
    static navigationOptions = ({navigation}) => {
        let headerTitle = "星标联系人";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"Contacts"}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
            if (navigation.state.params.onSavePress) {
                navigation.state.params.onSavePress();
            }
        }}>添加</NavCBtn>);
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
        this.state={
            starContacts:[],//星标联系人
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress: this.nextStep.bind(this),
        });

        this.selectStarContacts();

        this.reloadData = DeviceEventEmitter.addListener('reloadStarContacts', function () {
            this.selectStarContacts();
        }.bind(this));
    }


    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners();
    }

    selectStarContacts(){
        NativeModules.QimRNBModule.selectStarOrBlackContacts(kStarContact,function (response) {
            if(response.data != null && response.data.length>0){
                this.setState({
                    starContacts : response.data,
                });
            }
        }.bind(this));
    }

    nextStep(){
        this.props.navigation.navigate('StarContactAdd', {
            'innerVC': true,
        });
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
                    data={this.state.starContacts}>
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