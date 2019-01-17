/*************************************************************************************************
 * <pre>
 * @包路径：
 *
 * @类描述:
 * @版本:       V3.0.0
 * @作者        bigwhite
 * @创建时间    2018-11-29 15:54
 *
 * @修改记录：
 -----------------------------------------------------------------------------------------------
 ----------- 时间      |   修改人    |     修改的方法       |         修改描述   ---------------
 -----------------------------------------------------------------------------------------------
 </pre>
 ************************************************************************************************/
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
import SplitMessage from './../search/SpiltMessage';

import {
    QSearch,
} from 'react-native-qunar-component-library-public';
import NavCBtn from './../common/NavCBtn';

const sections = [
    {key: "A", data: [{title: "阿童木"}, {title: "阿玛尼"}, {title: "爱多多"}]},
    {key: "B", data: [{title: "表哥"}, {title: "贝贝"}, {title: "表弟"}, {title: "表姐"}, {title: "表叔"}]},
    {key: "C", data: [{title: "成吉思汗"}, {title: "超市快递"}]},
    {
        key: "W",
        data: [{title: "王磊"}, {title: "王者荣耀"}, {title: "往事不能回味"}, {title: "王小磊"}, {title: "王中磊"}, {title: "王大磊"}]
    },
];

export class LocalFileSearch extends Component {


    static navigationOptions = ({navigation}) => {
        let headerTitle = "文件搜索";
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        // if (navigation.state.params.innerVC) {
        //     let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
        //     leftBtn = (<NavCBtn {...props}/>);
        // }
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
            fileDate: [],
            searchContent: '',
        };
    }

    openNativeFile(info) {
        let params = {}
        params['httpUrl'] = info.item.fileUrl;//文件下载地址
        params['fileName'] = info.item.fileName;//文件名称
        params['fileSize'] = info.item.fileSize;//文件尺寸
        params['isQtalkNative'] = true;
        // params['fileMD5']=info.item.fileUrl;//文件md5
        try {
            NativeModules.QtalkPlugin.openDownLoad(params, function () {

            })
        } catch (e) {

        }
    }

    //返回每一条Item
    _renderItem = (info) => {

        return (
            <TouchableOpacity style={LocalImageSearchStyles.renderItem} onPress={() => {
                this.openNativeFile(info);
            }}>
                <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                    {/*<View style={{flexDirection: 'row'}}>*/}
                        {/*<Image style={LocalImageSearchStyles.itemImage} source={{uri: info.item.headerUrl}}/>*/}
                        {/*<Text style={LocalImageSearchStyles.itemNick}>{info.item.nickName}</Text>*/}
                    {/*</View>*/}

                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Image style={LocalImageSearchStyles.itemImage} source={{uri: info.item.headerUrl}}/>
                        {/*<Text style={LocalImageSearchStyles.itemNick}>{info.item.nickName}</Text>*/}
                        <Text numberOfLines={1}
                              style={LocalImageSearchStyles.itemNick}>{SplitMessage.spiltContent(info.item.nickName, this.state.searchContent)["left"]}</Text>
                        <Text numberOfLines={1} style={{
                            fontSize: 14,
                            color: "#43CD80"
                        }}>{SplitMessage.spiltContent(info.item.nickName, this.state.searchContent)["middle"]}</Text>
                        <Text numberOfLines={1}
                              style={LocalImageSearchStyles.itemNick}>{SplitMessage.spiltContent(info.item.nickName, this.state.searchContent)["right"]}</Text>

                    </View>

                    <Text style={LocalImageSearchStyles.renderItemTextRight}>{info.item.time}</Text>
                </View>


                <View style={LocalImageSearchStyles.renderItemTextCenter}>
                    {/*<Image  style={LocalImageSearchStyles.fileImgType} source={{uri: info.item.headerUrl}}/>*/}
                    {this.showFileType(info.item.fileType)}
                    {/*<View style={{marginLeft:12}}>*/}
                    {/*<Text style={LocalImageSearchStyles.fileName}>{info.item.fileName}</Text>*/}


                    {/*<Text style={LocalImageSearchStyles.fileSize}>{info.item.fileSize}</Text>*/}
                    {/*</View>*/}

                    <View>
                        <View style={{
                            marginLeft: 12,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            marginRight: 60
                        }}>
                            <Text numberOfLines={2} style={LocalImageSearchStyles.fileName}>
                                {SplitMessage.spiltContent(info.item.fileName, this.state.searchContent)["left"]}
                                <Text numberOfLines={2} style={{
                                    fontSize: 14,
                                    color: "#43CD80"
                                }}>
                                    {SplitMessage.spiltContent(info.item.fileName, this.state.searchContent)["middle"]}
                                </Text>
                                {SplitMessage.spiltContent(info.item.fileName, this.state.searchContent)["right"]}
                            </Text>
                        </View>
                        <Text style={LocalImageSearchStyles.fileSize}>{info.item.fileSize}</Text>
                    </View>

                </View>

            </TouchableOpacity>

        );
    }

    showFileType(fileType) {
        let item = '';
        switch (fileType) {
            case 'word':
                item = 'e2f4;'
                break;
            case 'image':
                item = 'f252;'
                break;
            case 'excel':
                item = 'e2f2;'
                break;
            case 'powerPoint':
                item = 'e2f6;'
                break;
            case 'pdf':
                item = 'e2f3;'
                break;
            case 'apk':
                item = 'e3ea;'
                break;
            case 'txt':
                item = 'e3ec;'
                break;
            case 'zip':
                item = 'e2f5;'
                break;
            case 'file':
            default:
                item = 'e3e9;'
                break
        }

        return (
            <Text style={LocalImageSearchStyles.iconStyle}>{String.fromCharCode(parseInt("0x" + item))}</Text>
        );
    }

    //设置分组头及头的样式
    _sectionComp = (info) => {
        var txt = info.section.key;
        return <Text
            style={{
                height: 24,
                paddingLeft: 16,
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                color: '#9e9e9e',
                fontSize: 12
            }}>{txt}</Text>
    }


    searchText(text) {
        let params = {};
        params['xmppid'] = this.state.xmppId;
        params['realjid'] = this.state.realjid;
        params['chatType'] = this.state.chatType;
        if (text == "") {

        } else {
            params['searchText'] = text;
            this.state.searchContent = text;
        }

        NativeModules.QimRNBModule.searchLocalFile(params, function (response) {
            if (response != null && response.ok) {
                this.setState({
                    fileDate: response.data,
                });
            }
        }.bind(this));
    }

    _renderSectionList() {
        if (this.state.fileDate.length > 0) {
            return (
                <SectionList
                    renderSectionHeader={this._sectionComp}
                    renderItem={this._renderItem}
                    stickyHeaderIndices={[0]}
                    stickySectionHeadersEnabled={true}
                    sections={this.state.fileDate}
                    ItemSeparatorComponent={() =>
                        <View
                            style={{height: 1, flex: 1, backgroundColor: '#ffffff', paddingLeft: 20, paddingRight: 20}}>
                            <View
                                style={{backgroundColor: '#eeeeee', marginLeft: 20, marginRight: 20, flex: 1}}>

                            </View>
                        </View>
                    }
                />
            );
        } else {
            console.log("搜索结果为空");
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{color: '#9E9E9E', fontSize: 14}}>暂无相关内容</Text>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={LocalImageSearchStyles.container}>
                <QSearch

                    placeholder='文件'
                    onSubmit={(text) => {
                        this.searchText(text)
                    }}
                    onCancel={() => {
                        this.searchText('')
                    }}
                    onClear={() => {
                        this.searchText('')
                    }}
                    showCancel={false}
                />
                {this._renderSectionList()}
            </View>
        );
    }

    //进行数据初始化操作
    componentDidMount() {
        let params = {};
        params['xmppid'] = this.state.xmppId;
        params['realjid'] = this.state.realjid;
        params['chatType'] = this.state.chatType;
        NativeModules.QimRNBModule.searchLocalFile(params, function (response) {
            if (response != null && response.ok) {
                this.setState({
                    fileDate: response.data,
                });
            }
        }.bind(this));
    }

    componentWillUnmount() {

    }
}

let {width, height} = Dimensions.get("window")
const LocalImageSearchStyles = StyleSheet.create({
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
        backgroundColor: '#ffffff'
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
        backgroundColor: '#f9f9f9',
        height: 56,
    },
    fileName: {
        color: '#212121',
        fontSize: 14,
    },
    fileSize: {
        marginTop: 10,
        marginLeft: 12,
        color: '#9e9e9e',
        fontSize: 12,
    },
    fileImgType: {
        marginLeft: 12,
        width: 36,
        height: 36,
    },
    iconStyle: {
        color: '#616161',
        fontFamily: 'QTalk-QChat',
        fontSize: 40,
        marginLeft: 12,
    }

});