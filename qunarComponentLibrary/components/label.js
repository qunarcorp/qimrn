import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default class Label extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let currentStyle = [style.label];
        switch (this.props.type) {
            case 'normal':
                currentStyle.push(style.normal);
                break;
            default:
                currentStyle.push(style.normal);
                break;
        }
        return (
            <View style={style.container}>
                <Text style={currentStyle}>{this.props.children}</Text>
            </View>
        );
    }
}

const style = StyleSheet.create({
    label: {
        color: '#888',
        marginLeft: 13,
    },
    normal: {
        fontSize: 14
    },
    container:{
        backgroundColor:'#F5F5F9',
    }

});