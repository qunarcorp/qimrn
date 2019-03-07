/* @Flow */
import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Switch,
    Dimensions,
    Alert,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";

const {height, width} = Dimensions.get('window');

export default class ChatInfo extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "聊天信息";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"UserCard"}/>);
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
            userId: this.props.navigation.state.params.UserId,
            RealJid: this.props.navigation.state.params.RealJid,
            // name: this.props.navigation.state.params.Name,
            // headerUri: this.props.navigation.state.params.HeaderUri,
            name: null,
            headerUri: null,
            stickyState: false,
            pushState: false,
            showRed:false,
        };
        this.unMount = false;
        this.cap = (width - 46 * 5) / 6.0;
    }

    //页面框架基本完成,请求一些基础数据
    componentDidMount() {
        if (this.state.userId === '' || this.state.userId === null) {
            return;
        }
        let realJid = this.state.RealJid;
        if(realJid === '' || realJid === null){
            realJid = this.state.userId;
        }
        NativeModules.QimRNBModule.getUserInfo(realJid, function (response) {
            let userInfo = response.UserInfo;
            this.setState({
                name: userInfo['Name'],
                headerUri: userInfo['HeaderUri'],
            })
        }.bind(this));
        let params = {};
        if (this.state.RealJid === '' || this.state.RealJid === null) {
            return;
        }
        params['xmppId'] = this.state.userId;
        params['realJid'] = this.state.RealJid;
        NativeModules.QimRNBModule.syncChatStickyState(params, function (response) {
            let state = response.state;
            this.setState({stickyState: state});
        }.bind(this));

        NativeModules.QimRNBModule.syncPushState(this.state.RealJid, function (responce) {
            let state = responce.state;
            this.setState({pushState: state});
        }.bind(this));

        NativeModules.QimRNBModule.showRedView(function (response) {
            this.setState({
                    showRed:response.show,
                }
            )
        }.bind(this))

    }

    componentWillUnmount() {
        this.unMount = true;
        if (this.subscription) {
            this.subscription.remove();
        }
    }

    openUserCard() {
        // let param = {};
        if(this.state.userId===''||this.state.userId===null){
            return;
        }
        let realJid = this.state.RealJid;
        if(realJid === '' || realJid === null){
            realJid = this.state.userId
        }
        // let userId = this.state.userId;
        // param["UserId"] = userId;
        // NativeModules.QimRNBModule.openUserCard(param);

        this.props.navigation.navigate('UserCard', {
            'UserId': realJid,
            'innerVC': true,
        });
    }

    addGroupMember() {
        if (this.state.name === '' || this.state.name === null ||
            this.state.userId === '' || this.state.userId === null) {
            return;
        }
        //打开加人页面
        // newSelectUsers
        let newSelectUsers = {};
        let user = {}
        user['name'] = this.state.name;
        user['xmppId'] = this.state.userId;
        user['headerUri'] = this.state.headerUri;
        newSelectUsers[this.state.userId] = user;

        this.props.navigation.navigate('GroupMemberAdd', {
            'GroupId': this.props.navigation.state.params.groupId,
            'newSelectUsers': newSelectUsers,
        });
    }

    searchChatHistory() {
        // let params = {};
        // params['NativeName'] = 'searchChatHistory';
        // NativeModules.QimRNBModule.openNativePage(params);

        //跳转到搜索
        let realJid = this.state.RealJid;
        if(realJid === '' || realJid === null){
            realJid = this.state.userId;
        }

        let params = {};
        params["Bundle"] = 'clock_in.ios';
        params["Module"] = 'Search';
        params["Properties"] = {};
        params["Properties"]["xmppid"] = this.state.userId;
        params["Properties"]["realjid"] = realJid;
        params["Properties"]["chatType"] = '0';
        params["Properties"]["Screen"] = "LocalSearch";
        params["Version"] = "1.0.0";
        NativeModules.QimRNBModule.openRNPage(params, function () {

        });


        NativeModules.QimRNBModule.isShowRedView();
        this.setState({
            showRed:false
        })
    }

    changeChatTop(stickyState2) {
        let params = {};
        if (this.state.name === '' || this.state.name === null ||
            this.state.userId === '' || this.state.userId === null
        ) {
            return;
        }
        params['xmppId'] = this.state.userId;
        params['realJid'] = this.state.RealJid;
        NativeModules.QimRNBModule.updateUserChatStickyState(
            params,
            function (response) {
                if (response.ok) {

                } else {
                    Alert.alert("提示", "会话置顶操作失败");
                    this.setState({stickyState: !stickyState2});
                }
            }.bind(this)
        );
    }

    changeChatPushState(pushState) {
        if(this.state.RealJid===''||this.state.RealJid===null){
            return;
        }
        NativeModules.QimRNBModule.updatePushState(
            this.state.RealJid,
            pushState,
            function (responce) {
                if (responce.ok) {

                } else {
                    Alert.alert("提示", "操作失败！");
                    this.setState({pushState: !pushState});
                }
            }.bind(this)
        );
    }

    openEncryptedSession() {

    }

    // showRed() {
    //     NativeModules.QimRNBModule.showRedView(function (response) {
    //         if (response.show) {
    //             return (
    //                 <View style={styles.redView}>
    //                     <View style={styles.round}>
    //                     </View>
    //                     <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
    //                 </View>
    //             );
    //         } else {
    //             return (
    //                 <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
    //             );
    //         }
    //     });
    // }

    clearChatMessage() {
        Alert.alert('提示', '确定清空么?',
            [
                {text: "确定", onPress: this._clearPressOK.bind(this)},
                {text: "取消", onPress: this._clearPressCancel},

            ]
        );
    }

    showRed() {

        if (this.state.showRed) {
            return (
                <View>
                    <TouchableOpacity style={[styles.cellContentView, {justifyContent: 'space-between'}]}
                                      onPress={this.searchChatHistory.bind(this)}>
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
                                      onPress={this.searchChatHistory.bind(this)}>
                        <Text style={styles.cellTitle}>查找聊天记录</Text>

                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                </View>
            );
        }

    }

    _clearPressOK(){
        let params ={};
        params['xmppId'] = this.state.userId;
        NativeModules.QimRNBModule.clearImessage( params);
    }

    _clearPressCancel(){

    }

    render() {
        let headerUri = "../images/singleHeaderDefault.png";
        return (
            <View style={styles.wrapper}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.headerView}>
                        <TouchableOpacity style={styles.userView} onPress={this.openUserCard.bind(this)}>
                            <Image source={{uri: this.state.headerUri ? this.state.headerUri : headerUri}} style={styles.userHeaderImage}/>
                            <Text style={styles.userName} numberOfLines={1}>{this.state.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addMemberBtn} onPress={() => {
                            this.addGroupMember();
                        }}>
                            <Image source={require('../images/add_member.png')} style={styles.addMemberIcon}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.line}/>
                    <View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>消息提醒</Text>
                            <View style={styles.cellQRCode}>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: .75}]}} value={this.state.pushState}
                                        onValueChange={(value) => {
                                            this.setState({pushState: value});
                                            this.changeChatPushState(value);
                                        }}/>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>置顶聊天</Text>
                            <View style={styles.cellQRCode}>
                                <Switch style={{transform: [{scaleX: .8}, {scaleY: .75}]}}
                                        value={this.state.stickyState}
                                        onValueChange={(value) => {
                                            this.setState({stickyState: value});
                                            this.changeChatTop(value);
                                        }}/>
                            </View>
                        </TouchableOpacity>
                        {/*<TouchableOpacity style={styles.cellContentView}>*/}
                        {/*<Text style={styles.cellTitle}>加密聊天</Text>*/}
                        {/*<View style={styles.cellQRCode}>*/}
                        {/*<Switch style={{transform: [{scaleX: .8}, {scaleY: .75}]}} value={this.state.pushState}*/}
                        {/*onValueChange={(value) => {*/}
                        {/*this.setState({pushState: value});*/}
                        {/*this.openEncryptedSession(value);*/}
                        {/*}}/>*/}
                        {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    <View style={styles.line}/>
                    {/*<View>*/}
                        {/*<TouchableOpacity style={styles.cellContentView} onPress={this.searchChatHistory.bind(this)}>*/}
                            {/*<Text style={styles.cellTitle}>查找聊天内容</Text>*/}

                            {this.showRed()}
                            {/*<Text style={styles.cellValue}></Text>*/}
                            {/*<Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    <View>
                        <TouchableOpacity style={styles.cellContentView} onPress={this.clearChatMessage.bind(this)}>
                            <Text style={styles.cellTitle}>清空聊天记录</Text>
                            <Text style={styles.cellValue}></Text>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
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
    cellTitle: {
        width: 100,
        color: "#333333",
    },
    cellValue: {
        flex: 1,
        textAlign: "right",
        color: "#999999",
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: -7,
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
    cellQRCode: {
        flex: 1,
        alignItems: "flex-end",
    },
    headerView: {
        height: 94,
        backgroundColor: "#FFF",
        flexDirection: 'row',
    },
    userView: {
        width: 50,
        marginLeft: 26,
        marginTop: 15,
    },
    userHeaderImage: {
        width: 48,
        height: 48,
        borderRadius: 5,
        borderColor: "#D1D1D1",
        borderWidth: 1,
    },
    userName: {
        fontSize: 12,
        color: '#616161',
        textAlign: 'center',
        marginTop: 5,

    },
    addMemberBtn: {
        width: 46,
        height: 46,
        borderColor: "#E1E1E1",
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginLeft: 26,
    },
    addMemberIcon: {
        width: 24,
        height: 24,
    },
    redView: {

        flexDirection: "row",
        height: 44,
        alignItems: "center",
    },
    round: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'red',
        alignSelf: 'center'
    },
});
