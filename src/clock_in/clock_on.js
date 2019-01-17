/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    ListView,
    Image,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions,
    DeviceEventEmitter,
    Keyboard,
    LayoutAnimation,
    Alert,
} from 'react-native';
import HttpTools from './../common/HttpTools';
import NavCBtn from "../common/NavCBtn";
import AppConfig from "../common/AppConfig";

const LOCATION_STATE = {DOING: 1, SUCCESS: 2, FAIL: 3};
const {height, width} = Dimensions.get('window');

class WithLabel extends Component {
    render() {
        if (this.props.location.length > 0) {
            return (
                <View style={styles.labelContainer}>
                    <Text style={{fontSize: 14, color: "#666666"}}>地点：{this.props.location}</Text>
                    {this.props.children}
                </View>
            );
        } else {
            return (
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>备注：</Text>
                    {this.props.children}
                </View>
            );
        }
    }
}

export default class ClockOn extends Component {

    static navigationOptions = ({navigation, screenProps}) => {
        let headerTitle = "打卡";
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
            locationState: LOCATION_STATE.DOING,
            locationInfo: null,
            latitude: 0,
            longitude: 0,
            selectedIndex: 0,
            marginTop: 0,
        };
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide.bind(this));
        // this.keyboardShow = false;//当前键盘的状态，显示与否
    }

    componentDidMount() {
        loadDate = function () {
            this.getCityLocation().then((localInfo) => {
                if (localInfo["pois"]) {
                    var list = [];
                    for (let index in localInfo["pois"]) {
                        list[index] = {key: index, data: localInfo["pois"][index]};
                    }
                    this.setState({locationInfo: this.ds.cloneWithRows(list), locationState: LOCATION_STATE.SUCCESS});
                } else {
                    this.setState({
                        locationInfo: this.ds.cloneWithRows([{
                            data: {
                                address: localInfo.address,
                                location: {lat: this.state.latitude, lng: this.state.longitude}
                            }, key: 0
                        }]),
                        locationState: LOCATION_STATE.SUCCESS
                    });
                }
            }, () => {
                this.setState({locationState: LOCATION_STATE.FAIL});
            });
        }.bind(this);
        setTimeout(loadDate,200);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    onClockOn() {
        if (AppConfig.getUserId()) {
            // ToastUtil.show("正在提交");
            let longitude = "0";
            let latitude = "0";
            let location = "";
            if (this.state.locationInfo.getRowCount() > 0) {
                let selectItem = this.state.locationInfo.getRowData(0, this.state.selectedIndex);
                longitude = selectItem.data.location.longitude;
                latitude = selectItem.data.location.latitude;
                location = selectItem.data.address;
            }
            let url = AppConfig.getHttpHost() + AppConfig.CLOCK_ADD_METHOD;
            let data = {
                ip: AppConfig.getClientIp(),
                userid: AppConfig.getUserId(),
                domain: AppConfig.getDomain(),
                longitude: longitude,
                latitude: latitude,
                description: this.state.remind,
                location: location,
            };
            HttpTools.postJson(url, JSON.stringify(data)).then(function (response) {
                // ToastUtil.hide();
                if (response.ret) {
                    DeviceEventEmitter.emit('clockOnCallback');
                    this.props.navigation.goBack();
                } else {
                    Alert.alert("提示","打卡失败：" + response.errmsg);
                }
            }.bind(this), function (error) {
                // ToastUtil.hide();
                Alert.alert("提示","打卡失败：" + error);
            });
        } else {
            Alert. alert("提示","未登录，不能打卡");
        }
    }

    // 定位

    getPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    // var result = "速度：" + location.coords.speed +
                    //     "\n经度：" + location.coords.longitude +
                    //     "\n纬度：" + location.coords.latitude +
                    //     "\n准确度：" + location.coords.accuracy +
                    //     "\n行进方向：" + location.coords.heading +
                    //     "\n海拔：" + location.coords.altitude +
                    //     "\n海拔准确度：" + location.coords.altitudeAccuracy +
                    //     "\n时间戳：" + location.timestamp;
                    resolve({"longitude": location.coords.longitude, "latitude": location.coords.latitude});
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    getCityLocation() {
        return new Promise((resolve, reject) => {
            this.getPosition().then((location) => {
                let longitude = location.longitude;
                let latitude = location.latitude;
                this.state.longitude = longitude;
                this.state.latitude = latitude;
                let requestUrl = AppConfig.RETROACTIVE_API + latitude + "," + longitude;
                // console.log(requestUrl);
                HttpTools.get(requestUrl)
                    .then((data) => {
                        if (data.status == 0) {
                            resolve(data.result);
                        } else {
                            reject("获取地理信息失败:" + data.message);
                        }
                    }, (error) => {
                        reject("定位失败:" + JSON.stringify(error.message));
                    }).catch((error) => {
                    reject("获取地理信息失败:" + JSON.stringify(error.message));
                });
            }).catch((error) => {
                reject("定位失败:" + JSON.stringify(error.message));
            })

        })
    }

    radioImage(index) {
        if (index == this.state.selectedIndex)
            return (<Image source={require('../images/selected_icon.png')} style={{marginRight: 15}}/>);
        else
            return (<Image/>);
    }

    _pressRow(rowId) {
        // console.log("_pressRow  " + rowId);
        if (rowId != this.state.selectedIndex) {
            this.setState({
                selectedIndex: rowId,
            });
        }
    }

    // 页面渲染
    locationRow(location) {
        return (
            <TouchableOpacity
                onPress={() => {
                    this._pressRow(location.key);
                }}>
                <View style={styles.list_container}>
                    <Image
                        source={require('../images/location_icon.png')}
                        style={styles.thumbnail}
                    />
                    <View style={styles.list_right_container}>
                        <Text style={styles.title}>{location.data.title?location.data.title:location.data.address}</Text>
                        <Text style={styles.desc}>{location.data.address}</Text>
                    </View>
                    {this.radioImage(location.key)}
                </View>
            </TouchableOpacity>
        );
    }

    locationView() {
        switch (this.state.locationState) {
            case LOCATION_STATE.SUCCESS: {
                return (
                    <ListView
                        dataSource={this.state.locationInfo}
                        renderRow={this.locationRow.bind(this)}
                        style={styles.list}
                    />
                );
            }
                break;
            case LOCATION_STATE.FAIL: {
                return (
                    <Text style={styles.welcome}>
                        获取地理信息失败
                    </Text>
                );
            }
                break;
            default: {
                return (
                    <Text style={styles.welcome}>
                        正在获取定位信息...
                    </Text>
                );
            }
                break;
        }
    }

    render() {
        let listHeight = height - 365;
        let location = "";
        if (this.state.locationInfo && this.state.locationInfo.getRowCount() > 0) {
            let selectItem = this.state.locationInfo.getRowData(0, this.state.selectedIndex);
            location = selectItem.data.address;
        }
        return (
            /*<KeyboardAvoidingView behavior='padding'>*/
            <View style={{backgroundColor: "#ffffff", flex: 1, marginTop: this.state.marginTop}}
                  ref={(e) => this.root = e}
                  onLayout={this.onLayout.bind(this)}>
                <View style={{height: listHeight}}>
                    {this.locationView()}
                </View>
                <WithLabel label="备注:" location={location} style={{marginTop: 20}}>
                    <TextInput
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => this.setState({remind: text})}
                        multiline={true}
                        autoFocus={false}
                        style={styles.default}
                        accessibilityLabel="remind input"
                    />
                    <View style={{flex:1,marginTop: 15, alignItems: "center"}}>
                        <TouchableOpacity
                            onPress={this.onClockOn.bind(this)}
                            style={styles.button}>
                            <Text style={styles.buttonText}>踩一下</Text>
                        </TouchableOpacity>
                    </View>
                </WithLabel>
            </View>
            // </KeyboardAvoidingView>
        );
    }


    _keyboardWillShow(e) {
        this.keyboardShow = true;
        let keyboardHeight = e.endCoordinates.screenY - height;
        let config = {
            duration: parseInt(e.duration),
            create: {
                type: LayoutAnimation.Types.easeOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
            }
        };
        LayoutAnimation.configureNext(config);
        this.setState({
            marginTop: keyboardHeight,
        });
    }

    _keyboardWillHide(e) {
        this.keyboardShow = false;
        if (this.state.marginTop != 0) {
            // this.config.duration = parseInt(e.duration);
            let config = {
                duration: parseInt(e.duration),
                create: {
                    type: LayoutAnimation.Types.easeOut,
                    property: LayoutAnimation.Properties.opacity,
                },
                update: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                }
            };
            LayoutAnimation.configureNext(config);
            this.setState({
                marginTop: 0,
            });
        }
    }

    onLayout(event) {
        if (this.baseLayout == null) {
            this.baseLayout = event.nativeEvent.layout;
        }
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor:"#F1F1F1"
    },
    // Location Item Row
    list: {
        backgroundColor: '#F5FCFF',
    },
    list_container: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderBottomColor: '#D1D1D1',
        borderBottomWidth: 0.5,
        borderTopColor: '#D1D1D1',
        borderTopWidth: 1,
        height: 50,
    },
    list_right_container: {
        flex: 1,
    },
    thumbnail: {
        width: 17,
        height: 17,
        marginLeft: 10,
        marginRight: 4,
        marginTop: 3,
    },
    title: {
        color: '#333333',
        fontSize: 16,
        textAlign: 'left',
        lineHeight: 20,
        height: 20,
    },
    desc: {
        color: '#999999',
        fontSize: 12,
        textAlign: 'left',
        lineHeight: 16,
        height: 16,
    },
    // 圆形Btn
    button: {
        height: 100,
        width: 100,
        borderRadius: 50,
        backgroundColor: '#41CF94',
        justifyContent: 'center',
        margin: 20,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
    },
    // With Label
    labelContainer: {
        flex: 1,
        marginTop: 20,
        padding: 15,
    },
    label: {
        marginBottom: 10,
        paddingTop: 2,
        color: "#666666",
        fontSize: 16
    },
    default: {
        height: 60,
        borderWidth: 0.5,
        borderColor: '#D1D1D1',
        borderRadius:5,
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:5,
        paddingBottom:5,
        marginTop: 5,
        backgroundColor:"#FFF",
    },
});
