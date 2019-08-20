import React, {PureComponent} from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    Image,
    View,
    InteractionManager,
    TouchableOpacity, NativeModules, DeviceEventEmitter, Alert,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";

export default class GroupMembers extends PureComponent {



    static navigationOptions = ({navigation}) => {
        let headerTitle = "群成员";
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
            if (navigation.state.params.onSavePress) {
                navigation.state.params.onSavePress();
            }
        }}>{navigation.getParam("rightText")}</NavCBtn>);
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
        this.state = {
            groupMembers:[],
        };
        this.index = 0;
        this.unMount = false;
        this.settingState = false;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress: this.setting.bind(this),
        });

        let groupMembers =  this.props.navigation.state.params.groupMembers;
        this.affiliation = this.props.navigation.state.params.affiliation;
        this.groupId = this.props.navigation.state.params.groupId;

        this.setMembersData(groupMembers);
        this.setState({loadImage:false});

        InteractionManager.runAfterInteractions(()=>{
            this.setState({loadImage:true});
        });
        if (this.affiliation == 0){
            this.props.navigation.setParams({
                rightText: '管理员设置',
            })
        }

        this.refreshGroupMemeber = DeviceEventEmitter.addListener('updateGroupMember', function (params) {
            let groupMembers = params["GroupMembers"];
            this.setMembersData(groupMembers)
            this.setState({loadImage:true});
        }.bind(this));
    }

    setMembersData(groupMembers){
        let memberList = [];
        if(groupMembers==null){
            return;
        }
        for (let index = 0, len = groupMembers.length;index < len;index++){
            memberList.push({"key":""+(index+1),"member":groupMembers[index]});
        }
        this.setState({groupMembers:memberList});
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    setting(){
        this.settingState = !this.settingState;
        // this.setState({settingState:!isSettingState});
        this.props.navigation.setParams({
            rightText: this.settingState ? '取消' : '管理员设置',
        })
    }

    openUserCard(xmppJid){
        if(xmppJid===''||xmppJid===null){
            return;
        }
        this.props.navigation.navigate('UserCard', {
            'UserId': xmppJid,
            'innerVC':true,
        });
    }

    setGroupAdmin(xmppid,affiliation,name){
        if(this.groupId===''||this.groupId===null){
            return;
        }
        if(xmppid===''||xmppid===null){
            return;
        }
        if(affiliation == 0){
            return;
        }
        let params = {};
        params["xmppid"] = xmppid;
        params["groupId"] = this.groupId;
        params["name"] = name;
        params["isAdmin"] = affiliation != 1;
        NativeModules.QimRNBModule.setGroupAdmin(params, function () {

        });
    }


    confirmMotice(xmppid,affiliation,name){
        let message = affiliation==1 ? "确定移除该管理员吗？" : "确定将该成员提升为管理员吗？";
        Alert.alert('提示', message,
            [
                {text: "确定", onPress: ()=> this.setGroupAdmin(xmppid,affiliation,name)},
                {text: "取消", onPress: ()=> console.log('cancel Pressed')},
            ]
        )

    }

    showSettingBtn(affiliation,xmppid,name){
        if(this.settingState && affiliation != 0){
            let role = "";
            let settingText = "";
            let sty = styles.memberRole2;
            let settingSty = styles.settingTextStyle0;
            let borderSty = styles.borderStyle1;
            if (affiliation == '0') {
                role = "群主";
                sty = styles.memberRole0;
            } else if (affiliation == '1') {
                role = "管理员";
                sty = styles.memberRole1;
                settingSty = styles.settingTextStyle1;
                settingText = "移除管理员";
            } else {
                borderSty = styles.borderStyle0;
                settingText = "设为管理员";
            }
            return <TouchableOpacity style={borderSty} onPress={() => {
                this.confirmMotice(xmppid,affiliation,name);
            }}>
                    <Text style={settingSty}>{settingText}</Text>
            </TouchableOpacity>
        }else {
            return <View/>
        }
    }

    _keyExtractor = (item, index) => item.key;

    _renderItem = ({item}) => {
        // console.log(item);
        let headerUri = item["member"]["headerUri"];
        let name = item["member"]["name"];
        let xmppId = item["member"]["xmppjid"];
        let affiliation = item["member"]["affiliation"];
        let role = "";
        let sty = styles.memberRole2;
        if (affiliation == '0') {
            role = "群主";
            sty = styles.memberRole0;
        } else if (affiliation == '1') {
            role = "管理员";
            sty = styles.memberRole1;
        } else {

        }
        if (headerUri == null || headerUri == '') {
            headerUri = 'https://qt.qunar.com/file/v2/download/perm/3ca05f2d92f6c0034ac9aee14d341fc7.png';
        }
        if (this.state.loadImage) {
            return (
                <TouchableOpacity key={item.key} style={styles.cellContentView} onPress={() => {
                    this.openUserCard(xmppId);
                }}>
                    <Image source={{uri:headerUri}} style={styles.memberHeader}/>
                    <Text>{name}</Text>
                    <Text style={sty}>{role}</Text>
                    <View style={{flex:1, flexDirection: 'row', justifyContent:"flex-end"}}>
                        {this.showSettingBtn(affiliation,xmppId,name)}
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity key={item.key} style={styles.cellContentView} onPress={() => {
                    this.openUserCard(xmppId);
                }}>
                    <Image source={require('../images/singleHeaderDefault.png')} style={styles.memberHeader}/>
                    <Text>{name}</Text>
                    <Text style={sty}>{role}</Text>
                    <View style={{flex:1, flexDirection: 'row',justifyContent:"flex-end"}}>
                        {this.showSettingBtn(affiliation,xmppId,name)}
                    </View>
                </TouchableOpacity>
            );
        }
    }

    render() {
        // console.log(this.state.groupMembers);
        return (
            <FlatList
                style={{flex:1,backgroundColor:"#FFF"}}
                data={this.state.groupMembers}
                ItemSeparatorComponent={this._separator}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
            />
        );
    }

    _separator = () => {
        return <View style={{height:0.1,backgroundColor:'#ccc'}}/>;
    }
}
var styles = StyleSheet.create({
    cellContentView:{
        flex:1,
        height:60,
        flexDirection:"row",
        backgroundColor:"#FFF",
        borderBottomWidth:1,
        borderBottomColor:"#E1E1E1",
        alignItems:"center",
    },
    memberHeader:{
        width:36,
        height:36,
        borderRadius:18,
        marginLeft:15,
        marginRight:15,
    },
    memberName:{
        flex:1,
        fontSize:16,
        color:"#333333",
    },
    memberRole0:{//群主标签样式
        fontSize:11,
        color:"#00CABE",
        padding:3,
        marginLeft:6,
        backgroundColor:'rgba(0,202,190,0.1)'
    },
    memberRole1:{//管理员标签样式
        fontSize:11,
        color:"#999999",
        padding:3,
        marginLeft:6,
        backgroundColor:'rgba(200,200,200,0.2)'
    },
    memberRole2:{//成员标签样式
        marginLeft:10,
    },
    settingTextStyle0:{
        fontSize:14,
        color:"#00CABE",
        padding:5,
        alignItems:"center",
    },
    settingTextStyle1:{
        fontSize:14,
        padding:5,
        color:"#c6c6c6",
        alignItems:"center",
    },
    borderStyle0:{
        borderRadius: 15,
        backgroundColor:"#ffffff",
        borderWidth:1,
        borderColor:"#00CABE",
        marginRight:10,
    },
    borderStyle1:{
        borderRadius: 15,
        backgroundColor:"#ffffff",
        borderWidth:1,
        borderColor:"#c6c6c6",
        marginRight:10,
    }
});