import React, {Component} from 'react';
import {
    Image,
    View,
    Text,
    StyleSheet,
    NativeModules,
    InteractionManager,
    Dimensions,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";

const {height, width} = Dimensions.get('window');
export default class GroupQRCode extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "群二维码名片";
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 18
            },
            headerLeft: leftBtn,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            groupId:this.props.navigation.state.params.groupId,
            groupName:this.props.navigation.state.params.groupName,
            groupHeader:this.props.navigation.state.params.groupHeader,
            groupQRCode:null,
        }
        this.unMount = false;
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(()=> {
        if(this.state.groupId===''||this.state.groupId===null){
            return
        }
            NativeModules.QimRNBModule.getGroupQRCode(this.state.groupId,function (responce) {
                this.setState({groupQRCode:responce.qrCode});
            }.bind(this));
        // });
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    qrCodeImage(){
        if (this.state.groupQRCode){
            return (<View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Image style={styles.qrCode} source={{uri:this.state.groupQRCode}}/></View>);
        }
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.qrCodeContent}>
                    <View style={styles.headerInfo}>
                        <Image style={styles.headerImage} source={{uri: this.state.groupHeader}} />
                        <Text style={styles.groupName}>{this.state.groupName}</Text>
                    </View>
                    {this.qrCodeImage()}
                </View>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    wrapper:{
        flex:1,
        backgroundColor:"#C1C1C1",
    },
    qrCodeContent:{
        width:300,
        height:360,
        backgroundColor:"#FFF",
        marginTop:80,
        marginLeft:(width-300)/2.0,
    },
    headerInfo:{
        height:50,
        flexDirection:"row",
        marginTop:20,
        alignItems:"center",
    },
    headerImage:{
        width:50,
        height:50,
        borderRadius:5,
        marginLeft:20,
        marginRight:20,
    },
    groupName:{
        fontSize:16,
        color:"#333333",
    },
    qrCode:{
        width:256,
        height:256,
    }
});