import React, {Component} from 'react';
import {View, FlatList, ScrollView, Text, StyleSheet, Platform, Dimensions} from 'react-native';

const screenHeight = Dimensions.get('window').height;
export default class Table extends Component {
    constructor(props) {
        super(props);
        this._renderTableHead = this._renderTableHead.bind(this);
        this._renderTableBody = this._renderTableBody.bind(this);
        this.onMoveShouldSetResponderCapture = this.onMoveShouldSetResponderCapture.bind(this);
    }


    onMoveShouldSetResponderCapture() {
        return true;
    }

    _renderTableHead() {
        const headData = this.props.headData;
        return (
            <View style={[styles.tableRow, styles.tableHeadRow]}>
                {headData.map((item, index) => {
                    return (
                        <View key={index} style={[styles.tableCellContainer,
                            typeof item.width === 'number' ? {width: parseInt(item.width)} : {width: 88},
                            index === 0 ? {borderLeftWidth: 0} : null]}>
                            <Text style={[styles.tableCell, styles.tableHeadCell]}>{item.label}</Text>
                        </View>
                    );
                })}
            </View>
        )
    }

    _renderTableRow(row, index) {
        const headData = this.props.headData;
        return (<View key={index} style={styles.tableRow}>
            {headData.map((item, index) => {
                const {prop, width} = item;
                return <View key={index} style={[styles.tableCellContainer,
                    typeof width === 'number' ? {width: parseInt(width)} : {width: 88},
                    index === 0 ? {borderLeftWidth: 0} : null]}>
                    {row[prop] ? <Text style={styles.tableCell}>{row[prop]}</Text> : null}
                </View>
            })}
        </View>);
    }

    _renderTableBody(item) {
        const tableData = this.props.tableData;
        return (
            <FlatList style={styles.tableBody}
                // disabled={true}
                      data={tableData}
                      renderItem={({item, index}) => {
                          return this._renderTableRow(item, index)
                      }}
            >
            </FlatList>
        )
    }

    render() {


        return (
            <ScrollView onMoveShouldSetResponderCapture={this.onMoveShouldSetResponderCapture}  horizontal={true}>
                <View style={styles.table}>
                    {this._renderTableHead()}
                    {this._renderTableBody()}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    table: {
        justifyContent: 'flex-start'
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        backgroundColor: '#FFFFFF',
        marginLeft: -1,
        marginRight: -1
    },
    tableHeadRow: {
        backgroundColor: '#F9FFFB',
        marginLeft: 0,
        marginRight: 0,
    },
    tableHeadCell: {
        color: '#5CC57F'
    },
    tableCellContainer: {
        minWidth: 88,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 9,
        paddingBottom: 9,
        borderLeftWidth: 1,
        borderColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tableCell: {
        fontSize: 12,
        lineHeight: 18,
        color: '#616161'
    },
    tableBody: {
        borderColor: '#EEEEEE',
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    tableIosHeight: {
        // height: this.props.tableData.size * 37,
        maxHeight: screenHeight / 2
    },
    tableAndroidHeight: {}
});