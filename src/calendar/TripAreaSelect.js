/*************************************************************************************************
 * <pre>
 * @包路径：
 *
 * @类描述:
 * @版本:       V3.0.0
 * @作者        bigwhite
 * @创建时间    2018-09-18 15:00
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
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
    NativeModules,
} from "react-native";
import NavCBtn from "../common/NavCBtn";

export class TripAreaSelect extends Component {
    static navigationOptions = ({navigation}) => {
        let headerTitle = "选择区域";
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
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
        super(props)

        this.state = {
            tripAddressNumber: this.props.navigation.state.params.tripAddressNumber,
            addresses:[],
        }
    }

    _keyExtractor = (item, index) => item.AddressNumber;

    showSelect(type){

        if(type==this.state.tripAddressNumber){
            return(
                <Text style={TripAreaSelectStyles.iconStyle}>{String.fromCharCode(0xe1d1)}</Text>
            );
        }

    }

    _renderItem = ({item, index}) => {
        return (
            <View>
                <TouchableOpacity onPress={
                    this.clickItem.bind(this, item, index)
                }>
                    <View style={{flexDirection: 'column'}}>
                        <View style={[{flexDirection:'row',justifyContent:'space-between'},TripAreaSelectStyles.itemView]}>
                            <Text style={[TripAreaSelectStyles.itemText]}>{item['AddressName']}</Text>
                            {this.showSelect(item['AddressNumber'])}

                        </View>
                        <View style={[TripAreaSelectStyles.divider]}/>

                    </View>
                </TouchableOpacity>
            </View>
        )
        // }
    };

    clickItem(item, index) {
        let par = {};
        par['AddressName']=item['AddressName'];
        par['AddressNumber']=item['AddressNumber'];
        par['rEndTime']=item['rEndTime'];
        par['rStartTime']=item['rStartTime'];
        DeviceEventEmitter.emit("updateTripArea", par);
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={TripAreaSelectStyles.container}>
                <FlatList
                    data={this.state.addresses}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}

                />
            </View>
        );
    }

    componentDidMount() {
        NativeModules.QimRNBModule.getTripArea(
            function (response) {
                if (response.ok) {
                    this.setState({
                        addresses: response.areaList,
                    });
                } else {
                    alert('出现不可预估错误,请重试!');
                }
            }.bind(this)
        )
    }

    componentWillUnmount() {

    }
}

let {width, height} = Dimensions.get("window")
const TripAreaSelectStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    itemText: {
        marginLeft:20,
        color: '#616161',
        fontSize: 14,

    },
    itemView:{
        marginTop: 17,
        marginBottom: 17,
        marginRight: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#EEEEEE'
    },
    iconStyle: {
        // width: 36,
        // height: 36,
        // lineHeight: 36,
        // textAlign: "center",
        color: '#4CD964',
        fontFamily: "QTalk-QChat",
        fontSize: 20,
        marginTop: 2,
    },
});