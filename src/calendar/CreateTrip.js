import React, {Component, PureComponent} from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    Switch,
    ScrollView,
    View,
    NativeModules,
    Platform,
    FlatList,
    TouchableOpacity,
    Dimensions,
    DeviceEventEmitter,
    Alert,
    Image,


} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import JsonUtils from "../common/JsonUtils";
import DatePicker from 'react-native-datepicker';
import RadioModal from 'react-native-radio-master';
import moment from 'moment';
import DateUtil from '../common/DateUtil';
import AppConfig from './../common/AppConfig';
import QIMTextInput from './../common/QIMTextInput';


var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

import {Agenda, CalendarList, LocaleConfig, parseDate} from 'react-native-calendars';

const ml = [{ //邀请人列表
    "memberId": "liufan.liu@ejabhost1",//邀请人id
    "memberName": "刘帆",

}, {
    "memberId": "helen.liu@ejabhost1",
    "memberName": "刘静",

}, {
    "memberId": "lihaibin.li@ejabhost1",
    "memberName": "李海滨",

}]


export default class CreateTrip extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = navigation.getParam("titleText");
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON, moduleName: 'TravelCalendar'};


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
        var item = {};
        if (this.props.navigation.state.params.item) {
            item = JsonUtils.strMapToObj(JsonUtils.jsonToMap(this.props.navigation.state.params.item));
        }
        this.showUpdateButtonState = false;
        // var item =  //this.props.navigation.state.params.item;
        var time = moment().format("YYYY-MM-DD HH:mm");
        const uid = AppConfig.getUserId() + '@' + AppConfig.getDomain();
        if (!this.props.navigation.state.params.isCreate) {
            var rt = '';
            var ht = '查看行程';
            if (moment(item['beginTime']).isBefore(time) || uid != item['tripInviter']) {
                rt = '';
                this.showUpdateButtonState = false;
            } else {
                rt = '';
                this.showUpdateButtonState = true;

            }

            this.props.navigation.setParams({
                titleText: ht,
                rightText: this.props.navigation.state.params.isCreate ? '确定' : rt,
            })
        } else {

            this.props.navigation.setParams({
                titleText: '创建行程',
                rightText: '确定',
            })
        }


        var allTime = moment().format("YYYY-MM-DD");
        this.isShowDetails = !this.props.navigation.state.params.isCreate;


        // let aa ='1';
        // var this.isShowDetails = aa==1;
        var begin = DateUtil.TimeToHours(time);
        var end = DateUtil.TimeToHours(DateUtil.TimeToHours(time));
        if (this.props.navigation.state.params.selectedDay) {
            if (!moment(this.props.navigation.state.params.selectedDay).isSame(allTime, 'day')) {
                begin = DateUtil.mandatoryHours(this.props.navigation.state.params.selectedDay, 8);
                end = DateUtil.TimeToHours(begin);
            }
        }
        this.addLocation = '添加地点';
        // var begin = DateUtil.TimeToHours(time);
        // var end = DateUtil.TimeToHours(DateUtil.TimeToHours(time));
        this.state = {
            // selectedDay:!this.isShowDetails?this.props.navigation.state.params.selectedDay:item['beginTime'],
            isShow: this.isShowDetails,
            datePickerModalVisible: false,
            // datetime:this.isShowDetails?item['']:time,
            // chooseDate: time,
            beginTime: this.isShowDetails ? item['beginTime'] : begin,//开始时间
            endTime: this.isShowDetails ? item['endTime'] : end,//结束时间
            noChangBeginTime: begin,//不可更改时间
            noChangEndTime: end,//不可更改时间
            allDayBeginTime: allTime,
            allDayEndTime: allTime,
            noAllDayBeginTime: begin,
            noAllDayEndTime: end,
            tripInviter: this.isShowDetails ? item['tripInviter'] : '',
            tripId: this.isShowDetails ? item['tripId'] : '',//会议id
            tripName: this.isShowDetails ? item['tripName'] : '',//会议名称
            tripType: AppConfig.isEasyTrip() ? 2 : ( this.isShowDetails ? parseInt(item['tripType']) : 1),//会议类型
            tripDate: this.isShowDetails ? item['tripDate'] : null,//会议日期
            tripRoom: this.isShowDetails ? item['tripRoom'] : '',//会议室名
            tripRoomNumber: this.isShowDetails ? parseInt(item['tripRoomNumber']) : 0,//会议室编号
            // tripRoomNumber:0,//会议室编号 设置为0
            tripLocale: this.isShowDetails ? item['tripLocale'] : '',//会议地址
            tripLocaleNumber: this.isShowDetails ? parseInt(item['tripLocaleNumber']) : 0,//会议地址编号
            tripIntr: this.isShowDetails ? item['tripIntr'] : '',//会议说明
            appointment: this.isShowDetails ? item['appointment'] : '',//地址合并
            scheduleTime: this.isShowDetails ? item['scheduleTime'] : '',//会议创建时间
            memberList: this.isShowDetails ? item['memberList'] : [],//邀请人列表
            isAllDay: false,//是否全天
            partyStr: (this.isShowDetails ? parseInt(item['tripType']) : 1 == 2) ? this.isShowDetails ? item['appointment'] : '' : '',//缓存party字段
            AddressRoom: '',
            dataPickerEnable: this.isShowDetails ? true : false,//日期选择器可用不可用 true 不可用 false 可用
            dataPickerEnableMandatory: true,


        }

    }

    selectTripType() {
        this.props.navigation.navigate('TripTypeSelect', {
            // userSelect: selectUsers,
            // beginTime: this.state.beginTime,
            // endTime: this.state.endTime,
            tripType: this.state.tripType,
        });
    }

    selectLocal() {
        console.log("传递数据" + this.state.beginTime);
        this.props.navigation.navigate('TripRoomSelect', {
            isAllDay: this.state.isAllDay,
            beginTime: this.state.beginTime,
            endTime: this.state.endTime,
            tripLocaleNumber: this.state.tripLocaleNumber,
            tripLocale: this.state.tripLocale,
        });
    }

    isAllDayChange(value) {
        this.setState({
            isAllDay: value,
            beginTime: value ? this.state.allDayBeginTime : this.state.noAllDayBeginTime,
            endTime: value ? this.state.allDayEndTime : this.state.noAllDayEndTime,
            tripRoomNumber: 0,
            tripAddressNumber: 0,
            tripAddressName: '',
            tripRoomName: '',
            appointment: '',
            AddressRoom: '',
            partyStr: '',
            dataPickerEnable: false,
        });


    }

    _onPartyChange(text) {
        this.setState({
            appointment: text,
            partyStr: text,
        })
    }

    tripTypeChange(id, item) {
        this.setState({
            tripType: id,
        });
        if (id == 1) {
            this.setState({
                appointment: this.state.AddressRoom,
                dataPickerEnableMandatory: true,
                beginTime: this.state.noChangBeginTime,
                endTime: this.state.noChangEndTime,
            });
        } else if (id == 2) {
            this.setState({
                appointment: this.state.partyStr,
                dataPickerEnableMandatory: false,
                beginTime: this.state.isAllDay ? this.state.allDayBeginTime : this.state.noAllDayBeginTime,
                endTime: this.state.isAllDay ? this.state.allDayEndTime : this.state.noAllDayEndTime,
                // isAllDay:true,
            });
        }
    }

    showtripTypeLocationChange() {
        // alert(id);
        if (AppConfig.isEasyTrip()) {
            return (
                <View>
                    <View style={[styles.rowView, styles.marginTop18, styles.marginBottom18]}>
                        <Image source={require('../images/Placeholder75.png')}
                               style={{height: 24, width: 24, marginLeft: 14}}/>
                        {/*<Text style={[styles.normalTextLeft, {flex: 2}, styles.marginLeft26]}>约会地点</Text>*/}
                        <QIMTextInput style={[styles.normalTextLeft, styles.marginLeft26, {
                            backgroundColor: '#ffffff', height: 20,
                            padding: 0, textAlignVertical: 'top'
                        }]}
                                      underlineColorAndroid='transparent'
                                      value={this.state.partyStr}
                                      editable={!this.state.isShow}
                                      onChangeText={this._onPartyChange.bind(this)}
                                      placeholder={'点击输入会议地点'}
                        ></QIMTextInput>
                    </View>
                    <View style={styles.divider}></View>
                </View>
            );
        } else {
            if (this.state.isShow) {
                // return (
                //     <View style={[styles.rowView, styles.maleft64, styles.marginTop18, styles.marginBottom18]}>
                //         <Text style={styles.normalTextLeft}>地点</Text>
                //
                //         <Text style={styles.normalTextLeft}>{this.state.appointment}</Text>
                //     </View>
                // );
                return (
                    <View style={[styles.rowView, {marginTop: 32}]}>
                        <Image source={require('../images/Placeholder75.png')}
                               style={{height: 24, width: 24, marginLeft: 14}}/>
                        {/*<Text style={[styles.normalTextLeft,styles.marginLeft26]}>行程地点</Text>*/}

                        <Text
                            style={[styles.normalTextLeft, styles.marginLeft26]}>{this.state.appointment ? this.state.appointment : '异常地点'}</Text>


                    </View>
                );
            } else {
                if (this.state.tripType == 1) {
                    return (
                        <TouchableOpacity style={{}} onPress={() => {
                            this.selectLocal();
                        }}>

                            <View style={[styles.rowView, styles.marginTop18, styles.marginBottom18]}>
                                <Image source={require('../images/Placeholder75.png')}
                                       style={{height: 24, width: 24, marginLeft: 14}}/>
                                {/*<Text style={[styles.normalTextLeft,styles.marginLeft26]}>行程地点</Text>*/}

                                <Text
                                    style={[styles.normalTextLeft, styles.marginLeft26]}>{this.state.appointment ? this.state.appointment : this.addLocation}</Text>


                            </View>
                            <View style={styles.divider}></View>
                        </TouchableOpacity>
                    );
                } else if (this.state.tripType == 2) {
                    return (
                        <View>
                            <View style={[styles.rowView, styles.marginTop18, styles.marginBottom18]}>
                                <Image source={require('../images/Placeholder75.png')}
                                       style={{height: 24, width: 24, marginLeft: 14}}/>
                                {/*<Text style={[styles.normalTextLeft, {flex: 2}, styles.marginLeft26]}>约会地点</Text>*/}
                                <QIMTextInput style={[styles.normalTextLeft, styles.marginLeft26, {
                                    backgroundColor: '#ffffff', height: 20,
                                    padding: 0, textAlignVertical: 'top'
                                }]}
                                              underlineColorAndroid='transparent'
                                              value={this.state.partyStr}
                                              editable={!this.state.isShow}
                                              onChangeText={this._onPartyChange.bind(this)}
                                              placeholder={'点击输入约会地点'}
                                ></QIMTextInput>
                            </View>
                            <View style={styles.divider}></View>
                        </View>
                    );
                }
            }
        }


        // if (this.state.tripType == 1) {
        //     return (
        //         <View style={[styles.box, styles.rowView]}>
        //             <Text style={styles.normalTextLeft}>行程地点</Text>
        //
        //             <Text style={styles.normalTextLeft}>{this.state.appointment}</Text>
        //             <TouchableOpacity style={{
        //                 width: 40,
        //                 height: 40,
        //                 backgroundColor: 'green',
        //                 borderRadius: 20,
        //                 justifyContent: 'center',
        //                 alignSelf: 'center',
        //                 alignItems: 'center'
        //             }} onPress={() => {
        //                 this.selectLocal();
        //             }}>
        //                 <Text style={{fontSize: 16, textAlign: 'center', color: 'white'}}>
        //                     +
        //                 </Text>
        //             </TouchableOpacity>
        //         </View>
        //     );
        // } else if (this.state.tripType == 2) {
        //     return (
        //         <View style={[styles.box, styles.rowView]}>
        //             <Text style={[styles.normalTextLeft, {flex: 2}]}>约会地点</Text>
        //             <TextInput style={{flex: 5, backgroundColor: '#fafafa'}} underlineColorAndroid='transparent'
        //                        value={this.state.partyStr}
        //                        editable={!this.state.isShow}
        //                        onChangeText={this._onPartyChange.bind(this)}
        //                        placeholder={'请输入约会地点'}
        //             ></TextInput>
        //         </View>
        //     );
        // }
    }

    checkTime(dateTime) {
        if (Platform.OS == 'ios') {
            if (!moment(this.state.beginTime).isBefore(dateTime)) {
                this.datePicker.onPressCancel();
                this.dateAlertTimer = setTimeout(function () {
                    alert('结束时间必须大约开始时间');
                    typeof options === 'function' ? options && options(): null
                }, 500)
                // return;
            } else {
                this.setState({
                    endTime: dateTime,
                    noAllDayEndTime: dateTime,
                    noChangEndTime: this.state.dataPickerEnable ? this.state.noChangEndTime : dateTime
                });
            }
        } else {
            if (!moment(this.state.beginTime).isBefore(dateTime)) {
                alert('结束时间必须大约开始时间');
                return;
            } else {
                this.setState({
                    endTime: dateTime,
                    noAllDayEndTime: dateTime,
                    noChangEndTime: this.state.dataPickerEnable ? this.state.noChangEndTime : dateTime
                });
            }
        }
    }

    setBeginTime(datetime) {

        var end = DateUtil.TimeIncreaseHours(datetime);
        // this.setState({
        //         beginTime: datetime,
        //         endTime: end,
        //     }
        // );

        this.setState({
            beginTime: datetime, noAllDayBeginTime: datetime,
            endTime: end, noAllDayEndTime: end,
            noChangBeginTime: this.state.dataPickerEnable ? this.state.noChangBeginTime : datetime,
            noChangEndTime: this.state.dataPickerEnable ? this.state.noChangEndTime : end,
        });
    }

    isAllDayShow() {
        if (this.state.isAllDay) {
            return (
                <View>
                    <View style={styles.box}>

                        <View style={[styles.rowView, styles.boxBody, styles.maleft64]}>
                            <Text style={styles.normalTextLeft}>指定日期</Text>
                            <DatePicker
                                ref={datePicker => this.datePicker = datePicker}
                                disabled={this.state.dataPickerEnableMandatory ? this.state.dataPickerEnable : this.state.dataPickerEnableMandatory}
                                style={[styles.normalTextRight, styles.meright16]}
                                date={this.state.beginTime}
                                mode="date"
                                minDate={moment().format("YYYY-MM-DD HH:mm")}
                                // maxDate={DateUtil.TimeDayAdd(moment().format("YYYY-MM-DD HH:mm"),4)}
                                format="YYYY-MM-DD"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                showIcon={false}
                                minuteInterval={10}
                                onDateChange={(datetime) => {
                                    this.setState({
                                        beginTime: datetime + ' 09:00', endTime: datetime + ' 21:00',
                                        allDayBeginTime: datetime + ' 09:00', allDayEndTime: datetime + ' 21:00',
                                        noChangBeginTime: this.state.dataPickerEnable ? this.state.noChangBeginTime : datetime + ' 09:00',
                                        noChangEndTime: this.state.dataPickerEnable ? this.state.noChangEndTime : datetime + ' 21:00',

                                    });
                                }}
                            />
                            {/*<Text style={styles.normalTextRight}>{this.state.beginTime}</Text>*/}
                        </View>

                    </View>
                </View>
            );
        } else {
            if (this.state.isShow) {
                return (
                    <View>

                        <View style={[styles.rowView, {marginTop: 35,}]}>
                            <Image source={require('../images/Placeholder73.png')}
                                   style={{height: 24, width: 24, marginLeft: 14}}/>
                            <Text
                                style={[styles.normalTextLeft, styles.marginLeft26]}>{moment(this.state.beginTime).format('YYYY-MM-DD HH:mm')}——{moment(this.state.endTime).format('YYYY-MM-DD HH:mm')}</Text>

                            {/*<DatePicker*/}
                            {/*disabled={this.state.dataPickerEnableMandatory ? this.state.dataPickerEnable : this.state.dataPickerEnableMandatory}  //本页面暂时不可更改时间*/}
                            {/*style={[styles.normalTextRight, styles.meright16, {border: 0}]}*/}
                            {/*date={this.state.beginTime}*/}
                            {/*mode="datetime"*/}
                            {/*minDate={moment().format("YYYY-MM-DD HH:mm")}*/}
                            {/*// maxDate={DateUtil.TimeDayAdd(moment().format("YYYY-MM-DD HH:mm"),4)}*/}
                            {/*format="YYYY-MM-DD HH:mm"*/}
                            {/*confirmBtnText="Confirm"*/}
                            {/*cancelBtnText="Cancel"*/}
                            {/*showIcon={false}*/}
                            {/*minuteInterval={10}*/}
                            {/*onDateChange={(datetime) => {*/}
                            {/*this.setBeginTime(datetime)*/}
                            {/*}}*/}
                            {/*/>*/}
                            {/*<Text style={styles.normalTextRight}>{this.state.beginTime}</Text>*/}
                        </View>

                    </View>);
            } else {
                return (
                    <View>
                        <View style={styles.box}>

                            <View style={[styles.rowView, styles.boxBody]}>
                                <Image source={require('../images/Placeholder73.png')}
                                       style={{height: 24, width: 24, marginLeft: 14}}/>
                                <Text style={[styles.normalTextLeft, styles.marginLeft26]}>开始时间</Text>

                                <DatePicker
                                    ref={datePicker => this.datePicker = datePicker}
                                    disabled={this.state.dataPickerEnableMandatory ? this.state.dataPickerEnable : this.state.dataPickerEnableMandatory}  //本页面暂时不可更改时间
                                    style={[styles.normalTextRight, styles.meright16, {border: 0}]}
                                    date={this.state.beginTime}
                                    mode="datetime"
                                    minDate={moment().format("YYYY-MM-DD HH:mm")}
                                    // maxDate={DateUtil.TimeDayAdd(moment().format("YYYY-MM-DD HH:mm"),4)}
                                    format="YYYY-MM-DD HH:mm"
                                    confirmBtnText="确定"
                                    cancelBtnText="取消"
                                    showIcon={false}
                                    minuteInterval={10}
                                    onDateChange={(datetime) => {
                                        this.setBeginTime(datetime)
                                    }}
                                />
                                {/*<Text style={styles.normalTextRight}>{this.state.beginTime}</Text>*/}
                            </View>

                        </View>
                        <View style={styles.box}>

                            <View style={[styles.rowView, styles.boxBody, styles.maleft64]}>
                                <Text style={styles.normalTextLeft}>结束时间</Text>

                                <DatePicker
                                    ref={datePicker => this.datePicker = datePicker}
                                    disabled={this.state.dataPickerEnableMandatory ? this.state.dataPickerEnable : this.state.dataPickerEnableMandatory} //本页面暂时不可更改时间
                                    style={[styles.normalTextRight, styles.meright16]}
                                    date={this.state.endTime}
                                    minDate={moment(this.state.beginTime).format("YYYY-MM-DD")}
                                    // maxDate={moment(this.state.beginTime).format("YYYY-MM-DD")}
                                    mode="datetime"
                                    format="YYYY-MM-DD HH:mm"
                                    confirmBtnText="确定"
                                    cancelBtnText="取消"
                                    showIcon={false}
                                    minuteInterval={10}
                                    onDateChange={(datetime) => {
                                        this.checkTime(datetime)
                                        // this.setState({endTime: datetime, noAllDayEndTime: datetime});
                                    }}
                                />
                                {/*<Text style={styles.normalTextRight}>{this.state.endTime}</Text>*/}
                            </View>

                        </View>
                        <View style={styles.divider}></View>
                    </View>);
            }


        }
    }

    updateTripType(par) {
        this.setState({
            tripType: par['tripType'],
        })
    }

    updateTripDate(par) {
        console.log("接收数据" + par['beginTime']);
        this.setState({
            beginTime: par['beginTime'],
            noAllDayBeginTime: par['beginTime'],
            noAllDayEndTime: par['endTime'],
            endTime: par['endTime'],
            noChangBeginTime: par['beginTime'],
            noChangEndTime: par['endTime'],
            tripRoomNumber: par['tripRoomNumber'],
            tripLocaleNumber: par['tripAddressNumber'],
            tripLocale: par['tripAddressName'],
            tripRoom: par['tripRoomName'],
            appointment: par['AddressRoom'],
            AddressRoom: par['AddressRoom'],
            dataPickerEnable: true,
        })
    }

    updateSelectDate(par) {
        this.setState({
            memberList: par['members'],
        })
    }

    //打开选择参会人员页面
    selectAttendees() {

        // {
        //     "memberId": "lihaibin.li@ejabhost1",
        //     "memberName": "李海滨",
        //
        // }
        // this.setState({
        //     memberList:  ml.concat(),
        // })

        let selectUsers = {};

        for (let i = 0; i < this.state.memberList.length; i++) {
            let item = {};
            item['headerUri'] = this.state.memberList[i]['headerUrl'];
            item['name'] = this.state.memberList[i]['memberName'];
            item['xmppId'] = this.state.memberList[i]['memberId'];

            selectUsers[item['xmppId']] = item;

        }
        this.props.navigation.navigate('TripAttendeesSelect', {
            userSelect: selectUsers,
            beginTime: this.state.beginTime,
            endTime: this.state.endTime,
        });
    }

    deleteSelect(deleteId) {
        let mbl = this.state.memberList;
        for (let i = 0; i < mbl.length; i++) {
            if (mbl[i]['memberId'] == deleteId) {
                mbl.splice(i, 1);
                break;
            }
        }
        this.setState({
            memberList: mbl,
        });
        // this.setState({
        //     refresh:true,
        // })
    }

    showMemberState(state) {
        if (state == '1') {
            return '√';
        } else if (state == '2') {
            return 'x';

        } else if (state == '0') {
            return '?'
        }
    }

    showAccept(acceptpar) {
        if (acceptpar.length == 0) {
            return;
        }
        return (
            <View style={{flexDirection: 'column', marginTop: 22}}>
                <Text style={{fontSize: 14, color: '#616161', marginBottom: 11}}>接受</Text>
                <View style={{
                    flexDirection: 'row',
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                }}>
                    {acceptpar}
                </View>
            </View>
        );


    }

    showTentative(tentativepar) {
        if (tentativepar.length == 0) {
            return;
        }
        return (
            <View style={{flexDirection: 'column', marginTop: 22}}>
                <Text style={{fontSize: 14, color: '#616161', marginBottom: 11}}>等待回复</Text>
                <View style={{
                    flexDirection: 'row',
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                }}>
                    {tentativepar}
                </View>
            </View>
        );
    }

    showRefused(refusedpar) {
        if (refusedpar.length == 0) {
            return;
        }
        return (
            <View style={{flexDirection: 'column', marginTop: 22}}>
                <Text style={{fontSize: 14, color: '#616161', marginBottom: 11}}>拒绝</Text>
                <View style={{
                    flexDirection: 'row',
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                }}>
                    {refusedpar}
                </View>
            </View>
        );
    }

    showSelectMember() {
        // "memberId": "liufan.liu@ejabhost1",//邀请人id
        //     "memberName"
        if (this.state.isShow) {
            let mbl = this.state.memberList;
            var acceptpar = [];
            var tentativepar = [];
            var refusedpar = [];
            let count = 0;
            for (let i = 0; i < mbl.length; i++) {
                count++;
                let view = (<TouchableOpacity
                    onPress={() => {
                        // this.deleteSelect(mbl[i]['memberId']);
                    }}>
                    <View key={i} style={{
                        // height: 25,
                        // marginLeft: 8,
                        width: 36,
                        marginRight: 12,
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                    }}>
                        <View style={{flexDirection: 'column'}}>
                            <Image source={{uri: mbl[i]['headerUrl']}} style={styles.memberHeader}/>
                            <Text style={{
                                marginTop: 3,
                                fontSize: 14,
                                color: '#616161',
                                alignSelf: 'center',
                                alignItems: 'center'
                            }} key={i}>{mbl[i]['memberName']}</Text>

                            {/*<Text style={{fontSize: 16, color: 'white'}}>*/}
                            {/*x*/}
                            {/*</Text>*/}
                        </View>

                    </View>
                </TouchableOpacity>);
                if (mbl[i]['memberState'] == '1') {
                    acceptpar.push(view)
                } else if (mbl[i]['memberState'] == '2') {
                    refusedpar.push(view)
                } else {
                    tentativepar.push(view)
                }

                // mbl[i]['memberState'] == '1' ? 'green' : mbl[i]['memberState'] == '2' ? 'red' : 'gray'
            }

            return (
                <View style={[styles.normalTextLeft, styles.marginLeft26, {flexDirection: 'column'}]}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 14, color: '#616161'}}>{count}位邀请人</Text>
                    </View>


                    {this.showAccept(acceptpar)}
                    {this.showTentative(tentativepar)}
                    {this.showRefused(refusedpar)}

                </View>
            );
        } else {
            if (!this.state.memberList || !this.state.memberList.length > 0) {
                return (
                    <Text style={[styles.normalTextLeft, styles.marginLeft26]}>添加邀请对象</Text>
                )
            }
            let mbl = this.state.memberList;
            var par = [];
            let count = 0;
            for (let i = 0; i < mbl.length; i++) {
                count++;
                // alert( this.state.meetingRooms[i])

                par.push(
                    <TouchableOpacity
                        onPress={() => {
                            this.deleteSelect(mbl[i]['memberId']);
                        }}>
                        <View key={i} style={{
                            // height: 25,
                            // marginLeft: 8,
                            width: 36,
                            marginRight: 12,
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                        }}>
                            <View style={{flexDirection: 'column'}}>
                                <Image source={{uri: mbl[i]['headerUrl']}} style={styles.memberHeader}/>
                                <Text style={{
                                    marginTop: 3,
                                    fontSize: 14,
                                    color: '#616161',
                                    alignSelf: 'center',
                                    alignItems: 'center'
                                }} key={i}>{mbl[i]['memberName']}</Text>

                                {/*<Text style={{fontSize: 16, color: 'white'}}>*/}
                                {/*x*/}
                                {/*</Text>*/}
                            </View>

                        </View>
                    </TouchableOpacity>
                )


            }
            //
            return (
                <View style={[styles.normalTextLeft, styles.marginLeft26, {flexDirection: 'column'}]}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 14, color: '#616161'}}>{count}位邀请人</Text>
                        <Text style={{fontSize: 12, color: '#9E9E9E'}}>(点击可删除邀请人)</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap'
                    }}>


                        {par}
                    </View>
                </View>
            );
        }


    }

    saveTrip() {


        if (this.state.isShow) {
            this.showUpdateButtonState = false;
            this.setState(
                {
                    isShow: false,
                    dataPickerEnable: false,
                }
            );
            this.props.navigation.setParams({rightText: "确定", titleText: '修改行程'});

            return;
        }

        if (this.state.tripName == '') {
            alert("请输入会议名称");
            return;
        }
        if (!this.state.isAllDay) {
            if (!moment(this.state.beginTime).isBefore(this.state.endTime)) {
                alert("结束时间必须大于开始时间!");
                return;
            }
        }
        if (this.state.tripType == 1) {
            if (!this.state.appointment) {
                alert("请选择会议地点");
                return;
            }
            // else if(this.state.tripRoomNumber==0){
            //     alert('由于修改,请重新选择会议地点')
            //     return;
            // }
        } else if (this.state.tripType == 2) {
            if (!this.state.appointment) {
                alert("请输入约会地址");
                return;
            }

        }
        // if (!this.state.appointment) {
        //     if (this.state.tripType == 1) {
        //         alert("请选择会议地点");
        //     } else if (this.state.tripType == 2) {
        //         alert("请输入约会地址");
        //     }
        //     return;
        // }

        if (!(this.state.memberList.length > 0)) {
            alert("请选择参会人员");
            return;
        }


        let params = {};
        params['beginTime'] = moment(this.state.beginTime).format("YYYY-MM-DD HH:mm");
        params['endTime'] = moment(this.state.endTime).format("YYYY-MM-DD HH:mm");
        params['scheduleTime'] = moment().format("YYYY-MM-DD HH:mm:ss")
        params['tripType'] = this.state.tripType;
        params['appointment'] = this.state.appointment;
        params['tripDate'] = moment(this.state.beginTime).format("YYYY-MM-DD");
        params['tripIntr'] = this.state.tripIntr;
        params['tripLocale'] = this.state.tripLocale;
        params['tripLocaleNumber'] = this.state.tripLocaleNumber;
        params['tripName'] = this.state.tripName;
        params['tripRoomNumber'] = this.state.tripRoomNumber;
        params['tripRoom'] = this.state.tripRoom;
        params['memberList'] = this.state.memberList;
        if (!this.props.navigation.state.params.isCreate) {
            params['operateType'] = '2';
            params['tripId'] = this.state.tripId;
        } else {
            params['operateType'] = '1';
        }
        // params['operateType']=

        NativeModules.QimRNBModule.createTrip(
            params,
            function (response) {
                var success = {};
                if (response.ok) {
                    success['success'] = true;
                    success['errMsg'] = response.errMsg;
                    success['selectDay'] = moment(this.state.beginTime).format("YYYY-MM-DD")
                    DeviceEventEmitter.emit("refresh", success);

                    if (response.errMsg) {
                        this.props.navigation.setParams({
                            isCreate: true,
                            titleText: '创建行程',
                        })
                        alert(response.errMsg);
                    } else {
                        let goBackSuccess = this.props.navigation.goBack();
                        if (goBackSuccess == false) {
                            AppConfig.exitApp('TravelCalendar');
                        }
                    }
                } else {
                    success['success'] = false;
                    DeviceEventEmitter.emit("refresh", success);
                    alert(response.errMsg);
                }
            }.bind(this)
        )

        // "updateTime": "111",
        //     "beginTime": "2018-8-3 14:00:00",
        //     "endTime": "2018-8-3 15:00:00",
        //     "memberList": [{
        //     "memberId": "liufan.liu@ejabhost1"
        //
        // }],
        //     "scheduleTime": "2018-8-3 10:00:00",
        //     "tripType":"2",
        //     "operateType":"1",
        //     "appointment":"预约会面",
        //     "tripDate": "2018-08-03",
        //     "tripId": "12345",
        //     "tripIntr": "我想开个会",
        //     "tripInviter": "hubin.hu@ejabhost1",
        //     "tripLocale": "维亚大厦",
        //     "tripLocaleNumber":"2",
        //     "tripName": "RN大神邀请会",
        //     "tripRemark": "可以写点自己对此会的备注",
        //     "tripRoomNumber":"1",
        //     "tripRoom": "酸梅汤"


    }

    componentDidMount() {
        this.updateType = DeviceEventEmitter.addListener('updateTripType', function (params) {
            this.updateTripType(params);
        }.bind(this));

        this.updateTD = DeviceEventEmitter.addListener('updateTripDate', function (params) {
            this.updateTripDate(params);
        }.bind(this));

        this.updateSelectMember = DeviceEventEmitter.addListener('updateTripSelectDate', function (params) {
            this.updateSelectDate(params);
        }.bind(this));

        this.props.navigation.setParams({
            onSavePress: this.saveTrip.bind(this),
        });

    }

    componentWillUnmount() {
        this.updateTD.remove();
        this.updateSelectMember.remove();
        this.timer && clearTimeout(this.timer);
    }

    showAllDayButton() {
        if (!this.state.isShow) {
            return (
                <View style={styles.box}>
                    <View style={styles.rowView}>
                        <Image source={require('../images/Placeholder73.png')}
                               style={{height: 24, width: 24, marginLeft: 14}}/>
                        <Text style={styles.allDayText}>全天</Text>
                        <Switch style={[styles.allDaySwitch, styles.meright16]} value={this.state.isAllDay}
                                onValueChange={(value) => {
                                    this.isAllDayChange(value);
                                }}></Switch>
                    </View>
                </View>
            );
        }
    }

    showTripTypeText(type) {
        if (type == '1') {
            return '会议';
        } else if (type == '2') {
            return '约会';
        }
    }

    deleteTrip() {


        Alert.alert(
            '提示',
            '您是否确定要删除该会议？',
            [
                {text: '取消', onPress: () => console.log('Cancel  Pressed'), style: 'cancel'},
                {
                    text: '确定', onPress: () => {
                    let params = {};
                    params['beginTime'] = this.state.beginTime;
                    params['endTime'] = this.state.endTime;
                    params['scheduleTime'] = moment().format("YYYY-MM-DD HH:mm:ss")
                    params['tripType'] = this.state.tripType;
                    params['appointment'] = this.state.appointment;
                    params['tripDate'] = moment(this.state.beginTime).format("YYYY-MM-DD");
                    params['tripIntr'] = this.state.tripIntr;
                    params['tripLocale'] = this.state.tripLocale;
                    params['tripLocaleNumber'] = this.state.tripLocaleNumber;
                    params['tripName'] = this.state.tripName;
                    params['tripRoomNumber'] = this.state.tripRoomNumber;
                    params['tripRoom'] = this.state.tripRoom;
                    params['memberList'] = this.state.memberList;
                    params['operateType'] = '3';
                    params['tripId'] = this.state.tripId;
                    // if (!this.props.navigation.state.params.isCreate) {
                    //     params['operateType'] = '2';
                    //     params['tripId'] = this.state.tripId;
                    // } else {
                    //     params['operateType'] = '1';
                    // }
                    // params['operateType']=

                    NativeModules.QimRNBModule.createTrip(
                        params,
                        function (response) {
                            if (response.ok) {
                                var success = {};
                                success['success'] = true;
                                success['selectDay'] = moment(this.state.beginTime).format("YYYY-MM-DD")
                                DeviceEventEmitter.emit("refresh", success);

                                let goBackSuccess = this.props.navigation.goBack();
                                if (goBackSuccess == false) {
                                    AppConfig.exitApp('TravelCalendar');
                                }
                            } else {

                                alert(response.errMsg);
                            }
                        }.bind(this)
                    )
                }
                },
            ],
            {cancelable: false}
        )


    }

    showDeleteTripButton() {
        const uid = AppConfig.getUserId() + '@' + AppConfig.getDomain();
        if (this.state.isShow && uid == this.state.tripInviter) {
            return (
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,

                }}>
                    <TouchableOpacity

                        style={{
                            width: width,
                            height: 44,
                            backgroundColor: '#F9F9F9',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            alignItems: 'center'
                        }} onPress={() => {
                        this.deleteTrip();
                    }}

                    >
                        <Text style={{fontSize: 15, textAlign: 'center', color: '#FF3A30'}}>
                            删除日程
                        </Text>
                    </TouchableOpacity>
                </View>

            )
        }
    }

    showTripTypeButton() {

        if (AppConfig.isEasyTrip()) {

        } else {
            if (this.state.isShow) {
                // return (
                //     <View style={styles.box}>
                //         <View style={styles.rowView}>
                //             <Text style={{flex: 1}}>行程类型</Text>
                //             <Text
                //                 style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}
                //             >
                //                 {this.showTripTypeText(this.state.tripType)}
                //             </Text>
                //
                //         </View>
                //     </View>
                // )
            } else {
                return (

                    <TouchableOpacity style={{}} onPress={() => {
                        this.selectTripType();
                    }}>

                        <View style={[styles.rowView, styles.marginTop18, styles.marginBottom18]}>
                            <Image source={require('../images/Placeholder74.png')}
                                   style={{height: 24, width: 24, marginLeft: 14}}/>
                            {/*<Text style={[styles.normalTextLeft,styles.marginLeft26]}>行程地点</Text>*/}

                            <Text
                                style={[styles.normalTextLeft, styles.marginLeft26]}>{this.showTripTypeText(this.state.tripType)}</Text>

                            <Image source={require('../images/arrow_right.png')}
                                   style={[{height: 24, width: 24,}, styles.meright16]}/>

                        </View>
                        <View style={styles.divider}></View>
                    </TouchableOpacity>


                    // <View style={styles.box}>
                    //     <View style={styles.rowView}>
                    //         <Text style={{flex: 1}}>行程类型</Text>
                    //         <RadioModal
                    //             style={{flex: 2, flexDirection: 'row', alignItems: 'flex-start'}}
                    //             selectedValue={this.state.tripType}
                    //
                    //             onValueChange={(id, item) => {
                    //                 this.tripTypeChange(id, item)
                    //             }}
                    //
                    //         >
                    //             <Text value={1}>会议</Text>
                    //             <Text value={2}>约会</Text>
                    //
                    //         </RadioModal>
                    //     </View>
                    // </View>
                );
            }
        }

    }

    showMemberButton() {
        if (this.state.isShow) {
            return (
                <View style={[styles.inviteBox, styles.marginTop18, styles.marginBottom18]}>
                    <Image source={require('../images/Placeholder76.png')}
                           style={{height: 24, width: 24, marginLeft: 14}}/>
                    {/*<Text style={[styles.normalTextLeft, styles.marginLeft26]}>添加邀请对象</Text>*/}
                    {/*<View style={{*/}
                    {/*flex: 4,*/}
                    {/*}}>*/}
                    {this.showSelectMember()}
                    {/*</View>*/}
                </View>
            );
        } else {
            return (
                <TouchableOpacity

                    onPress={() => {
                        this.selectAttendees();
                    }}

                >
                    <View style={[styles.inviteBox, styles.marginTop18, styles.marginBottom18]}>
                        <Image source={require('../images/Placeholder76.png')}
                               style={{height: 24, width: 24, marginLeft: 14}}/>
                        {/*<Text style={[styles.normalTextLeft, styles.marginLeft26]}>添加邀请对象</Text>*/}
                        {/*<View style={{*/}
                        {/*flex: 4,*/}
                        {/*}}>*/}
                        {this.showSelectMember()}
                        {/*</View>*/}
                    </View>
                    <View style={styles.divider}></View>
                </TouchableOpacity>
            )
        }
    }

    showTripName() {
        if (this.state.isShow) {
            return (
                <View style={[{backgroundColor: '#F5F5F5',}, styles.rowView]}>
                    <Text
                        style={[{
                            flex: 1,
                            color: '#212121',
                            fontSize: 16,
                            flexDirection: 'row',
                            alignItems: 'flex-start'
                        }, styles.maleft64, styles.marginTop18, styles.marginBottom18]}
                    >
                        {this.state.tripName}
                    </Text>

                </View>
            )
        } else {
            return (
                <View style={[{marginLeft: 16, marginTop: 17}]}>
                    <QIMTextInput style={[styles.boxBody, {backgroundColor: '#ffffff', fontSize: 16, color: '#9E9E9E'}]}
                                  autoFocus={this.state.isShow ? false : true}
                                  underlineColorAndroid='transparent' clearButtonMode={'always'}
                                  placeholder={'请输入行程主题'}
                                  editable={!this.state.isShow}
                                  value={this.state.tripName}
                                  onChangeText={(text) => {
                                      this.setState({
                                          tripName: text,
                                      })
                                  }}
                    ></QIMTextInput>
                </View>
            );
        }
    }


    showAddDetails() {
        if (this.state.isShow) {
            return (
                <View style={{flexDirection: 'column', marginBottom: 50}}>
                    <View style={[styles.rowView, styles.marginTop18,]}>
                        <Image source={require('../images/Placeholder77.png')}
                               style={{height: 24, width: 24, marginLeft: 14}}/>
                        {/*<Text style={[styles.normalTextLeft,styles.marginLeft26]}>行程地点</Text>*/}

                        <Text style={[styles.normalTextLeft, styles.marginLeft26]}>{this.state.tripIntr}</Text>


                    </View>
                </View>
            )
        } else {
            return (
                <View style={{flexDirection: 'column'}}>
                    <View style={[styles.rowView, styles.marginTop18,]}>
                        <Image source={require('../images/Placeholder77.png')}
                               style={{height: 24, width: 24, marginLeft: 14}}/>
                        {/*<Text style={[styles.normalTextLeft,styles.marginLeft26]}>行程地点</Text>*/}

                        <Text style={[styles.normalTextLeft, styles.marginLeft26]}>添加详情</Text>


                    </View>
                    <QIMTextInput
                        style={[{height: 40, fontSize: 14}, styles.maleft64, styles.textInputStyle]}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => {
                            this.setState({
                                tripIntr: text,
                            })
                        }}
                        placeholder={'点击输入详情'}
                        value={this.state.tripIntr}
                        editable={!this.state.isShow}
                        multiline={true}
                    />
                    <View style={styles.divider}></View>
                </View>
            );
        }

        {/*<Text style={[{height: 40}, styles.maleft64]}>会议详情</Text>*/
        }
        {/*<TextInput style={[styles.textInputStyle]}*/
        }
        {/*underlineColorAndroid='transparent'*/
        }
        {/*placeholder={'请输入行程简介'}*/
        }
        {/*onChangeText={(text) => {*/
        }
        {/*this.setState({*/
        }
        {/*tripIntr: text,*/
        }
        {/*})*/
        }
        {/*}}*/
        }
        {/*value={this.state.tripIntr}*/
        }
        {/*editable={!this.state.isShow}*/
        }
        {/*multiline={true}></TextInput>*/
        }
    }

    showUpdateButton() {
        if (this.showUpdateButtonState) {

            return (
                <View style={{
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    // paddingTop: 120,
                    // right: 15,
                    top: 36,
                    right: 32,


                }}>


                    <TouchableOpacity style={{


                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center'
                    }} onPress={() => {
                        this.saveTrip();
                    }}>
                        <Image source={require('../images/edit_calendar.png')}
                               style={{height: 48, width: 48, borderRadius: 25,}}/>
                        {/*<Text style={{fontSize: 16, textAlign: 'center', color: 'white'}}>*/}
                        {/*+*/}
                        {/*</Text>*/}
                    </TouchableOpacity>
                    {/*<View style={{height: 1, backgroundColor: '#d3d3d3', marginLeft: 10, marginRight: 10}}></View>*/}
                </View>
            )
        }
    }

    render() {


        return (
            <View style={styles.wrapper}>
                <ScrollView style={styles.wrapper}>
                    {this.showTripName()}
                    {/*{this.showAllDayButton()}*/}
                    {this.isAllDayShow()}

                    {this.showTripTypeButton()}


                    {this.showtripTypeLocationChange()}

                    {this.showMemberButton()}

                    {this.showAddDetails()}

                    {/*<Text style={[{height: 40}, styles.maleft64]}>会议详情</Text>*/}
                    {/*<TextInput style={[styles.textInputStyle]}*/}
                    {/*underlineColorAndroid='transparent'*/}
                    {/*placeholder={'请输入行程简介'}*/}
                    {/*onChangeText={(text) => {*/}
                    {/*this.setState({*/}
                    {/*tripIntr: text,*/}
                    {/*})*/}
                    {/*}}*/}
                    {/*value={this.state.tripIntr}*/}
                    {/*editable={!this.state.isShow}*/}
                    {/*multiline={true}></TextInput>*/}


                </ScrollView>
                {this.showDeleteTripButton()}

                {this.showUpdateButton()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInputStyle: { //文本输入组件样式
        alignItems: 'center',
        height: 200,
        marginRight: 5,
        fontSize: 16,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "#ffffff",
        textAlignVertical: 'top'
    },
    memberHeader: {
        height: 36,
        width: 36,
    },
    box: {

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
    boxBody: {
        height: 40,
    },

    allDaySwitch: {
        flex: 1,
    },
    meright16: {
        marginRight: 16,
    },
    allDayText: {
        alignSelf: 'center',
        flex: 1,
        marginLeft: 26,
        fontSize: 14,
        color: '#212121'
    },
    rowView: {
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: 'row',

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
    inviteBox: {
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: 'row',
    },
    datePickerContainer: {
        flex: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 10,
    },

    wrapper: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#EEEEEE'
    },

});


{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'white',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'red',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'white',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'red',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'white',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'red',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'white',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'red',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'white',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'red',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'white',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'red',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'white',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'red',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'white',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'red',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}
{/*<Text style={{*/
}
{/*width: 80,*/
}
{/*backgroundColor: 'white',*/
}
{/*flexWrap: 'wrap',*/
}
{/*flexDirection: 'column',*/
}
{/*alignItems: 'flex-start',*/
}
{/*justifyContent: 'flex-start',*/
}
{/*}} value={'0'}>会议</Text>*/
}