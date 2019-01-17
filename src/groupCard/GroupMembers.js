import React, {PureComponent} from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    Image,
    View,
    InteractionManager,
    TouchableOpacity,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";

export default class GroupMembers extends PureComponent {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "群成员";
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
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
            groupMembers:[],
        };
        this.index = 0;
        this.unMount = false;
    }

    componentDidMount() {
        let groupMembers =  this.props.navigation.state.params.groupMembers;
        let memberList = [];
        if(groupMembers==null){
            return;
        }
        for (let index = 0, len = groupMembers.length;index < len;index++){
            memberList.push({"key":""+(index+1),"member":groupMembers[index]});
        }
        this.setState({groupMembers:memberList,loadImage:false});
        InteractionManager.runAfterInteractions(()=>{
            this.setState({loadImage:true});
        });
    }

    componentWillUnmount() {
        this.unMount = true;
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

    _keyExtractor = (item, index) => item.key;

    _renderItem = ({item}) => {
        // console.log(item);
        let headerUri = item["member"]["headerUri"];
        let name = item["member"]["name"];
        let xmppId = item["member"]["xmppjid"];
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
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity key={item.key} style={styles.cellContentView} onPress={() => {
                    this.openUserCard(xmppId);
                }}>
                    <Image source={{uri:"../images/singleHeaderDefault.png"}} style={styles.memberHeader}/>
                    <Text>{name}</Text>
                </TouchableOpacity>
            );
        }
    }

    render() {
        // console.log(this.state.groupMembers);
        return (
            <FlatList
                style={{flex:1}}
                data={this.state.groupMembers}
                // extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
            />
        );
    }
}
var styles = StyleSheet.create({
    cellContentView:{
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
});