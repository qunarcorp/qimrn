import React, {Component} from 'react';
import {
    Platform,
    View,
    BackHandler,
    UIManager,
    NativeModules, NativeAppEventEmitter,
    DeviceEventEmitter,
} from 'react-native';
import TravelCalendar from './TravelCalendar';
import TripDetails from './TripDetails';
import CreateTrip from './CreateTrip';
import {TripRoomSelect} from './TripRoomSelect';
import {TripAttendeesSelect} from './TripAttendeesSelect';
import {TripTypeSelect} from './TripTypeSelect';
import {TripAreaSelect} from "./TripAreaSelect";
import {TripCitySelect} from "./TripCitySelect";

import {StackNavigator, NavigationActions} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import checkVersion from "./../conf/AutoUpdateRNBundle";

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);


export default class App extends Component {
    constructor(props) {
        super(props);

        let route = {name: this.props.Screen ? this.props.Screen : "TravelCalendar"};
        let initData = {
            canshu:this.props.canshu,
            groupId: this.props.groupId,
            permissions: this.props.permissions,
            isFromShare: this.props.isFromShare,
            ShareData: this.props.ShareData,
            sel_trans_user: this.props.sel_trans_user,
            trans_msg: this.props.trans_msg
        };
        this.AppStack = StackNavigator({

            'TravelCalendar': {
                screen: TravelCalendar,
            },
            'TripDetails': {
                screen: TripDetails,
            },
            'CreateTrip':{
                screen: CreateTrip,
            },
            'TripRoomSelect':{
                screen:TripRoomSelect,
            },
            'TripAttendeesSelect':{
                screen:TripAttendeesSelect,
            },
            'TripTypeSelect':{
                screen:TripTypeSelect,
            },
            'TripAreaSelect':{
                screen:TripAreaSelect,
            },
            'TripCitySelect':{
                screen:TripCitySelect,
            },


        }, {
            mode: 'card',
            headerMode: 'screen',
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
                            NativeModules.ExitApp.exitApp(() => {
                            }, () => {
                            });
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