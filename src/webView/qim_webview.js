import React, {Component} from 'react';
import {
    View,
    WebView,
    StyleSheet,
    ActivityIndicator,
    Platform,
    Dimensions,
    Alert,
} from 'react-native';

import createInvoke from './native.js'
import MD5 from 'crypto-js/md5'
import Buffer from 'buffer'
import HttpTools from "../common/HttpTools";
import AppConfig from "../common/AppConfig";
import NavCBtn from "../common/NavCBtn";

// 解决 PostMessage 问题 <WebView injectedJavaScript={patchPostMessageJsCode} />
const patchPostMessageFunction = () => {
    const originalPostMessage = window.postMessage;
    const patchedPostMessage = (message, targetOrigin, transfer) => {
        originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = () => String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    window.postMessage = patchedPostMessage;
};
const patchPostMessageJsCode = `(${String(patchPostMessageFunction)})();`;

const {height, width} = Dimensions.get('window');

class QIMWebViewLoading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: false,
        };
    }

    render() {
        if (!this.state.hidden) {
            return (
                <View style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: "#FFF"
                }}>
                    <ActivityIndicator
                        color='#009688'
                        size='large'
                        style={styles.ActivityIndicatorStyle}
                    />
                </View>
            );
        } else {
            return undefined;
        }
    }
}

export default class QIMWebView extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = `${navigation.state.params.title ? navigation.state.params.title : ""}`;
        let leftBtn;
        if (navigation.state.params.canGoBack) {
            leftBtn = (<NavCBtn
                btnType={NavCBtn.WEB_BACK_BUTTON} moduleName={"WebView"}
                onPress={()=>{navigation.state.params.webBackPress();}}/>);
        } else {
            leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"WebView"}/>);
        }
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
        };
    };

    constructor(props) {
        super(props);
        this.unmount = false;
        this.appId = this.props.appId;
        this.url = this.props.navigation.state.params.Url;
        this.state = {
            url: this.url,
            status: '',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
            scalesPageToFit: true,
        };
    }

    invoke = createInvoke(() => this.webview);
    webInitialize = () => {
        this.setState({
            status: '[Ready] Done!'
        })
    };
    webWannaGet = () => {
        return this.state.value;
    };
    webWannaSet = (data) => {
        this.setState({
            status: `[Receive From Web] '${data}'`
        });
    };

    componentDidMount(){
        this.props.navigation.setParams({
            webBackPress: this.onBackClick.bind(this),
            // goBack: this.goBack.bind(this),
            canGoBack: false,
            title: this.state.status,
        });
        this.invoke
            .define('init', this.webInitialize)
            .define('get', this.webWannaGet)
            .define('set', this.webWannaSet);
    }

    componentWillUnmount() {
        this.unmount = true;
    }

    onBackClick() {
        this.webview.goBack();
    }

    onCloseClick() {
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={styles.container}>
                <WebView
                    injectedJavaScript={patchPostMessageJsCode}
                    ref={webview => {
                        this.webview = webview;
                    }}
                    style={{
                        backgroundColor: "rgba(255,255,255,0.8)",
                        flex: 1,
                    }}
                    source={{uri: this.state.url}}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    automaticallyAdjustContentInsets={false}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onMessage={this.invoke.listener}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                    // onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest.bind(this)}
                    onLoadStart={this.onLoadStart.bind(this)}
                    onError={this.onError.bind(this)}
                    onLoad={this.onLoad.bind(this)}
                    onLoadEnd={this.onLoadEnd.bind(this)}
                    startInLoadingState={true}
                    //renderLoadingView={this.renderLoadingView()}
                />
            </View>
        );
    }

    /**
     *
     * WebView post message 接收函数
     *
     * @param message
     */
    renderLoadingView() {
        // if (this.state.loading) {
        // console.log("renderLoadingView");
        return (
            <View style={styles.loadingViewContainer}>
                <ActivityIndicator
                    color='#009688'
                    size='large'
                    style={styles.ActivityIndicatorStyle}
                />
            </View>
        );
        // }
    }

    appKeyCheck() {
        (async function () {
            let appKey = await this.invoke.bind("appKey")();
            let authKey = MD5(`AppId=${this.appId}&AppKey=${appKey}`);
            let base64Str = new Buffer.Buffer(`appId=${this.appId}&key=${authKey}`).toString('base64');
            let url = `${AppConfig.APP_CHECK}&authKey=${base64Str}`;
            // console.log(url);
            HttpTools.get(url).then(function (res) {
                if (this.unmount) {
                    return;
                }
                if (res.ok) {
                    // console.log("App 认证成功")
                } else {
                    Alert.alert('提示', res.msg, [{
                        text: '确定',
                        onPress: () => {
                            this.goBack();
                        }
                    }]);
                }
            }.bind(this));
        }.bind(this))();
    }

    onNavigationStateChange(navState) {
        let needUpdate = false;
        if (navState.title != this.state.status) {
            needUpdate = true;
        }
        if (navState.canGoBack != this.state.backButtonEnabled) {
            needUpdate = true;
        }
        this.state = {
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            url: navState.url,
            status: navState.title,
            loading: navState.loading,
            scalesPageToFit: true
        };

        if (needUpdate) {
            this.props.navigation.setParams({title: this.state.status, canGoBack: this.state.forwardButtonEnabled});
        }
    }

    onShouldStartLoadWithRequest(event) {
        // Implement any custom loading logic here, don't forget to return!
        return true;
    }

    onLoadStart(event) {
        // 加载开始时调用 开Log 很卡
        // console.log(event);
    }

    onLoad(event) {
        // 加载成功时调用
        // console.log("onLoad" + event);
        // this.appKeyCheck();
    }

    onError(event) {
        // 加载失败时调用
        // console.log("onError" + event);
    }

    onLoadEnd(event) {
        // this.loadingView.setState({hidden:true});
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    leftBtnContainer: {
        flex: 1,
        flexDirection: "row",
        width: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backButton: {
        flex: 1, flexDirection: 'row', width: 50, alignItems: 'center', justifyContent: 'center'
    },
    backBtnIcon: {
        width: 16,
        height: 16,
        marginTop: 1,
    },
    closeButton: {
        flex: 1, flexDirection: 'row', width: 30, alignItems: 'center', justifyContent: 'center'
    },
    buttonText: {
        fontSize: 14, color: '#42CF94', fontWeight: '600'
    },
    WebViewStyle:
        {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            marginTop: (Platform.OS) === 'ios' ? 20 : 0
        },
    loadingViewContainer: {
        position: 'absolute',
        flex: 1,
        top: (height - 40) / 2.0 - 100,
        left: (width - 40) / 2.0,
    },
    ActivityIndicatorStyle: {
        width: 32,
        height: 32,
    }
});