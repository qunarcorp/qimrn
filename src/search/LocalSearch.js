'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    SectionList,
    Image,
    TouchableOpacity, Alert, Platform, NativeModules,
} from 'react-native';
import NavCBtn from './../common/NavCBtn';
import SplitMessage from './../search/SpiltMessage'
import { QSearch,} from 'react-native-qunar-component-library-public';
import AppConfig from "../common/AppConfig";

export default class LocalSearch extends Component {
    static navigationOptions = ({navigation}) => {
        let headerTitle = "消息搜索";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"Search"}/>);
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
        this.state = {
            searchData: [],
            // searchAppointData:[],
            searchContent: '',
            isAppointSearch: false,
        };
        this.xmppid = this.props.navigation.state.params.xmppid;
        this.realjid = this.props.navigation.state.params.realjid;
        this.chatType = this.props.navigation.state.params.chatType;
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    search(text) {
        if (text == '') {
            this.clearList();
            return;
        }
        if (Platform.OS == 'ios') {
            let params = {};
            params['xmppid'] = this.xmppid;
            params['realjid'] = this.xmppid;
            params['chatType'] = this.chatType;
            params['searchText'] = text;
            NativeModules.QimRNBModule.searchLocalMessageByKeyword(params, function (response) {
                if (response != null) {
                    this.setState({
                        searchData: response.data,
                    });
                }
            }.bind(this));
        } else {
            NativeModules.QimRNBModule.searchLocalMessageByKeyword(text, this.xmppid, this.realjid, function (response) {
                if (response != null) {
                    this.setState({
                        searchData: response.data,
                    });
                }
            }.bind(this));
        }
    }

    //清除搜索框数据
    clearSerachText() {
        this.refs.searchText.clear();
        this.clearList();
    }

    clearList() {
        this.setState({
            searchContent: '',
            isAppointSearch: false,
            searchData: [],
        });
    }

    searchFile() {

        this.props.navigation.navigate('LocalFileSearch', {
            'xmppid': this.xmppid,
            "realjid": this.realjid,
            'chatType': this.chatType,
        });

        // NativeModules.QimRNBModule.searchFilesByXmppId(this.xmppid,function (response) {
        //     if(response != null){
        //         this.setState({
        //             isAppointSearch:true,
        //             searchAppointData:response.files,
        //         });
        //     }
        // }.bind(this));
    }

    searchDate() {
        this.props.navigation.navigate('LocalDateSearch', {
            'xmppid': this.xmppid,
            'realjid': this.realjid,
            'chatType': this.chatType,
        });
    }

    searchLink() {
        this.props.navigation.navigate('LocalLinkSearch', {
            'xmppid': this.xmppid,
            'realjid': this.realjid,
            'chatType': this.chatType,
        });
    }

    searchImage(){
        if (Platform.OS == 'ios') {
            let param = {};
            param['xmppid'] = this.xmppid;
            param['realjid'] = this.realjid;
            param['chatType'] = this.chatType;
            NativeModules.QimRNBModule.openLocalSearchImage(param);
        } else {
            NativeModules.QimRNBModule.openLocalSearchImage(this.xmppid,this.realjid);
        }
    }


    showAppointView() {
        if(AppConfig.showLocalQuickSearch()){
            if (!this.state.isAppointSearch) {
                return <View style={styles.appointSearch}>
                    <Text style={{fontSize: 14, color: '#9e9e9e', marginTop: 36,}}>快速搜索聊天内容</Text>
                    <View style={styles.appointSearchItem}>
                        <TouchableOpacity onPress={() => {
                            this.searchImage();
                        }}>
                            <View style={styles.searhItemView}>
                                <Text style={styles.iconStyle}>{String.fromCharCode(parseInt("0xf252;"))}</Text>
                                <Text style={styles.searchItemText}>图片与视频</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {

                            this.searchFile();
                        }}>
                            <View style={styles.searhItemView}>
                                <Text style={styles.iconStyle}>{String.fromCharCode(parseInt("0xe211;"))}</Text>
                                <Text style={styles.searchItemText}>文件</Text>
                            </View>


                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            this.searchLink();
                        }}>

                            <View style={styles.searhItemView}>
                                <Text style={styles.iconStyle}>{String.fromCharCode(parseInt("0xf4e9;"))}</Text>
                                <Text style={styles.searchItemText}>链接</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            this.searchDate();
                        }}>

                            <View style={styles.searhItemView}>
                                <Text style={styles.iconStyle}>{String.fromCharCode(parseInt("0xf14c;"))}</Text>
                                <Text style={styles.searchItemText}>日期</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        }
    }

    //设置分组头及头的样式
    _sectionComp = (info) => {
        var txt = info.section.key;
        return <Text
            style={{
                height: 24,
                paddingTop: 6,
                paddingLeft: 16,
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                color: '#9e9e9e',
                fontSize: 12
            }}>{txt}</Text>
    }

    _renderSectionList() {


        if(this.state.searchContent==""||this.state.searchData.length>0){
            return(
                <SectionList
                    ListFooterComponent={this._footer}
                    ListEmptyComponent={this.showAppointView()}

                    renderSectionHeader={this._sectionComp}
                    renderItem={this._renderItem}
                    stickyHeaderIndices={[0]}
                    stickySectionHeadersEnabled={true}
                    sections={this.state.searchData}
                    ItemSeparatorComponent={() => <View style={{
                        height: 1,
                        flex: 1,
                        backgroundColor: '#ffffff',
                        paddingLeft: 20,
                        paddingRight: 20
                    }}><View
                        style={{backgroundColor: '#eeeeee', marginLeft: 20, marginRight: 20, flex: 1}}></View></View>}
                />
            );
        }else {
            return (
                <View style={{
                    flex: 1,
                    backgroundColor:'#ffffff',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{color:'#9E9E9E',  fontSize: 14}}>暂无'{this.state.searchContent}'相关的聊天记录</Text>
                </View>
            );
        }
    }


    render() {
        return (
            <View style={styles.wrapper}>


                <QSearch

                    placeholder='输入“关键词”搜索聊天记录'
                    onSubmit={(text) => {
                        this.setState({
                            searchContent: text,
                        });
                        this.search(text);
                    }}
                    onCancel={() => {
                        this.search('');
                    }}
                    onClear={() => {
                        this.search('');
                    }}
                    onChangeText={(text)=>{
                        if(text == ''){
                            this.search('');
                        }
                    }}
                    showCancel={false}

                />
                {/*<TextInput ref='searchText' style={styles.inputText}*/}
                {/*underlineColorAndroid={'transparent'}*/}
                {/*numberOfLines={1}*/}
                {/*autoFocus={true}*/}
                {/*textAlign="left"*/}
                {/*placeholder='关键字'*/}
                {/*onChangeText={(userText) => {*/}
                {/*this.setState({*/}
                {/*searchContent:userText,*/}
                {/*});*/}
                {/*this.search(userText);*/}
                {/*}}*/}
                {/*/>*/}


                {/*{this.showAppointView()}*/}

                {/*<FlatList*/}
                {/*ref={(ref) => this._flatList = ref}*/}
                {/*ListFooterComponent={this._footer}*/}
                {/*ListEmptyComponent={this.showAppointView()}*/}
                {/*ItemSeparatorComponent={this._separator}*/}
                {/*renderItem={this._renderItem}*/}
                {/*data={this.state.searchData}>*/}
                {/*</FlatList>*/}


                {this._renderSectionList()}

            </View>
        );
    }

    spiltMessageContent(content, k) {
        let wnm = {};
        let index = content.indexOf(k);
        let length = content.length;

        let defaultLength = 15;

        if (k.length >= defaultLength) {
            wnm["left"] = "";
            wnm["right"] = "";
        } else {
            let subLength = k.length;
            if (Platform.OS == 'ios') {
                subLength = k.length + 1;
            }
            if (length > defaultLength) {
                let temp = defaultLength - k.length;
                if (index - temp / 2 <= 0) {
                    wnm["left"] = content.substring(0, index);
                    wnm["right"] = content.substring(index + subLength);
                } else {
                    if (index + k.length + temp / 2 >= length) {
                        wnm["left"] = "..." + content.substring(index - temp / 2, index);
                        wnm["right"] = content.substring(index + subLength);
                    } else {
                        wnm["left"] = "..." + content.substring(index - temp / 2, index);
                        wnm["right"] = content.substring(index + subLength, index + k.length + temp / 2) + "...";
                    }
                }
            } else {
                if (index == 0) {
                    wnm["left"] = "";
                    wnm["right"] = content.substring(k.length);
                } else if (index == length - k.length) {
                    wnm["left"] = content.substring(0, index);
                    wnm["right"] = "";
                } else {
                    wnm["left"] = content.substring(0, index);
                    wnm["right"] = content.substring(index + subLength);
                }
            }
        }
        wnm["middle"] = k;
        return wnm;
    }

    skipActivity(time) {
        try {
            if (Platform.OS == 'ios') {
                NativeModules.QimRNBModule.openChatForLocalSearch(this.xmppid, this.realjid, this.chatType, Number(time));
            } else {
                NativeModules.QimRNBModule.openChatForLocalSearch(this.xmppid, this.realjid, this.chatType, time);
            }
        } catch (e) {
            console.log("LocalSearch openChatForLocalSearch Faild: " + e);
        }
    }


    _renderItem = ({item, index}) => {

        return (
            <TouchableOpacity style={styles.renderItem} onPress={() => {
                this.skipActivity(item.timeLong);
            }}>
                <Image style={styles.itemImage} source={{uri: item.headerUrl}}/>
                <View style={styles.renderItemTextCenter}>
                    <Text style={{color: '#000000', fontSize: 15}}>{item.nickName}</Text>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <Text numberOfLines={1}
                              style={{fontSize: 13}}>{SplitMessage.spiltContent(item.content, this.state.searchContent)["left"]}</Text>
                        <Text numberOfLines={1}
                              style={{fontSize: 13, color: "#43CD80"}}>{this.state.searchContent}</Text>
                        <Text numberOfLines={1}
                              style={{fontSize: 13}}>{SplitMessage.spiltContent(item.content, this.state.searchContent)["right"]}</Text>
                        {/*<Text numberOfLines={1} style={{fontSize:13}}>{this.spiltMessageContent(item.content,this.state.searchContent)["left"]}</Text>*/}
                        {/*<Text numberOfLines={1} style={{fontSize:13,color:"#43CD80"}}>{this.state.searchContent}</Text>*/}
                        {/*<Text numberOfLines={1} style={{fontSize:13}}>{this.spiltMessageContent(item.content,this.state.searchContent)["right"]}</Text>*/}
                    </View>
                </View>
                <Text style={styles.renderItemTextRight}>{item.time}</Text>
            </TouchableOpacity>

        );

    };

    _footer = () => {
        if (this.state.searchContent == '') {
            return <View></View>;
        } else {
            //TODO 还没有h5页面
            return <View></View>;
            // return <TouchableOpacity onPress={() => {
            //
            // }}>
            //     <View style={{height:0.5,backgroundColor:'#ccc'}}/>
            //     <View style={styles.renderItem}>
            //         <Text style={{flex:1,marginLeft:5,color:'#000'}}>搜索更多历史消息...</Text>
            //         <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
            //     </View>
            // </TouchableOpacity>
        }
    }

    _separator = () => {
        return <View style={{height: 0.5, backgroundColor: '#ccc'}}/>;
    }
}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    appointSearch: {
        flex: 1,
        backgroundColor: '#ffffff',

        alignItems: 'center',
    },
    appointSearchItem: {
        flex: 1,
        width: '100%',
        backgroundColor:'#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 32,
    },
    container: {
        flexDirection: 'row',   // 水平排布
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
        height: Platform.OS === 'ios' ? 68 : 48,   // 处理iOS状态栏
        backgroundColor: '#54fc8c',
        alignItems: 'center'  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
    },
    searchBox: {//搜索框
        height: 35,
        flexDirection: 'row',   // 水平排布
        flex: 1,
        borderRadius: 3,  // 设置圆角边
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
    },
    inputText: {
        backgroundColor: 'transparent',
        flex: 1,
        height: 35,
        lineHeight: 30,
        fontSize: 15,
        padding: 0,
        paddingLeft: 20,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    renderItem: {
        flex: 1,
        flexDirection: "row",
        height: 60,
        padding: 5,
        backgroundColor: 'white',
        alignItems: "center",
    },
    renderItemAppoint: {
        flex: 1,
        flexDirection: "row",
        height: 180,
        padding: 5,
        backgroundColor: 'white',
    },
    renderItemTextCenter: {
        flex: 1,
        marginRight: 5,
    },
    renderItemTextRight: {
        color: '#9E9E9E',
        fontSize: 12,
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    iconStyle: {
        color: '#616161',
        fontFamily: 'QTalk-QChat',
        fontSize: 40,
    },
    searhItemView: {
        backgroundColor:'#ffffff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchItemText: {
        marginTop: 16,
        fontSize: 12,
        color: '#212121'
    }
});

