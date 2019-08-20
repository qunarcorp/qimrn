'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    Image,
    Picker,
    TouchableOpacity, Alert, DeviceEventEmitter, NativeModules,
} from 'react-native';
import NavCBtn from './../common/NavCBtn'
import HttpTools from './../common/HttpTools';
import AppConfig from "../common/AppConfig";
let deaultHeaderUrl = '/file/v2/download/perm/3ca05f2d92f6c0034ac9aee14d341fc7.png';
export default class Search extends Component {
    static navigationOptions = ({navigation}) => {
        let headerTitle = "搜索";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"Contacts"}/>);
        if (navigation.state.params.innerVC) {
            let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
            leftBtn = (<NavCBtn {...props}/>);
        }
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
        this.searchStr = '';
        this.state = {
            url : this.props.navigation.state.params.domainUrl,
            domainDatas : [],
            domainSelectValue :"",
            domainDescription:"",
            domainPosition:0,
            offset:0,
            searchData : [],
        };
    }

    componentDidMount() {
        this._getDomainList();
    }


    componentWillUnmount() {
    }

    _getDomainList(){
        NativeModules.QimRNBModule.getDomainList(function (response) {
            if (response.ret) {
                let jsonData = response.domains;
                this.setState({
                    domainDatas:jsonData,
                    domainSelectValue:jsonData[0].name,
                    domainDescription:jsonData[0].description,
                });
                this.domainDatas = jsonData;
            } else {
                Alert.alert("提示","请求数据失败：" + response.errmsg);
            }
        }.bind(this));
        // let formData = new FormData();
        // formData.append("version",0);
        //
        // var headers = new Headers();
        // headers.append("Cookie", "q_ckey=" + AppConfig._ckey);
        //
        // HttpTools.postJson(this.state.url,formData,headers).then(function (response) {
        //     if (response.ret) {
        //         let jsonData = response.data.domains;
        //         this.setState({
        //             domainDatas:jsonData,
        //             domainSelectValue:jsonData[0].name,
        //             domainDescription:jsonData[0].description,
        //         });
        //         this.domainDatas = jsonData;
        //     } else {
        //         Alert.alert("提示","请求数据失败：" + response.errmsg);
        //     }
        // }.bind(this), function (error) {
        //     Alert.alert("提示","请求数据失败：" + error);
        // });
    }

    _searchChangeText(text) {
        this.searchStr = text;
        this.state.searchData = [];
    }

    _searchUser(){
        this._switchData();
        if(this.searchStr === null || this.searchStr === '' ){
            return;
        }
        NativeModules.QimRNBModule.searchDomainUser(this.url,this.id,this.searchStr,this.state.offset,20,function (response) {
            if (response.ret) {
                this.tempData = response.users;
                        if(this.state.searchData.length == 0){
                            this.userDatas = this.tempData;
                        }else {
                            for(var i = 0;i<this.tempData.length;i++){
                                this.userDatas.push(this.tempData[i]);
                            }
                        }
                        this.setState({
                            searchData:this.userDatas,
                        });
            } else {
                Alert.alert("提示","请求数据失败：" + response.errmsg);
            }
        }.bind(this));
        // let formData = new FormData();
        // formData.append("id",this.id);
        // formData.append("key",this.searchStr);
        // formData.append("offset",this.state.offset);
        // formData.append("limit",20);
        // let headers = {
        //     q_ckey : AppConfig._ckey,
        // }
        // HttpTools.postJson(this.url,formData,headers).then(function (response) {
        //     if (response.ret) {
        //         this.tempData = response.data.users;
        //         if(this.state.searchData.length == 0){
        //             this.userDatas = this.tempData;
        //         }else {
        //             for(var i = 0;i<this.tempData.length;i++){
        //                 this.userDatas.push(this.tempData[i]);
        //             }
        //         }
        //         this.setState({
        //             searchData:this.userDatas,
        //         });
        //     } else {
        //         Alert.alert("提示","请求数据失败：" + response.errmsg);
        //     }
        // }.bind(this), function (error) {
        //     Alert.alert("提示","请求数据失败：" + error);
        // });
    }

    _onloadMore(){
        this.state.offset++;
        this._searchUser();
    }
    _switchData() {
        let position = this.state.domainPosition;
        this.url = this.state.domainDatas[position].url;
        this.id = this.state.domainDatas[position].id;
    }

    pickerItemRender(dataArr) {
        var pickerItemArr = [];
        for (var i = 0; i < dataArr.length; i++) {
            pickerItemArr.push(
                <Picker.Item key={i} label={dataArr[i].name} value={dataArr[i].name}/>
            );
        }
        return pickerItemArr;
    }

    render(){
        return(
            <View style={styles.wrapper}>
                <View style={styles.search}>
                    <Picker
                        mode = {'dropdown'}
                        style={styles.picker}
                        selectedValue = {this.state.domainSelectValue}
                        onValueChange = {(value,position)=>this.setState({
                            domainSelectValue:value,
                            domainPosition:position,
                            domainDescription:this.domainDatas[position].description,
                            searchData:[],
                            offset:0,
                        })}>
                        {this.pickerItemRender(this.state.domainDatas)}
                    </Picker>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入搜索关键词"
                        returnKeyType="search"
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        clearButtonMode="while-editing"
                        onChangeText={(text) => {this._searchChangeText(text);}}
                        onSubmitEditing={this._searchUser.bind(this)}
                        //Warning clear时候没有回调
                    />
                </View>

                {/*<Text style={styles.description}>备注：({this.state.domainDescription})</Text>*/}
                <FlatList
                    ref={(ref)=>this._flatList = ref}
                    ListFooterComponent={this._footer}
                    ItemSeparatorComponent={this._separator}
                    renderItem={this._renderItem}
                    refreshing={false}
                    // onEndReachedThreshold={0.5}
                    // onEndReached={
                    //     this._onloadMore()
                    // }
                    data={this.state.searchData}>
                </FlatList>
            </View>
        );
    }
    _openUserCard(userId){
        this.props.navigation.navigate('UserCard', {
            'UserId': userId,
            'innerVC': true,
        });
    }

    _parseHeaderUri(uri){
        if(uri===null || uri===''){
            return AppConfig._fileUrl + deaultHeaderUrl;
        }
        if(uri.indexOf("http") == 0){
            return uri;
        }else if(uri.indexOf("/") == 0) {
            return AppConfig._fileUrl + uri;
        }else {
            return AppConfig._fileUrl + "/" +  uri;
        }
    }
    _renderItem = ({item}) => {
        return <TouchableOpacity style={styles.renderItem} onPress={() => {
            this._openUserCard(item.uri)
        }}>
            <Image style={styles.itemImage} source={{uri: this._parseHeaderUri(item.icon)}}/>
            <Text>{item.name===undefined?item.content:item.name}</Text>
        </TouchableOpacity>

    };

    _footer = () => {
        // this.tempData === undefined || this.tempData === null || this.tempData.length<20
        if(true){//暂时不支持分页
            return <View></View>;
        }else {
            return <TouchableOpacity style={styles.footer} onPress={() => {
                this._onloadMore()
            }}>
                <Text>点击加载更多...</Text>
            </TouchableOpacity>
        }
    }

    _separator = () => {
        return <View style={{height:1,backgroundColor:'#ccc'}}/>;
    }
}
var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    search:{
        flexDirection:"row",
        marginTop:10,
        backgroundColor:"white",
        padding:10,
    },
    input: {
        height: 36,
        flex:1,
        marginLeft:10,
        marginRight: 10,
        backgroundColor:"white",
        borderRadius:10,
        borderWidth: 1,
        paddingLeft: 5,
        borderColor: '#ccc',
        alignItems:"center",
    },
    picker:{
        width:150,
        height:36,
        marginRight:10,
    },
    description:{
        color:"red",
        padding:5,
        backgroundColor:"white",
        fontSize:12,
    },
    footer:{
        flex:1,
        flexDirection:"row",
        height:50,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems:'center',
        justifyContent:"center",
    },
    itemImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        marginRight:10,
        alignItems:"center",
        justifyContent:"center",
    },
    renderItem:{
        flex:1,
        flexDirection:"row",
        height:50,
        padding:5,
        alignItems:"center",
    }
});