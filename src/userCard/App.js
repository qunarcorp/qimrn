import React, {Component} from 'react';
import {
    Platform,
    View,
    BackHandler,
    UIManager,
    NativeModules, NativeAppEventEmitter,
} from 'react-native';
import UserCard from './UserCard';
import RemarkSetting from './RemarkSetting';
import UserMedal from './UserMedal';
import ChatInfo from './ChatInfo';
import checkVersion from "./../conf/AutoUpdateRNBundle";
import GroupMemberAdd from './../groupCard/GroupMemberAdd';
import UserSetting from './UserSetting'

import {StackNavigator,NavigationActions} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends Component {
    constructor(props) {
        super(props);

        let route = {name:this.props.Screen?this.props.Screen:"UserCard"};
        // let initData = this.props.UserInfo;
        // console.log("initData");
        // console.log(initData);
        this.AppStack = StackNavigator({
            // UserCard
            'UserCard': {
                screen: UserCard,
            },
            // 备注设置
            'RemarkSetting':{
                screen: RemarkSetting,
            },
            //用户勋章
            'UserMedal': {
                screen: UserMedal,
            },
            // 聊天信息
            'ChatInfo':{
                screen: ChatInfo,
            },
            //添加群成员页面
            'GroupMemberAdd':{
                screen:GroupMemberAdd,
            },
            //设置
            'UserSetting':{
                screen:UserSetting,
            }

        }, {
            mode:'card',
            headerMode:'screen',
            initialRouteName: route.name,
            initialRouteParams: this.props,
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
                console.log("UserCard QIM_RN_Check_Version");
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