import
    React, {
    Component
}
    from
        'react';
import {
    View,
    Image,
    Text,
    ListView,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Platform,
    ScrollView,
    Alert, NativeAppEventEmitter,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import AppConfig from "../common/AppConfig";

export default class ServiceState extends Component {
    static navigationOptions = ({navigation}) => {
        let headerTitle = "服务状态";
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        // let leftBtn = (<NavCBtn btnType={NavCBtn.BACK_BUTTON} moduleName={"Setting"}/>);
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
        this.ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 != r2});
        this.state = {
            JsonData: this.ds,
            SeatArray:[],
        }
    }

    componentWillUnmount(){

    }

    componentDidMount() {
        NativeModules.QimRNBModule.getServiceState(function (response) {
            this.setState({
                JsonData:this.ds.cloneWithRows(response.JsonData),
                SeatArray:response.JsonData,
            });
        }.bind(this));
    }


    render(){
        return(
            <View style={styles.wrapper}>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.JsonData}
                    renderRow={this.renderRow.bind(this)}
                    style={styles.list}>
                </ListView>

            </View>
        );
    }

    _showImage(flag){
        if(flag){
            return (

            <Image source={require('../images/selected_icon.png')} style={styles.rightArrow}></Image>
            );
        }
    }

    _settingServiceState(state,rowData,rowId){
        if(state !== rowData.st){
            let params = {}
            params['sid'] = rowData.sid;
            params['state'] = state;
            NativeModules.QimRNBModule.setServiceState(params,function (response) {
                if(response.result){
                    this.state.SeatArray[rowId].st = state;
                    this.setState({
                        JsonData:this.ds.cloneWithRows(this.state.SeatArray)
                    });;
                }else{
                    alert("设置失败！")
                }
            }.bind(this));
        }
    }

    // 返回一个Item
    renderRow(rowData,sectionId,rowId){
        return(
            <View style={styles.wrapper_row}>
                <View style={styles.shopRow}>
                    <Text style={styles.cellTitle}>店铺名：</Text>
                    <Text style={styles.cellTitleValue}>{rowData.sname}</Text>
                </View>

                    <TouchableOpacity style={styles.selectRow} onPress={() => {
                        this._settingServiceState('0',rowData,rowId);
                    }}>
                        <Text style={styles.cellContent}>标准模式</Text>
                        <Text style={styles.cellContentValue}>（在线时才接收咨询，默认）</Text>
                        {this._showImage('0' == rowData.st)}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.selectRow} onPress={() => {
                        this._settingServiceState('4',rowData,rowId);
                    }}>
                        <Text style={styles.cellContent}>超人模式</Text>
                        <Text style={styles.cellContentValue}>（不在线也接收咨询）</Text>
                        {this._showImage('4' == rowData.st)}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.selectRow} onPress={() => {
                        this._settingServiceState('1',rowData,rowId);
                    }}>
                        <Text style={styles.cellContent}>勿扰模式</Text>
                        <Text style={styles.cellContentValue}>（在线也不接收咨询）</Text>
                        {this._showImage('1' == rowData.st)}
                    </TouchableOpacity>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    wrapper_row: {
        height:210,
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#EAEAEA",
    },
    cellTitle: {
        color: "#999999",
        fontSize: 13,
    },
    cellTitleValue: {
        flex:1,
        color: "#999999",
        fontSize: 13,
    },
    cellContent: {
        width:100,
        color: "#000000",
        fontSize: 14,
    },
    cellContentValue: {
        flex:1,
        color: "#999999",
        textAlign: "left",
        fontSize: 14,
    },
    list: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: -7,
    },
    selectRow:{
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: 50,
        borderBottomWidth: 1,
        borderColor: "#EAEAEA",
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
        flex: 1,
    },
    shopRow:{
        flexDirection: "row",
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom:5,
        alignItems: "flex-end",
        flex: 1,
    }

});