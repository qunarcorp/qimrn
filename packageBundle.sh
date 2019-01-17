#!/bin/bash
#Author: lilulucas.li
if [ $# -lt 1 ];then
    echo "Error! Should enter Platform to Package bundle. 'ios' or 'android' ? "
    exit 2
fi

if [ ! -n "$2" ];then  
   echo "Defalut Release Package";
else  
   devPackage = "dev"
fi  

# ios打包

if [ "${1}" == "ios" ];then
    if [ "$devPackage" == "dev" ];then
       echo "开始iOS dev打包"
       react-native bundle --entry-file index.ios.js --bundle-output ./bundle/clock_in.ios.jsbundle --platform ios --assets-dest ./bundle --dev true *
       mkdir -p  ~/Desktop/clock_inBundle/
       cp -r ./bundle/ ~/Desktop/clock_inBundle/
       open ~/Desktop/clock_inBundle/
    else
       echo "开始 iOS Release打包"
       react-native bundle --entry-file index.ios.js --bundle-output ./bundle/clock_in.ios.jsbundle --platform ios --assets-dest ./bundle --dev false *
       mkdir -p  ~/Desktop/clock_inBundle/
       cp -r ./bundle/ ~/Desktop/clock_inBundle/
       open ~/Desktop/clock_inBundle/
    fi 

# Android打包
elif [ "${2} == android" ];then
      react-native bundle --entry-file index.android.js --bundle-output ./android/bundle/index.android.bundle --platform android --assets-dest ./andr#/bin/bash
      open ./android/bundle/
else
    echo "Error! Not Found Platform ${1}"
fi
