'use strict';

import React, {Component} from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    NativeModules,
    Animated,
    Dimensions,
} from 'react-native';
import NavCBtn from './../common/NavCBtn';
import Image2 from './../common/Image2';

const {height, width} = Dimensions.get('window');

class PNOAnimatedView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0), // init opacity 0
        };
    }

    componentDidMount() {
        Animated.timing(
            this.state.fadeAnim,
            {toValue: 1},
        ).start();
    }

    hiddenView(callback) {
        Animated.timing(
            this.state.fadeAnim,
            {toValue: 0},
        ).start(callback);
    }

    render() {
        return (
            <Animated.View
                style={[this.props.style, {opacity: this.state.fadeAnim}]}>
                {this.props.children}
            </Animated.View>
        );
    }
}

export default class PublicNumberList extends React.PureComponent {

    static navigationOptions = ({navigation}) => {
        let headerTitle = '公众号';
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"Contacts"}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON}><TouchableOpacity onPress={() => {
                navigation.state.params.rightAction();
            }}><Text
                style={styles.addBtnStyle}>{String.fromCharCode(parseInt("0xf1cd"))}</Text></TouchableOpacity></NavCBtn>
        );
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
            headerRight: rightBtn,
        };
    };

    _openRightView = () => {
        if (this.state.rightViewShow) {
            this._hiddenRightView();
        } else {
            this.setState({rightViewShow: true,});
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            groupList: [], rightViewShow: false,
        };
    }

    componentDidMount() {
        this.loadDataSource();
        this.props.navigation.setParams({rightAction: this._openRightView.bind(this)});
    }


    componentWillUnmount() {
    }

    loadDataSource() {
        NativeModules.QimRNBModule.getPublicNumberList(
            function (responce) {
                let publicNumberList = responce.publicNumberList;
                this.setState({
                    publicNumberList: publicNumberList,
                });
            }.bind(this)
        );
    }

    _keyExtractor = (item) => {
        return item.PublicNumberId;
    };
    _renderHeaderImage = (info) => {
        return (<Image2 style={styles.itemImage} source={{uri: info.item.HeaderUri}}
                        placeholder={{uri: "robot_default_header"}}/>);
    };

    _itemPress = (info) => {
        let params = {};
        if(info.item.XmppId===''||info.item.XmppId===null){
            return;
        }
        params["NativeName"] = "PublicNumberChat";
        params['PublicNumberId'] = info.item.XmppId;
        NativeModules.QimRNBModule.openNativePage(params);
    };

    _searchBtnPress = () => {
        let params = {};
        params["NativeName"] = "SearchContact";
        NativeModules.QimRNBModule.openNativePage(params);
    };

    _renderItem = (info) => {
        var txt = info.item.Name;
        return (
            <TouchableOpacity key={txt} style={styles.itemRow} onPress={this._itemPress.bind(this, info)}>
                {this._renderHeaderImage(info)}
                <Text style={styles.itemText}>{txt}</Text>
            </TouchableOpacity>
        );
    };

    _renderHeader = () => {
        return (
            <View style={styles.searchHeader}>
                <TouchableOpacity style={styles.searchBtn} onPress={this._searchBtnPress.bind(this)}>
                    <Text style={styles.iconStyle}>{String.fromCharCode(parseInt("0xf407"))}</Text>
                    <Text style={styles.searchBtnText}>搜索</Text>
                </TouchableOpacity>
            </View>
        );
    };

    _renderFooter = () => {
        if (this.state.publicNumberList) {
            return (
                <Text style={styles.footerText}>{this.state.publicNumberList.length + "个公众号"}</Text>
            );
        } else {
            return (<View/>);
        }
    };

    _hiddenRightView = () => {
        this.refs.rightView.hiddenView(function (finish) {
            this.setState({rightViewShow: false});
        }.bind(this));
    };

    //搜索公众号
    _searchPublicNumber = () => {
        NativeModules.QimRNBModule.searchPublicNumber();
    };

    //扫一扫
    _qrCodeClick = () => {
        NativeModules.QimRNBModule.scanQrcode();
    };

    //更多
    _moreClick = () => {

    };

    _renderRightView = () => {
        if (this.state.rightViewShow) {
            return (
                <PNOAnimatedView style={styles.rightView} ref='rightView'>
                    <TouchableWithoutFeedback onPress={() => {
                        this._hiddenRightView();
                    }}>
                        <View style={{flex: 1}}>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.actionView}>
                        <TouchableOpacity style={styles.itemView} onPress={() => {
                            this._qrCodeClick();
                            this._hiddenRightView();
                        }}>
                            <Text style={styles.itemViewText}>扫一扫</Text>
                        </TouchableOpacity>
                        <View style={styles.separatorLine}/>
                        <TouchableOpacity style={styles.itemView} onPress={() => {
                            this._searchPublicNumber();
                            this._hiddenRightView();
                        }}>
                            <Text style={styles.itemViewText}>查找公众号</Text>
                        </TouchableOpacity>
                        <View style={styles.separatorLine}/>
                        <TouchableOpacity style={styles.itemView} onPress={() => {
                            this._moreClick();
                            this._hiddenRightView();
                        }}>
                            <Text style={styles.itemViewText}>更多</Text>
                        </TouchableOpacity>
                    </View>
                </PNOAnimatedView>
            );
        } else {

        }
    };

    render() {
        return (
            <View style={{flex: 1,}}>
                <FlatList
                    style={{flex: 1}}
                    data={this.state.publicNumberList}
                    // extraData={this.state}
                    ItemSeparatorComponent={() => <View style={styles.itemSeparatorLine}></View>}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeader.bind(this)}
                    ListFooterComponent={this._renderFooter.bind(this)}
                />
                {this._renderRightView()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    itemSeparatorLine: {
        height: 1,
        backgroundColor: "#EAEAEA",
    },
    itemRow: {
        height: 56,
        flexDirection: "row",
        backgroundColor: "#FFF",
    },
    itemText: {
        height: 56,
        lineHeight: 56,
        fontSize: 14,
        fontWeight: "400",
        color: "#212121",
        marginLeft: 16,
    },
    footerText: {
        height: 44,
        lineHeight: 44,
        fontSize: 14,
        color: "#999999",
        textAlign: "center",
    },
    itemImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 0.5,
        borderColor: "#E1E1E1",
        marginLeft: 10,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor:"#FF0000",
    },
    searchHeader: {
        height: 50,
        backgroundColor: "#FFF",
    },
    searchBtn: {
        height: 32,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 9,
        backgroundColor: "#E6E6E7",
        borderRadius: 10,
        flexDirection: "row",
    },
    searchBtnText: {
        height: 32,
        lineHeight: 32,
        fontSize: 14,
        color: "#9E9E9E",
    },
    iconStyle: {
        width: 32,
        height: 32,
        lineHeight: 32,
        textAlign: "center",
        color: '#9E9E9E',
        fontFamily: 'QTalk-QChat',
        fontSize: 14,
    },
    addBtnStyle: {
        width: 32,
        height: 32,
        lineHeight: 32,
        textAlign: "center",
        color: '#42CF94',
        fontFamily: 'QTalk-QChat',
        fontSize: 20,
    },
    rightView: {
        position: 'absolute',
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        top: 0,
        left: 0,
        flexDirection: 'row',
    },
    actionView: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 100,
        backgroundColor: '#FFF',
        borderRadius: 5,
        padding: 10,
    },
    itemView: {
        height: 30,
    },
    itemViewText: {
        height: 30,
        lineHeight: 30,
        fontSize: 14,
        fontWeight: '600',
        color: '#212121',
    },
    separatorLine: {
        height: 1,
        backgroundColor: "#EAEAEA",
    },
});
