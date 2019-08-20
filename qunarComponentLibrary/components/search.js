import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import QIMTextInput from './QIMTextInput';
import PropTypes from 'prop-types';
import SVG from '../SVGComponents/SVG';

export default class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showClear: !!this.props.value,
            currentText: this.props.value || ''
        };


        this.triggerStopInput = true;
        this.recordText = this.props.value || '';
        this.onChangeText = this.onChangeText.bind(this);
        this.onClearText = this.onClearText.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onStopInput = this.onStopInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onChangeText(text) {
        this.setState({
            showClear: !!text,
            currentText: text
        });
        this.triggerStopInput = false;
        this.props.onChangeText(text);
    }

    onClearText() {
        this.props.onClear(this.state.currentText);
        this.setState({
            showClear: false,
            currentText: ''
        });
        this.recordText = '';
    }

    onCancel() {
        this.props.onCancel(this.state.currentText);
        this.setState({
            currentText: ''
        });
        this.recordText = '';
    }

    onStopInput() {
        setInterval(() => {
            let currentText = this.state.currentText;
            if (this.recordText == currentText && currentText != '' && !this.triggerStopInput) {
                this.triggerStopInput = true;
                this.props.onStopInput(this.state.currentText);
            }
            this.recordText = currentText;
        }, 300);
    }

    onSubmit() {
        this.props.onSubmit(this.state.currentText);
    }

    onFocus() {
        this.props.onFocus(this.state.currentText);
    }

    onBlur() {
        this.props.onBlur(this.state.currentText);
    }

    componentDidMount() {
        this.onStopInput();
    }

    render() {
        return (
            <View style={styles.searchInput}>
                <View style={styles.inputContainer}>
                    <View style={styles.searchIcon}>
                        <Text style={styles.searchBtnIcon}>{String.fromCharCode(parseInt("0xe752"))}</Text>
                        {/*<SVG icon="search" size={20}></SVG>*/}
                    </View>
                    <QIMTextInput style={styles.input}
                                  returnKeyType={'search'}
                                  value={this.state.currentText}
                                  onChangeText={this.onChangeText}
                                  onBlur={this.onBlur}
                                  onFocus={this.onFocus}
                                  onSubmitEditing={this.onSubmit}
                                  placeholder={this.props.placeholder || '搜索'}
                                  placeholderTextColor="#BDBDBD"
                                  underlineColorAndroid="transparent"/>
                    {
                        this.state.showClear ?
                            <View style={styles.clearIcon}>
                                <TouchableOpacity onPress={this.onClearText}>
                                    {/*<SVG icon="cancel" size={20}></SVG>*/}
                                    <Text style={styles.searchBtnIcon}>{String.fromCharCode(parseInt("0xe33c"))}</Text>

                                </TouchableOpacity>
                            </View> : null
                    }

                </View>
                {
                    this.props.showCancel ?
                        <TouchableOpacity onPress={this.onCancel}>
                            <Text style={styles.cancelbtn}>取消</Text>
                        </TouchableOpacity> : null
                }
            </View>
        )
    }
}
const foo = new Function();

SearchInput.defaultProps = {
    showCancel: true,
    onCancel: foo,
    onChangeText: foo,
    onClear: foo,
    onStopInput: foo,
    onSubmit: foo,
    onBlur: foo,
    onFocus: foo
}
SearchInput.propTypes = {
    showCancel: PropTypes.bool,
    onCancel: PropTypes.function,
    onChangeText: PropTypes.function,
    onClear: PropTypes.function,
    onStopInput: PropTypes.foo,
    onSubmit: PropTypes.function,
    onBlur: PropTypes.function,
    onFocus: PropTypes.function
}

const styles = StyleSheet.create({
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        paddingLeft: 10,
        paddingRight: 12,
        backgroundColor: '#EFEFF4'
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 28,
        borderRadius: 6,
        backgroundColor: '#FFFFFF'
    },
    input: {
        flex: 1,
        padding: 0,
        fontSize: 15,
        color: '#212121'
    },
    searchIcon: {
        marginLeft: 12,
        marginRight: 12
    },
    clearIcon: {
        marginLeft: 4,
        marginRight: 4
    },
    cancelbtn: {
        marginLeft: 16,
        marginRight: 14,
        fontSize: 16,
        color: '#108EE9'
    },
    searchBtnIcon: {
        // width: 13,
        // height: 13,
        // lineHeight: 40,
        textAlign: "center",
        color: '#BFBFBF',
        fontFamily: 'QTalk-QChat',
        fontSize: 15,
    },
});