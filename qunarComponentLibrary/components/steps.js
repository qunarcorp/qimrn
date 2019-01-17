import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import fontMap from '../util/fontmap';
import SVG from '../SVGComponents/SVG';
import svgmap from '../SVGUtil/svgs';

export default class Steps extends Component {
    constructor(props) {
        super(props);
        this._getStateStyles = this._getStateStyles.bind(this);
        this._renderContent = this._renderContent.bind(this);
    }

    _getStateStyles(state) {
        const result = {};
        switch (state) {
            case 'success':
                result.sign = 'right';
                result.color = styles.green;
                break;
            case 'fail':
                result.sign = 'cross';
                result.color = styles.red;
                break;
            case 'current':
                result.sign = 'radio';
                result.color = styles.green;
                break;
            case 'transfer':
                result.sign = 'leave';
                result.color = styles.green;
                break;
            case 'end':
                result.sign = 'stop';
                result.color = styles.yellow;
                break;
            default:
                result.sign = 'round';
                result.color = styles.gray;
                break;
            // case 'success':
            //   result.sign = fontMap['right'];
            //   result.color = styles.green;
            //   break;
            // case 'fail':
            //   result.sign = fontMap['cross'];
            //   result.color = styles.red;
            //   break;
            // case 'current':
            //   result.sign = fontMap['radio'];
            //   result.color = styles.green;
            //   break;
            // case 'transfer':
            //   result.sign = fontMap['leave'];
            //   result.color = styles.green;
            //   break;
            // case 'end':
            //   result.sign = fontMap['stop'];
            //   result.color = styles.yellow;
            //   break;
            // default:
            //   result.sign = fontMap['round'];
            //   result.color = styles.gray;
            //   break;
        }
        return result;
    }

    _renderInfo(item) {
        if (!item.description && !item.stamp) {
            return null;
        }
        return (
            <View style={styles.info}>
                <View style={[styles.line, styles.cutLine]}></View>
                <Text style={[styles.description, this._getStateStyles(item.state).color]}>
                    {item.description}
                </Text>
                <Text style={styles.stamp}>{item.stamp}</Text>
            </View>
        )
    }

    _renderContent(item) {
        if (!item.content) {
            return null;
        }
        return (
            <View>
                <View style={[styles.line, styles.cutLine]}></View>
                <Text style={styles.content}>{item.content}</Text>
            </View>
        )
    }

    render() {
        const data = this.props.data;
        const stepList = [];
        for (let i = 0, len = data.length; i < len; i++) {
            let item = data[i];
            stepList.push(
                <View style={styles.step} key={i}>
                    <View style={styles.leftContainer}>
                        {i !== 0 ? <View style={[styles.line, styles.topLine]}></View> : null}
                        {/*<Text style={[styles.stateSign, this._getStateStyles(item.state).color]}>{String.fromCharCode(parseInt(this._getStateStyles(item.state).sign))}</Text>*/}
                        <View style={[styles.stateSign,]}>
                            <SVG icon={this._getStateStyles(item.state).sign} size={20}
                                 fill={this._getStateStyles(item.state).color}/>
                        </View>

                        {i !== len - 1 ? <View style={[styles.line, styles.bottomLine]}></View> : null}
                    </View>
                    <View style={styles.card}>
                        {/*<Text style={styles.triangle}>{String.fromCharCode(parseInt(fontMap['left-triangle']))}</Text>*/}
                        <View style={styles.triangle}>
                            <SVG icon={'left_triangle'} size={10}/>
                        </View>

                        <View style={styles.main}>
                            <View style={styles.profile}>
                                {item.avatar ? <Image style={styles.avatar} source={{uri: item.avatar}}></Image> : null}
                                <Text style={styles.profileTitle}>{item.title}</Text>
                            </View>
                            {this._renderInfo(item)}
                            {this._renderContent(item)}
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.steps}>
                {stepList}
            </View>
        )
    }
}

// Steps.propTypes = {
//   data: PropTypes.array,
//   title: PropTypes.string, //标题
//   avatar: PropTypes.string, //头像
//   state: PropTypes.oneOf(['success', 'fail', 'transfer', 'end', undefined]), //左侧图标
//   description: PropTypes.string, //当前状态描述
//   stamp: PropTypes.string, //显示时间
//   content: PropTypes.content //文本内容
// }

const styles = StyleSheet.create({
    steps: {
        paddingTop: 20,
        paddingRight: 10,
        paddingBottom: 20,
        paddingLeft: 4
    },
    step: {
        flexDirection: 'row',
    },
    leftContainer: {
        alignItems: 'center',
        width: 27
    },
    line: {
        borderColor: '#EEEEEE',
        borderLeftWidth: 1
    },
    topLine: {
        position: 'absolute',
        top: 0,
        left: 13,
        height: 8
    },
    bottomLine: {
        flex: 1,
        marginTop: 8
    },
    stateSign: {
        marginTop: 12,
        fontSize: 18,
        fontFamily: 'QTalk-QChat'
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 20
    },
    triangle: {
        marginTop: 16,
        marginRight: -3,
        fontSize: 10,
        fontFamily: 'QTalk-QChat',
        color: '#fff'
    },
    main: {
        flex: 1,
        padding: 12,
        borderRadius: 4,
        backgroundColor: '#fff'
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    avatar: {
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius: 10
    },
    profileTitle: {
        fontSize: 16,
        color: '#212121'
    },
    cutLine: {
        borderTopWidth: 1,
        marginTop: 8,
        marginBottom: 8
    },
    description: {
        marginTop: 5,
        lineHeight: 20,
        fontSize: 16
    },
    state: {
        marginTop: 4,
        marginBottom: 11,
        lineHeight: 18,
        fontSize: 13,
        color: '#5CC57F'
    },
    name: {
        marginTop: 12,
        lineHeight: 21,
        fontSize: 15,
        color: '#212121'
    },
    stamp: {
        fontSize: 11,
        lineHeight: 16,
        color: '#BDBDBD'
    },
    content: {
        fontSize: 14,
        lineHeight: 18,
        color: '#616161'
    },
    green: {
        color: '#5CC57F'
    },
    red: {
        color: '#E64340'
    },
    gray: {
        color: '#eeeeee'
    },
    yellow: {
        color: '#FFBE00'
    }
});