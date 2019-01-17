import React, {Component} from 'react';
import {
    AppRegistry,
} from 'react-native';


// 打卡应用
import ClockInApp from './src/clock_in/App';
AppRegistry.registerComponent('ClockIn', () => ClockInApp);

// 2FA
import TotpApp from './src/totp/App';
AppRegistry.registerComponent('TOTP', () => TotpApp);

// 个人名片模块
import UserCard from './src/userCard/App';
AppRegistry.registerComponent('UserCard', () => UserCard);

// 群名片
import GroupCard from './src/groupCard/App';
AppRegistry.registerComponent('GroupCard', () => GroupCard);

// 个人设置
import MySetting from './src/mySetting/App';
AppRegistry.registerComponent('MySetting', () => MySetting);

// 发现页
import FoundPage from './src/found/App';
AppRegistry.registerComponent('FoundPage', () => FoundPage);

// 浏览器
import WebView from './src/webView/App';
AppRegistry.registerComponent('WebView', () => WebView);

// 联系人
import Contacts from './src/contacts/App';
AppRegistry.registerComponent('Contacts', () => Contacts);

// 测试页面
import TestPage from './src/testApp/App';
AppRegistry.registerComponent('TestPage', () => TestPage);

// 行程日历
import TravelCalendar from './src/calendar/App';
AppRegistry.registerComponent('TravelCalendar', () => TravelCalendar);

//客服系统相关
import Merchant from './src/merchant/App';

AppRegistry.registerComponent('Merchant', () => Merchant);

//搜索
import Search from './src/search/App';
AppRegistry.registerComponent("Search",() => Search);