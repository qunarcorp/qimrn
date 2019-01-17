import React, {Component} from 'react';
import {
    View,
    ActivityIndicator,
    AppRegistry,
    Text,
    StyleSheet,
    YellowBox,
    Animated,
    Dimensions,
    Easing, DeviceEventEmitter,
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import * as Progress from 'react-native-progress';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

let sibling = undefined
const QIMProgress = {
    show: () => {
        console.log("xxxx");
        sibling = new RootSiblings(
            <View style={styles.maskStyle}>
                <View style={styles.backViewStyle}>
                    <Progress.Circle
                        style={styles.progressStyle}
                        progress={0}
                        indeterminate={false}
                        size={48}
                        strokeCap={'square'}
                    />
                </View>e
            </View>
        )
    },

    updateProgress:(progressValue) => {
        if (sibling) {
            sibling = new RootSiblings(

                <View style={styles.maskStyle}>
                    <View style={styles.backViewStyle}>
                        <Progress.Circle
                            style={styles.progressStyle}
                            progress={progressValue}
                            indeterminate={false}
                            size={48}
                            strokeCap={'square'}
                        />
                    </View>
                </View>
            )
        }
    },

    hidden: ()=> {
        if (sibling instanceof RootSiblings) {
            sibling.destroy()
        }
    }
}

const styles = StyleSheet.create({
        maskStyle: {
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            width: width,
            height: height,
            alignItems: 'center',
            justifyContent: 'center'
        },
        backViewStyle: {
            backgroundColor: '#111',
            width: 120,
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
        }
    }
)

export {QIMProgress}