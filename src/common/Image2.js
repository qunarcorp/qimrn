import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
} from 'react-native';

import PropTypes from 'prop-types';

export default class Image2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadSuccess:false,
        };
        var prefetchTask = Image.prefetch(this.props.source.uri);
        prefetchTask.then(() => {
            //此处可设置状态，显示Image组件。此时组件会使用预加载的图片信息。而不用再次加载
            // console.log('加载图片成功')
            this.setState({loadSuccess:true});
        }, error => {
            // console.log('加载图片失败')
        });
    }

    _onLoadEnd = () => {
        if (this.state.loadSuccess!=1){
            this.setState({
                loadSuccess:0,
            });
        }
    };

    _onLoad = () => {
        this.setState({
            loadSuccess:1,
        });
    };

    _renderImage(){
        if (this.state.loadSuccess) {
            return (
                <Image style={[this.props.style,styles.imageView]}
                       source={this.props.source}
                    />
            );
        } else {
            return (
                <Image style={[this.props.style,styles.imageDefault]}
                       source={this.props.placeholder}/>
            );
        }
        // if(this.state.loadSuccess == -1){
        //     return (
        //         <View style={[this.props.style,styles.reset]}>
        //             <Image style={[this.props.style,styles.imageDefault,styles.reset]}
        //                    source={this.props.placeholder}/>
        //             <Image style={[this.props.style,styles.imageView,styles.reset]}
        //                    source={this.props.source}
        //                    onLoad={this._onLoad.bind(this)}
        //                    onLoadEnd={this._onLoadEnd.bind(this)} />
        //         </View>
        //     );
        // } else if (this.state.loadSuccess == 1){
        //     return (
        //         <Image style={[this.props.style,styles.imageView]}
        //                source={this.props.source}
        //                onLoad={this._onLoad.bind(this)}
        //                onLoadEnd={this._onLoadEnd.bind(this)} />
        //     );
        // } else {
        //     return (
        //         <Image style={[this.props.style,styles.imageDefault]}
        //                source={this.props.placeholder}/>
        //     );
        // }
    }

    render() {
        if (this.props.placeholder){
            if (this.state.loadSuccess) {
                return (
                    <Image style={[this.props.style,styles.imageView]}
                           source={this.props.source}
                    />
                );
            } else {
                return (
                    <Image style={[this.props.style,styles.imageDefault]}
                           source={this.props.placeholder}/>
                );
            }
            // return (
            //     <View style={this.props.style}>
            //         {this._renderImage()}
            //     </View>
            // );
        } else {
            return (
                <Image style={[this.props.style]}
                       source={this.props.source} />);
        }
    }
}

const styles = StyleSheet.create({
    reset:{
        margin:0,
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 0,
        padding:0,
        paddingLeft:0,
        paddingRight:0,
        paddingTop:0,
        paddingBottom:0,
        backgroundColor:"transparent",
        borderWidth: 0,
    },
    imageDefault:{
        // position:"absolute",
    },
    imageView:{
        // position:"absolute",
    },
});