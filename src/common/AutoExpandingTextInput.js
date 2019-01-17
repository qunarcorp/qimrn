import React, {Component} from 'react';
import {AppRegistry, TextInput, StyleSheet} from 'react-native';

export default class AutoExpandingTextInput extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text: '',
            height: 0
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        console.log(event.nativeEvent);
        this.setState({
            text: event.nativeEvent.text,
            height:event.nativeEvent.contentSize.height
        });
    }
    onContentSizeChange(params){
        console.log(params);
    }
    render() {
        return (
            <TextInput {...this.props}  //将组件定义的属性交给TextInput
                       multiline={true}
                       onChange={this.onChange}
                       onContentSizeChange={this.onContentSizeChange}
                       style={[styles.textInputStyle,{height:Math.max(35,this.state.height)}]}
                       value={this.state.text}
            />
        );
    }
}

const styles = StyleSheet.create({
    textInputStyle: { //文本输入组件样式
        width: 300,
        height: 30,
        fontSize: 20,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "grey"
    }
});

