import React from 'react';
import {
    Platform,
    NativeModules,
} from 'react-native';
import CookieManager from 'react-native-cookies';

var AppConfig = {
    _projectType: 0,
    _loaded: false,
    _httpHost: null,
    _userId: null,
    _domain: null,
    _ckey: null,
    _clientIp: null,
    _RNAboutView: false,
    _RNMineView: true,
    _RNGroupCardView: true,
    _RNContactView: true,
    _RNSettingView: true,
    _RNUserCardView: true,
    _RNGroupListView: true,
    _RNPublicNumberListView: true,
    _showOrganizational: false,
    _showOA: false,
    _showServiceState: true,
    _isShowWorkWorld: false,
    _isShowRedPackage: true,
    _notNeedShowLeaderInfo: false,
    _notNeedShowMobileInfo: false,
    _notNeedShowEmailInfo: false,
    _showGroupQRCode: true,
    _showLocalQuickSearch: true,
    _isShowRedPackage: true,
    _notNeedShowFriendBtn: false,
    _isQtalk: true,
    _fileUrl: null,
    _qcAdminHost: null,
    _isEasyTrip: false,
    _isiOSIpad: false,
    _isToCManager:false,
    _iPadScreenWidth: 0,
};

// 逆追踪定位
AppConfig.RETROACTIVE_API = "https://apis.map.qq.com/ws/geocoder/v1/?key=342BZ-AS73R-PVQWJ-W234Y-OB6MV-OJB22&get_poi=1&location=";

// 打卡相关接口
AppConfig.CLOCK_ADD_METHOD = "/qtapi/dailymark/add.qunar";
AppConfig.CLOCK_LIST_METHOD = "/qtapi/dailymark/getMultiDayMark.qunar";
AppConfig.CLOCK_DETAIL_METHOD = "/qtapi/dailymark/getOneDayMark.qunar";

let __HttpHost = "http://qt.qunar.com/test_public/public/";
AppConfig.FOUND_SETTING = __HttpHost + "mainSite/HttpApi/appStoreApi.php?action=getAllFoundSetting";
AppConfig.APP_CHECK = __HttpHost + "mainSite/HttpApi/appStoreApi.php?action=appCheck";

AppConfig.checkConfig = function () {
    if (__DEV__) {
        // debug模式
        if (!this._httpHost) {
            alert("未设置HttpHost");
        }
        if (!this._userId) {
            alert("未设置UserId");
        }
        if (!this._domain) {
            alert("未设置Domain");
        }
        if (!this._ckey) {
            alert("未设置Ckey");
        }
        if (!this._clientIp) {
            alert("未设置Clinet Ip");
        }
    } else {

    }
}

AppConfig.initConfig = function () {
    return new Promise(function (resolve, reject) {
        let QimRNBModule = NativeModules.QimRNBModule;
        QimRNBModule.appConfig(function (config) {
            // console.log("Config 输出")
            // console.log(config);
            this._projectType = parseInt(config.projectType);
            // console.log("projectType === " + this._projectType);
            this._httpHost = config.httpHost;
            this._userId = config.userId;
            this._domain = config.domain;
            this._ckey = config.ckey;
            this._clientIp = config.clientIp;
            this._showServiceState = config.showServiceState;
            this._isQtalk = config.isQtalk;
            this._isShowWorkWorld = config.isShowWorkWorld;
            this._notNeedShowLeaderInfo = config.notNeedShowLeaderInfo;
            this._notNeedShowEmailInfo = config.notNeedShowEmailInfo;
            this._notNeedShowMobileInfo = config.notNeedShowMobileInfo;
            this._fileUrl = config.fileUrl;
            this._qcAdminHost = config.qcAdminHost;
            this._isEasyTrip = Boolean(config.isEasyTrip);
            this._RNContactView = parseInt(config.RNContactView);
            // console.log("_RNContactView === " + this._RNContactView);

            this._RNMineView = parseInt(config._RNMineView);
            // console.log("_RNMineView === " + this._RNMineView);

            this._RNSettingView = parseInt(config.RNSettingView);
            // console.log("_RNSettingView === " + this._RNSettingView);

            this._RNAboutView = parseInt(config.RNAboutView);
            // console.log("_RNAboutView === " + this._RNAboutView);

            this._RNGroupCardView = parseInt(config.RNGroupCardView);
            // console.log("_RNGroupCardView === " + this._RNGroupCardView);

            this._RNUserCardView = parseInt(config.RNUserCardView);
            // console.log("_RNUserCardView === " + this._RNUserCardView);

            this._RNGroupListView = Boolean(config.RNGroupListView);
            // console.log("_RNGroupListView === " + this._RNGroupListView);

            this._RNPublicNumberListView = Boolean(config.RNPublicNumberListView);
            // console.log("_RNPublicNumberListView === " + this._RNPublicNumberListView);

            this._showOrganizational = Boolean(config.showOrganizational);
            // console.log("_showOrganizational === " + this._showOrganizational);

            this._showGroupQRCode = Boolean(config.isShowGroupQRCode);

            this._showLocalQuickSearch = Boolean(config.isShowLocalQuickSearch);

            this._showOA = parseInt(config.showOA);
            // console.log("_showOA === " + this._showOA);
            this._isShowRedPackage = Boolean(config.isShowRedPackage);

            this._isiOSIpad = Boolean(config.isiOSIpad);

            this._iPadScreenWidth = parseInt(config.ScreenWidth);

            this._isToCManager = Boolean(config.isToCManager);

            this.checkConfig();
            this._loaded = true;
            // if (Platform.OS == 'android') {
            //     CookieManager.setFromResponse(
            //         this._httpHost,
            //         'q_ckey='+this._ckey+'; path=/; expires=Thu, 1 Jan 2030 00:00:00 -0000; secure; HttpOnly')
            //         .then((res) => {
            //             // `res` will be true or false depending on success.
            //             console.log('CookieManager.setFromResponse =>', res);
            //         });
            // } else {
            CookieManager.set({
                name: 'q_ckey',
                value: this._ckey,
                domain: this._domain,
                origin: this._domain,
                path: '/',
                version: '1',
                expiration: '2099-05-30T12:30:00.00-05:00'
            }).then((res) => {
                // console.log('CookieManager.set =>', res);
            });
            // }
            resolve();
        }.bind(this));
    }.bind(this));
}

AppConfig.getQCAdminHost = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    if (this._qcAdminHost == null || this._qcAdminHost == '') {
        this._qcAdminHost = "https://qcadmin.qunar.com";
    }
    return this._qcAdminHost;
}

AppConfig.getShowServiceState = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._showServiceState;
}

AppConfig.isQtalk = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._isQtalk;
}


AppConfig.isEasyTrip = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._isEasyTrip;
}

AppConfig.isShowWorkWorld = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._isShowWorkWorld;
}

AppConfig.isShowRedPackage = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._isShowRedPackage;
}

AppConfig.notNeedShowLeaderInfo = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._notNeedShowLeaderInfo;
}

AppConfig.notNeedShowMobileInfo = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._notNeedShowMobileInfo;
}

AppConfig.notNeedShowEmailInfo = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._notNeedShowEmailInfo;
}

AppConfig.notNeedShowFriendBtn = function () {
    if (!this._notNeedShowFriendBtn) {
        this.initConfig();
    }
    return this._notNeedShowFriendBtn;
}

AppConfig.showGroupQRCode = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._showGroupQRCode;
}

AppConfig.showLocalQuickSearch = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._showLocalQuickSearch;
}

AppConfig.isShowRedPackage = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._isShowRedPackage;
}

AppConfig.getProjectType = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._projectType;
}

AppConfig.getRNContactView = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._RNContactView;
}

AppConfig.getRNMineView = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._RNMineView;
}

AppConfig.getRNSettingView = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._RNSettingView;
}

AppConfig.getIsQtalk = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._isQtalk;
}

AppConfig.getRNAboutView = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._RNAboutView;
}

AppConfig.getRNGroupCardView = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._RNGroupCardView;
}

AppConfig.getRNGroupListView = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._RNGroupListView;
}

AppConfig.getRNPublicNumberListView = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._RNPublicNumberListView;
}

AppConfig.getRNUserCardView = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._RNUserCardView;
}

AppConfig.getShowOA = function () {
    if (!this._loaded) {
        this.initConfig();
    }
    return this._showOA;
}

AppConfig.getShowOrganizational = function () {
    if (!this._loaded) {
        // alert("getshowOrg");
        this.initConfig();
    }
    return this._showOrganizational;
}

AppConfig.getHttpHost = function () {
    if (!this._loaded) {
        // alert("getHttpHost");
        this.initConfig();
    }
    return this._httpHost;
}

AppConfig.getUserId = function () {
    if (!this._loaded) {
        // alert("getUserId");
        this.initConfig();
    }
    return this._userId;
}

AppConfig.isToCManager = function(){
    if(!this._loaded){
        this.initConfig();
    }
    return this._isToCManager;
}

AppConfig.getDomain = function () {
    if (!this._loaded) {
        // alert("getDomain");
        this.initConfig();
    }
    return this._domain;
}

AppConfig.getQCkey = function () {
    if (!this._loaded) {
        // alert("getQCkey");
        this.initConfig();
    }
    return this._ckey;
}

AppConfig.getClientIp = function () {
    if (!this._loaded) {
        // alert("getClientIp");
        this.initConfig();
    }
    return this._clientIp;
}

AppConfig.isIosIpad = async function () {
    if (!this._loaded) {
        // alert("getClientIp");
        await this.initConfig()
    }
    return this._isiOSIpad

    // return this._isiOSIpad;
}

AppConfig.getiPadWidth = function () {
    if (!this._loaded) {
        // alert("getClientIp");
        this.initConfig().then(function () {
            return this._iPadScreenWidth
        });
    } else {
        return this._iPadScreenWidth;
    }
}

AppConfig.exitClockIn = function () {
    let QimRNBModule = NativeModules.QimRNBModule;
    QimRNBModule.exitApp("ClockIn");
}

AppConfig.exitTotp = function () {
    let QimRNBModule = NativeModules.QimRNBModule;
    QimRNBModule.exitApp("TOTP");
}

AppConfig.exitApp = function (moduleName) {
    let QimRNBModule = NativeModules.QimRNBModule;
    QimRNBModule.exitApp(moduleName);
}

AppConfig.updateRemoteKey = function () {
    return new Promise(function (resolve, reject) {
        let QimRNBModule = NativeModules.QimRNBModule;
        QimRNBModule.updateRemoteKey(function () {
            resolve();
        }.bind(this));
    }.bind(this));
}

AppConfig.moduleHandle = NativeModules.QimRNBModule;

export default AppConfig;