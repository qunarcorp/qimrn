import React, {Component} from 'react';
import {
    ScrollView,
    Button,
    Text,
    View,
    Image,
    StyleSheet,
    Alert,
    DeviceEventEmitter,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import HttpTools from './../common/HttpTools';
import Date from './../common/DateFormat';
import ToastUtil from './../common/ToastUtil';
import AppConfig from './../common/AppConfig';
import ClockOn from "./clock_on";
import ClockInDetail from "./clock_in_detail";
import NavCBtn from "../common/NavCBtn";

const clock_in = {key: 'vacation', color: '#41CF94', selectedColor: 'green'};
const clock_out = {key: 'massage', color: '#FF0000', selectedColor: 'red'};

LocaleConfig.locales['fr'] = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六']
};

LocaleConfig.defaultLocale = 'fr';

class ClockDetailView extends Component {
    render() {
        if (this.props.data) {
            let inDate = new Date(parseInt(this.props.data.min.timestamp));
            let outDate = new Date(parseInt(this.props.data.max.timestamp));
            let inTime = inDate ? inDate.pattern("yyyy-MM-dd HH:mm:ss") : "未打卡";
            let outTime = outDate ? outDate.pattern("yyyy-MM-dd HH:mm:ss") : "未打卡";
            return (
                <View>
                    <View style={{
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "#e1e1e1",
                        backgroundColor: "#fff",
                        padding: 10
                    }}>
                        <Text>上班 <Text style={{color: "red"}}>{inTime}</Text></Text>
                        <Text style={{color: "#8a8a8a", fontSize: 12, marginTop: 3}}>
                            <Image source={require('../images/location_info.png')}
                                   style={styles.thumbnail}/> {this.props.data.min.location}
                        </Text>
                        <Text style={{
                            color: "#999999",
                            fontSize: 12,
                            marginTop: 15
                        }}>备注：{this.props.data.min.description}</Text>
                    </View>
                    <View style={{
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "#e1e1e1",
                        backgroundColor: "#fff",
                        padding: 10
                    }}>
                        <Text>下班 <Text style={{color: "red"}}>{outTime}</Text></Text>
                        <Text style={{color: "#8a8a8a", fontSize: 12, marginTop: 3}}>
                            <Image source={require('../images/location_info.png')}
                                   style={styles.thumbnail}/> {this.props.data.max.location}
                        </Text>
                        <Text style={{
                            color: "#999999",
                            fontSize: 12,
                            marginTop: 15
                        }}>备注：{this.props.data.max.description}</Text>
                    </View>
                    <View style={{marginTop: 15, marginBottom: 30}}>
                        <Button onPress={this.props.detailPress} title="打卡详情" color="#841584"
                                accessibilityLabel="Clock In Detail"/>
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <Text style={{marginTop: 30, color: "#999999"}}>
                        没有打开记录
                    </Text>
                </View>
            );
        }
    }
}

export default class ClockIn extends Component {

    static headerTitle = "打卡上班";
    static navigationOptions = ({navigation}) => {
        let headerTitle = ClockIn.headerTitle;
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"ClockIn"}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {navigation.navigate('ClockOn',{'backTitle':headerTitle});}}>打卡</NavCBtn>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
            headerRight: rightBtn,
        };
    };

    openClockDetail(){
        this.props.navigation.navigate('ClockDetail',{'backTitle':ClockIn.headerTitle,selectDate:this.state.selected});
    }

    // Navigator 导航设置
    // static rightPressState = false;
    //
    // static rightPress(navigator) {
    //     navigator.push(
    //         {
    //             name: "ClockOn",
    //             title: "打卡",
    //             component: ClockOn,
    //         }
    //     );
    // }
    //
    // static routeInfo() {
    //     return {
    //         name: "ClockIn",
    //         title: "打卡应用",
    //         rightBtn: "打卡",
    //         rightPress: ClockIn.rightPress,
    //         component: ClockIn
    //     };
    // }

    constructor(props) {
        super(props);
        var date = new Date();
        // console.log(date);
        this.headerTitle = '打卡上班';
        this.state = {
            currentDate: date,
            selected: date.pattern("yyyy-MM-dd"),
            selectedDate: date,
            clockList: {},
        };
        this.onDayPress = this.onDayPress.bind(this);
        this.toast = null;
        this.initDataSounce();
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('clockOnCallback', this.reloadPage.bind(this));
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    reloadPage() {
        this.setState({
            selected: this.state.currentDate.pattern("yyyy-MM-dd"),
            selectedDate: this.state.currentDate,
        });
        this._calendar.pressDay(this.state.currentDate.pattern("yyyy-MM-dd"));
        this.loadClockData(this.state.currentDate);
    }

    initDataSounce() {
        this.toast = ToastUtil.show("初始化...");
        AppConfig.initConfig().then(function () {
            this.loadClockData(this.state.selectedDate);
        }.bind(this));
    }

    onDayPress(day) {
        this.setState({
            selected: day.dateString,
            selectedDate: new Date(day.year, day.month, day.day),
        });
    }

    onMonthChange(month) {
        let date = new Date(month.dateString);
        this.setState({
            selected: month.dateString,
            selectedDate: date,
        });
        this.loadClockData(date);
    }

    loadClockData(currentDate) {
        // ToastUtil.show("加载打卡");
        let timePrex = currentDate.pattern("yyyy-MM-");
        let start = timePrex + "01";
        let end = timePrex + currentDate.monthMaxDays();
        let url = AppConfig.getHttpHost() + AppConfig.CLOCK_LIST_METHOD +
            "?userid=" + AppConfig.getUserId() + "&domain=" + AppConfig.getDomain()
            + "&beginday=" + start + "&endday=" + end;
        // console.log(url);
        HttpTools.get(url).then(function (responce) {
                // ToastUtil.hide();
                if (responce.ret) {
                    let dataList = {};
                    for (var index in responce.data) {
                        let item = responce.data[index];
                        let key = item.day;
                        dataList[key] = item.data;
                    }
                    this.setState({clockList: dataList});
                } else {
                    Alert.alert("提示", "获取打卡记录失败");
                }
            }.bind(this),
            function (error) {
                // ToastUtil.hide();
                Alert.alert("提示", "获取打卡记录失败");
            }.bind(this)
        );
    }

    getClockMarkedDate() {
        let clockData = {
            [this.state.selected]: {selected: true},
        };
        for (key in this.state.clockList) {
            value = this.state.clockList[key];
            var dots = [];
            if ((value.max.timestamp - value.min.timestamp) / 1000 / 3600.0 > 9) {
                dots.push(clock_in);
            } else {
                dots.push(clock_out);
            }
            if (clockData[key]) {
                clockData[key]["dots"] = dots;
            } else {
                clockData[key] = {dots: dots};
            }
        }
        return clockData;
    }

    render() {
        let clockData = this.state.clockList[this.state.selected];
        let workLenStr = "";
        let workLenColor = "#ff0000";
        if (clockData) {
            let workLen = ((clockData.max.timestamp - clockData.min.timestamp) / 1000 / 3600.0).toFixed(2);
            workLenStr = workLen + "小时";
            if (workLen > 9) {
                workLenColor = "#41CF94"
            }
        }
        return (
            <ScrollView style={styles.container}>
                <Calendar
                    ref={(e) => this._calendar = e}
                    onDayPress={this.onDayPress.bind(this)}
                    onMonthChange={this.onMonthChange.bind(this)}
                    style={styles.calendar}
                    hideArrows={false}
                    markedDates={this.getClockMarkedDate()}
                    markingType={'multi-dot'}
                />
                <View style={styles.info}>
                    <Text style={{color: "#333333", fontSize: 18}}>{this.state.selectedDate.pattern("EEE")}</Text>
                    <View style={{flex: 1, flexDirection: 'row',}}>
                        <Text
                            style={{
                                color: "#999999",
                                fontSize: 14
                            }}>{this.state.selectedDate.pattern("yyyy年MM月dd日")}</Text>
                        <Text style={{flex: 1, textAlign: "right", color: workLenColor}}>{workLenStr}</Text>
                    </View>
                    <ClockDetailView data={clockData} detailPress={this.openClockDetail.bind(this)} />
                        {/*// this.props.navigator.push({*/}
                        {/*//     name: "ClockDetail",*/}
                        {/*//     title: "打卡详情",*/}
                        {/*//     component: ClockInDetail,*/}
                        {/*//     params: {*/}
                        {/*//         selectDate: this.state.selected,*/}
                        {/*//     }*/}
                        {/*// })*/}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    thumbnail: {
        height: 12,
        width: 12,
        marginTop: 3,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    info: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15,
    },
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        // height:300
    },
});