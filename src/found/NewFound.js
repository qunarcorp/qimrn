/*************************************************************************************************
 * <pre>
 * @包路径：
 *
 * @类描述:
 * @版本:       V3.0.0
 * @作者        bigwhite
 * @创建时间    2019-03-26 11:02
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
    StatusBar,
    Platform,
    TouchableOpacity,
    NativeModules,
    PermissionsAndroid,
} from "react-native";

export default class NewFound extends Component {

    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props)
    }



    openNativeScan(){
        let param = {};
        if (Platform.OS == 'ios') {
            // this.takePhoto();
            NativeModules.QtalkPlugin.openScan(param);
        } else {
            this.requestCameraPermission(PermissionsAndroid.PERMISSIONS.CAMERA,function (response) {
                if(response.ok){
                    // this.takePhoto();
                    NativeModules.QtalkPlugin.openScan(param);
                }
            }.bind(this));
        }



    }

    openNativeNoteBook(){
        let param = {};
        NativeModules.QtalkPlugin.openNoteBook(param);
    }

    openNativeFileTransfer(){
        let param = {};
        NativeModules.QtalkPlugin.openFileTransfer(param);
    }

    openNativeTravelCalendar(){
        let param = {};
        NativeModules.QtalkPlugin.openTravelCalendar(param);
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

    render() {
        let containerStyle = {flex: 1};
        if (Platform.OS == 'android') {
            containerStyle = {height: (height - 105 - StatusBar.currentHeight)};
        }
        return (
            <View style={[NewFoundStyles.container,containerStyle]}>
                <View style={NewFoundStyles.appointSearchItem}>
                    <TouchableOpacity onPress={() => {
                        this.openNativeNoteBook();
                    }}>
                        <View style={NewFoundStyles.searhItemView}>
                            <Text style={NewFoundStyles.iconStyle}>{String.fromCharCode(parseInt("0xe213;"))}</Text>
                            <Text style={NewFoundStyles.searchItemText}>笔记本</Text>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {

                        this.openNativeTravelCalendar();
                    }}>
                        <View style={NewFoundStyles.searhItemView}>
                            <Text style={NewFoundStyles.iconStyle}>{String.fromCharCode(parseInt("0xe403;"))}</Text>
                            <Text style={NewFoundStyles.searchItemText}>行程</Text>
                        </View>


                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.openNativeFileTransfer();
                    }}>

                        <View style={NewFoundStyles.searhItemView}>
                            <Text style={NewFoundStyles.iconStyle}>{String.fromCharCode(parseInt("0xe211;"))}</Text>
                            <Text style={NewFoundStyles.searchItemText}>文件传输助手</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.openNativeScan();
                    }}>

                        <View style={NewFoundStyles.searhItemView}>
                            <Text style={NewFoundStyles.iconStyle}>{String.fromCharCode(parseInt("0xf0f5;"))}</Text>
                            <Text style={NewFoundStyles.searchItemText}>扫一扫</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}

let {width, height} = Dimensions.get("window")
const NewFoundStyles = StyleSheet.create({

    wrapper: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    appointSearch: {
        flex: 1,
        backgroundColor: '#ffffff',

        alignItems: 'center',
    },
    appointSearchItem: {
        flex: 1,
        width: '100%',
        backgroundColor:'#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 32,
    },
    container: {
        backgroundColor:'#ffffff',
        flexDirection: 'row',   // 水平排布
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
        height: Platform.OS === 'ios' ? 68 : 48,   // 处理iOS状态栏
        // alignItems: 'center'  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
    },
    searchBox: {//搜索框
        height: 35,
        flexDirection: 'row',   // 水平排布
        flex: 1,
        borderRadius: 3,  // 设置圆角边
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
    },
    inputText: {
        backgroundColor: 'transparent',
        flex: 1,
        height: 35,
        lineHeight: 30,
        fontSize: 15,
        padding: 0,
        paddingLeft: 20,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    renderItem: {
        flex: 1,
        flexDirection: "row",
        height: 60,
        padding: 5,
        backgroundColor: 'white',
        alignItems: "center",
    },
    renderItemAppoint: {
        flex: 1,
        flexDirection: "row",
        height: 180,
        padding: 5,
        backgroundColor: 'white',
    },
    renderItemTextCenter: {
        flex: 1,
        marginRight: 5,
    },
    renderItemTextRight: {
        color: '#9E9E9E',
        fontSize: 12,
    },
    rightArrow: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    iconStyle: {
        color: '#616161',
        fontFamily: 'QTalk-QChat',
        fontSize: 40,
    },
    searhItemView: {
        backgroundColor:'#ffffff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchItemText: {
        marginTop: 16,
        fontSize: 12,
        color: '#212121'
    }
});