import React from "react";
//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest
import {
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  AsyncStorage,
  Platform,
} from "react-native";
import { makeHTTPDriver } from "@cycle/http";
import StorybookUI from "./storybook";
import Expo from "expo";
import Rx from "rxjs/Rx";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { SearchScene, SearchScreen } from "./components/SearchScene";
import {
  LibrarySearchScene,
  PrefSearchScene,
} from "./components/LibrarySearchScene";
import { run } from "@cycle/rxjs-run";
import { AppLoading, Constants, WebBrowser, Location, Permissions } from "expo";
import { intent, model } from "./intent";
//const view = require('./view');

import {
  Cycle,
  withCycle,
  makeReactNativeDriver,
  CycleRoot,
  makeAsyncStorageDriver,
} from "./cycle-react-native";

import {
  StackNavigator,
  DrawerNavigator,
  NavigationActions,
} from "react-navigation";

import PropTypes from "prop-types";
import emptyFunction from "fbjs/lib/emptyFunction";

@withCycle
class LibraryLocation extends React.Component {
  static propTypes = {
    onLocation: PropTypes.func,
  };
  static defaultProps = {
    onLocation: emptyFunction,
  };
  state = {
    location: null,
    errorMessage: null,
  };
  componentWillMount() {
    //console.log("dn:",Constants.deviceName)

    /* if (Platform.OS === 'android' && !Constants.isDevice) {
     *   this.setState({
     *     errorMessage: '??Oops, this will not work on Sketch in an Android emulator. Try it on your device!'+Constants.deviceName,
     *   });
     * } else {*/
    this._getLocationAsync();
    /* }*/
  }
  _getLocationAsync = async () => {
    const {
      locationServicesEnabled,
      gpsAvailable,
      networkAvailable,
      passiveAvailable,
    } = await Expo.Location.getProviderStatusAsync();
    //console.log("st",{ locationServicesEnabled,gpsAvailable,networkAvailable,passiveAvailable })
    if (!locationServicesEnabled) {
      this.setState({
        errorMessage: "Location Service is not enabled",
      });
    }
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    }
    const location = await Location.getCurrentPositionAsync(
      Platform.OS === "android"
        ? { timeout: 1000, enableHighAccuracy: gpsAvailable }
        : {},
    ).catch(() => null); //{enableHighAccuracy:true}
    if (!location) {
      this.setState({
        errorMessage: "Location request timed out",
      });
      return;
    }
    this.props.onLocation(location);
    //this.setState({ location });
  };
  render() {
    console.log("rend", this.props);
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.props.location && this.props.libraries.length === 0) {
      text = "";
      //text = "近くに図書館がありません"
      //TODO:FIX ME!!
    } else if (this.props.location && this.props.libraries.length !== 0) {
      text = "";
      //text = JSON.stringify(this.state.location);
    }

    return (
      <View>
        <Text>{text}</Text>
      </View>
    );
  }
}

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Home" })],
});

class LibraryLocationScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: "現在地から図書館を探す",
      headerRight: (
        <Button
          title="Done"
          disabled={screenProps.selectedLibrary == "" ? true : false}
          onPress={() =>
            //navigation.navigate("Home")
            navigation.dispatch(resetAction)
          }
        />
      ),
    };
  };
  render() {
    const { params } = this.props.navigation.state;
    const { selectedLibrary, libraries, location } = this.props.screenProps;
    console.log("st", selectedLibrary, libraries, location); //,libraries.lengt
    return (
      <View>
        <LibraryLocation {...{ location, libraries }} selector="location" />
        <LibrarySearchScene
          data={libraries}
          extraData={{ selectedLibrary }}
          selector="libraries"
        />
      </View>
    );
  }
}

class LibraryListScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: `図書館を選択`,
      headerRight: (
        <Button
          title="Done"
          disabled={screenProps.selectedLibrary == "" ? true : false}
          onPress={() =>
            //navigation.navigate("Home")
            navigation.dispatch(resetAction)
          }
        />
      ),
    };
  };
  render() {
    const { params } = this.props.navigation.state;
    const { selectedLibrary, libraries } = this.props.screenProps;
    console.log(selectedLibrary);
    /* data={[
     *   {systemname:"埼玉県上尾市",description:"たちばな分館ほか",
     *    systemid:"Saitama_Ageo"},
     *   {systemname:"埼玉県嵐山町",description:"嵐山町立図書館ほか",
     *    systemid:"Saitama_Arashiyama"},
     *   {systemname:"埼玉県朝霞市",description:"内間木公民館ほか",
     *    systemid:"Saitama_Asaka"},
     * ]}*/
    return (
      <LibrarySearchScene
        data={libraries}
        extraData={{ selectedLibrary }}
        selector="libraries"
      />
      //        onPress={e=>console.log(e)}
    );
  }
}

class PrefSelectScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `都道府県から図書館を探す`,
  });
  render() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    //const screen = this.props.screenProps.screen;
    return (
      <PrefSearchScene
        onPress={e => navigate("LibraryList", { pref: e })}
        selector="pref"
      />
    );
  }
}

class SelectLibraryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `図書館を探す`,
  });
  render() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    //const screen = this.props.screenProps.screen;
    // https://github.com/react-community/react-navigation/blob/fafe68b8cba06b64e5cd63f48b0490856edd34b7/src/views/Header/HeaderBackButton.js#L34
    return (
      <View>
        <Button
          title="現在地から図書館を探す"
          onPress={() => navigate("LibraryLocation")}
        />
        <Button
          title="都道府県から図書館を探す"
          onPress={() => navigate("PrefSelect")}
        />
      </View>
    );
  }
}

class LoadingScreen extends React.Component {
  state = {
    isReady: false,
  };
  render() {
    const { navigation } = this.props;
    //'@MySuperStore:key'
    return (
      <AppLoading
        startAsync={() => {
          return AsyncStorage.getItem("CycleReactNativeEx");
        }}
        onFinish={() => {
          //console.log("fo")//undefined
          //this.setState({ isReady: true })
          if (this.props.screenProps.selectedLibrary) {
            navigation.dispatch(resetAction);
          } else {
            navigation.dispatch(
              NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: "SelectLibrary" }),
                ],
              }),
            );
          }
        }}
        onError={console.warn}
      />
    );
  }
}

// https://github.com/react-community/react-navigation/issues/1232
// screenProps
//const Navigator = DrawerNavigator({
const Navigator = StackNavigator({
  Loading: { screen: LoadingScreen },
  Home: { screen: SearchScreen },
  SelectLibrary: { screen: SelectLibraryScreen },
  LibraryLocation: { screen: LibraryLocationScreen },
  PrefSelect: { screen: PrefSelectScreen },
  LibraryList: { screen: LibraryListScreen },
});

function view(state$) {
  return state$.map(state => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={
            Platform.OS === "android"
              ? { paddingTop: Constants.statusBarHeight }
              : {}
          }
        />
        <Navigator screenProps={state} />
      </View>
    );
  });
}

//TODO:change top level props name
//TODO:clear search field
//TODO:set expo release-channel
//TODO:change library while searching
//https://docs.expo.io/versions/latest/guides/release-channels.html

function main({ RN, HTTP, AS }) {
  const actions = intent(RN, HTTP, AS);
  const state$ = model(actions);

  return {
    RN: view(state$.startWith("")), //view(model(intent(sources.DOM)))
    HTTP: actions.request$,
    AS: actions.storage$,
  };
}

run(main, {
  RN: makeReactNativeDriver(),
  HTTP: makeHTTPDriver(),
  AS: makeAsyncStorageDriver("CycleReactNativeEx"),
});

//module.exports = __DEV__ && typeof __TEST__ == 'undefined' ? StorybookUI : CycleRoot;

console.log(Expo.Constants.isDevice);
//test:both OK
//dev:storybook:
//expo0:not storybook->testflight?
//expo1:storybook
//module.exports = StorybookUI
//module.exports = Expo.Constants.manifest.extra.enableStoryBook || (__DEV__ && typeof __TEST__ == 'undefined') ? StorybookUI : CycleRoot;
//module.exports = Expo.Constants.isDevice ? CycleRoot : StorybookUI
//module.exports = Expo.Constants.isDevice ? App : StorybookUI

//module.exports = CycleRoot;
module.exports = StorybookUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
