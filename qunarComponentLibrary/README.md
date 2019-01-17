
# react-native-qunar-component-library

## Getting started

`$ npm install react-native-qunar-component-library --save`

### Mostly automatic installation

`$ react-native link react-native-qunar-component-library`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-qunar-component-library` and add `RNQunarComponentLibrary.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNQunarComponentLibrary.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNQunarComponentLibraryPackage;` to the imports at the top of the file
  - Add `new RNQunarComponentLibraryPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-qunar-component-library'
  	project(':react-native-qunar-component-library').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-qunar-component-library/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-qunar-component-library')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNQunarComponentLibrary.sln` in `node_modules/react-native-qunar-component-library/windows/RNQunarComponentLibrary.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Qunar.Component.Library.RNQunarComponentLibrary;` to the usings at the top of the file
  - Add `new RNQunarComponentLibraryPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNQunarComponentLibrary from 'react-native-qunar-component-library';

// TODO: What to do with the module?
RNQunarComponentLibrary;


react-native bundle --entry-file index.js --dev false --bundle-output ./android/bundle/index.android.bundle --platform android --assets-dest ./android/bundle*

```
  