'use strict';

import React, {Component} from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    NativeModules,
    ScrollView, DeviceEventEmitter,
} from 'react-native';
import NavCBtn from './../common/NavCBtn'

export default class GroupList extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "群组";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"Contacts"}/>);
        return {
            headerTitle: headerTitle,
            headerLeft: leftBtn,
        };
    };


    constructor(props) {
        super(props);
        this.state = {
            groupList: [],
            //for android share or transfer start
            isShare : this.props.navigation.state.params.isFromShare,
            shareMsg : this.props.navigation.state.params.ShareData,
            isTrans : this.props.navigation.state.params.sel_trans_user,
            transMsg : this.props.navigation.state.params.trans_msg,
            //for android share or transfer end
        };
    }

    componentDidMount() {
        this.loadDataSource();
        this.exit = DeviceEventEmitter.addListener('Del_Destory_Muc', function (params) {
            this.loadDataSource();
        }.bind(this));
    }


    componentWillUnmount() {
    }

    loadDataSource() {
        NativeModules.QimRNBModule.getGroupList(
            function (responce) {
                let groupList = responce.groupList;
                this.setState({
                    groupList: groupList,
                });
            }.bind(this)
        );
    }

    _keyExtractor = (item) => {
        return item.GroupId;
    };
    _renderHeaderImage = (info) => {
        return (<Image style={styles.itemImage} source={{uri: info.item.HeaderUri}}/>);
    };

    _itemPress = (info) => {
        let params = {};
        if(info.item.GroupId===''||info.item.GroupId===null){
            return;
        }
        params["NativeName"] = "GroupChat";
        params['GroupId'] = info.item.GroupId;

        //for android transfer or share
        params["isFromShare"] = this.state.isShare;
        params["ShareData"] = this.state.shareMsg;
        params["sel_trans_user"] = this.state.isTrans;
        params["trans_msg"] = this.state.transMsg;
        NativeModules.QimRNBModule.openNativePage(params);
    };

    _renderItem = (info) => {
        var txt = "";
        if (info.item.title) {
            txt = info.item.title;
        } else {
            txt = info.item.Name;
        }
        return (
            <TouchableOpacity key={txt} style={styles.itemRow} onPress={this._itemPress.bind(this, info)}>
                {this._renderHeaderImage(info)}
                <Text style={styles.itemText}>{txt}</Text>
            </TouchableOpacity>
        );
    };

    //根据关键字搜索群组
    searchGroupByText() {
        if(this.searchText===''||this.searchText===null) {
            return;
        }
// console.log("开始进行数据搜索:");
//         console.log(this.searchText);
        NativeModules.QimRNBModule.searchGroupListWithKey(this.searchText, function (response) {
            let groupList = response.groupList;
            this.setState({
                groupList : groupList,
            });
        }.bind(this));
    };

    searchChangeText(text) {
        // console.log("开始进行数据搜索:");
        this.searchText = text;
        if (text.length === 0) {
            this.loadDataSource();
        } else {

        }
    }

    // _renderHeader = () => {
    //     return (
    //     );
    // };

    _renderFooter = () => {
        if (this.state.groupList){
            return (
                <Text style={styles.footerText}>{this.state.groupList.length+"个群组"}</Text>
            );
        } else {
            return (<View/>);
        }
    };

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <View style={styles.flex}>
                    <View style={styles.searchHeader}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="请输入搜索关键词"
                            returnKeyType="search"
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            clearButtonMode="while-editing"
                            onChangeText={(text) => {this.searchChangeText(text);}}
                            onSubmitEditing={this.searchGroupByText.bind(this)}
                            // value={this.searchText}
                            //Warning clear时候没有回调
                        />
                    </View>
                </View>
                <FlatList
                    style={{flex:1}}
                    data={this.state.groupList}
                    // extraData={this.state}
                    ItemSeparatorComponent={() => <View style={styles.itemSeparatorLine}></View>}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    // ListHeaderComponent={this._renderHeader.bind(this)}
                    ListFooterComponent={this._renderFooter.bind(this)}
                />
            </ScrollView>
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
        marginLeft: 10,
    },
    footerText:{
        height:44,
        lineHeight:44,
        fontSize:14,
        color:"#999999",
        textAlign:"center",
    },
    itemImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        marginLeft: 10,
        marginTop: 10,
        alignItems:"center",
        justifyContent:"center",
    },
    searchHeader: {
        height: 56,
        backgroundColor:"#e6e7e9",
    },
    searchInput: {
        height: 36,
        marginLeft:10,
        marginRight: 10,
        marginTop:9,
        backgroundColor:"white",
        borderRadius:10,
        flexDirection:"row",
        borderWidth: 1,
        paddingLeft: 5,
        borderColor: '#ccc',
    }
});
