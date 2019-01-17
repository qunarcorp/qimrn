/*
 * @providesModule Conf/version
 */

'use strict';
import {
    Platform,
} from 'react-native';

const VERSION_INFO = [{
    'ios': {
        version: '0.4.10',
    },
    'android': {
        version: '0.0.8',
    }
}, ];

var getVersionInfo = function() {
    return VERSION_INFO[VERSION_INFO.length - 1][Platform.OS];
};

module.exports = {
    getVersionInfo: getVersionInfo,
};
