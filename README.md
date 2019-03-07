公有云（Startalk APP）
=====
基于Startalk服务器及客户端，用户可建立属于自己的域,

注册账号、新建域、添加域用户、下载客户端、配置域导航，

仅需5步，您就可以拥有强大的im能力，

客户端下载[下载](https://im.qunar.com/new/#/download)

客户端导航配置[配置导航](https://im.qunar.com/new/#/platform/access_guide/manage_nav?id=manage_nav_mb)

私有云（Startalk SDK）
=====
Startalk私有云是一种去中心化的部署方式，

用户或企业将Startalk后端代码完全部署在自己的服务器上，

选择SDK嵌入自己的APP中，

每个公司都是一个单独的节点，每个节点独立运营，数据只保存在节点中

## 项目介绍
Startalk移动端的React-Native项目，目前使用的React-Native版本为0.54.

## 工程配置:
1. 通过git下载qimrn项目到本地
2. 在根目录下执行`npm install`
3. 打开`node_modules`目录下的`react-native-calendats/src/index.js`, 添加`export {parseDate, xdateToData} from '../src/interface';`

## 真机调试
1. iOS真机调试

	```	
	1. 在qimrn项目根目录下执行npm start
	2. 打开IMSDK-iOS项目中的QIMRNBodule.m文件
	3. 编辑+(NSURL *)getJsCodeLocation方法
	4. 在第一行新加 return [NSURL URLWithString:@"http://你的本机ip:8081/index.ios.bundle?platform=ios&dev=true"];
	```
2. 安卓真机调试
    ```
    1. 在qimrn项目根目录下执行npm start
    2. 调用QIMSDK.getInstance().openDebug()打开debug模式//最好在application里面调用
    3. 手机摇一摇，设置debug的本地ip和端口8081
    4. reload相关RN页面
    ```
## 离线包调试
1. iOS离线包调试
	
	```	
	1. 在qimrn项目根目录下执行bash packageBuild ios
	2. 复制Build出来的clock_in.ios.jsbundle文件及assets文件夹到IMSDK-iOS项目下/你的项目的QIMRNKit.bundle中
	3. Clean IMSDK-iOS项目/你的项目
	4. 重新运行IMSDK-iOS项目/你的项目
	```
2. 安卓离线包调试
	```	
	1.在qimrn项目根目录下执行react-native bundle --entry-file index.android.js --dev false --bundle-output ./android/bundle/index.android.bundle --platform android --assets-dest ./android/bundle
	2.蒋android/bundle目录下的index.android.bundle文件名称修改为index.androidserver.bundle
	3.复制index.androidserver.bundle文件到native工程app下的assets目录
	```
