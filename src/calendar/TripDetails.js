import React, {Component, PureComponent} from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    NativeModules,
    Platform,
    FlatList,
    TouchableOpacity,
    Dimensions,

} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import JsonUtils from "../common/JsonUtils";
import moment from 'moment';

import {Agenda, CalendarList, LocaleConfig, parseDate} from 'react-native-calendars';

export default class TripDetails extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "行程详情";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"TravelCalendar"}/>);

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
            item: JsonUtils.strMapToObj(JsonUtils.jsonToMap(this.props.navigation.state.params.canshu)),
        }
    }


    _showMember() {
        let memberList = this.state.item['memberList'];
        if(!memberList){
            return;
        }
        if(!(memberList.length>0)){
            return;
        }
        var par = [];
        for (let i = 0; i < memberList.length; i++) {
            let state ='';
            if(memberList[i]['memberState']===1){
                state = '参加'
            }else if(memberList[i]['memberState']===2){
                state = '拒绝'
            }else if(memberList[i]['memberState']===0){
                state = '暂定'
            }
            par.push(
                <View key={i}>
                    <Text>{memberList[i]['memberId']}-{state}</Text>
                </View>
            )
        }
        return (
            <View>
                <Text>参会人员</Text>
                {par}
            </View>
        );
    }

    render() {
        return (
            <ScrollView style={{marginLeft: 10, marginRight: 10}}>
                <Text>行程名称:{this.state.item['tripName']}</Text>
                <Text>行程邀请人:{this.state.item['tripInviter']}</Text>
                <Text>行程日期:{this.state.item['tripDate']}</Text>
                <Text>开始时间:{this.state.item['beginTime']}</Text>
                <Text>结束时间:{this.state.item['endTime']}</Text>
                <Text>行程室地点:{this.state.item['appointment']}</Text>
                {this._showMember()}
            </ScrollView>

        );
    }
}