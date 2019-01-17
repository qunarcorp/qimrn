/*************************************************************************************************
 * <pre>
 * @包路径：
 *
 * @类描述:
 * @版本:       V3.0.0
 * @作者        bigwhite
 * @创建时间    2018-08-10 18:13
 *
 * @修改记录：
 -----------------------------------------------------------------------------------------------
 ----------- 时间      |   修改人    |     修改的方法       |         修改描述   ---------------
 -----------------------------------------------------------------------------------------------
 </pre>
 ************************************************************************************************/
import React, {Component, PureComponent} from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    FlatList,
    NativeModules,
    TouchableOpacity,
    Platform,
    InteractionManager,
    DeviceEventEmitter,
} from "react-native";

import NavCBtn from "../common/NavCBtn";
import moment from 'moment';
import QIMCheckBox from '../common/QIMCheckBox';
import LoadingView from "../common/LoadingView";

class GroupMemberAddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadImage: this.props.loadImage,
            item: this.props.item,
            isConform: false,
        };
        this.beginTime = this.props.beginTime;
        this.endTime = this.props.endTime
    }

    setMember(item) {
        this.setState({item: item});
        if (item.selected) {
            let params = {};
            params['beginTime'] = moment(this.beginTime).format('x');
            params['endTime'] = moment(this.endTime).format('x');
            params['checkId'] = item['xmppId'];
            NativeModules.QimRNBModule.tripMemberCheck(
                params,
                function (response) {
                    if (response.ok) {
                        this.setState({
                            isConform: response.isConform,
                        });
                    } else {
                        alert('出现不可预估错误,请重试!');
                    }
                }.bind(this)
            )
        }

    }

    componentDidMount() {

    }


    componentWillUpdate() {
        // if(this.state.item.selected){
        //     let params={};
        //     params['beginTime']=moment('2018-10-10 10:10:10').format('x');
        //     params['endTime']=moment('2018-10-10 10:15:10').format('x');
        //     params['checkId']=this.state.item['xmppId'];
        //     this.setState({
        //         isConform:false,
        //     })
        //     // NativeModules.QimRNBModule.tripMemberCheck(
        //     //     params,
        //     //     function (response) {
        //     //         if (response.ok) {
        //     //             this.setState({
        //     //                 isConform:response.isConform,
        //     //             });
        //     //         } else {
        //     //             alert('出现不可预估错误,请重试!');
        //     //         }
        //     //     }.bind(this)
        //     // )
        // }
    }

    render() {
        let headerUri = this.state.item["headerUri"];
        if (headerUri) {

        } else {
            headerUri = "http://ww2.sinaimg.cn/bmiddle/b432fab8gw1et7zc799jzj20jg0jgabk.jpg";
        }
        let name = this.state.item["name"];
        // let xmppId = item["xmppId"];
        if (this.state.loadImage) {
            return (
                <View style={TripAttendeesSelectStyles.cellContentView}>
                    <QIMCheckBox style={TripAttendeesSelectStyles.ckBox} value={this.state.item.selected}
                              onValueChange={this.props.onSelectedChange}/>
                    <Image source={{uri: headerUri}} style={TripAttendeesSelectStyles.memberHeader}/>
                    <Text style={TripAttendeesSelectStyles.ckText}>{name}</Text>
                    <Text
                        style={[TripAttendeesSelectStyles.ckText, {color: 'red'}]}>{this.state.item.selected ? this.state.isConform ? '时间冲突' : '' : ''}</Text>


                </View>
            );
        } else {
            return (
                <View style={TripAttendeesSelectStyles.cellContentView}>
                    {/*{this.checkHeaderUri()}*/}
                    <Text style={TripAttendeesSelectStyles.ckText}>{name}</Text>
                    <QIMCheckBox style={TripAttendeesSelectStyles.ckBox} value={this.state.item.selected}
                              onValueChange={this.props.onSelectedChange}/>
                </View>
            );
        }
    }
}

class GroupAddMemberList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
    }

    _keyRowExtractor = (item) => {
        return item.xmppId + '-' + item.selected;
    };

    releadData(data) {
        this.setState({data: data});
    }

    _renderRowItem = ({item, index}) => {
        console.log(item);
        // let userDic = this.selectUsers[item];
        let headerUri = item.headerUri;
        let name = item.name;
        let xmppId = item.xmppId;
        return (
            <View key={this.props.id + index} style={{
                width: 46 + this.cap,
                height: 80,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 10
            }}>
                <TouchableOpacity style={TripAttendeesSelectStyles.memberHeaderBtn} onPress={() => {
                    this.props.onItemClick(item);
                }}>
                    <Image source={{uri: headerUri}} style={TripAttendeesSelectStyles.memberHeaderRow}/>
                </TouchableOpacity>
                <Text numberOfLines={1} style={TripAttendeesSelectStyles.memberNameRow}>{name}</Text>

            </View>
        );
    }

    render() {
        return (
            <View style={TripAttendeesSelectStyles.selectBrowse}>
                <FlatList
                    horizontal={true}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={this._keyRowExtractor}
                    renderItem={this._renderRowItem}/>

            </View>
        );
    }
}


export class TripAttendeesSelect extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "选择邀请对象";
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
            if (navigation.state.params.onSavePress) {
                navigation.state.params.onSavePress();
            }
        }}>完成</NavCBtn>);
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
        super(props)
        this.state = {
            groupMembers: [],
            searchList: [],
            selectUserList: [],

        };

        let newUser = this.props.navigation.state.params.userSelect;
        this.selectUsers = newUser ? newUser : {};
        console.log('<================>');
        console.log(this.selectUsers);
        this.selectCellDic = {};
    }

    //当搜索框内容改变
    checkInterval(userText) {
        if (!(userText.replace(/[\u0391-\uFFE5]/g, "aa").length > 2)) {
            return;
        }
        if (this.checkTime) {
            clearTimeout(this.checkTime)
        }
        this.checkTime = setTimeout(this.selectUserByText.bind(this, userText), 1000)
    }

    //搜索参会人员
    selectUserByText(userText) {
        let params = {};
        //这里还要传一个groupID因为共用一个方法 省事
        let groupid = 'none';

        params['groupId'] = groupid;
        params['searchText'] = userText;
        NativeModules.QimRNBModule.selectUserListByText(params, function (responce) {
            if (responce.ok) {
                let userList = responce.UserList;
                this.setState({searchList: userList})
            }
        }.bind(this));
    }

    //清空搜索框数据
    clearSerachText() {
        this.refs.searchText.clear();
    }

    //是否选中状态
    isShowUserSelected(index) {
        let itemDic = this.state.searchList[index];
        if (this.selectUsers[itemDic.xmppId]) {
            itemDic.selected = false;
            delete this.selectUsers[itemDic.xmppId];
        } else {
            itemDic.selected = true;
            this.selectUsers[itemDic.xmppId] = itemDic;
        }
        this.state.searchList[index] = itemDic;
        // 只刷新List Item
        this.selectCellDic[itemDic.xmppId].setMember(itemDic);
        let selectedUserIDs = [];
        for (let key in this.selectUsers) {
            selectedUserIDs.push(this.selectUsers[key]);
        }
        // 只刷新选择列表
        this.addMemberList.releadData(selectedUserIDs);
        // this.setState({refresh: true});
        // ckBox.props.value = !ckBox.props.value;
    }

    //外层列表单个item
    _renderItem = ({item, index}) => {
        // console.log(index);
        //  console.log(item);
        item.selected = this.selectUsers[item.xmppId] ? true : false;
        return (
            <TouchableOpacity key={item.xmppId} style={TripAttendeesSelectStyles.cellContentView} onPress={() => {
                this.isShowUserSelected(index);
            }}>
                <GroupMemberAddItem
                    beginTime={this.props.navigation.state.params.beginTime}
                    endTime={this.props.navigation.state.params.endTime}
                    ref={(cellItem) => {
                        this.selectCellDic[item.xmppId] = cellItem;
                    }} loadImage={this.state.loadImage} item={item} onSelectedChange={() => {
                    this.isShowUserSelected(index);
                }}/>
            </TouchableOpacity>
        );

    }

    _keyExtractor = (item) => {
        // console.log(item);
        return item.xmppId + ':' + (item['selected'] ? 'true' : 'false');
    };

    //添加参会人员
    onAddMembers() {
        let params = {};
        let array = [];
        for (let key in this.selectUsers) {
            let d = {};
            d['memberId'] = this.selectUsers[key]['xmppId'];
            d['memberName'] = this.selectUsers[key]['name'];
            d['headerUrl'] = this.selectUsers[key]['headerUri'];
            array.push(d);
        }
        params['members'] = array;

        DeviceEventEmitter.emit("updateTripSelectDate", params);
        this.props.navigation.goBack();

    }

    showText() {
        if (this.state.searchList.length>0) {
            return (<Text style={{
                fontSize: 14,
                paddingLeft: 9,
                paddingTop: 4,
                paddingBottom: 4,
                backgroundColor: '#f5f5f5',
                color: '#9e9e9e'
            }}>联系人</Text>);
        }
    }

    render() {

        let selectedUserIDs = [];
        // console.log(this.selectUsers);
        for (let key in this.selectUsers) {
            selectedUserIDs.push(this.selectUsers[key]);
        }
        // console.log(selectedUserIDs);
        return (

            <View style={{flex: 1, backgroundColor: '#ffffff'}}>
                <View style={TripAttendeesSelectStyles.container}>

                    {/*<Image source={require('./images/header/header_logo.png')} style={TripAttendeesSelectStyles.logo}/>*/}

                    <View style={TripAttendeesSelectStyles.searchBox}>

                        {/*<Image source={require('./images/header/icon_search.png')} style={TripAttendeesSelectStyles.searchIcon}/>*/}

                        <TextInput ref='searchText' style={TripAttendeesSelectStyles.inputText}
                                   underlineColorAndroid={'transparent'}
                                   numberOfLines={1}
                                   autoFocus={true}
                                   textAlign="left"
                                   placeholder='搜索姓名/ID-不少于3字'
                                   onChangeText={(userText) => {
                                       this.checkInterval(userText);
                                   }}
                        />
                        <Text style={TripAttendeesSelectStyles.iconStyle} onPress={() => {
                            this.clearSerachText();
                        }}>{String.fromCharCode(parseInt("0xf063"))}</Text>
                        {/*<Image source={require('./images/header/icon_voice.png')} style={TripAttendeesSelectStyles.voiceIcon}/>*/}
                    </View>

                    {/*<Image source={require('./images/header/icon_qr.png')} style={TripAttendeesSelectStyles.scanIcon}/>*/}

                </View>
                <GroupAddMemberList ref={(list) => {
                    this.addMemberList = list;
                }} data={selectedUserIDs} onItemClick={(item) => {
                    delete this.selectUsers[item.xmppId];
                    item.selected = false;
                    if (this.selectCellDic[item.xmppId]) {
                        this.selectCellDic[item.xmppId].setMember(item);
                    }

                    let selectedUserIDs = [];
                    for (let key in this.selectUsers) {
                        selectedUserIDs.push(this.selectUsers[key]);
                    }
                    this.addMemberList.releadData(selectedUserIDs);
                }}/>
                <View style={TripAttendeesSelectStyles.line}/>
                <View style={{flex: 1}}>
                    {this.showText()}
                    <FlatList
                        style={{flex: 1}}
                        data={this.state.searchList}
                        ListEmptyComponent={this.emptyComponent()}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </View>
            </View>
        );

    }

    emptyComponent() {
        return (
            <View style={{flex: 1, backgroundColor: '#ffffff'}}/>
        )
    }

    componentDidMount() {
        //好像是延迟加载图片
        this.setState({loadImage: false});
        InteractionManager.runAfterInteractions(() => {
            this.setState({loadImage: true});
        });
        //设置右上角保存按钮
        this.props.navigation.setParams({
            onSavePress: this.onAddMembers.bind(this),
        });
    }

    componentWillUnmount() {

    }
}

let {width, height} = Dimensions.get("window")
const TripAttendeesSelectStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cellContentView: {
        flex: 1,
        height: 60,
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
        alignItems: "center",
    },
    ckBox: {
        marginLeft: 15,
        marginRight: 15,
    },
    ckText: {
        flex: 1,
        fontSize: 14,
        color: '#212121'
    },
    line: {
        height: 1
    },
    selectBrowse: {
        flexDirection: "row",
        height: 90,
        backgroundColor: "#ffffff"
    },
    memberHeader: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginLeft: 15,
        marginRight: 15,
    },
    memberHeaderRow: {
        width: 46,
        height: 46,
        borderRadius: 5,
    },
    memberName: {
        flex: 1,
        fontSize: 16,
        color: "#333333",
    },
    memberNameRow: {
        fontSize: 12,
        color: "#999999",
        width: 46,
        textAlign: "center",
        marginTop: 5,
        height: 16,
    },
    container: {
        flexDirection: 'row',   // 水平排布
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
        height: Platform.OS === 'ios' ? 68 : 48,   // 处理iOS状态栏
        backgroundColor: '#ffffff',
        alignItems: 'center'  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
    },
    memberHeaderBtn: {
        width: 46,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
        marginLeft: 5,
    },
    logo: {//图片logo
        height: 24,
        width: 64,
        resizeMode: 'stretch'  // 设置拉伸模式
    },
    searchBox: {//搜索框
        height: 44,
        flexDirection: 'row',   // 水平排布
        flex: 1,
        borderRadius: 3,  // 设置圆角边
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
    },
    searchIcon: {//搜索图标
        height: 20,
        width: 20,
        marginLeft: 5,
        resizeMode: 'stretch'
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
    voiceIcon: {
        marginLeft: 5,
        marginRight: 8,
        width: 15,
        height: 20,
        resizeMode: 'stretch'
    },
    scanIcon: {//搜索图标
        height: 26.7,
        width: 26.7,
        resizeMode: 'stretch'
    },
    iconStyle: {
        color: '#333333',
        fontFamily: 'ops_opsapp',
        fontSize: 15,
        marginRight: 20,
    },
});