import React, {Component, PureComponent} from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    StatusBar,
    NativeModules,
    Platform,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Image,
    DeviceEventEmitter,
    DatePickerAndroid,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import moment from 'moment';
import JsonUtils from "../common/JsonUtils";

import {Agenda, CalendarList, LocaleConfig, Calendar, parseDate, xdateToData} from 'react-native-calendars';
// export {parseDate, xdateToData} from '../src/interface';
// import {parseDate} from '../calendar/interface'


// LocaleConfig.locales['fr'] = {
//     monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
//     monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
//     dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
//     dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
// };
//
// LocaleConfig.defaultLocale = 'fr';
export default class TravelCalendar extends Component {

    // static navigationOptions = ({navigation}) => {
    //     let headerTitle = "行程日历";
    //     let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"TravelCalendar"}/>);
    //     let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
    //         if (navigation.state.params.onSavePress) {
    //             navigation.state.params.onSavePress();
    //         }
    //     }}>行程</NavCBtn>);
    //     return {
    //         headerTitle: headerTitle,
    //         headerTitleStyle: {
    //             fontSize: 14
    //         },
    //         headerLeft: leftBtn,
    //         headerRight: rightBtn,
    //     };
    // };

    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        };
    };


    constructor(props) {
        super(props);
        this.state = {

            selectedMonth: '',
            selectedDayItem: [],
            selectedDay: parseDate(moment().format("YYYY-MM-DD")),
            lastSelectedDay: parseDate(moment().format("YYYY-MM-DD")),
            // items: {
            //     '2018-08-07': [{
            //         "beginTime": "2018-08-07 14:00:00", //开始时间
            //         "endTime": "2018-08-07 15:00:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-07", //会议日期
            //         "tripId": "12325", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }, {
            //         "beginTime": "2018-08-07 16:00:00", //开始时间
            //         "endTime": "2018-08-07 17:00:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-07", //会议日期
            //         "tripId": "1345", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }],
            //     '2018-08-21': [{
            //         "beginTime": "2018-08-21 14:00:00", //开始时间
            //         "endTime": "2018-08-21 15:00:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-21", //会议日期
            //         "tripId": "112345", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }, {
            //         "beginTime": "2018-08-21 15:10:00", //开始时间
            //         "endTime": "2018-08-21 15:20:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-21", //会议日期
            //         "tripId": "11231", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }, {
            //         "beginTime": "2018-08-21 15:30:00", //开始时间
            //         "endTime": "2018-08-21 15:40:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-21", //会议日期
            //         "tripId": "123132", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }, {
            //         "beginTime": "2018-08-21 15:50:00", //开始时间
            //         "endTime": "2018-08-21 16:00:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-21", //会议日期
            //         "tripId": "11231325", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }, {
            //         "beginTime": "2018-08-21 16:10:00", //开始时间
            //         "endTime": "2018-08-21 16:20:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-21", //会议日期
            //         "tripId": "11231235", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }, {
            //         "beginTime": "2018-08-21 16:30:00", //开始时间
            //         "endTime": "2018-08-21 16:50:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-21", //会议日期
            //         "tripId": "112311135", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }, {
            //         "beginTime": "2018-08-21 17:00:00", //开始时间
            //         "endTime": "2018-08-21 18:00:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-21", //会议日期
            //         "tripId": "1231231", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }, {
            //         "beginTime": "2018-08-21 18:10:00", //开始时间
            //         "endTime": "2018-08-21 19:10:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-21", //会议日期
            //         "tripId": "33221312", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }, {
            //         "beginTime": "2018-08-21 20:00:00", //开始时间
            //         "endTime": "2018-08-21 21:00:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-21", //会议日期
            //         "tripId": "2233213312", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }],
            //     '2018-08-26': [{
            //         "beginTime": "2018-08-26 14:00:00", //开始时间
            //         "endTime": "2018-08-26 15:00:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-26", //会议日期
            //         "tripId": "233311", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }],
            //     '2018-08-08': [{
            //         "beginTime": "2018-08-08 17:10:00", //开始时间
            //         "endTime": "2018-08-08 17:20:00", //结束时间
            //         "memberList": [{ //邀请人列表
            //             "memberId": "liufan.liu@ejabhost1", //邀请人id
            //             "memberName": "刘帆",
            //             "memberState": 1, //邀请人接收状态
            //             "memberStateDescribe": "接受" //邀请人状态说明
            //         }, {
            //             "memberId": "helen.liu@ejabhost1",
            //             "memberName": "刘静",
            //             "memberState": 2,
            //             "memberStateDescribe": "拒绝"
            //         }, {
            //             "memberId": "lihaibin.li@ejabhost1",
            //             "memberName": "李海滨",
            //             "memberState": 0,
            //             "memberStateDescribe": "暂定"
            //         }],
            //         "scheduleTime": "2018-08-03 10:00:00", //会议创建时间
            //         "tripType": "1", //行程类型: 1会议2约会等等等
            //         "appointment": "预约会面", //本字段为2时代表预约会面详情,1的情况下为 会议地址及会议室之和
            //         "tripDate": "2018-08-08", //会议日期
            //         "tripId": "233311", //会议id
            //         "tripIntr": "我想开个会", //会议说明
            //         "tripInviter": "hubin.hu@ejabhost1", //会议创建人
            //         "tripLocale": "维亚大厦", //会议地址
            //         "tripLocaleNumber": 2, //地址编号
            //         "tripName": "RN大神邀请会", //会议名称
            //         "tripRemark": "可以写点自己对此会的备注", //会议备注
            //         "tripRoomNumber": 1, //会议室编号
            //         "tripRoom": "酸梅汤" //会议室名称
            //     }],
            //
            // },
            items: {},
            refreshing: false,
            currentDay: parseDate(moment().format("YYYY-MM-DD")),
        }
    }

    componentWillMount() {

    }

    componentWillUnmount() {

    }

    // componentDidMount() {
    //     console.log('开始进行')
    //
    //     // let key = this.state.selectedDay.toString('yyyy-MM-dd');
    //     // this.setState({
    //     //     selectedDayItem: this.state.items[key] ? this.state.items[key] : [],
    //     // });
    //     // this.props.navigation.setParams({
    //     //     onSavePress: this.openNewPager.bind(this),
    //     // });
    //
    //     this.selectDataByMonth(this.state.selectedDay)
    //
    // }

    openNewPager() {
        alert('打开新界面')
    }


    generateMarkings() {
        let markings = this.state.markedDates;
        if (!markings) {
            markings = {};
            Object.keys(this.state.items || {}).forEach(key => {
                if (this.state.items[key] && this.state.items[key].length) {
                    markings[key] = {marked: true};
                }
            });
        }
        const key = this.state.selectedDay.toString('yyyy-MM-dd');
        // this.setState({
        //     selectedDayItem: this.state.items[key] ? this.state.items[key] : [],
        // });

        return {...markings, [key]: {...(markings[key] || {}), ...{selected: true}}};
    }

    // _showTrip() {
    //     let item = this.state.items[this.state.selectedDay.toString('yyyy-MM-dd')];
    //     if (item && item.length) {
    //         return
    //         for (let i = 0; i < item.length; i++) {
    //
    //         }
    //         // if(item.length>1){
    //         //
    //         // }else{
    //
    //         // }
    //
    //     } else {
    //         return (
    //
    //             <View>
    //                 <Text>没数据</Text>
    //             </View>
    //         );
    //     }
    //
    // }

    dayPress(d) {

        const day = parseDate(d);
        let sd = moment(day.toString()).format('YYYY-MM-DD');
        // let a = day.toString('YYYY-MM-DD');
        this.setState({
            selectedDay: day.clone(),
            selectedDayItem: this.state.items[sd] ? this.state.items[sd] : [],
            currentDay: sd,
        });

        // alert('点击了:' + d.dateString)
    }

    addTrip() {

        //
        // this.setState({
        //
        //     currentDay:moment('2015-10-10').format("YYYY-MM-DD"),
        // })
        // // 通过本地打开
        let params = {};
        params["Bundle"] = 'clock_in.ios';
        params["Module"] = 'TravelCalendar';
        let sd = moment().format('YYYY-MM-DD');
        if (moment(this.state.selectedDay.toString('yyyy-MM-dd')).isAfter(sd)) {
            sd = moment(this.state.selectedDay.toString('yyyy-MM-dd')).format('YYYY-MM-DD');
        }
        params["Properties"] = {'Screen': 'CreateTrip', 'isCreate': 'true', 'selectedDay': sd};
        NativeModules.QimRNBModule.openRNPage(params, function (response) {

        });


        //rn直接打开
        // this.props.navigation.navigate('CreateTrip', {
        //     isCreate: true,
        //     selectedDay: this.state.selectedDay.toString('yyyy-MM-dd'),
        // });
    }

    clickItem(item, index) {
        // 通过本地打开

        let params = {};
        params["Bundle"] = 'clock_in.ios';
        params["Module"] = 'TravelCalendar';
        params["Properties"] = {'Screen': 'CreateTrip', 'item': JsonUtils.mapToJson(JsonUtils.objToStrMap(item))};
        NativeModules.QimRNBModule.openRNPage(params, function (response) {

        });

        // alert('创建');

        //rn内部直接打开
        // this.props.navigation.navigate('CreateTrip', {
        //     isCreate: false,
        //     item: item,
        // });

    }

    _renderItem = ({item, index}) => {
        let begin = moment(item['beginTime']).format('HH:mm:ss');
        let end = moment(item['endTime']).format('HH:mm:ss');
        // if (index === 0) {
        //     return (
        //         <View>
        //             <View style={{marginLeft: 20, marginRight: 20}}>
        //                 <Text style={{fontWeight: 'bold'}}>{begin}-{end}</Text>
        //                 <Text style={{fontWeight: 'bold'}}>{item['tripName']}-{item['appointment']}</Text>
        //                 <Text style={{fontWeight: 'bold'}}>邀请人-{item['tripInviter']}</Text>
        //                 <View/>
        //             </View>
        //             <View style={{height: 1, backgroundColor: '#d3d3d3', marginLeft: 10, marginRight: 10}}></View>
        //         </View>
        //     );
        // } else {
        return (
            <View>
                <TouchableOpacity onPress={
                    this.clickItem.bind(this, item, index)
                }>
                    <View style={[{backgroundColor:'#F5E3FA',borderColor:'#D080E4',borderLeftWidth:1,marginRight:13,marginTop:8,paddingTop:4,paddingBottom:4},styles.maleft64]}>
                        <Text style={[styles.itemText,{color:'#6E0F86',}]}>{begin}-{end}</Text>
                        <Text style={[styles.itemText,{color:'#6E0F86',}]}>{item['tripName']}</Text>
                        {/*<Text style={{}}>邀请人-{item['tripInviter']}</Text>*/}
                        <Text style={[styles.itemText,{color:'#6E0F86',}]}>{item['appointment']}</Text>
                        <View/>
                    </View>
                    {/*<View style={{height: 1, backgroundColor: '#bdbdbd', marginLeft: 10, marginRight: 10}}></View>*/}
                </TouchableOpacity>
            </View>
        )
        // }
    };

    _showCreateTrip() {
        let newDate = moment().format('YYYY-MM-DD HH:mm:ss').toString();
        let isShow = moment(this.state.selectedDay.toString('yyyy-MM-dd')).isAfter(newDate);
        let isSame = moment(this.state.selectedDay.toString('yyyy-MM-dd')).isSame(newDate, 'day');
        if (isShow || isSame) {
            return (
                <View style={{marginTop: 5}}>


                    <TouchableOpacity style={{
                        width: 40,
                        height: 40,
                        backgroundColor: 'green',
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center'
                    }} onPress={() => {
                        this.addTrip();
                    }}>
                        <Text style={{fontSize: 16, textAlign: 'center', color: 'white'}}>
                            +
                        </Text>
                    </TouchableOpacity>

                    <Text style={{alignSelf: 'center',}}>点击创建新行程</Text>
                    {/*<View style={{height: 1, backgroundColor: '#d3d3d3', marginLeft: 10, marginRight: 10}}></View>*/}
                </View>
            );
        }
    }

    _showTripTitle() {
        if (this.state.selectedDayItem.length > 0) {
            return (
                <View>
                    <Text style={[{
                        fontSize:13,
                        color:'#616161',
                        backgroundColor: '#ffffff',
                        marginTop:32,
                    },styles.maleft64]}>当日全部行程</Text>
                </View>
            );
        }
    }

    _showNextTrip() {
        let newDate = moment().format('YYYY-MM-DD HH:mm:ss').toString();

        let showData = null;
        // alert(this.state.selectedDay.toString('yyyy-MM-dd'))
        let isShow = moment(this.state.selectedDay.toString('yyyy-MM-dd')).isAfter(newDate);
        let isSame = moment(this.state.selectedDay.toString('yyyy-MM-dd')).isSame(newDate, 'day');
        if (isShow || isSame) {
            for (let i = 0; i < this.state.selectedDayItem.length; i++) {
                if (moment(newDate).isBefore(this.state.selectedDayItem[i]['beginTime'])) {
                    showData = this.state.selectedDayItem[i];
                    break;
                }

                // this.state.selectedDayItem[i]['beginTime']
            }

            if (!showData) {
                return;
            }
            let begin = moment(showData['beginTime']).format('HH:mm:ss');
            let end = moment(showData['endTime']).format('HH:mm:ss');
            return (
                <View>
                    <Text style={[{
                        fontSize:13,
                        color:'#616161',
                        backgroundColor: '#ffffff',
                        marginBottom:8,
                        marginTop:32,
                    },styles.maleft64]}>当日下一个行程</Text>
                    <TouchableOpacity onPress={
                        this.clickItem.bind(this, showData, -1)
                    }>
                        <View style={[{backgroundColor:'#D080E4',marginRight:13,paddingTop:4,paddingBottom:4},styles.maleft64]}>
                            <Text style={styles.itemText}>{begin}-{end}</Text>
                            <Text style={styles.itemText}>{showData['tripName']}</Text>
                            {/*<Text style={styles.itemText}>邀请人-{showData['tripInviter']}</Text>*/}
                            <Text style={styles.itemText}>{showData['appointment']}</Text>
                            <View/>
                        </View>
                    </TouchableOpacity>

                    {/*<Text style={{paddingLeft: 10, borderColor: '#d3d3d3', borderWidth: 1}}>当日全部行程</Text>*/}
                </View>
            );
        }
        // else {
        //     if (this.state.selectedDayItem.length > 0) {
        //         return (
        //             <View>
        //                 <Text style={{paddingLeft: 10, borderColor: '#d3d3d3', borderWidth: 1}}>当日全部行程</Text>
        //             </View>
        //         );
        //     }
        // }
        // for (let i =0,this.stati){
        //
        // }
        // alert(newDate)
        // <View>
        //     <Text style={{paddingLeft:10,borderColor:'#d3d3d3',borderWidth:1}}>下一个行程</Text>
        //     <View style={{marginLeft: 20, marginRight: 20}}>
        //         <Text style={{fontWeight: 'bold'}}>下一个行程</Text>
        //         <Text style={{fontWeight: 'bold'}}>111</Text>
        //         <Text style={{fontWeight: 'bold'}}>邀请人-1111</Text>
        //         <View/>
        //     </View>
        //     {/*<View style={{height: 1, backgroundColor: '#d3d3d3', marginLeft: 10, marginRight: 10}}></View>*/}
        //     <Text style={{paddingLeft:10,borderColor:'#d3d3d3',borderWidth:1}}>当日全部行程</Text>
        // </View>
        // let begin = moment(item['beginTime']).format('HH:mm:ss');
        // let end = moment(item['endTime']).format('HH:mm:ss');
        // if (index === 0) {
        //     return (
        //         <View>
        //             <View style={{marginLeft: 20, marginRight: 20}}>
        //                 <Text style={{fontWeight: 'bold'}}>{begin}-{end}</Text>
        //                 <Text style={{fontWeight: 'bold'}}>{item['tripName']}-{item['appointment']}</Text>
        //                 <Text style={{fontWeight: 'bold'}}>邀请人-{item['tripInviter']}</Text>
        //                 <View/>
        //             </View>
        //             <View style={{height: 1, backgroundColor: '#d3d3d3', marginLeft: 10, marginRight: 10}}></View>
        //         </View>
    }

    _keyExtractor = (item, index) => item.tripId;

    refreshDataList(p) {
        if (p['success']) {
            setTimeout(function () {
                alert('操作成功');
            }, 300)

            // this.setState({
            //     selectedDay: p['selectDay'],
            //     currentDay:p['selectDay']
            //
            // })
            this.setState({
                selectedDay:p['selectDay'],
            },function () {
                this.selectDataByMonth(p['selectDay'], false, true);
            })


            // if(p['errMsg']){
            //     alert(p['errMsg']);
            // }else{

            // }

            //
            // var params = {};
            // params['showDate'] = this.state.selectedMonth;
            // NativeModules.QimRNBModule.selectUserTripByDate(
            //     params,
            //     function (response) {
            //         if (response.ok) {
            //             let key = this.state.selectedDay.toString('yyyy-MM-dd');
            //             this.setState({
            //                 items: response.data,
            //                 selectedDayItem: response.data[key] ? response.data[key] : [],
            //             });
            //         }
            //     }.bind(this)
            // )
        } else {
            var params = {};
            params['showDate'] = this.state.selectedMonth;
            NativeModules.QimRNBModule.selectUserTripByDate(
                params,
                function (response) {
                    if (response.ok) {
                        let key = this.state.selectedDay.toString('yyyy-MM-dd');
                        this.setState({
                            items: response.data,
                            selectedDayItem: response.data[key] ? response.data[key] : [],
                        });
                    }
                }.bind(this)
            )
        }
    }

    selectDataByMonth(month, isFirstDay, mandatory) {
        var m = moment(month).format('YYYY-MM');
        console.log('输出日期')
        console.log(m);
        var sd = parseDate(moment().format("YYYY-MM-DD"));
        if (isFirstDay) {


            if (moment(m).isSame(moment(), 'month')) {
                sd = parseDate(moment().format("YYYY-MM-DD"));
                // this.setState({
                //     selectedDay: parseDate(moment().format("YYYY-MM-DD")),
                // })
            } else {
                sd = m + '-01';
                // this.setState({
                //     selectedDay:m+'-01',
                // })
            }
        }else{
            sd = this.state.selectedDay;
        }


        var params = {};
        if(mandatory){
            this.setState({
                currentDay: sd,
                selectedMonth: m,
                selectedDay: sd,
                // selectedDay:m+'-01',
            })
        }else {
            if (m == this.state.selectedMonth) {
                return
            } else {
                this.setState({
                    currentDay: sd,
                    selectedMonth: m,
                    selectedDay: sd,
                    // selectedDay:m+'-01',
                })
            }
        }
        params['showDate'] = m;
        NativeModules.QimRNBModule.selectUserTripByDate(
            params,
            function (response) {
                if (response.ok) {
                    let key = this.state.selectedDay.toString('yyyy-MM-dd');
                    this.setState({
                        items: response.data,
                        selectedDayItem: response.data[key] ? response.data[key] : [],
                    });
                }
            }.bind(this)
        )
    }

    // onDatePicked({action, year, month, day}) {
    //     if (action !== DatePickerAndroid.dismissedAction) {
    //
    //          let date= new Date(year, month, day)
    //         alert(date.toDateString());
    //         // this.datePicked();
    //     } else {
    //         // this.onPressCancel();
    //     }
    // }

    async openDataPicker(stateKey, options) {
        // try{
        //     var newState = {};
        //     const {action,year,month,day} = await DatePickerAndroid.open(options);
        //     if(action === DatePickerAndroid.dismissedAction){
        //         // newState[stateKey + 'Text'] = 'dismissed';
        //     }else{
        //
        //         var date = new Date(year,month,day);
        //
        //         this.dayPress(moment(date.toLocaleDateString()).format('YYYY-MM-DD'));
        //         // this.setState({
        //         //     selectedDay:date.toDateString(),
        //         // })
        //         // newState[stateKey+'Text'] = date.toLocaleDateString();
        //         // newState[stateKey+'Date'] = date;
        //
        //     }
        //     // this.setState(newState);
        // }catch({code,message}){
        //     console.warn("Error in example '${stateKey}': ",message)
        // }
        let params = {};
        params['selectDay'] = this.state.selectedDay.toString();
        NativeModules.QimRNBModule.openDatePicker(
            params,
            function (response) {
                // if (response.ok) {
                //     let key = this.state.selectedDay.toString('yyyy-MM-dd');
                //     this.setState({
                //         items: response.data,
                //         selectedDayItem: response.data[key] ? response.data[key] : [],
                //     });
                // }
            }.bind(this)
        )

    }

    getListHead() {
        return (
            <View>
                {/*<View>*/}
                {/*<TouchableOpacity*/}
                {/*onPress={*/}
                {/*this.openDataPicker.bind(this,'simple',{date:new Date(this.state.selectedDay.toString())})*/}
                {/*}*/}
                {/*>*/}
                {/*<Text>*/}
                {/*选择日期*/}
                {/*</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*</View>*/}
                <Calendar
                    // monthFormat={'yyyy-MM'}
                    // onVisibleMonthsChange={(month) => {
                    //     this.selectDataByMonth(month);
                    // }}
                    onMonthChange={(month) => {
                        this.selectDataByMonth(month.dateString, true, false);
                    }}
                    hideExtraDays={true}
                    current={this.state.currentDay}
                    horizontal={true}
                    pagingEnabled={true}
                    onDayPress={this.dayPress.bind(this)}
                    markedDates={this.generateMarkings()}
                    style={{borderBottomWidth: 1, borderBottomColor: '#bdbdbd'}}
                />
                {/*{this._showCreateTrip()}*/}
                {this._showNextTrip()}
                {this._showTripTitle()}
            </View>);
    }

    ListEmptyComponent() {
        return (
            <View style={[{height:200,alignItems:'center',justifyContent:'center'}]}>
                <Text style={{}}>{moment(this.state.selectedDay.toString('yyyy-MM-dd')).isBefore(moment().format('YYYY-MM-DD'))?'往期不可创建行程!':'还没有行程,快去创建行程吧!'} </Text>
            </View>
        )
    }


    componentDidMount() {
        this.refresh = DeviceEventEmitter.addListener('refresh', function (params) {
            this.refreshDataList(params);
        }.bind(this));


        this.selectDateNative = DeviceEventEmitter.addListener('nativeSelectDate', function (params) {
            this.dayPress(params['date']);
            this.selectDataByMonth(params['date'], false, false);
        }.bind(this));

        this.willShow = DeviceEventEmitter.addListener(
            'QIM_RN_Will_Show',
            function (params) {
                var paramsa = {};
                paramsa['showDate'] = this.state.selectedMonth;
                NativeModules.QimRNBModule.selectUserTripByDate(
                    paramsa,
                    function (response) {
                        if (response.ok) {
                            let key = this.state.selectedDay.toString('yyyy-MM-dd');
                            this.setState({
                                items: response.data,
                                selectedDayItem: response.data[key] ? response.data[key] : [],
                            });
                        }
                    }.bind(this)
                )
            }.bind(this)
        );
        this.selectDataByMonth(this.state.selectedDay, false, false);


    }

    componentWillUnmount() {
        this.refresh.remove();
        this.willShow.remove();
        this.selectDateNative.remove();
    }


    render() {
        let containerStyle = {flex: 1};
        if (Platform.OS == 'android') {
            containerStyle = {height: (height - 105 - StatusBar.currentHeight)};
        }
        return (

            <View style={[{backgroundColor: 'white', justifyContent: 'center'}, containerStyle]}>


                <FlatList
                    ListHeaderComponent={this.getListHead()}
                    ListEmptyComponent={this.ListEmptyComponent()}
                    data={this.state.selectedDayItem}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}

                />

                <View style={{
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    // paddingTop: 120,
                    // right: 15,
                    bottom:18,
                    right:22,


                }}>


                    <TouchableOpacity style={{


                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center'
                    }} onPress={() => {
                        this.addTrip();
                    }}>
                        <Image source={require('../images/add_calendar.png')}
                               style={{height: 48, width: 48,borderRadius: 25,  }}/>
                        {/*<Text style={{fontSize: 16, textAlign: 'center', color: 'white'}}>*/}
                            {/*+*/}
                        {/*</Text>*/}
                    </TouchableOpacity>
                    {/*<View style={{height: 1, backgroundColor: '#d3d3d3', marginLeft: 10, marginRight: 10}}></View>*/}
                </View>
            </View>

        );
    }
}
let {width, height} = Dimensions.get("window")
const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    wrapper: {
        flex: 1,
    },
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350
    },
    text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
        backgroundColor: '#eee'
    },
    container: {
        flex: 1,
        backgroundColor: 'gray'
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
    itemText:{
        marginLeft:5,
        fontSize:12,
        color:'#ffffff',
    }

});