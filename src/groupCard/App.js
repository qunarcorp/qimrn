import React, {Component} from 'react';
import {
    Platform,
    View,
    BackHandler,
    UIManager,
    NativeModules, NativeAppEventEmitter,
    DeviceEventEmitter,
} from 'react-native';
import GroupCard from './GroupCard';
import GroupMembers from './GroupMembers';
import GroupMemberAdd from './GroupMemberAdd';
import GroupNameSetting from './GroupNameSetting';
import GroupTopicSetting from './GroupTopicSetting';
import GroupQRCode from './GroupQRCode';
import UserCard from './../userCard/UserCard';
import RemarkSetting from './../userCard/RemarkSetting';
import checkVersion from "./../conf/AutoUpdateRNBundle";

import {StackNavigator,NavigationActions} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import UserSetting from "../userCard/UserSetting";
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends Component {
    constructor(props) {
        super(props);

        let route = {name:this.props.Screen?this.props.Screen:"GroupCard"};
        let initData = {groupId: this.props.groupId,
            permissions:this.props.permissions,
            isFromShare:this.props.isFromShare,
            ShareData:this.props.ShareData,
            sel_trans_user:this.props.sel_trans_user,
            trans_msg:this.props.trans_msg
        };
        this.AppStack = StackNavigator({
            // UserCard
            'GroupCard': {
                screen: GroupCard,
            },
            // 群成员
            'GroupMembers':{
                screen: GroupMembers,
            },
            //增加群成员
            'GroupMemberAdd':{
                screen:GroupMemberAdd,
            },
            // 群名设置
            'GroupNameSetting':{
                screen: GroupNameSetting,
            },
            // 群公告设置
            'GroupTopicSetting':{
                screen:GroupTopicSetting,
            },
            // 群二维码名片
            'GroupQRCode':{
                screen:GroupQRCode,

            },
            // 个人名片
            'UserCard':{
                screen:UserCard,
            },
            //设置
            'UserSetting':{
                screen:UserSetting,
            },
            // 备注设置
            'RemarkSetting':{
                screen: RemarkSetting,
            },

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
                // console.log("GroupCard QIM_RN_Check_Version");
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