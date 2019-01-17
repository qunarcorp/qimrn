//勋章
import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter,
    NativeModules,
    Alert,
    BackHandler,
    ListView,
    Platform,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import AppConfig from "../common/AppConfig";

export default class UserMedal extends Component {
    static navigationOptions = ({navigation}) => {
        let headerTitle = "勋章列表";
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 16,
            },
            headerLeft: leftBtn,
        };
    };

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
        this.state = {
            userId: this.props.navigation.state.params.userId,
            userName: this.props.navigation.state.params.name,
            medals: this.dataSource.cloneWithRows(this.props.navigation.state.params.userMedals),
        }
    }

    renderRow(rowData) {
        console.log('rowData' + rowData);
        return (
            <View>
                <View style={styles.cellContentViewStyle}>
                    <Image style={styles.userMedalIconStyle}
                           source={{uri: rowData.url}}></Image>
                    <Text style={styles.userMedalDescStyle}>{rowData.desc}</Text>

                </View>
                <View style={styles.lineStyle}></View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <ListView
                    style={styles.listSTyle}
                    enableEmptySections={true}
                    dataSource={this.state.medals}
                    renderRow={this.renderRow.bind(this)}>
                </ListView>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#EAEAEA'
    },
    listSTyle: {
        flex: 1,
        backgroundColor: '#EAEAEA',
    },
    cellContentViewStyle: {
        flexDirection: "row",
        height: 49,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        alignItems: "center",
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    userMedalIconStyle: {
        width: 36,
        height: 36,
    },
    userMedalDescStyle: {
        flex: 1,
        marginRight: 16,
        fontSize: 15,
        color: '#12C394',
        height: 21,
        textAlign: 'right',
        alignItems: 'center',
        flexDirection: "row",
    },
    lineStyle: {
        height: 1,
        backgroundColor: '#EAEAEA',
    }
});