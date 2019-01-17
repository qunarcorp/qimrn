import React, {Component} from 'react';
import {Platform, TextInput} from 'react-native';


export default class QIMTextInput extends Component {

    //解决iOS下不能输入中文的bug
    shouldComponentUpdate (nextProps){
        return Platform.OS !== 'ios'
            || (this.props.value === nextProps.value && (nextProps.defaultValue == undefined || nextProps.defaultValue == '' ))
            || (this.props.defaultValue === nextProps.defaultValue && (nextProps.value == undefined || nextProps.value == '' ));
    }


    render() {
        return <TextInput {...this.props} />;
    }
};