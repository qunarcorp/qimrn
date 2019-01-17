import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RootSiblings from 'react-native-root-siblings';

export default class Modal{
  constructor(options) {
    this.modal = null;
    this.options = options;
    this.closeModal = this.closeModal.bind(this);
    this.submitModal = this.submitModal.bind(this);
  }
  closeModal(){
    if(this.modal){
      this.modal.destroy();
      if(typeof this.options.CloseHandle === 'function'){
        this.options.CloseHandle();
      }
    }
  }
  submitModal(){
    if(this.modal){
      this.modal.destroy();
      if(typeof this.options.firtBtnPressHandle === 'function'){
        this.options.firtBtnPressHandle();

      }
    }
  }
  _renderModal() {
    const options = this.options;
    return (
      <View style={style.modal}>
        <View style={style.modalDialog}>
          <Text style={style.modalHeader}>
            {options.title}
          </Text>
          <Text style={style.modalContent}>
            {options.detail}
          </Text>
          <View style={[style.modalFooter, style.rowBtn]}>
            <View style={[style.modalBtn, style.closeBtn]}>
              <TouchableOpacity onPress={this.closeModal}>
                <Text style={style.closeBtnText}>关闭</Text>
              </TouchableOpacity>
            </View>
            <View style={style.modalBtn}>
              <TouchableOpacity onPress={this.submitModal}>
                <Text style={style.btnText}>{options.firtBtnTitle}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
  showModal(){
    this.modal = new RootSiblings(this._renderModal());
  }
  closeModal(){
    this.modal.destroy();
  }
}
const style = StyleSheet.create({
  container: {
    height: 0,
    width: 0
  },
  modal: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  modalDialog: {
    width: 270,
    borderRadius: 14,
    backgroundColor: '#fff'
  },
  modalHeader: {
    marginTop: 20,
    lineHeight: 36,
    fontSize: 18,
    textAlign: 'center',
    color: '#212121'
  },
  modalContent: {
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20,
    lineHeight: 21,
    fontSize: 15,
    color: '#9e9e9e'
  },
  modalFooter: {
    marginTop: 20
  },
  rowBtn: {
    flexDirection: 'row'
  },
  modalBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderTopWidth: 1,
    borderColor: '#dddddd'
  },
  closeBtn: {
    borderRightWidth: 1,
    color: '#212121'
  },
  btnText: {
    fontSize: 18,
    color: '#108EE9'
  },
  closeBtnText: {
    fontSize: 18,
    color: '#212121'
  }
});