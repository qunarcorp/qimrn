import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    DeviceEventEmitter,
    ActionSheetIOS,
    PermissionsAndroid,
    Alert,
    Platform,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import CustomActionSheet from '../common/CustomActionSheet'
import LoadingView from "../common/LoadingView";
import AppConfig from "../common/AppConfig";

var HEADERBUTTONS = [
    '查看头像',
    '相册中选择',
    '拍照',
    '取消',
];

var CANCEL_INDEX = 3;

export default class UserCard extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "个人资料";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"MySetting"}/>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 18
            },
            headerLeft: leftBtn,
        };
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.unMount = false;
        // this.onPressHeaderButton = this.onPressHeaderButton.bind(this);
    }

    componentDidMount() {
        NativeModules.QimRNBModule.getMyInfo(function (responce) {
            let userInfo = responce.MyInfo;
            this.setState({userInfo: userInfo});
        }.bind(this));
        NativeModules.QimRNBModule.getMyMood(function(responce){
            let mood = responce.mood;
            this.setState({userMood:mood});
        }.bind(this));

        //个性签名更新通知
        this.updatePSignature = DeviceEventEmitter.addListener('updatePersonalSignature', function (params) {
            this.updatePersonalSignature(params);
        }.bind(this));

        this.imageUpdateStartAttribute = DeviceEventEmitter.addListener('imageUpdateStart', function (params) {
            this.imageUpdateStart(params);
        }.bind(this));

        this.imageUpdateEndAttribute = DeviceEventEmitter.addListener('imageUpdateEnd', function (params) {
            this.imageUpdateEnd(params);
        }.bind(this));

    }

    //开始显示
    imageUpdateStart(params) {
        LoadingView.show('请稍等');
    }

    //结束显示
    imageUpdateEnd(params) {
        if (params.ok) {
            let headerUrl = params.headerUrl;
            this.state.userInfo["HeaderUri"] = headerUrl;
            this.setState({userInfo: this.state.userInfo});

        }else{
            Alert.alert('提示','更新失败');
        }
        LoadingView.hidden();
    }

    componentWillUnmount() {
        this.unMount = true;
        this.updatePSignature.remove();
        this.imageUpdateStartAttribute.remove();
        this.imageUpdateEndAttribute.remove();
    }

    updatePersonalSignature(params) {
        let userId = params["UserId"];
        let pSignature = params["PersonalSignature"];
        if (userId == this.state.userInfo["UserId"]) {
            // this.state.userMood =pSignature;
            // let userInfo = this.state.userInfo;
            // userInfo["Mood"] = pSignature;
            this.setState({userMood: pSignature});
        }
    }

    openPersonalSignature() {
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        this.props.navigation.navigate('PersonalSignature', {
            'backTitle': "个人资料",
            'userId': this.state.userInfo["UserId"],
            'personalSignature': this.state.userMood,
        });
    }

    openUserQRCode() {
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        this.props.navigation.navigate('UserQRCode', {
            'backTitle': "个人资料",
            'userId': this.state.userInfo["UserId"],
            'userName': this.state.userInfo["Name"],
            'userHeader': this.state.userInfo["HeaderUri"],
        });
    }

    browseBigHeader() {
        if (this.state.userInfo["UserId"] === '' || this.state.userInfo["UserId"] === null) {
            return;
        }
        let param = {};
        let userId = this.state.userInfo["UserId"];
        param["UserId"] = userId;
        NativeModules.QimRNBModule.browseBigHeader(param, function (responce) {
        }.bind(this));
    }

    updateMyPhotoFromImagePicker() {
        NativeModules.QimRNBModule.updateMyPhotoFromImagePicker();
    }

    takePhoto() {
        NativeModules.QimRNBModule.takePhoto();
    }

    async requestCameraPermission(permissions,callback) {
        try {
            const granted = await PermissionsAndroid.request(
                permissions,
                {
                    'title': '请求授予摄像头权限',
                    'message': '请授予摄像头权限进行拍照操作!'
                }
            )
            if (granted=== PermissionsAndroid.RESULTS.GRANTED) {
               callback({"ok":true})
            } else {
                callback({"ok":false})
            }
        } catch (err) {
            // console.warn(err)
            callback({"ok":false})
        }
    }

    showHeaderActionSheet() {

        ActionSheetIOS.showActionSheetWithOptions({
                options: HEADERBUTTONS,
                message: "选择",
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex) => {
                if (buttonIndex === 0) {
                    this.browseBigHeader();
                } else if (buttonIndex === 1) {
                    this.updateMyPhotoFromImagePicker();
                } else if (buttonIndex === 2) {
                    this.takePhoto();
                } else {

                }
            });
    }

    onPressHeaderButton() {

        let actions = ['取消', '查看大图', '相册上传头像', '拍照上传头像'];
        if (AppConfig.isQtalk() != true) {
            actions = ['取消', '查看大图'];
        }

        this.CustomActionSheet.onShowCustomActionSheet('请选择', actions, 0, -1, (index, str) => {
            // console.log(index + str);
            switch (index) {
                case 1:
                    this.browseBigHeader();
                    break;

                case 2:
                    this.updateMyPhotoFromImagePicker();
                    break;
                case 3: {
                    if (Platform.OS == 'ios') {
                        this.takePhoto();
                    } else {
                        this.requestCameraPermission(PermissionsAndroid.PERMISSIONS.CAMERA,function (response) {
                            if(response.ok){
                                this.takePhoto();
                            }
                        }.bind(this));
                    }
                }
                    break;
                default:

                    break;
            }
        });
    };

    _showPersonalSignature(mood){
        if(AppConfig.isQtalk()){
            return(
                <View>
                    <TouchableOpacity style={styles.cellContentView} onPress={() => {
                        this.openPersonalSignature();
                    }}>
                        <Text style={styles.cellTitle}>个性签名</Text>
                        <Text style={styles.cellValue}>{mood}</Text>
                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                </View>
            )
        }
    }


    render() {
        let nickName = "";
        let mood = "这家伙很懒什么都没留"; //'/Users/admin/Documents/big_image.gif'
        let headerUri = "../images/singleHeaderDefault.png";
        let userId = "";
        let department = "";
        if (this.state.userInfo) {
            userId = this.state.userInfo["UserId"];
            nickName = this.state.userInfo["Name"];
            headerUri = this.state.userInfo["HeaderUri"];
            // mood = this.state.userInfo["Mood"];
            department = this.state.userInfo["Department"];
        }
        if (this.state.userMood) {
            mood = this.state.userMood;
        }
        return (
            <View style={styles.wrapper}>
                <CustomActionSheet ref={o => this.CustomActionSheet = o}/>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                    <TouchableOpacity style={styles.userHeader} onPress={() => {
                        this.onPressHeaderButton();
                    }}>
                        <Text style={styles.cellTitle}>头像</Text>
                        <View style={styles.cellQRCode}>
                            <Image source={{uri: headerUri}} style={styles.userHeaderImage}/>
                        </View>
                        <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                    </TouchableOpacity>
                    <View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>名字</Text>
                            <Text style={styles.cellValue}>{nickName}</Text>
                        </View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>用户ID</Text>
                            <Text style={styles.cellValue}>{userId}</Text>
                        </View>
                        <View style={styles.cellContentView}>
                            <Text style={styles.cellTitle}>部门</Text>
                            <Text style={styles.cellValue}>{department}</Text>
                        </View>
                        <TouchableOpacity style={styles.cellContentView} onPress={() => {
                            this.openUserQRCode();
                        }}>
                            <Text style={styles.cellTitle}>我的二维码</Text>
                            <View style={styles.cellQRCode}>
                                <Image source={require('../images/qrcode.png')} style={styles.qrCodeIcon}/>
                            </View>
                            <Image source={require('../images/arrow_right.png')} style={styles.rightArrow}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}>

                    </View>
                    {this._showPersonalSignature(mood)}
                </ScrollView>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    tabBar: {
        height: 64,
        flexDirection: "row",
        backgroundColor: "#EAEAEA",
    },
    leftTab: {
        flex: 1,
    },
    rightTab: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#EAEAEA",
    },
    contentContainer: {
        // paddingVertical: 20
    },
    line: {
        height: 10,
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: 44,
        borderBottomWidth: 1,
        borderColor: "#EAEAEA",
        paddingLeft: 15,
        alignItems: "center",
        flex: 1,
    },
    cellIcon: {
        width: 24,
        height: 24,
        lineHeight: 24,
        fontFamily: "QTalk-QChat",
        fontSize: 22,
        color: "#888888",
        marginRight: 5,
    },
    cellTitle: {
        width: 100,
        color: "#212121",
        fontSize: 14,
    },
    cellValue: {
        flex: 1,
        textAlign: "right",
        color: "#999999",
        marginRight: 10,
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    userHeader: {
        height: 70,
        backgroundColor: "#FFF",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#EAEAEA",
        alignItems: "center",
        paddingLeft: 15,
    },
    userHeaderImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderColor: "#D1D1D1",
        borderWidth: 1,
        marginRight: 5,
    },
    userNameInfo: {
        height: 60,
        marginLeft: 15,
        marginRight: 15,
    },
    userName: {
        marginTop: 10,
        fontSize: 18,
        color: "#333333",
    },
    userMood: {
        marginTop: 10,
        fontSize: 14,
        color: "#999999",
    },
    cellQRCode: {
        flex: 1,
        alignItems: "flex-end",
    },
    qrCodeIcon: {
        width: 24,
        height: 24,
        marginRight: 5,
    },
    walletInfo: {},
});
