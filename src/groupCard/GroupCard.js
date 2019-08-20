import React, {Component, PureComponent} from 'react';
import {
    ScrollView,
    View,
    Image,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter,
    NativeModules,
    Dimensions,
    Switch,
    Alert,
    BackHandler,
    Platform,

} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import AppConfig from "../common/AppConfig";

const {height, width} = Dimensions.get('window');

class MyListItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            groupId: this.props.groupId,
            groupMembers: this.props.groupMembers,

        };
        this.cap = (width - 46 * 5) / 6.0;
        this.unMount = false;
    }

    openUserCard(xmppJid) {
        if (xmppJid === '' || xmppJid === null) {
            return;
        }
        this.props.navigation.navigate('UserCard', {
            'UserId': xmppJid,
            'innerVC': true,
        });
    }

    addGroupMember() {
        // NativeModules.QimRNBModule.addGroupMember(this.state.groupId, function (responce) {
        //
        // }.bind(this));
        if (this.props.navigation.state.params.groupId === '' || this.props.navigation.state.params.groupId === null) {
            return;
        }
        this.props.navigation.navigate('GroupMemberAdd', {
            'GroupId': this.props.navigation.state.params.groupId,
        });

    }

    kickGroupMember(){
        if (this.props.navigation.state.params.groupId === '' || this.props.navigation.state.params.groupId === null) {
            return;
        }
        this.props.navigation.navigate('GroupMemberKick', {
            'GroupId': this.props.navigation.state.params.groupId,
            'Permissions': this.props.navigation.state.params.permissions,
        });
    }

    renderItem(item, index) {
        // console.log("MemberItem ============");
        // console.log(item);
        if (item == "ADD") {
            return (
                <View key={this.props.groupId + index} style={{
                    width: 46 + this.cap,
                    height: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 10
                }}>
                    <TouchableOpacity style={styles.addMemberBtn} onPress={() => {
                        this.addGroupMember();
                    }}>
                        <Image source={require('../images/add_member.png')} style={styles.addMemberIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.memberName}></Text>
                </View>
            );
        } else if (item == "KICK"){
            return (
                <View key={this.props.groupId + index} style={{
                    width: 46 + this.cap,
                    height: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 10
                }}>
                    <TouchableOpacity style={styles.addMemberBtn} onPress={() => {
                        this.kickGroupMember();
                    }}>
                        <Image source={require('../images/atom_ui_kick_member.png')} style={styles.addMemberIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.memberName}></Text>
                </View>
            );
        } else {
            let headerUri = item["headerUri"];
            let name = item["name"];
            let xmppJid = item["xmppjid"];
            return (
                <View key={this.props.groupId + index} style={{
                    width: 46 + this.cap,
                    height: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 10
                }}>
                    {this.getHeaderImage(headerUri,xmppJid)}

                    <Text numberOfLines={1} style={styles.memberName}>{name}</Text>
                </View>
            );
        }
    }

    getHeaderImage(headerUri,xmppJid){
        if (headerUri == null || headerUri == '') {
            return (
                <TouchableOpacity style={styles.memberHeaderBtn} onPress={() => {
                    this.openUserCard(xmppJid);
                }}>
                    <Image source={require('../images/single_chat_icon.png')} style={styles.memberHeader}/>
                </TouchableOpacity>
            );
        }else {
            return (
                <TouchableOpacity style={styles.memberHeaderBtn} onPress={() => {
                    this.openUserCard(xmppJid);
                }}>
                    <Image source= {{uri: headerUri}} style={styles.memberHeader}/>
                </TouchableOpacity>
            );
        }
    }

    renderList(list) {
        if (list) {
            return list.map((item, index) => this.renderItem(item, index));
        }
    }

    render() {
        return (
            <View style={{flexDirection: "row", paddingLeft: this.cap / 2.0}}>
                {this.renderList(this.props.groupMembers)}
            </View>
        );
    }
}

var key = 1;
export default class GroupCard extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = navigation.state.params ? navigation.state.params.headerTitle : "聊天信息";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"GroupCard"}/>);
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
            groupId: this.props.navigation.state.params.groupId,
            pushState: false,
            stickyState: false,
            permissions: this.props.navigation.state.params.permissions,
            showRed:false,
            groupInfo:{},
        };
        this.unMount = false;
    }

    getGroupMember(params) {
        let groupMembers = params['GroupMembers'];
        let memberList = [];
        let membersTemp = [];
        for (let index = 0, len = groupMembers.length; index < len && index < 44; index++) {
            if (index % 5 == 0) {
                membersTemp = [];
                membersTemp.push(groupMembers[index]);
                memberList.push({"key": "" + key, "list": membersTemp});
                key++;
            } else {
                membersTemp.push(groupMembers[index]);
            }
        }
        if(this.state.permissions == 0 || this.state.permissions == 1){
            if (membersTemp.length < 4) {
                membersTemp.push("ADD");
                membersTemp.push("KICK");
            } else if (membersTemp.length < 5) {
                membersTemp.push("ADD");
                memberList.push({"key": "" + key, "list": ["KICK"]});
            } else {
                memberList.push({"key": "" + key, "list": ["ADD","KICK"]});
            }
        } else {
            if (membersTemp.length < 5) {
                membersTemp.push("ADD");
            } else {
                memberList.push({"key": "" + key, "list": ["ADD"]});
            }
        }
        key = 1;
        this.setState({
            groupMembers: memberList,
            memberList: groupMembers,
        });
        this.props.navigation.setParams({headerTitle: "聊天信息(" + groupMembers.length + ")"});
    }

    updateGetGroupMember() {
        NativeModules.QimRNBModule.getGroupMember(this.state.groupId, function (responce) {
            if (responce.ok) {
                this.getGroupMember(responce);
            }
        }.bind(this));
    }

    updateGroupInfo() {
        if (this.state.groupId === '' || this.state.groupId === null) {
            return;
        }
        NativeModules.QimRNBModule.getGroupInfo(this.state.groupId, function (responce) {
            if (responce.ok) {
                let groupInfo = responce.GroupInfo;


                this.setState({
                    groupInfo: groupInfo,
                    // groupMembers: memberList,
                    // memberList:groupMembers,
                });

            }
        }.bind(this));
        this.updateGetGroupMember();
        NativeModules.QimRNBModule.syncPushState(this.state.groupId, function (responce) {
            let state = responce.state;
            this.setState({pushState: state});
        }.bind(this));
        NativeModules.QimRNBModule.syncGroupStickyState(this.state.groupId, function (response) {
            let state = response.state;
            this.setState({stickyState: state});
        }.bind(this));
    }

    componentDidMount() {
        this.groupNameChange = DeviceEventEmitter.addListener('updateGroupName', function (params) {
            this.updateGroupName(params);
        }.bind(this));
        this.groupTopicChange = DeviceEventEmitter.addListener('updateGroupTopic', function (params) {
            this.updateGroupTopic(params);
        }.bind(this));
        this.exit = DeviceEventEmitter.addListener('Del_Destory_Muc', function (params) {
            this.updateGroupMemberByKick(params);
        }.bind(this));


        this.removeSession = DeviceEventEmitter.addListener('Remove_Session', function (params) {
            this.closeActivity(params);
        }.bind(this));
        this.refreshNick = DeviceEventEmitter.addListener('updateNick', function (params) {
            this.updateGetGroupMember();
        }.bind(this));
        this.refreshGroupMemeber = DeviceEventEmitter.addListener('updateGroupMember', function (params) {
            let groupId = params['GroupId'];
            let per = params['permissions'];
            if (groupId === this.state.groupId) {
                this.setState({permissions: per});
                this.getGroupMember(params);
            }
        }.bind(this));

        this.updateGroupInfo();

        //此处是提醒红点功能
        // NativeModules.QimRNBModule.showRedView(function (response) {
        //     this.setState({
        //             showRed:response.show,
        //         }
        //     )
        // }.bind(this))
    }

    updateGroupMemberByKick(params){

        let groupId = params["groupId"];
        let moduleName = "GroupCard";
        if (groupId == this.state.groupId) {
            // //关闭activi
            // if (Platform.OS === 'ios') {
            //     AppConfig.exitApp(moduleName);
            // } else {
            //     BackHandler.exitApp();
            // }
            this.updateGetGroupMember();
        }


    }

    closeActivity(params) {
        let groupId = params["groupId"];
        let moduleName = "GroupCard";
        if (groupId == this.state.groupId) {
            //关闭activi
            if (Platform.OS === 'ios') {
                AppConfig.exitApp(moduleName);
            } else {
                BackHandler.exitApp();
            }
        }

    }


    updateGroupName(params) {
        let groupId = params["GroupId"];
        let groupName = params["GroupName"];
        if (groupId == this.state.groupId) {
            let groupInfo = this.state.groupInfo;
            groupInfo["Name"] = groupName;
            this.setState({groupInfo: groupInfo});
        }
    }

    updateGroupTopic(params) {
        let groupId = params["GroupId"];
        let groupTopic = params["GroupTopic"];
        if (groupId == this.state.groupId) {
            let groupInfo = this.state.groupInfo;
            groupInfo["Topic"] = groupTopic;
            this.setState({groupInfo: groupInfo});
        }
    }

    changeGroupPushState(pushState) {
        if (this.state.groupId === '' || this.state.groupId === null) {
            return;
        }
        NativeModules.QimRNBModule.updatePushState(
            this.state.groupId,
            pushState,
            function (responce) {
                if (responce.ok) {

                } else {
                    Alert.alert("提示", "修改群消息提醒状态失败");
                    this.setState({pushState: !pushState});
                }
            }.bind(this)
        );
    }

    changeGroupStickyState(stickyState) {
        if (this.state.groupId === '' || this.state.groupId === null) {
            return;
        }
        NativeModules.QimRNBModule.updateGroupStickyState(
            this.state.groupId,
            function (response) {
                if (response.ok) {

                } else {
                    Alert.alert("提示", "群置顶操作失败");
                    this.setState({stickyState: !stickyState});
                }
            }.bind(this)
        )
    }

    openGroupQRCode() {
        if (this.state.groupInfo["GroupId"] === '' || this.state.groupInfo["GroupId"] === null ||
            this.state.groupInfo["Name"] === '' || this.state.groupInfo["Name"] === null ||
            this.state.groupInfo["HeaderSrc"] === '' || this.state.groupInfo["HeaderSrc"] === null) {
            return;
        }
        this.props.navigation.navigate('GroupQRCode', {
            'groupId': this.state.groupInfo["GroupId"],
            "groupName": this.state.groupInfo["Name"],
            "groupHeader": this.state.groupInfo["HeaderSrc"],
        });
    }

    openGroupNameSetting() {
        if (this.state.groupInfo["GroupId"] === '' || this.state.groupInfo["GroupId"] === null ||
            this.state.groupInfo["Name"] === '' || this.state.groupInfo["Name"] === null) {
            return;
        }

        this.props.navigation.navigate('GroupNameSetting', {
            'groupId': this.state.groupInfo["GroupId"],
            "groupName": this.state.groupInfo["Name"],
        });
    }

    openGroupTopicSetting() {
        if (this.state.groupInfo["GroupId"] === '' || this.state.groupInfo["GroupId"] === null) {
            return;
        }
        this.props.navigation.navigate('GroupTopicSetting', {
            'groupId': this.state.groupInfo["GroupId"],
            "groupTopic": this.state.groupInfo["Topic"],
        });
    }

    openGroupMemberList() {
        if (this.state.groupInfo["GroupId"] === '' || this.state.groupInfo["GroupId"] === null ||
            this.state.memberList === null) {
            return;
        }
        this.props.navigation.navigate('GroupMembers', {
            'groupId': this.state.groupInfo["GroupId"],
            "groupMembers": this.state.memberList,
            "affiliation":this.state.permissions,
        });
    }

    //设置是否显示群销毁按钮
    _isShowDestructionView() {
        if (this.state.permissions == 0) {
            return (

                <View style={styles.exitGroupLayout}>

                    <View style={styles.exitGroup}>
                        <TouchableOpacity style={styles.exitGroupBtn} onPress={() => {
                            this.quitGroup();
                        }}>
                            <Text style={{color: "#FFF", fontSize: 16}}>
                                退出群聊
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.exitGroup}>
                        <TouchableOpacity style={styles.exitGroupBtn} onPress={() => {
                            this.destructionGroup();
                        }}>
                            <Text style={{color: "#FFF", fontSize: 16}}>
                                销毁群组
                            </Text>
                        </TouchableOpacity>
                    </View>


                </View>
            );
        } else {
            return (
                <View style={styles.exitGroupLayout}>
                    <View style={styles.exitGroup}>
                        <TouchableOpacity style={styles.exitGroupBtn} onPress={() => {
                            this.quitGroup();
                        }}>
                            <Text style={{color: "#FFF", fontSize: 16}}>
                                退出群聊
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    componentWillMount() {
        this.unMount = true;
    }

    componentWillUnmount() {
        key = 1;
        this.unMount = false;
        this.groupNameChange.remove();
        this.groupTopicChange.remove();
        this.exit.remove();
        this.removeSession.remove();
        if (this.refreshNick) {
            this.refreshNick.remove();
        }
    }


    //销毁群聊
    destructionGroup() {
        if (this.state.groupId === '' || this.state.groupId === null) {
            return;
        }
        Alert.alert(
            '提示',
            '您是否确定要销毁该群？',
            [
                {text: '取消', onPress: () => console.log('Cancel  Pressed'), style: 'cancel'},
                {
                    text: '确定', onPress: () => NativeModules.QimRNBModule.destructionGroup(
                    this.state.groupId,
                    function (response) {
                        if (response.ok) {

                        } else {
                            Alert.alert("提示", "销毁群聊失败！");
                        }
                    }
                )
                },
            ],
            {cancelable: false}
        )
    }

    clearChatMessage() {
        Alert.alert('提示', '确定清空么?',
            [
                {text: "确定", onPress: this._clearPressOK.bind(this)},
                {text: "取消", onPress: this._clearPressCancel},

            ]
        );
    }

    searchMessage() {
        //跳转到搜索
        let params = {};
        params["Bundle"] = 'clock_in.ios';
        params["Module"] = 'Search';
        params["Properties"] = {};
        params["Properties"]["xmppid"] = this.state.groupId;
        params["Properties"]["realjid"] = this.state.groupId;
        params["Properties"]["chatType"] = '1';
        params["Properties"]["Screen"] = "LocalSearch";
        params["Version"] = "1.0.0";
        NativeModules.QimRNBModule.openRNPage(params, function () {

        });

        NativeModules.QimRNBModule.isShowRedView();
        this.setState({
            showRed:false
        })
    }

    _clearPressOK() {
        if (this.state.groupId === '' || this.state.groupId === null) {
            return;
        }
        let params = {};
        params['xmppId'] = this.state.groupId;
        NativeModules.QimRNBModule.clearImessage(params);
    }

    _clearPressCancel() {

    }

    //退出群聊
    quitGroup() {
        if (this.state.groupId === '' || this.state.groupId === null) {
            return;
        }

        Alert.alert(
            '提示',
            '您是否确定要退出该群？',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: '确定', onPress: () => NativeModules.QimRNBModule.quitGroup(
                    this.state.groupId,
                    function (response) {
                        if (response.ok) {

                        } else {
                            Alert.alert("提示", "退出群聊失败！");
                        }
                    }
                )
                },
            ],
            {cancelable: false}
        )
    }

    _keyExtractor = (item, index) => item.key;

    _renderItem = ({item}) => {
        return (<MyListItem groupId={item.key} groupMembers={item.list} {...this.props}/>);
    };

    showRed() {

            if (this.state.showRed) {
                return (
                    <View>
                        <TouchableOpacity style={[styles.cellContentView, {justifyContent: 'space-between'}]}
                                          onPress={this.searchMessage.bind(this)}>
                            <Text style={styles.cellTitle}>查找聊天记录</Text>
                            <View style={styles.redView}>
                                <View style={styles.round}>
                                </View>
                                <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                            </View>
                        </TouchableOpacity>
                    </View>

                );
            } else {
                return (
                    <View>
                        <TouchableOpacity style={[styles.cellContentView, {justifyContent: 'space-between'}]}
                                          onPress={this.searchMessage.bind(this)}>
                            <Text style={styles.cellTitle}>查找聊天记录</Text>

                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
                );
            }

    }

    showQRCode(){
        if(AppConfig.showGroupQRCode()){
            return(
                <View>
                    <TouchableOpacity style={styles.cellContentView} onPress={this.openGroupQRCode.bind(this)}>
                        <Text style={styles.cellTitle}>群二维码</Text>
                        <View style={styles.cellQRCode}>
                            <Image source={require('../images/qrcode.png')} style={styles.qrCodeIcon}/>
                        </View>
                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    render() {
        // console.log(this.state.groupInfo);
        let groupName = "";
        let groupTopic = "";
        if (this.state.groupInfo) {
            groupName = this.state.groupInfo["Name"];
            groupTopic = this.state.groupInfo["Topic"];
        }
        return (
            <View style={styles.wrapper}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.groupMembers}>
                        <FlatList
                            data={this.state.groupMembers}
                            // extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                        />
                        <TouchableOpacity style={{marginTop: 15, height: 40}}
                                          onPress={this.openGroupMemberList.bind(this)}>
                            <Text style={{fontSize: 16, color: "#999999", textAlign: "center"}}>
                                查看全部群成员
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.baseInfo}>
                        <TouchableOpacity style={styles.cellContentView} onPress={this.openGroupNameSetting.bind(this)}>
                            <Text style={styles.cellTitle}>群聊名称</Text>
                            <Text style={styles.cellValue} selectable={true}>{groupName}</Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>

                        {this.showQRCode()}

                        {/*<View style={styles.cellGroupTopic}>*/}
                        <TouchableOpacity style={styles.cellContentView}
                                          onPress={this.openGroupTopicSetting.bind(this)}>
                            <Text style={styles.cellTitle}>群公告</Text>
                            {/*<View style={styles.cellGroupTopicValue}>*/}
                            <Text style={styles.cellValue} numberOfLines={1}>{groupTopic}</Text>

                            {/*</View>*/}
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                        {/*</View>*/}
                    </View>
                    <View style={styles.line}>

                    </View>
                    <View style={styles.groupNotify}>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>群消息提醒</Text>
                            <View style={styles.cellQRCode}>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: .75}]}} value={this.state.pushState}
                                        onValueChange={(value) => {
                                            this.setState({pushState: value});
                                            this.changeGroupPushState(value);
                                        }}/>
                            </View>
                        </View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>置顶聊天</Text>
                            <View style={styles.cellQRCode}>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: .75}]}}
                                        value={this.state.stickyState}
                                        onValueChange={(value) => {
                                            this.setState({stickyState: value});
                                            this.changeGroupStickyState(value);
                                        }}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.line}>

                    </View>

                    {this.showRed()}


                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={this.clearChatMessage.bind(this)}>
                            <Text style={styles.cellTitle}>清空聊天记录</Text>
                            <View style={styles.cellQRCode}>
                            </View>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>

                    {this._isShowDestructionView()}
                </ScrollView>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    tabBar: {
        height: 64,
        flexDirection: "row",
        backgroundColor: "#EAEAEA",
    },
    leftTab: {
        flex: 1,
    },
    rightTab: {
        flex: 1,
    },
    groupMembers: {
        backgroundColor: "#FFF",
    },
    addMemberBtn: {
        width: 46,
        height: 46,
        borderColor: "#E1E1E1",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
    },
    addMemberIcon: {
        width: 24,
        height: 24,
    },
    memberHeaderBtn: {
        width: 46,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
    },
    memberHeader: {
        width: 46,
        height: 46,
        borderRadius: 5,
    },
    memberName: {
        fontSize: 12,
        color: "#999999",
        width: 46,
        textAlign: "center",
        marginTop: 5,
        height: 16,
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#EAEAEA",
    },
    contentContainer: {
        // paddingVertical: 20
    },
    line: {
        height: 10,
    },
    redView: {

        flexDirection: "row",
        height: 44,
        alignItems: "center",
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
    cellTitle: {
        width: 150,
        fontSize: 14,
        color: "#333333",
    },
    cellValue: {
        flex: 1,
        textAlign: "right",
        color: "#999999",

    },
    cellQRCode: {
        flex: 1,
        alignItems: "flex-end",
    },
    cellGroupTopic: {
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderColor: "#EAEAEA",
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
    },
    cellGroupTopicTitle: {
        height: 30,
        textAlign: "left",
        fontSize: 15,
        color: "#333333",
        paddingTop: 10,
    },
    cellGroupTopicValue: {
        maxHeight: 60,
        flexDirection: "row",
        paddingBottom: 5,
    },
    cellGroupTopicValueText: {
        flex: 1,
        fontSize: 13,
        color: "#999999",
        marginRight: 10,
        flexShrink: 1,
        lineHeight: 20,
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: -7,
    },
    baseInfo: {},
    qrCodeIcon: {
        width: 24,
        height: 24,
    },
    groupNotify: {
        height: 100,
    },
    exitGroup: {
        height: 44,
        paddingLeft: 17,
        paddingRight: 17,
        marginTop: 20,
        marginBottom: 20,
    },
    exitGroupLayout: {
        marginBottom: 46,
    },
    exitGroupBtn: {
        flex: 1,
        backgroundColor: "#D74F43",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    round: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'red',
        alignSelf: 'center'
    }
});