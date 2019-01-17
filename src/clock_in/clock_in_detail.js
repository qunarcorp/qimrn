import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    Alert,
} from 'react-native';
import HttpTools from './../common/HttpTools'
import Date from './../common/DateFormat';
import AppConfig from "../common/AppConfig";
import NavCBtn from "../common/NavCBtn";

export default class ClockInDetail extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = '打卡详情';
        let props = {navigation:navigation,btnType:NavCBtn.BACK_BUTTON};
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
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            selectDate:this.props.navigation.state.params.selectDate,
            clockList: this.ds.cloneWithRows([]),
        };
    }

    componentDidMount() {
        this.loadClockDetail();
    }

    loadClockDetail() {
        // ToastUtil.show("正在加载");
        let url = AppConfig.getHttpHost() + AppConfig.CLOCK_DETAIL_METHOD + "?userid=" + AppConfig.getUserId() + "&domain=" + AppConfig.getDomain() + "&day="+this.state.selectDate;
        // console.log(url);
        HttpTools.get(url).then(
            function (response) {
                // ToastUtil.hide();
                if (response.ret) {
                    var list = [];
                    for (var index in response.data) {
                        let item = response.data[index];
                        list.push({key: index, item: item});
                    }
                    if (list.length > 0) {
                        this.setState({
                            clockList:  this.ds.cloneWithRows(list),
                        });
                    }
                } else {
                    Alert.alert("提示","获取打卡详细失败：" + response.errmsg);
                }
            }.bind(this),
            function (error) {
                // ToastUtil.hide();
                Alert.alert("提示","获取打卡详细失败：" + error);
            }
        );
    }

    clockItemRow(clockItem) {
        let time = new Date(parseInt(clockItem.item.timestamp)).pattern("yyyy-MM-dd HH:mm:ss");
        return (
            <View style={styles.clock_row}>
                <View style={styles.clock_time}>
                    <Image source={require('../images/clock.png')} style={styles.clock_time_icon}/>
                    <Text style={styles.clock_time_text}>{time}</Text>
                </View>
                <View style={styles.clock_location}>
                    <Image source={require('../images/clock_location_icon.png')}
                           style={styles.clock_location_icon}/>
                    <Text style={styles.clock_location_text}>{clockItem.item.location}</Text>
                </View>
                <Text style={styles.clock_remind}>
                    备注：{clockItem.item.description}
                </Text>
            </View>
        );
    }

    render() {
        return (
            <View style={{flex:1}}>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.clockList}
                    renderRow={this.clockItemRow.bind(this)}
                    style={styles.list}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    clock_row: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#d1d1d1",
    },
    clock_time: {
        flexDirection: "row",
    },
    clock_time_icon: {
        width: 15,
        height: 15,
        marginRight: 3,
    },
    clock_time_text: {
        fontSize: 15,
        color: "#333333",
    },
    clock_location: {
        flexDirection: "row",
        marginTop: 6,
    },
    clock_location_icon: {
        width: 15,
        height: 15,
        marginRight: 3,
    },
    clock_location_text: {
        flex:1,
        fontSize: 15,
        color: "#666666",
    },
    clock_remind: {
        marginTop: 15,
        fontSize: 12,
        color: "#999999"
    }
});

