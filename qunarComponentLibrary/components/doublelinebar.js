import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import fontMap from '../util/fontmap';
import SVG from '../SVGComponents/SVG';
import svgmap from '../SVGUtil/svgs';

export default class DoubleLineBar extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this._renderTitle = this._renderTitle.bind(this);
    this._renderDetail = this._renderDetail.bind(this);
  }
  onPress() {
    const fn = this.props.navigateTo;
    if (typeof fn === 'function') {
      fn();
    }
  }
  _renderTitle() {
    let icon = null;
    let titleIcon = this.props.titleIcon;
    let style = [];

    if (titleIcon) {
      if (fontMap[titleIcon]) {
        icon =
          <View style={styles.iconContainer}>
            <Text style={[styles.icon, styles.titleIcon]}>{String.fromCharCode(parseInt(fontMap[titleIcon]))}</Text>
          </View>;
      } else {
        icon =
          <Image style={styles.titleImg}
            resizeMode="stretch"
            source={{ uri: this.props.titleIcon }}>
          </Image>;
        style.push({ height: 74 });
      }
    }
    return (
      <View style={[styles.titleContainer, ...style]}>
        {icon}
        <View style={styles.titleContentContainer}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.subTitle}>
            {this.props.subTitle ? this.props.subTitle : ' '}
          </Text>
        </View>
      </View>
    );
  }
  _renderDetail() {
    let detailInfo = null;
    let detailImg = null;
    let containTitleImg = false;
    const detail = this.props.detail;
    const detailIcon = this.props.detailIcon;

    if (this.props.titleIcon && !fontMap[this.props.titleIcon]) {
      containTitleImg = true;
    }
    if (detail) {
      if (Array.isArray(detail)) {
        detailInfo =
          <View style={[styles.detail, containTitleImg ? { marginTop: 14 } : null]}>
            {
              detail.map((item, index) => {
                return <Text key={index} style={styles.detailText}>{item}</Text>;
              })
            }
          </View>;
      }
      if (typeof detail === 'string') {
        detailInfo =
          <View style={[styles.detail, containTitleImg ? { marginTop: 14 } : null]}>
            <Text style={styles.detailText}>{detail}</Text>
          </View>;
      }
    }
    if (!detail && detailIcon) {
      if (fontMap[detailIcon]) {
        detailImg = <Text style={[styles.icon, styles.detailIcon]}>{String.fromCharCode(parseInt(fontMap[detailIcon]))}</Text>;
      } else {
        detailImg = <Image
          style={styles.detailImg}
          resizeMode="stretch"
          source={{ uri: this.props.detailIcon }} >
        </Image>
      }
    }

    let nav = null;
    const showNavigate = this.props.showNavigate;
    if ((typeof showNavigate === 'undefined' && this.props.navigateTo) || showNavigate) {
      // nav = <Text style={[styles.icon, styles.detailRightArrow]}>{String.fromCharCode(parseInt(fontMap['right-arrow']))}</Text>;
        nav = <SVG icon={'right_arrow'} size={30} fill='#9e9e9e' />
    }
    return (
      <View style={styles.detailContainer}>
        {detailInfo}
        <View style={[styles.detailNav, containTitleImg ? { height: 72 } : null]}>
          {detailImg}
          {nav}
        </View>
      </View>
    );
  }
  render() {
    const style = [styles.bar];
    if (this.props.topBorder) {
      style.push({
        borderTopWidth: 1
      });
    }
    if (this.props.bottomBorder) {
      style.push({
        borderBottomWidth: 1
      });
    }
    return (<TouchableOpacity
      disabled={typeof this.props.navigateTo !== 'function'}
      style={style}
      onPress={this.onPress}>
      {this._renderTitle()}
      {this._renderDetail()}
    </TouchableOpacity>);
  }
}

DoubleLineBar.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  titleIcon: PropTypes.string,
  detailIcon: PropTypes.string,
  navigateTo: PropTypes.func,
  showNavigate: PropTypes.bool,
  topBorder: PropTypes.bool,
  bottomBorder: PropTypes.bool
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderColor: '#eee'
  },
  titleContainer: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: 62
  },
  iconContainer: {
    marginLeft: 16
  },
  titleIcon: {
    fontSize: 25,
    marginTop: 2
  },
  titleImg: {
    width: 50,
    height: 50,
    marginLeft: 16
  },
  titleContentContainer: {
    marginLeft: 16
  },
  icon: {
    fontFamily: 'QTalk-QChat',
    fontSize: 20,
    color: '#9e9e9e'
  },
  title: {
    lineHeight: 22,
    fontSize: 16,
    color: '#212121'
  },
  subTitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#9e9e9e'
  },

  detailContainer: {
    flex: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  detailNav: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 62
  },
  detailImg: {
    width: 40,
    height: 40,
    marginRight: 12
  },
  detailRightArrow: {
    marginRight: 12,
    fontSize: 12
  },
  detailText: {
    fontSize: 16,
    color: '#9e9e9e',
    marginBottom: 4
  },
  detail: {
    marginTop: 12,
    marginRight: 12
  }
});

