import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import colorMap from '../util/colormap';

const screenWidth = Dimensions.get('window').width;
const sizeList = ['large', 'small'];
const typeList = ['primary', 'info', 'error'];

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
  }
  onPress(e) {
    const onPress = this.props.onPress;
    if (typeof onPress === 'function') {
      onPress(e);
    }
  }
  onLongPress(e) {
    const onLongPress = this.props.onLongPress;
    if (typeof onLongPress === 'function') {
      onLongPress(e);
    }
  }
  render() {
    const style = [styles.btn];
    const textStyle = [];
    const size = this.props.size;
    sizeList.indexOf(size) !== -1 ? style.push(styles[size]) : style.push(styles['large']);
    let type = this.props.type;
    typeList.indexOf(type) !== -1 || (type = 'primary');
    style.push(styles[type]);
    textStyle.push(styles[type + 'Text']);

    let disabled = this.props.disabled;
    if (disabled === true || disabled === 'disabled') {
      disabled = true;
      style.push({
        backgroundColor: '#DBDBDB',
        borderColor: '#DBDBDB'
      });
      textStyle.push({
        color: '#515151'
      });
    }

    this.props.color && textStyle.push({ color: this.props.color });
    this.props.backgroundColor && style.push({ backgroundColor: this.props.backgroundColor });
    this.props.borderColor && style.push({ borderColor: this.props.borderColor });
    const stretch = this.props.stretch;
    if (stretch === true || stretch === 'stretch') {
      style.push({
        width: 'auto'
      });
    }
    return (
      <TouchableOpacity
        onPress={this.onPress}
        onLongPress={this.onLongPress}
        style={style}
        disabled={disabled || false}
      >
        <Text style={[styles.btnText, textStyle]}>{this.props.children}</Text>
      </TouchableOpacity>
    )
  }
}
Button.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOf([...sizeList, undefined]),
  type: PropTypes.oneOf([...typeList, undefined]),
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  stretch: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  disabled: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  onPress: PropTypes.func,
  onLongPress: PropTypes.func
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 2
  },
  btnText: {
    lineHeight: 22,
    fontSize: 16,
    textAlign: 'center'
  },
  small: {
    height: 32,
    width: parseInt(screenWidth / 4)
  },
  large: {
    height: 44,
    width: parseInt(screenWidth - 30)
  },
  primary: {
    backgroundColor: colorMap['green'],
    borderColor: colorMap['green']
  },
  primaryText: {
    color: colorMap['white']
  },
  disabled: {
    backgroundColor: colorMap['gray']
  },
  info: {
    backgroundColor: colorMap['white'],
    borderColor: colorMap['green']
  },
  infoText: {
    color: colorMap['green']
  },
  error: {
    backgroundColor: colorMap['red'],
    borderColor: colorMap['red']
  },
  errorText: {
    color: colorMap['white']
  },
});