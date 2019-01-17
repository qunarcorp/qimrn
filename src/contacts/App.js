import React, {Component} from 'react';
import {
    Platform,
    View,
    BackHandler,
    UIManager,
    NativeModules,
    YellowBox, NativeAppEventEmitter,
} from 'react-native';
import {StackNavigator,NavigationActions} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import Contacts from './contacts';
import Search from './Search';
import GroupList from './GroupList';
import PublicNumberList from './PublicNumberList';
import StarContact from './StarContact'
import StarContactAdd from './StarContactAdd'
import BlackContacts from './BlackContacts'
import checkVersion from "./../conf/AutoUpdateRNBundle";
import AppConfig from "../common/AppConfig";
import UserCard from "../userCard/UserCard";
import UserSetting from "../userCard/UserSetting";

export default class App extends Component {
    constructor(props) {
        super(props);
        YellowBox.ignoreWarnings([
            'Warning: componentWillMount is deprecated',
            'Warning: componentWillReceiveProps is deprecated',
        ]);

        let route = {name:this.props.Screen?this.props.Screen:"Contacts"};
        let initData = {groupId: this.props.groupId,
                        domainUrl:this.props.domainUrl,
                        isFromShare:this.props.isFromShare,
                        ShareData:this.props.ShareData,
                        sel_trans_user:this.props.sel_trans_user,
                        trans_msg:this.props.trans_msg};
        this.AppStack = StackNavigator({
            // 设置页
            'Contacts': {
                screen: Contacts,
            },
            'Search': {
                screen: Search,
            },
            'GroupList': {
                screen: GroupList,
            },
            'PublicNumberList': {
                screen: PublicNumberList,
            },
            // 个人名片
            'UserCard':{
                screen:UserCard,
            },
            //设置
            'UserSetting':{
                screen:UserSetting,
            },
            'StarContact':{
                screen:StarContact,
            },
            'StarContactAdd':{
                screen:StarContactAdd,
            },
            'BlackContacts':{
                screen:BlackContacts,
            }
        }, {
            mode:'card',
            headerMode:'screen',
            initialRouteName: route.name,
            initialRouteParams: initData,
            transitionConfig: () => ({screenInterpolator: CardStackStyleInterpolator.forHorizontal})
        });

        let stateIndex;
        const defaultGetStateForAction = this.AppStack.router.getStateForAction;
        this.AppStack.router.getStateForAction = (action, state) => {
            if (state) {
                stateIndex = state.index;
                if (action.type === NavigationActions.BACK) {
                    if (stateIndex == 0) {
                        if (Platform.OS === 'ios') {
                            NativeModules.ExitApp.exitApp(() => {}, () => {});
                        } else {
                            BackHandler.exitApp();
                        }
                        return;
                    }
                }
            }
            return defaultGetStateForAction(action, state);
        };
    }

    componentDidMount() {
        this.willShow = NativeAppEventEmitter.addListener(
            'QIM_RN_Check_Version',
            () => {
                // console.log("Contacts QIM_RN_Check_Version");
                checkVersion.autoCheckRNVersion();
            }
        );
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <this.AppStack {...this.props}/>
            </View>
        )
    }
}