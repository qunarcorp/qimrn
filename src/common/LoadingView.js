import React, {Component} from 'react';
import {
    View,
    ActivityIndicator,
    AppRegistry,
    Text,
    StyleSheet,
    YellowBox,
    Animated,
    Easing,
} from 'react-native';

reactNativeApp = null;

const originRegister = AppRegistry.registerComponent;

class LoadingViewRootView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fadeOutOpacity: new Animated.Value(0),
        };
    }

    startAnimation() {
        Animated.timing(this.state.fadeOutOpacity, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
        }).start();
    }

    stopAnimation(callBack){
        Animated.timing(this.state.fadeOutOpacity, {
            toValue: 0,
            duration: 200,
            easing: Easing.linear,
        }).start(callBack);
    }

    componentDidMount() {
        this.startAnimation();
    }

    render() {
        return (
            <View style={styles.rootView} /*pointerEvents="box-none"*/>
                <Animated.View style={{opacity: this.state.fadeOutOpacity}}>
                    <View style={styles.activityIndicatorContainer}>
                        <ActivityIndicator
                            animating={this.state.animating}
                            style={[styles.centering, {height: 80}]}
                            size="large"/>
                        <Text style={styles.loadingLabel}>{this.props.text}</Text>
                    </View>
                </Animated.View>
            </View> );
    }

}

AppRegistry.registerComponent = (appKey, component) => {
    return originRegister(appKey, function () {
        const OriginAppComponent = component();
        return class extends Component {

            constructor(props) {
                super(props);
                this.state = {loadingHidden: true};
                reactNativeApp = this;

                YellowBox.ignoreWarnings([
                    'Warning: componentWillMount is deprecated',
                    'Warning: componentWillReceiveProps is deprecated',
                ]);
            }

            showLoadingView(msg){
                this.setState({loadingHidden: false, loadingMsg: msg});
            }

            hiddenLoadingView(){
                if (this.loadingView) {
                    this.loadingView.stopAnimation(()=>{
                        this.setState({loadingHidden: true});
                    });
                }
            }

            drawLoadingView() {
                if (!this.state.loadingHidden) {
                    return (<LoadingViewRootView ref={(loadingView) => {this.loadingView = loadingView;}} text={this.state.loadingMsg}/>);
                }
            }

            render() {
                return (
                    <View style={styles.container}>
                        <OriginAppComponent {...this.props}/>
                        {this.drawLoadingView()}
                    </View>
                );
            };
        };
    });
};

export default class LoadingView {
    static show(msg) {
        reactNativeApp.showLoadingView(msg);
    }

    static hidden() {
        reactNativeApp.hiddenLoadingView();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    rootView: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        // flexDirection: "row",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(0,0,0,0.3)",
    },
    activityIndicatorContainer: {
        width: 120,
        height: 120,
        backgroundColor: "rgba(0,0,0,0.65)",
        borderRadius: 5,
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        marginTop: 5,
    },
    loadingLabel: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    }
});