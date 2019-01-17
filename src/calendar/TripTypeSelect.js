/*************************************************************************************************
 * <pre>
 * @包路径：
 *
 * @类描述:
 * @版本:       V3.0.0
 * @作者        bigwhite
 * @创建时间    2018-09-10 16:59
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
} from "react-native";

import NavCBtn from "../common/NavCBtn";

const items = [
    {typeName: '会议', typeType: 1},
    {typeName: '约会', typeType: 2},
]

export class TripTypeSelect extends Component {


    static navigationOptions = ({navigation}) => {
        let headerTitle = "选择类型";
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
            tripType: this.props.navigation.state.params.tripType,
        }
    }

    _keyExtractor = (item, index) => item.tripType;

    showSelect(type){

        if(type==this.state.tripType){
            return(
                <Text style={TripTypeSelectStyles.iconStyle}>{String.fromCharCode(0xe1d1)}</Text>
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
                        <View style={[{flexDirection:'row',justifyContent:'space-between'},TripTypeSelectStyles.itemView]}>
                            <Text style={[TripTypeSelectStyles.itemText]}>{item['typeName']}</Text>
                            {this.showSelect(item['typeType'])}

                        </View>
                            <View style={[TripTypeSelectStyles.divider]}/>

                    </View>
                </TouchableOpacity>
            </View>
        )
        // }
    };

    clickItem(item, index) {
        let par = {};
        par['tripType']=item['typeType'];
        DeviceEventEmitter.emit("updateTripType", par);
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={TripTypeSelectStyles.container}>
                <FlatList
                    data={items}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}

                />
            </View>
        );
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}

let {width, height} = Dimensions.get("window")
const TripTypeSelectStyles = StyleSheet.create({
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