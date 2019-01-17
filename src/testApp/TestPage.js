import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";
import LoadingView from "../common/LoadingView";

export default class UserCard extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "测试页面";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"TestPage"}/>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
        };
    };

    constructor(props) {
        super(props);
        this.state = {

        };
        this.unMount = false;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => {
                    LoadingView.show('正在加载');
                }}>
                    <Text>测试LoadingView</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    LoadingView.hidden();
                }}>
                    <Text>隐藏测试LoadingView</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor:"#FF0000",
    },
});
