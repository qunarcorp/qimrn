import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    Dimensions,
    SectionList,
    Image,
    TouchableOpacity, Alert, Platform, NativeModules,
} from 'react-native';
import moment from 'moment';
import NavCBtn from './../common/NavCBtn';
import {Agenda, CalendarList, LocaleConfig, Calendar, parseDate, xdateToData} from 'react-native-calendars';

export class LocalDateSearch extends Component {


    static navigationOptions = ({navigation}) => {
        let headerTitle = "日期搜索";
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
            xmppId: this.props.navigation.state.params.xmppid,
            realjid: this.props.navigation.state.params.realjid,
            chatType: this.props.navigation.state.params.chatType,
            linkData: [],
            searchContent: '',
        };
    }

    skipActivity(time) {
        try {
            if (Platform.OS == 'ios') {
                NativeModules.QimRNBModule.openChatForLocalSearch(this.state.xmppId, this.state.realjid, this.state.chatType, Number(time));
            } else {
                NativeModules.QimRNBModule.openChatForLocalSearch(this.state.xmppId, this.state.realjid, this.state.chatType, time);
            }
        } catch (e) {
            console.log("LocalDateSeaerch openChatForLocalSearch Faild :" + e);
        }
    }


    render() {
        return (
            <View style={LocalDateSearchStyles.container}>
                <CalendarList
                    style={{flex: 1}}
                    // Callback which gets executed when visible months change in scroll view. Default = undefined
                    // onVisibleMonthsChange={(months) => {
                    //     console.log('now these months are visible', months);
                    // }}
                    // Max amount of months allowed to scroll to the past. Default = 50
                    pastScrollRange={50}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    futureScrollRange={50}
                    // Enable or disable scrolling of calendar list
                    scrollEnabled={true}
                    // Enable or disable vertical scroll indicator. Default = false
                    showScrollIndicator={true}

                    maxDate={parseDate(moment().format("YYYY-MM-DD"))}

                    onDayPress={(day) => {
                        this.skipActivity(moment(day.timestamp).hours(0).format("x"))
                        // alert('selected day:' + )
                    }}

                />
            </View>
        );
    }


    //进行数据初始化操作
    componentDidMount() {
    }

    componentWillUnmount() {

    }
}

let {width, height} = Dimensions.get("window")
const LocalDateSearchStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemImage: {
        width: 24,
        height: 24,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    itemNick: {
        height: 24,
        marginLeft: 8,
        color: '#9e9e9e',
        fontSize: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    renderItem: {
        flex: 1,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#ffffff',
    },
    renderItemTextRight: {
        fontSize: 11,
        color: '#9e9e9e'
    },
    renderItemTextCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginTop: 12,
        backgroundColor: '#ffffff',
        height: 56,
    },
    linkTitleStyle: {
        color: '#212121',
        fontSize: 14
    },
    linkTypeStyle: {
        color: '#9e9e9e',
        marginTop: 10,
        marginLeft: 12,
        fontSize: 12
    },
    fileImgType: {
        marginLeft: 12,
        width: 36,
        height: 36,
    }
});