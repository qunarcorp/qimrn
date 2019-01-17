import React, {Component} from 'react';
import {
    Platform,
    View,
    BackHandler,
    UIManager, NativeAppEventEmitter,
} from 'react-native';
import Seats from './Seats';
import checkVersion from "./../conf/AutoUpdateRNBundle";

import {StackNavigator,NavigationActions} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import TransferReason from './TransferReason';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends Component {
    constructor(props) {
        super(props);

        let route = {name:this.props.Screen?this.props.Screen:"Seats"};
        let initData = {
            shopJid:this.props.shopJid,
            customerName:this.props.customerName,
        };
        this.AppStack = StackNavigator({
            'Seats': {
                screen: Seats,
            },
            'TransferReason': {
                screen: TransferReason,
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
                // console.log("Totp QIM_RN_Check_Version");
                checkVersion.autoCheckRNVersion();
            }
        );
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <this.AppStack />
            </View>
        )
    }
}