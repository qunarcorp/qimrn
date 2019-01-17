import React, {Component} from "react";



import ActionSheet from 'react-native-actionsheet'


class CustomActionSheet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectIndex: 0,
            warmingTitle: '提示',
            optionLists: ['取消', '确认需求,开始跟进', '暂无需求', '目前使用竞品产品', '联系不上'],
            cancel_index: 0,
            destruc_index: -1,
        };
        this.onShowCustomActionSheet = this.onShowCustomActionSheet.bind(this)
        this.onPressIndex = this.onPressIndex.bind(this);
    }

    clickedCallBack() {

    };

    onShowCustomActionSheet(warmingTitle, options, cancelButtonIndex,
                            destructiveButtonIndex, callback){



        // console.log('warmingTitle:' + warmingTitle + '\toptions:' + options + '\tcancelButtonIndex:' + cancelButtonIndex + '\tdestructiveButtonIndex:' + destructiveButtonIndex);


        this.setState({
            warmingTitle:warmingTitle,
            optionLists:options,
            cancel_index:cancelButtonIndex,
            destruc_index:destructiveButtonIndex,

        }, function () {
            this.ActionSheet.show()
        });
        // this.ActionSheet.show();
        this.clickedCallBack = callback;
    };

    onPressIndex(index) {
        this.setState ({
            selectIndex: index
        });

        this.clickedCallBack(index, this.state.optionLists[index])
    };

    render() {
        return (
            <ActionSheet ref={o => this.ActionSheet = o} onPress={this.onPressIndex} title={this.state.warmingTitle}
                         options={this.state.optionLists} cancelButtonIndex={this.state.cancel_index}
                         destructiveButtonIndex={this.state.destruc_index}></ActionSheet>
        );
    }
}

export default CustomActionSheet;
