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

import MySetting from './MySetting';
import Setting from './Setting';
import About from './About';
import MyCard from './MyCard';
import PersonalSignature from './PersonalSignature';
import UserQRCode from './UserQRCode';
import AdviceAndFeedback from './AdviceAndFeedback';
import checkVersion from "./../conf/AutoUpdateRNBundle";
import ServiceState from "./ServiceState";
import NotificationSetting from './NotificationSetting'
import PrivacySetting from './PrivacySetting'

export default class App extends Component {
    constructor(props) {
        super(props);

        YellowBox.ignoreWarnings([
            'Warning: componentWillMount is deprecated',
            'Warning: componentWillReceiveProps is deprecated',
        ]);

        let route = {name:this.props.Screen?this.props.Screen:"MySetting"};
        let initData = {groupId: this.props.groupId};
        this.AppStack = StackNavigator({
            // 设置页
            'MySetting': {
                screen: MySetting,
            },
            // 设置
            'Setting':{
                screen:Setting,
            },
            // 关于
            'About':{
                screen:About,
            },
            // 个人资料
            'MyCard':{
                screen:MyCard,
            },
            // 个性签名
            'PersonalSignature':{
                screen:PersonalSignature,
            },
            // 二维码名片
            'UserQRCode':{
                screen:UserQRCode,
            },
            // 建议和反馈
            'AdviceAndFeedback':{
                screen:AdviceAndFeedback,
            },
            //服务状态设置
            'ServiceState':{
                screen:ServiceState
            },
            //通知设置
            'NotificationSetting':{
              screen:NotificationSetting
            },
            'PrivacySetting':{
                screen:PrivacySetting
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
        console.log("MySetting componentDidMount");
        if (this.willShow) {
            this.willShow.remove();
        }
        this.willShow = NativeAppEventEmitter.addListener(
            'QIM_RN_Check_Version',
            () => {
                console.log("MySetting QIM_RN_Check_Version");
                checkVersion.autoCheckRNVersion();
            }
        );
    }

    componentWillUnmount() {
        console.log("MySetting componentWillUnmount");
        this.willShow.remove();
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <this.AppStack {...this.props}/>
            </View>
        )
    }
}