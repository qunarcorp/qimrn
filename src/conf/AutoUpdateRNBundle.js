import checkVersion from "./../conf/CheckUpdate";

var autoCheckRNVersion = () => {
    var callback = function (param) {

        if (param['new']) {
            param['update_type'] = 'auto';
            const url = param['bundleUrl'];
            // bundle name after unzip
            param['bundleName'] = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));

            checkVersion.update(param, (ret) => {

            });
        }
    }
    checkVersion.checkToUpdate(callback);
};

module.exports = {
    autoCheckRNVersion: autoCheckRNVersion,
}