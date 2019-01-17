/*************************************************************************************************
 * <pre>
 * @包路径：
 *
 * @类描述:
 * @版本:       V3.0.0
 * @作者        bigwhite
 * @创建时间    2018-08-09 20:23
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
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    NativeModules,
    DeviceEventEmitter,
    FlatList,
} from "react-native";
import NavCBtn from "../common/NavCBtn";
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import RadioModal from 'react-native-radio-master';
import DateUtil from '../common/DateUtil';

const DEMO_OPTIONS_2 = [
    {"name": "中国电子大厦", "age": 30},
    {"name": "维亚大厦", "age": 25},
    {"name": "数码大厦", "age": 41},
    {"name": "爱奇艺大厦", "age": 22},
    {"name": "食宝街", "age": 52},
    {"name": "新中关", "age": 33},
    {"name": "欧美汇", "age": 16},
    {"name": "神州", "age": 20},
    {"name": "海龙大厦", "age": 24},
];
const aaa = [{
    "AddressNumber": 1,
    "RoomName": "冰激凌",
    "RoomNumber": 1,
    "RoomDetails": "无"
}, {
    "AddressNumber": 1,
    "RoomName": "火锅",
    "RoomNumber": 2,
    "RoomDetails": "投影"
}, {
    "AddressNumber": 1,
    "RoomName": "麻辣烫",
    "RoomNumber": 3,
    "RoomDetails": "10人座"
}];

const bbb = [{
    "AddressNumber": 2,
    "RoomName": "酸梅汤",
    "RoomNumber": 1,
    "RoomDetails": "空调"
}, {
    "AddressNumber": 2,
    "RoomName": "驴火",
    "RoomNumber": 2,
    "RoomDetails": "无"
}, {
    "AddressNumber": 3,
    "RoomName": "大拌菜",
    "RoomNumber": 3,
    "RoomDetails": "无"
}];

export class TripRoomSelect extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "会议室筛选";
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON, moduleName: 'CreateTrip'};
        let leftBtn = (<NavCBtn {...props}/>);
        // let leftBtn = (<NavCBtn {navigation:} btnType={NavCBtn.BACK_BUTTON} moduleName={"CreateTrip"}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
            if (navigation.state.params.onSavePress) {
                navigation.state.params.onSavePress();
            }
        }}>确定</NavCBtn>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
            // headerRight: rightBtn,
        };
    };

    constructor(props) {

        super(props)
        var time = moment().format("YYYY-MM-DD HH:mm");
        var text = '请选择地址';
        var aName = '请选择地址';
        var aNumber = 0;
        if (this.props.navigation.state.params.tripLocaleNumber != 0) {
            aNumber = this.props.navigation.state.params.tripLocaleNumber;
            aName = this.props.navigation.state.params.tripLocale;
            text = this.props.navigation.state.params.tripLocale;
        }

        // tripLocaleNumber:this.state.tripLocaleNumber,
        //     tripLocale:this.state.tripLocale,

        this.state = {
            beginTime: this.props.navigation.state.params.beginTime,//开始时间
            endTime: this.props.navigation.state.params.endTime,//结束时间
            tripRoomNumber: 0,
            tripAddressNumber: aNumber,
            tripAddressName: aName,
            tripRoomName: '',
            isAllDay: this.props.navigation.state.params.isAllDay,
            addresses: [],
            meetingRooms: [],
            rStartTime: '08:00:00',
            rEndTime: '20:00:00',
            defaultValue: text,
            errMsg: '',
            selectRoomNumber: 0,
        }
    }

    getAvailableRoom() {
        // {
        //     "date": "2018-08-13",//日期
        //     "areaId": 6,//区域id
        //     "startTime": "12:00",//开始时间
        //     "endTime": "13:00"//结束时间
        // }
        let params = {};

        params['date'] = moment(this.state.beginTime).format("YYYY-MM-DD");
        console.log("开始使用:" + this.state.tripAddressNumber)
        params['areaId'] = this.state.tripAddressNumber;
        params['startTime'] = moment(this.state.beginTime).format("HH:mm")
        params['endTime'] = moment(this.state.endTime).format("HH:mm");
        console.log('获取地址:' + this.state.beginTime);
        NativeModules.QimRNBModule.getTripAreaAvailableRoom(
            params,
            function (response) {
                if (response.ok) {
                    this.setState({
                        meetingRooms: response.roomList,
                        errMsg: '',
                    });
                } else {
                    // alert('出现不可预估错误,请重试!');
                    this.setState({
                        errMsg: response.errMsg,
                        meetingRooms: [],
                    })
                }
            }.bind(this)
        )
    }


    _dropdown_2_renderButtonText(rowData) {
        let AddressName = rowData.AddressName;
        let AddressNumber = rowData.AddressNumber;
        let rStartTime = rowData.rStartTime;
        let rEndTime = rowData.rEndTime;
        // const {AddressName, AddressNumber,rStartTime,rEndTime} = rowData;
        console.log("设置之前原始:" + AddressNumber)
        this.setState({
            tripAddressName: AddressName,
            tripAddressNumber: AddressNumber,
            tripRoomNumber: 0,
            tripRoomName: '',
            rStartTime: rStartTime,
            rEndTime: rEndTime,

            // meetingRooms:AddressNumber==1?aaa:bbb,
        }, () => {
            this.getAvailableRoom();
        })
        console.log("设置完成:" + this.state.tripAddressNumber)

        if (this.refs.rm) {
            this.refs.rm.setSelect(0);
        }

        //应该去搜索可用会议室
        return `${AddressName}`;
    }

    _dropdown_2_renderRow(rowData, rowID, highlighted) {
        // let icon = highlighted ? require('./images/heart.png') : require('./images/flower.png');
        let evenRow = rowID % 2;
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View
                    style={[TripRoomSelectStyles.dropdown_2_row, {backgroundColor: evenRow ? '#fafafa' : 'white'}]}>
                    <Text
                        style={[TripRoomSelectStyles.dropdown_2_row_text, highlighted && {color: 'mediumaquamarine'}]}>
                        {`${rowData.AddressName}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == DEMO_OPTIONS_2.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={TripRoomSelectStyles.dropdown_2_separator}
                      key={key}
        />);
    }

    tripRoomChange(id, item) {
        let roomName = '';
        for (let i = 0; i < this.state.meetingRooms.length; i++) {
            if (this.state.meetingRooms[i]['RoomNumber'] == id) {
                roomName = this.state.meetingRooms[i]['RoomName'];
            }
        }
        this.setState({
            tripRoomNumber: id,
            tripRoomName: roomName,
        });
    }

    _showOptionalRooms() {
        if (!this.state.meetingRooms || !this.state.meetingRooms.length > 0) {
            return
        }
        let roomList = this.state.meetingRooms;
        var par = [];
        for (let i = 0; i < roomList.length; i++) {
            // alert( this.state.meetingRooms[i])
            let text = roomList[i]['RoomName'] + '(' + roomList[i]['RoomCapacity'] + ')' + roomList[i]['RoomDetails']
            par.push(
                <Text key={i} value={roomList[i]['RoomNumber']}>{text}</Text>
            )
        }
        //
        return (
            <RadioModal
                ref={'rm'}
                style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}
                innerStyle={[TripRoomSelectStyles.selectItem]}
                onValueChange={(id, item) => {
                    this.tripRoomChange(id, item);
                }}

            >

                {par}
            </RadioModal>
        );


    }

    setBeginTime(datetime) {
        if (DateUtil.isBefores(datetime, this.state.rStartTime)) {
            alert("开始时间不能早于区域开始时间:" + this.state.rStartTime)
            return;
        }
        if (DateUtil.isAfters(datetime, this.state.rEndTime)) {
            alert('开始时间不能晚于区域结束时间:' + this.state.rEndTime);
            return;
        }
        var start = DateUtil.TimeZero(datetime);
        var end = DateUtil.TimeIncreaseHours(start);
        this.setState({
                beginTime: start,
                endTime: end,
            }
        );

        this.getAvailableRoom()
    }

    setEndTime(datetime) {
        if (DateUtil.isBefores(datetime, this.state.rStartTime)) {
            alert("结束时间不能早于区域开始时间:" + this.state.rStartTime)
            return;
        }
        if (DateUtil.isAfters(datetime, this.state.rEndTime)) {
            alert('结束时间不能晚于区域结束时间:' + this.state.rEndTime);
            return;
        }
        var end = DateUtil.TimeZero(datetime);
        this.setState({endTime: end});

        this.getAvailableRoom()
    }

    showisAllDayDatePicker() {
        if (this.state.isAllDay) {
            return (
                <View style={[TripRoomSelectStyles.box, TripRoomSelectStyles.rowView,]}>

                    <Text style={[TripRoomSelectStyles.tileItem,]}>指定日期</Text>
                    <DatePicker
                        style={[TripRoomSelectStyles.tileItem, {white: 180}]}
                        date={this.state.beginTime}
                        mode="datetime"
                        minDate={moment().format("YYYY-MM-DD HH:mm")}
                        // maxDate={DateUtil.TimeDayAdd(moment().format("YYYY-MM-DD HH:mm"),4)}
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        minuteInterval={10}
                        onDateChange={(datetime) => {
                            this.setState({beginTime: datetime + ' 08:00', endTime: datetime + ' 20:00'});
                            this.getAvailableRoom();
                        }}
                    />
                    {/*<Text style={styles.normalTextRight}>{this.state.beginTime}</Text>*/}

                </View>
            );
        } else {
            return (
                <View>
                    <View style={[TripRoomSelectStyles.box, TripRoomSelectStyles.rowView,]}>

                        <Text style={[TripRoomSelectStyles.tileItem, TripRoomSelectStyles.maleft64]}>开始时间</Text>
                        <DatePicker
                            style={[TripRoomSelectStyles.tileItem, {white: 180}]}
                            date={this.state.beginTime}
                            mode="datetime"
                            minDate={moment().format("YYYY-MM-DD HH:mm")}
                            // maxDate={DateUtil.TimeDayAdd(moment().format("YYYY-MM-DD HH:mm"),4)}
                            format="YYYY-MM-DD HH:mm"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            minuteInterval={10}
                            onDateChange={(datetime) => {
                                this.setBeginTime(datetime)

                            }}
                        />
                        {/*<Text style={styles.normalTextRight}>{this.state.beginTime}</Text>*/}

                    </View>
                    <View style={[TripRoomSelectStyles.box, TripRoomSelectStyles.rowView,]}>
                        <Text style={[TripRoomSelectStyles.tileItem, TripRoomSelectStyles.maleft64]}>结束时间</Text>

                        <DatePicker
                            style={[TripRoomSelectStyles.tileItem, {white: 180}]}
                            date={this.state.endTime}
                            minDate={this.state.beginTime}
                            maxDate={this.state.beginTime}
                            mode="datetime"
                            format="YYYY-MM-DD HH:mm"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            minuteInterval={10}
                            onDateChange={(datetime) => {
                                this.setEndTime(datetime)
                            }}
                        />
                    </View>

                </View>
            );
        }
    }

    _keyExtractor = (item, index) => item.RoomNumber;

    _renderItem = ({item, index}) => {
        let text = item['RoomName'] + '(' + item['RoomCapacity'] + ')' + item['RoomDetails']

        return (
            <View>
                <TouchableOpacity onPress={
                    this.clickItem.bind(this, item, index)
                }>
                    <View style={{flexDirection: 'column'}}>
                        <View style={[{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }, TripRoomSelectStyles.itemView]}>
                            <Text style={[TripRoomSelectStyles.itemText]}>{text}</Text>
                            {this.showSelect(item['RoomNumber'])}

                        </View>
                        <View style={[TripRoomSelectStyles.divider]}/>

                    </View>
                </TouchableOpacity>
            </View>
        )
        // }
    };

    showSelect(type) {

        if (type == this.state.selectRoomNumber) {
            return (
                <Text style={TripRoomSelectStyles.iconStyle}>{String.fromCharCode(0xe1d1)}</Text>
            );
        }

    }

    clickItem(item, index) {

        // this.setState({
        //     tripRoomNumber: id,
        //     tripRoomName: roomName,
        // });
        this.setState({
            tripRoomNumber: item['RoomNumber'],
            tripRoomName:item['RoomName'],
        }, function () {
            this.saveAddress();
        })
        // let par = {};
        // par['tripType']=item['typeType'];
        // DeviceEventEmitter.emit("updateTripType", par);
        // this.props.navigation.goBack();
    }


    selectTripArea() {
        this.props.navigation.navigate('TripAreaSelect', {
            // userSelect: selectUsers,
            // beginTime: this.state.beginTime,
            // endTime: this.state.endTime,
            tripAddressNumber: this.state.tripAddressNumber,
        });
    }

    render() {
        return (
            <View style={[TripRoomSelectStyles.wrapper]}>

                <View style={{flexDirection: 'column'}}>
                    <TouchableOpacity onPress={
                        ()=>{  this.selectTripArea()}

                    }>
                        <View
                            style={[TripRoomSelectStyles.rowView, TripRoomSelectStyles.marginTop18, TripRoomSelectStyles.marginBottom18]}>
                            <Image source={require('../images/Placeholder78.png')}
                                   style={{height: 24, width: 24, marginLeft: 14}}/>
                            {/*<Text style={[styles.normalTextLeft,styles.marginLeft26]}>行程地点</Text>*/}

                            <Text
                                style={[TripRoomSelectStyles.normalTextLeft, TripRoomSelectStyles.marginLeft26]}>{this.state.tripAddressName}</Text>

                            <Image source={require('../images/arrow_right.png')}
                                   style={[{height: 24, width: 24,}, TripRoomSelectStyles.meright16]}/>

                        </View>
                    </TouchableOpacity>
                    {this.showisAllDayDatePicker()}
                </View>


                <View style={[TripRoomSelectStyles.box, TripRoomSelectStyles.rowView, {
                    flexDirection: 'column',

                }]}>
                    <Text
                        style={[TripRoomSelectStyles.topic,]}>{this.state.meetingRooms.length > 0 ? '可用会议室' : '无可用会议室'}</Text>
                </View>
                <FlatList
                    data={this.state.meetingRooms}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}

                />
            </View>
        );
    }

    componentDidMount() {
        console.log('ceshi' + this.state.beginTime);
        if (DateUtil.isBefores(this.state.endTime, this.state.rStartTime) || DateUtil.isAfters(this.state.beginTime, this.state.rEndTime) || DateUtil.isBefores(this.state.beginTime, this.state.rStartTime) || DateUtil.isAfters(this.state.endTime, this.state.rEndTime)) {
            alert("预定会议室时间为:" + this.state.rStartTime + '-' + this.state.rEndTime);

            if (DateUtil.isBefores(this.state.beginTime, this.state.rStartTime)) {
                let a = DateUtil.mandatoryHours(this.state.beginTime, 8);
                let b = DateUtil.TimeIncreaseHours(a);
                this.setState({
                    beginTime: a,
                    endTime: b,
                })
            }

            if (DateUtil.isAfters(this.state.endTime, this.state.rEndTime) || DateUtil.isBefores(this.state.endTime, this.state.rStartTime)) {
                let c = DateUtil.mandatoryDayAdd(this.state.beginTime, 8);
                let d = DateUtil.TimeIncreaseHours(c);
                this.setState({
                    beginTime: c,
                    endTime: d,
                })
            }
            // return;
        }
        console.log('完成测试:' + this.state.beginTime);


        this.props.navigation.setParams({
            onSavePress: this.saveAddress.bind(this),
        });

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

        this.getAvailableRoom()

        this.updateArea = DeviceEventEmitter.addListener('updateTripArea', function (params) {
            this.updateTripArea(params);
        }.bind(this));
    }

    updateTripArea(params){
        let AddressName = params.AddressName;
        let AddressNumber = params.AddressNumber;
        let rStartTime = params.rStartTime;
        let rEndTime = params.rEndTime;
        // const {AddressName, AddressNumber,rStartTime,rEndTime} = rowData;
        // console.log("设置之前原始:" + AddressNumber)
        this.setState({
            tripAddressName: AddressName,
            tripAddressNumber: AddressNumber,
            tripRoomNumber: 0,
            tripRoomName: '',
            rStartTime: rStartTime,
            rEndTime: rEndTime,

            // meetingRooms:AddressNumber==1?aaa:bbb,
        }, () => {
            this.getAvailableRoom();
        })
    }

    componentWillMount() {


    }

    componentWillUnmount() {
        this.updateArea.remove();
    }


    saveAddress() {
        // alert('保存地址');
        //进行数据检查
        if (this.state.tripAddressNumber == 0) {
            alert('请选择地址!');
            return;
        }
        if (!this.state.isAllDay) {
            if (!moment(this.state.beginTime).isBefore(this.state.endTime)) {
                alert("结束时间必须大于开始时间!");
                return;
            }
        }

        if (this.state.tripRoomNumber == 0) {
            alert('请选择会议室!');
            return;
        }

        // beginTime: time,//开始时间
        //     endTime: time,//结束时间
        //     tripRoomNumber: 0,
        //     tripAddressNumber: 0,
        //     tripAddressName:'',
        //     tripRoomName:'',
        let par = {};
        par['beginTime'] = this.state.beginTime;
        par['endTime'] = this.state.endTime;
        par['tripRoomNumber'] = this.state.tripRoomNumber;
        par['tripAddressNumber'] = this.state.tripAddressNumber;
        par['tripAddressName'] = this.state.tripAddressName;
        par['tripRoomName'] = this.state.tripRoomName;
        par['AddressRoom'] = this.state.tripAddressName + '-' + this.state.tripRoomName;
        DeviceEventEmitter.emit("updateTripDate", par);
        this.props.navigation.goBack();

    }
}

let {width, height} = Dimensions.get("window")
const TripRoomSelectStyles = StyleSheet.create({
    selectItem: {
        height: 40,
        width: width - 10,
        marginRight: 0,


    },
    container: {
        flex: 1,
    },
    topic: {
        fontSize: 14,
        color: '#9e9e9e',
        marginTop: 19,
        marginBottom: 22,
    },
    box: {},
    rowView: {
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: 'row',
    },
    columnView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tileItem: {
        fontSize: 14,
        color: '#212121',
        alignSelf: 'center',
        flex: 1
    },
    dropdown_2: {
        alignSelf: 'center',

        width: 180,
        borderWidth: 0,
        borderRadius: 3,
        backgroundColor: '#C1C1C1',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
        width: 180,
        height: 300,
        borderColor: '#C1C1C1',
        borderWidth: 1,
        borderRadius: 3,
    },

    dropdown_2_row: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
    },
    dropdown_2_separator: {
        height: 1,
    },
    dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: 'navy',
        textAlignVertical: 'center',
    },
    marginLeft26: {
        marginLeft: 26,
    },
    maleft64: {
        marginLeft: 64,
    },
    marginTop18: {
        marginTop: 18
    },
    marginBottom18: {
        marginBottom: 18
    },
    boxBody: {
        height: 40,
    },
    normalTextLeft: {
        flex: 1,
        color: '#212121',
        fontSize: 14,

    },
    normalTextRight: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        backgroundColor: '#ffffff'
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