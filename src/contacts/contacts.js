'use strict';

import React, {Component,PureComponent}from 'react';
import {
    SectionList,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    NativeModules,
    Dimensions,
    StatusBar,
    DeviceEventEmitter,
    Platform,
    NativeAppEventEmitter,
    Alert,
} from 'react-native';
import SectionIndex from './SectionIndex';
import AppConfig from "../common/AppConfig";
import RNRestart from 'react-native-restart';

const {height, width} = Dimensions.get('window');

const ITEM_HEIGHT = 56; //item的高度
const HEADER_HEIGHT = 24;  //分组头部的高度
const SEPARATOR_HEIGHT = 1;  //分割线的高度

class ContactItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            info: this.props.itemInfo,
            unreadCount:0,
        };
    }

    componentDidMount() {
        // console.log('componentDidMount'+this.state.info.item.XmppId);
        this.userInfoUpdateNotify = NativeAppEventEmitter.addListener(
            'UserInfoUpdate', (userInfo) => {
                // console.log(userInfo);
            }
        );

        this.userInfoUpdateNotify = NativeAppEventEmitter.addListener(
            'EventName', (userInfo) => {
                // console.log("aaaasd"+userInfo);
            }
        );


        this.userInfoUpdateNotify = DeviceEventEmitter.addListener(
            'QIM_RN_UnreadCount',(userInfo) => {
                this.setState({
                    unreadCount:userInfo.UnreadCount,
                });
            }
        );
    }

    componentWillUnmount() {
        this.userInfoUpdateNotify.remove();
    }

    _renderHeaderImage = (info) => {
        if (info.item.iconFont) {
            return (
                <View style={[styles.itemImage, {backgroundColor: info.item.backgroundColor}]}>
                    <Text style={styles.iconStyle}>{String.fromCharCode(parseInt("0x" + info.item.icon))}</Text>
                </View>
            );
        } else {
            if (info.item.HeaderUri.length > 0) {
                if(Platform.OS === 'ios') {
                    return (<Image style={styles.itemImage} source={{uri: info.item.HeaderUri}} defaultSource={require('../images/singleHeaderDefault.png')}/>);
                } else {
                    return (<Image style={styles.itemImage} source={{uri: info.item.HeaderUri}}/>);
                }
            } else {

            }
        }
    };

    _itemPress = (info) => {
        if (info.section.key == "HEADER") {
            if (info.item.title == "未读消息") {
                let params = {};
                params["NativeName"] = "NotReadMsg";
                NativeModules.QimRNBModule.openNativePage(params);
            } else if (info.item.title == "好友") {
                let params = {};
                params["NativeName"] = "FriendList";
                NativeModules.QimRNBModule.openNativePage(params);
            } else if (info.item.title == "群组") {
                let params = {};
                params["Bundle"] = 'clock_in.ios';
                params["Module"] = 'Contacts';
                params["Properties"] = {'Screen': 'GroupList'};
                NativeModules.QimRNBModule.openRNPage(params, function (response) {

                });
            } else if (info.item.title == "公众号") {
                if(Platform.OS=='ios'){
                    let params = {};
                    params["Bundle"] = 'clock_in.ios';
                    params["Module"] = 'Contacts';
                    params["Properties"] = {'Screen': 'PublicNumberList'};
                    NativeModules.QimRNBModule.openRNPage(params, function (responce) {

                    });
                }else{
                    let params = {};
                    params["NativeName"] = "publicNumber";
                    NativeModules.QimRNBModule.openNativePage(params);
                }

            } else if(info.item.title == "组织架构") {
                let params = {};
                params["NativeName"] = "Organizational";
                NativeModules.QimRNBModule.openNativePage(params);
            } else if(info.item.title == "星标联系人"){
                let params = {};
                params["Bundle"] = 'clock_in.ios';
                params["Module"] = 'Contacts';
                params["Properties"] = {'Screen': 'StarContact'};
                NativeModules.QimRNBModule.openRNPage(params, function (response) {

                });
            }
        } else {
            if(info.item.XmppId===''||info.item.XmppId===null){
                return;
            }
            let xmppJid = info.item.XmppId;

            let params = {};
            params["Bundle"] = 'clock_in.ios';
            params["Module"] = 'UserCard';
            params["Properties"] = {'UserId': xmppJid};
            params["Version"] = "1.0.0";
            NativeModules.QimRNBModule.openRNPage(params, function () {

            });
        }
    };

    showUnreadCount(title){
        if(title === '未读消息' && this.state.unreadCount>0){
            return (
                <View style={styles.unreadCount}>
                    <Text style={styles.unreadCountText}>{this.state.unreadCount}</Text>
                </View>
            );
        }
    }

    render() {
        if (this.state.info.item) {
            var txt = "";
            if (this.state.info.item.title) {
                txt = this.state.info.item.title;
            } else {
                if(this.state.info.item.Remark){
                    txt = this.state.info.item.Remark;
                }else if (this.state.info.item.Name) {
                    txt = this.state.info.item.Name;
                } else {
                    txt = this.state.info.item.XmppId;
                }
            }
            return (
                <TouchableOpacity key={txt} style={styles.itemRow}
                                  onPress={this._itemPress.bind(this, this.state.info)}>
                    {this._renderHeaderImage(this.state.info)}
                    <Text style={styles.itemText}>{txt}</Text>
                    {this.showUnreadCount(txt)}
                </TouchableOpacity>
            );
        } else {
            return (<View/>);
        }
    }

}

export default class Contacts extends Component {
    static navigationOptions = () => ({
        header: null,
    });

    constructor(props) {
        super(props);
        this.showOrganizational = false;
        if (!AppConfig._loaded) {
            AppConfig.initConfig().then(function () {
                this.showOrganizational = AppConfig.getShowOrganizational();
                // this.loadDataSource();
            }.bind(this));
        } else {
            this.showOrganizational = AppConfig.getShowOrganizational();
        }
        this.sectionIndex = ['↑', '☆', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];
        this.sectionIndexDic = {};
        this.state = {
            section: [],
            sectionIndex: this.sectionIndex,
            unreadCount:0,
        };
        this.loadedContact = {};
    }

    componentDidMount() {
        // console.log('componentDidMount 调用次数');

        this.willShow = DeviceEventEmitter.addListener(
            'QIM_RN_Will_Show',
            function (params) {
                AppConfig.initConfig().then(function () {
                    this.showOrganizational = AppConfig.getShowOrganizational();
                    this.loadDataSource();
                }.bind(this));
            }.bind(this)
        );

         this.loadDataSource();


        // //它们的高度都是一样的，所以这边只需要测量一个就好了
        // this.measureTimer = setTimeout(() => {
        //     this.refs.viewContainer.measure((x, y, width, height, pageX, pageY) => {
        //         console.log('Height'+height);
        //     });
        // }, 0);
    }

    //
    componentWillUnmount() {
        this.willShow.remove();
    }

    updateLayoutList(list){
        this.layoutList = [];
        let offset = 56;
        let localIndex = 0;
        for (let index = 0, len = list.length; index < len; index++) {
            let section = list[index];
            let sectionKey = section.key;
            if (sectionKey == 'HEADER') {
                // sectionHeader
                this.layoutList.push({length:0, offset:offset,index:localIndex});
                localIndex++;
                for (let jIndex = 0, jLen = section.data.length;jIndex < jLen;jIndex++){
                    this.layoutList.push({length:57, offset:offset,index:localIndex});
                    offset += 57;
                    localIndex++;
                }
                // sectionFooter
                this.layoutList.push({length:0, offset:offset,index:localIndex});
                localIndex++;
            } else {
                // sectionHeader
                this.layoutList.push({length:0, offset:offset,index:localIndex});
                offset += 24;
                localIndex++;
                for (let jIndex = 0, jLen = section.data.length;jIndex < jLen;jIndex++){
                    this.layoutList.push({length:57, offset:offset,index:localIndex});
                    offset += 57;
                    localIndex++;
                }
                // sectionFooter
                this.layoutList.push({length:0, offset:offset,index:localIndex});
                localIndex++;
            }
        }
        // console.log(this.layoutList);
    }

    _loadContact(xmppid) {
        if(xmppid===''||xmppid===null){
            return;
        }
        this.loadedContact[xmppid] = true;
        NativeModules.QimRNBModule.getContactsNick(xmppid,
            function (responce) {
                let nick = responce.nick;
                let searchIndex = nick['SearchIndex'];
                let key = " ";
                if (searchIndex.length > 0) {
                    key = searchIndex.substr(0, 1);
                } else {
                    key = xmppid.substr(0, 1);
                }
                key = key.toUpperCase();
                let contactsList =  this.state.section;
                for(let index = 0, len = contactsList.length; index < len; index++){
                    let group =  contactsList[index];
                    if(group["key"]==key){
                        let data = group["data"];
                        for(let j =0, l = data.length; j<l; j++){
                            let item = data[j];
                            if(item["XmppId"]==nick["XmppId"]){
                                contactsList[index]["data"][j]["Name"]=nick["Name"];
                                contactsList[index]["data"][j]["HeaderUri"]=nick["HeaderUri"];
                                contactsList[index]["data"][j]["SearchIndex"]=nick["SearchIndex"];
                                contactsList[index]["data"][j]["Remark"]=nick["Remark"];
                                break;
                            }
                        }
                    }else{
                        continue;
                    }
                }
                this.setState({
                    section:contactsList,
                });

            }.bind(this)
        );
    }


    loadDataSource() {
        // RNRestart.Restart();
        // console.log("全局")
        NativeModules.QimRNBModule.getContacts(
            function (responce) {
                let userList = {};
                let keyList = [];
                let contacts = responce.contacts;
                // for (let index = 0, len = 260; index < len; index++) {
                //     let aa = this.sectionIndex[index%26];
                //     contacts[index] = {'XmppId': index + "", 'SearchIndex': aa + "", 'Name': aa + ""};
                // }
                // console.log("本次加载数据的值:");
                // console.log(contacts);
                if(!contacts){
                    return;
                }
                for (let index = 0, len = contacts.length; index < len; index++) {
                    let contact = contacts[index];
                    let searchIndex = contact["SearchIndex"];
                    let xmppJid = contact["XmppId"];
                    let key = " ";
                    if (searchIndex.length > 0) {
                        key = searchIndex.substr(0, 1);
                    } else {
                        key = xmppJid.substr(0, 1);
                    }
                    key = key.toUpperCase();
                    if (userList[key]) {

                    } else {
                        userList[key] = [];
                        keyList.push(key);
                    }
                    userList[key].push(contact);
                }
                keyList = keyList.sort();
                let sectionList = [];
                let friendCount = 0;
                for (let index = 0, len = keyList.length; index < len; index++) {
                    let data = {};
                    let key = keyList[index];
                    let upKey = key.toUpperCase();
                    data['key'] = upKey;
                    data['data'] = userList[key];
                    this.sectionIndexDic[upKey] = index;
                    sectionList.push(data);
                    friendCount += data['data'].length;
                }
                // console.log(sectionList);
                this.friendCount = friendCount;

                let data;
                if (this.showOrganizational) {
                    data = [
                        {title: "未读消息", iconFont: true, icon: "f0f4", backgroundColor: "#FA8829"},
                        {title: "星标联系人", iconFont: true, icon: "f038", backgroundColor: "#34475e"},
                        // {title: "好友", iconFont: true, icon: "f0eb", backgroundColor: "#5D73E5"},
                        {title: "群组", iconFont: true, icon: "f3e3", backgroundColor: "#06B524"},
                        {title: "公众号", iconFont: true, icon: "f130", backgroundColor: "#007AFF"},
                        {title: "组织架构", iconFont: true, icon: "f11d", backgroundColor: "#40ff15"}
                    ];
                } else {
                    data = [
                        {title: "未读消息", iconFont: true, icon: "f0f4", backgroundColor: "#FA8829"},
                        {title: "星标联系人", iconFont: true, icon: "f038", backgroundColor: "#34475e"},
                        // {title: "好友", iconFont: true, icon: "f0eb", backgroundColor: "#5D73E5"},
                        {title: "群组", iconFont: true, icon: "f3e3", backgroundColor: "#06B524"},
                        {title: "公众号", iconFont: true, icon: "f130", backgroundColor: "#007AFF"},
                        // {title: "组织架构", iconFont: true, icon: "f11d", backgroundColor: "#40ff15"}
                    ];
                }
                let sectionHeader = [{
                    key: "HEADER",
                    data: data,
                },];
                let list = sectionHeader.concat(sectionList);
                this.updateLayoutList(list);
                this.setState({
                    section: list,
                    // sectionIndex: keyList,
                });

                // console.log(list);
            }.bind(this)
        );
    }

    _keyExtractor = (item, index) => {
        if (item.title) {
            return item.title;
        } else {
            return item.XmppId;
        }
    };

    _renderItem = (info) => {
        return (
            <ContactItem itemInfo={info}/>
        );
    };

    _sectionComp = (info) => {
        var txt = info.section.key;
        if (txt == "HEADER") {

        } else {
            return <Text key={txt} style={styles.sectionHeaderText}>{txt}</Text>
        }
    };

    _onSectionSelect = (section, index) => {
        if (index == 0) {
            this.selectIndex = 0;
        } else {
            if (this.sectionIndexDic[section]) {
                this.selectIndex = this.sectionIndexDic[section] + 1;
            } else {
                this.selectIndex = undefined;
            }
        }
    };

    _onSectionUp = () => {
        if (this.selectIndex != undefined) {
            this.refs.list.scrollToLocation({
                animated: false,
                itemIndex: -1,
                sectionIndex: this.selectIndex,
                viewPosition: 0
            });
            this.selectIndex = undefined;
        }
    };

    _sectionIndex = () => {
        if (this.state.sectionIndex.length > 0) {
            return (
                <SectionIndex
                    sections={this.state.sectionIndex}
                    onSectionSelect={this._onSectionSelect.bind(this)}
                    onSectionUp={this._onSectionUp.bind(this)}/>
            );
        }
    };
    _getItemLayout(data, index) {
        if (this.layoutList) {
            return this.layoutList[index];
        } else {
            return {length:0,offset:0,index:index};
        }
        // console.log(index);
        let length = 0;
        return {length, offset: length * index , index};
    }

    _searchBtnPress = () => {
        let params = {};
        params["NativeName"] = "SearchContact";
        NativeModules.QimRNBModule.openNativePage(params);
    };

    _renderHeader = () => {
        return (
            <View style={styles.searchHeader}>
                <TouchableOpacity style={styles.searchBtn} onPress={this._searchBtnPress.bind(this)}>
                    <Text style={styles.searchBtnIcon}>{String.fromCharCode(parseInt("0xf407"))}</Text>
                    <Text style={styles.searchBtnText}>搜索</Text>
                </TouchableOpacity>
            </View>
        );
    };

    _renderFooter = () => {
        if (this.state.section.length > 1) {
            return (
                <Text style={styles.footerText}>{this.friendCount + "位好友"}</Text>
            );
        } else {
            return (<View/>);
        }
    };



    _onViewableItemsChanged = (info) => {
        // console.log(info);
        info.changed.map((value) => {
            if (value.isViewable && value.index != null && value.item && value.item.XmppId) {
                if (this.loadedContact[value.item.XmppId]) {

                } else {
                    if (value.item.Name){
                        let xmppId = value.item.XmppId;
                        // setTimeout(()=>{
                            this._loadContact(xmppId);
                        // },3);
                    } else {
                        let xmppId = value.item.XmppId;
                        // setTimeout(()=>{
                            this._loadContact(xmppId);
                        // },3);
                    }
                }
            }
        });
    };

    render() {
        let containerStyle = {flex: 1};
        if (Platform.OS == 'android') {
            containerStyle = {height: (height - 105 - StatusBar.currentHeight)};
        }
        // let initNum = parseInt(height / 57.0);
        return (
            <View style={containerStyle} ref='viewContainer'>
                <SectionList
                    style={{flex: 1}}
                    ref='list'
                    // initialNumToRender={initNum}
                    renderSectionHeader={this._sectionComp}
                    renderItem={this._renderItem}
                    sections={this.state.section}
                    stickyHeaderIndices={[0]}
                    stickySectionHeadersEnabled={true}
                    ItemSeparatorComponent={() => <View style={styles.itemSeparatorLine}></View>}
                    keyExtractor={this._keyExtractor}
                    // 不能加ItemLayout 加了 Items Changed 不好使
                    ListHeaderComponent={this._renderHeader.bind(this)}
                    ListFooterComponent={this._renderFooter.bind(this)}
                    onViewableItemsChanged={this._onViewableItemsChanged.bind(this)}
                    getItemLayout={this._getItemLayout.bind(this)}
                />
                {this._sectionIndex()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sectionHeaderText: {
        paddingLeft: 10,
        height: 24,
        lineHeight: 24,
        textAlign: 'left',
        backgroundColor: '#EAEAEA',
        color: '#212121',
        fontSize: 14,
    },
    iconStyle: {
        // width: 36,
        // height: 36,
        // lineHeight: 36,
        // textAlign: "center",
        color: '#FFF',
        fontFamily: 'QTalk-QChat',
        fontSize: 20,
        marginTop: 2,
    },
    itemSeparatorLine: {
        height: 1,
        backgroundColor: "#EAEAEA",
    },
    itemRow: {
        flex:1,
        height: 56,
        flexDirection: "row",
        backgroundColor: "#FFF",
    },
    itemImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        marginLeft: 10,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    itemText: {
        height: 56,
        lineHeight: 56,
        fontSize: 14,
        fontWeight: "400",
        color: "#212121",
        marginLeft: 10,
    },
    unreadCount:{
        flex:1,
        flexDirection:'row',
        height:56,
        marginRight:20,
        justifyContent:'flex-end',
        alignItems:'center',
    },
    unreadCountText:{
        borderRadius: 8,
        width:16,
        height:16,
        color:"white",
        fontSize:8,
        backgroundColor:'red',
        textAlign: "center",
        paddingTop:2,
    },
    footerText: {
        height: 44,
        lineHeight: 44,
        fontSize: 14,
        color: "#999999",
        textAlign: "center",
    },
    searchHeader: {
        height: 56,
        backgroundColor: "#e6e7e9",
    },
    searchBtn: {
        height: 36,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 9,
        backgroundColor: "white",
        borderRadius: 10,
        flexDirection: "row",
    },
    searchBtnText: {
        height: 36,
        lineHeight: 36,
        fontSize: 16,
        color: "#9e9e9e",
    },
    searchBtnIcon: {
        width: 36,
        height: 36,
        lineHeight: 36,
        textAlign: "center",
        color: '#9E9E9E',
        fontFamily: 'QTalk-QChat',
        fontSize: 16,
    }
});
