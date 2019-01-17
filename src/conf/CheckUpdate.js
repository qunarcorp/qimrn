/*
 * @providesModule conf/CheckUpdate
 */
'use strict';
import React from 'react';
import {
    Platform,
    NativeModules,
} from 'react-native';
import Version from './../conf/Version'
import HttpTools from './../common/HttpTools'
import apiConfig from './../conf/api'

let CheckUpdate = NativeModules.QIMRnCheckUpdate;

const PLATFORM_MAPPING = {
    'ios': 'iOS',
    'android': 'Android',
};

var checkToUpdate = function(callback) {
    const bundleVersion = Version.getVersionInfo();
    const versionId = bundleVersion.version;
    const platform = PLATFORM_MAPPING[Platform.OS];

    let checkUpdateUrl = apiConfig['update'].checkUpdate.replace('{VERSION}', versionId).replace('{PLATFORM}', platform).replace('{APP}', "qtalkrn");
    console.log("请求QIMRn检查更新 : " + checkUpdateUrl);
    HttpTools.get(checkUpdateUrl).then(function (response) {
            console.log(response);
            if (!response.errorCode) {
                let data = response.data;
                callback && callback(data)
                console.log("请求QIMRn Bundle包检查更新成功");
            } else {
                console.log("请求QIMRn Bundle包检查更新失败");
            }
        }.bind(this),
        function (error) {
            console.log(error)
        }.bind(this)
    );
}

var update = function (param, callback) {
    CheckUpdate.update(param, function (data) {
        callback && callback(data);
    });
};

module.exports = {
    checkToUpdate: checkToUpdate,
    update: update,
};