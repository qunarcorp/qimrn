import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ART,
    Button,
    Platform,
} from 'react-native';
import AppConfig from '../common/AppConfig'
import HttpTools from '../common/HttpTools'
import NavCBtn from "../common/NavCBtn";

const {
    Surface,
    Group,
    Shape,
    Path,
} = ART;

class TotpLeft extends Component {
    render() {
        var value = parseInt(this.props.second % 30 / 5);
        switch (value) {
            case 0: {
                return (
                    <Group x={130} y={48}>
                        <Shape d={new Path().moveTo(0, 0).lineTo(5, 0)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 5).lineTo(5, 5)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 10).lineTo(5, 10)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 15).lineTo(5, 15)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 20).lineTo(5, 20)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 25).lineTo(5, 25)} strokeWidth={3} stroke="#000"/>
                    </Group>
                );
            }
                break;
            case 1: {
                return (
                    <Group x={130} y={48}>
                        <Shape d={new Path().moveTo(0, 5).lineTo(5, 5)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 10).lineTo(5, 10)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 15).lineTo(5, 15)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 20).lineTo(5, 20)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 25).lineTo(5, 25)} strokeWidth={3} stroke="#000"/>
                    </Group>
                );
            }
                break;
            case 2: {
                return (
                    <Group x={130} y={48}>
                        <Shape d={new Path().moveTo(0, 10).lineTo(5, 10)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 15).lineTo(5, 15)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 20).lineTo(5, 20)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 25).lineTo(5, 25)} strokeWidth={3} stroke="#000"/>
                    </Group>
                );
            }
                break;
            case 3: {
                return (
                    <Group x={130} y={48}>
                        <Shape d={new Path().moveTo(0, 15).lineTo(5, 15)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 20).lineTo(5, 20)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 25).lineTo(5, 25)} strokeWidth={3} stroke="#000"/>
                    </Group>
                );
            }
                break;
            case 4: {
                return (
                    <Group x={130} y={48}>
                        <Shape d={new Path().moveTo(0, 20).lineTo(5, 20)} strokeWidth={3} stroke="#000"/>
                        <Shape d={new Path().moveTo(0, 25).lineTo(5, 25)} strokeWidth={3} stroke="#000"/>
                    </Group>
                );
            }
                break;
            case 5: {
                return (
                    <Group x={130} y={48}>
                        <Shape d={new Path().moveTo(0, 25).lineTo(5, 25)} strokeWidth={3} stroke="#000"/>
                    </Group>
                );
            }
                break;
            default: {
                return (<Group x={130} y={48}>
                </Group>);
            }
                break;
        }
    }
}

class TotpToken extends Component {
    render() {

        const pathRect = new Path()
            .moveTo(80, 20)
            .lineTo(80, 100)
            .lineTo(298, 100)
            .lineTo(298, 20)
            .close();

        const pathCircle = new Path()
            .moveTo(60, 0)
            .arc(0, 116, 1)
            .arc(0, -116, 1)
            .close();

        const pathLogoCircle = new Path()
            .moveTo(60, 20)
            .arc(0, 80, 1)
            .arc(0, -80, 1)
            .close();

        const pathLogoCircle2 = new Path()
            .moveTo(135, 20)
            .arc(0, 80, 1)
            .arc(0, -80, 1)
            .close();

        const pathLogoRect = new Path()
            .moveTo(38, 40)
            .lineTo(38, 65)
            .lineTo(82, 65)
            .lineTo(82, 40)
            .close();

        const pathTextRect = new Path()
            .moveTo(127, 42)
            .lineTo(127, 78)
            .lineTo(270, 78)
            .lineTo(270, 42)
            .close();

        let bgColor = "#ACB4BA";
        let logoBgColor = "#202475";
        let logoTextBgColor = "#FF0000";
        let textBgColor = "#70858A";//"#9FBACF";
        let tokenText = this.props.totp.substr(0, 3) + " " + this.props.totp.substr(3, 3);
        let text = parseInt(this.props.second) % 2 != 0 ? "." : " ";
        // Console.log("当前时间:"+this.props.second+" 当前结果;"+ parseInt(this.props.second) % 2);
        // Console.log("当前点:"+text);
        let totpFont = "bold italic 30px DS-Digital";

        if (Platform.OS == 'android') {
            return (
                <View style={{width: this.props.width, height: this.props.height}}>
                    <Surface width={this.props.width} height={this.props.height}>
                        <Group y={3} x={1}>
                            <Shape d={pathCircle} stroke="#636363" strokeWidth={2}/>
                            <Shape d={pathRect} fill={bgColor} stroke="#636363" strokeWidth={2}/>
                        </Group>
                        <Group y={1}>
                            <Shape d={pathCircle} stroke="#aaaaaa" strokeWidth={2}/>
                            <Shape d={pathRect} fill={bgColor} stroke="#aaaaaa" strokeWidth={2}/>
                            <Shape d={pathCircle} fill={bgColor}/>
                            <Shape d={pathLogoCircle} fill={logoBgColor}/>
                            <Shape d={pathLogoCircle2} fill={bgColor}/>
                            <Shape d={pathLogoRect} fill={logoTextBgColor}/>
                            <ART.Text fill="#FFF" font="bold 18px Heiti SC" x={42} y={40}>QIM</ART.Text>
                            <ART.Text fill="#FFF" font="bold 14px Heiti SC" x={32} y={66}>SecurID</ART.Text>
                            <ART.Text fill="#FFF" font="bold 10px Heiti SC" x={84} y={66}>®</ART.Text>
                            <Shape d={pathTextRect} fill={textBgColor}/>
                            {/*<ART.Text fill="#000" font={totpFont} x={155} y={40}>{tokenText}</ART.Text>*/}
                            {/*<ART.Text fill="#000" font={totpFont} x={260} y={43}>{parseInt(this.props.second) % 2 != 0 ? "." : " "}</ART.Text>*/}
                        </Group>
                        <TotpLeft second={this.props.second}/>
                    </Surface>
                    <Text style={{
                        backgroundColor: "transparent",
                        fontFamily: "DS-Digital",
                        fontSize: 30,
                        // fontStyle: "italic",
                        // fontWeight: "bold",
                        position: "absolute",
                        top: 46,
                        left: 152,
                    }}>{tokenText}</Text>
                    <Text style={{
                        backgroundColor: "transparent",
                        fontFamily: "DS-Digital",
                        fontSize: 30,
                        // fontStyle: "italic",
                        // fontWeight: "bold",
                        position: "absolute",
                        top: 46,
                        left: 260,
                    }}>{text}</Text>
                </View>
            );
        } else {
            return (
                <Surface width={this.props.width} height={this.props.height}>
                    <Group y={3} x={1}>
                        <Shape d={pathCircle} fill="#636363"/>
                        <Shape d={pathRect} fill="#636363" stroke="#636363" strokeWidth={2}/>
                    </Group>
                    <Group y={1}>
                        {/*<Shape d={pathCircle} stroke="#aaaaaa" strokeWidth={2}/>*/}
                        <Shape d={pathRect} fill={bgColor} stroke="#aaaaaa" strokeWidth={2}/>
                        <Shape d={pathCircle} fill={bgColor}/>
                        <Shape d={pathLogoCircle} fill={logoBgColor}/>
                        <Shape d={pathLogoCircle2} fill={bgColor}/>
                        <Shape d={pathLogoRect} fill={logoTextBgColor}/>
                        <ART.Text fill="#FFF" font="bold 18px Heiti SC" x={42} y={40}>QIM</ART.Text>
                        <ART.Text fill="#FFF" font="bold 14px Heiti SC" x={32} y={66}>SecurID</ART.Text>
                        <ART.Text fill="#FFF" font="bold 10px Heiti SC" x={84} y={66}>®</ART.Text>
                        <Shape d={pathTextRect} fill={textBgColor}/>
                        <ART.Text fill="#000" font={totpFont} x={152} y={40}>{tokenText}</ART.Text>
                        <ART.Text fill="#000" font={totpFont} x={260} y={43}>{text}</ART.Text>
                    </Group>
                    <TotpLeft second={this.props.second}/>
                </Surface>
            );
        }
    }
}

export default class Totp extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "Token";
        let leftBtn = (<NavCBtn btnType={NavCBtn.EXIT_APP} moduleName={"TOTP"}/>);
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
        var date = new Date();
        var seconds = date.getSeconds();
        this.state = {
            second: seconds,
            totp: "000000",
        };
        this.unMount = false;
    }

    updateTotp() {
        AppConfig.moduleHandle.getTOTP(function (map) {
            if (!this.unMount) {
                this.setState({
                    second: map.time,
                    totp: map.totp,
                });
            }
        }.bind(this));
    }

    componentDidMount() {
        AppConfig.updateRemoteKey().then(function () {
            var func = this.updateTotp.bind(this);
            func();
            this.timer = setInterval(func, 1000);
        }.bind(this));
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.unMount = true;
    }

    sendCheckTotp() {
        let url = "";
        HttpTools.get(url).then(function (respone) {
            if (!this.unMount) {
                if (respone.ret) {
                    alert("校验成功");
                } else {
                    alert("校验失败:" + respone.errmsg);
                }
            }
        }, function (err) {
            if (!this.unMount) {
                alert("校验失败:" + err.toString());
            }
        });
    }

    checkTotp() {
        if (__DEV__) {
            // debug模式
            return (
                <View>
                    <Button
                        onPress={this.sendCheckTotp.bind(this)}
                        title="Token 检查"
                        color="#841584"
                    />
                </View>
            );
        } else {
            // release模式
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#eaeaea", marginTop: -30}}>
                <View style={{flex: 0.7, alignItems: "center", justifyContent: "center", padding: 0}}>
                    <TotpToken width={302} height={120} totp={this.state.totp} second={this.state.second}/>
                </View>
                <View style={{flex: 1, margin: 20}}>
                    <Text style={{fontSize: 18, fontWeight: "900", color: "#333333"}}>QTalk Token</Text>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: "#666666",
                        marginTop: 10,
                        paddingLeft: 20,
                        paddingRight: 20,
                        lineHeight: 20
                    }}>
                        1、代替RSA Token 准备
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: "#666666",
                        paddingLeft: 20,
                        paddingRight: 20,
                        lineHeight: 20
                    }}>
                        2、使用QTalk的认证体系实现的二因素认证，安全可靠
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: "#666666",
                        paddingLeft: 20,
                        paddingRight: 20,
                        lineHeight: 20
                    }}>
                        3、不再担心Token的丢失或忘带
                    </Text>
                </View>
                {this.checkTotp()}
            </View>
        )
    }
}