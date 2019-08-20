import
    React, {
    Component
}
    from
        'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Switch, Alert,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";

export default class AlertVoiceSetting extends Component{
    static navigationOptions = ({navigation}) => {
        let headerTitle = "提示音设置";
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        return {
            headerTitle:headerTitle,
            headerTitleStyle:{
                fontSize:14
            },
            headerLeft:leftBtn,
        };
    };

    constructor(props){
        super(props);
        this.state = {
            alertVoiceState:false,
        };
    }

    componentDidMount() {
        NativeModules.QimRNBModule.getAlertVoiceType(function (response) {
            let state = response.state;
            this.setState({alertVoiceState:state});
        }.bind(this));
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    configAlertStatus(){
        NativeModules.QimRNBModule.configAlertStatus(this.state);
    }

    changeConfigAlertStatus(state) {
        NativeModules.QimRNBModule.changeConfigAlertStatus(state, function (response) {
                if (response.ok) {

                } else {
                    Alert.alert("提示", "修改通知开启状态失败");
                    this.setState({alertVoiceState: !state});
                }
            }.bind(this)
        );
    }
    // changeAlertVoiceState(newAlertType) {
    //    NativeModules.QimRNBModule.updateAlertVoiceType(state, function (response) {
    //        if (response.ok) {
    //
    //        } else {
    //            Alert.alert("提示","修改提示音状态失败");
    //            this.setState({alertVoiceState:newAlertType});
    //        }
    //     }.bind(this));
    // }

    _renderAlertVoiceSetting() {
        return(
          <View>
              <TouchableOpacity style={styles.cellContentView} onPress={() =>{
                   this.setState({alertVoiceState : true}, ()=> {
                       this.changeConfigAlertStatus(this.state.alertVoiceState);
                   });
              }}>
                  <Text style={styles.cellTitle}>强提示音</Text>
                  <View style={styles.cellValue2}>
                      {this.state.alertVoiceState ? <Image source={require('../images/selected_icon.png')} style={styles.rightArrow}/> : null}
                  </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cellContentView} onPress={() =>{
                  this.setState({alertVoiceState:false}, ()=> {
                      this.changeConfigAlertStatus(this.state.alertVoiceState);
                  });
                }}>
                  <Text style={styles.cellTitle}>弱提示音</Text>
                  <View style={styles.cellValue2}>
                      {!this.state.alertVoiceState ? <Image source={require('../images/selected_icon.png')} style={styles.rightArrow}/>:null}
                  </View>

              </TouchableOpacity>
          </View>
        );
    }

    render() {
        return (
          <View style={styles.wrapper}>
              <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                 {this._renderAlertVoiceSetting()}
              </ScrollView>
          </View>
        );
    }
}


var styles = StyleSheet.create({
    wrapper: {
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
        height: 20,
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: 44,
        borderBottomWidth: 1,
        borderColor: "#EAEAEA",
        paddingLeft: 10,
        alignItems: "center",
        flex: 1,
    },
    cellIcon: {
        width: 24,
        height: 24,
        lineHeight: 24,
        fontFamily: "QTalk-QChat",
        fontSize: 22,
        color: "#888888",
        marginRight: 5,
    },
    cellTitle: {
        width: 200,
        color: "#212121",
        fontSize: 14,
    },
    cellImg:{
        height:18,
        width:18,
        marginRight:5,
        alignItems: "flex-end",
    },
    cellValue: {
        flex: 1,
        textAlign: "right",
        color: "#999999",
        marginRight: 5,
    },
    cellValue2: {
        flex: 1,
        alignItems: "flex-end",
        paddingRight: 5,
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    sectionHeader: {
        height: 40,
        lineHeight: 40,
        paddingLeft: 10,
        color: "#616161",
        fontSize: 12,
    },
});
