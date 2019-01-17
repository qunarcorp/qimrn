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
import {
    QSearch,
} from 'react-native-qunar-component-library-public';
import NavCBtn from './../common/NavCBtn';
import SplitMessage from './../search/SpiltMessage';

export class LocalLinkSearch extends Component {


    static navigationOptions = ({navigation}) => {
        let headerTitle = "链接搜索";
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

    openWebView(item) {
        let params = {};
        params['linkurl'] = item.linkUrl;
	    params['reacturl'] = item.reacturl;
        console.log('linkUrl : ' + item.linkUrl);
        console.log('reactUrl : ' + item.reacturl);
        try {
            NativeModules.QtalkPlugin.openNativeWebView(params);
        } catch (e) {
            console.log("打开WebView ：" + item.linkUrl + "失败");
        }
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

        NativeModules.QimRNBModule.searchLocalLink(params, function (response) {
            if (response != null && response.ok) {
                this.setState({
                    linkData: response.data,
                });
            }
        }.bind(this));
    }

    //返回每一条Item
    _renderItem = (info) => {

        return (
            <TouchableOpacity style={LocalImageSearchStyles.renderItem} onPress={() => {
                this.openWebView(info.item);
            }}>
                <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
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
                    <Text style={LocalImageSearchStyles.renderItemTextRight}>{info.item.linkDate}</Text>
                </View>


                <View style={LocalImageSearchStyles.renderItemTextCenter}>

                    <Image style={LocalImageSearchStyles.fileImgType} source={{uri: info.item.linkIcon}}/>
                    <View>
                        <View style={{
                            marginLeft: 12,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            marginRight: 60
                        }}>
                            <Text numberOfLines={2} style={LocalImageSearchStyles.linkTitleStyle}>
                                {SplitMessage.spiltContent(info.item.linkTitle, this.state.searchContent)["left"]}
                                <Text numberOfLines={2} style={{
                                    fontSize: 14,
                                    color: "#43CD80"
                                }}>
                                    {SplitMessage.spiltContent(info.item.linkTitle, this.state.searchContent)["middle"]}
                                </Text>
                                {SplitMessage.spiltContent(info.item.linkTitle, this.state.searchContent)["right"]}
                            </Text>
                        </View>
                        <Text style={LocalImageSearchStyles.linkTypeStyle}>{info.item.linkType}</Text>
                    </View>
                </View>
            </TouchableOpacity>
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
                fontSize: 12,
            }}>{txt}</Text>
    }

    _renderSectionList() {
        if (this.state.linkData.length > 0) {
            return (
                <SectionList
                    renderSectionHeader={this._sectionComp}
                    renderItem={this._renderItem}
                    stickyHeaderIndices={[0]}
                    stickySectionHeadersEnabled={true}
                    sections={this.state.linkData}
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
                    <Text style={{color:'#9E9E9E',  fontSize: 14}}>暂无相关内容</Text>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={LocalImageSearchStyles.container}>
                <QSearch

                    placeholder='链接'
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


    _separator = () => {
        return (
            <View style={{height: 1, flex: 1, backgroundColor: '#ffffff', paddingLeft: 16, paddingRight: 16}}>
                <View style={{backgroundColor: '#eeeeee', marginLeft: 16, marginRight: 16, flex: 1}}>

                </View>
            </View>
        );
    }

    //进行数据初始化操作
    componentDidMount() {
        let params = {};
        params['xmppid'] = this.state.xmppId;
        params['realjid'] = this.state.realjid;
        params['chatType'] = this.state.chatType;
        NativeModules.QimRNBModule.searchLocalLink(params, function (response) {
            if (response != null && response.ok) {
                this.setState({
                    linkData: response.data,
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
