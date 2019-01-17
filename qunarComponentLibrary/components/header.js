import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import fontMap from '../util/fontmap';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.navigateBack = this.navigateBack.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
  }
  navigateBack(e) {
    const callback = this.props.navigateBack;
    if (typeof callback === 'function') {
      callback(e);
    }
  }
  navigateTo(e) {
    const callback = this.props.navigateTo;
    if (typeof callback === 'function') {
      callback(e);
    }
  }
  render() {
    let navigateBack = null;
    const isHomePage = this.props.isHomePage;

    if (!isHomePage) {
      navigateBack = <TouchableOpacity style={style.back} onPress={this.navigateBack}>
        <Text style={style.icon}>
          {String.fromCharCode(parseInt(fontMap['left-arrow']))}
        </Text>
        {
          this.props.navigateBackText ?
            <Text style={style.backText}>{this.props.navigateBackText}</Text> : null
        }
      </TouchableOpacity>;
    }
    let navigateTo = null;
    if (this.props.navigateToIcon) {
      navigateTo = <Text style={style.icon} >
        {String.fromCharCode(parseInt(fontMap[this.props.navigateToIcon]))}
      </Text>;
    } else if (this.props.navigateToText) {
      navigateTo = <Text style={style.navigateToText}>
        {this.props.navigateToText}
      </Text>;
    }

    return (
      <View style={style.header}>
        {navigateBack}
        <Text style={style.title} onPress={this.navigateBack}>{this.props.title}</Text>
        <TouchableOpacity style={style.to} onPress={this.navigateTo}>
          {navigateTo}
        </TouchableOpacity>
      </View>
    );
  }
}
Header.propTypes = {
  title: PropTypes.string.isRequired,
  isHomePage: PropTypes.bool,
  navigateBackText: PropTypes.string,
  navigateToText: PropTypes.string,
  navigateToIcon: PropTypes.string,
  navigateTo: PropTypes.func,
  navigateBack: PropTypes.func,
}
const style = StyleSheet.create({
  icon: {
    fontFamily: 'QTalk-QChat',
    fontSize: 20,
    color: '#000'
  },
  header: {
    position: 'relative',
    height: 44,
    paddingTop: 12,
    backgroundColor: '#fff'
  },
  back: {
    position: 'absolute',
    flexDirection: 'row',
    top: 12,
    left: 6,
    zIndex: 999
  },
  backText: {
    color: '#212121',
    fontSize: 17
  },
  to: {
    position: 'absolute',
    top: 12,
    right: 8,
    zIndex: 999
  },
  title: {
    flex: 1,
    lineHeight: 20,
    textAlign: 'center',
    fontSize: 17,
    color: '#030303'
  }
});

