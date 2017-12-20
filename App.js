import React from 'react';
import {
  StatusBar,TouchableOpacity,StyleSheet, Text, View,FlatList,Button,
  AsyncStorage,
} from 'react-native';
import { makeHTTPDriver } from '@cycle/http';
import StorybookUI from './storybook';
import Expo from 'expo'
import Rx from 'rxjs/Rx';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { SearchScene } from './components/SearchScene';
import { LibrarySearchScene,PrefSearchScene } from './components/LibrarySearchScene';
import { run } from '@cycle/rxjs-run';
import { Constants, WebBrowser } from 'expo';

import { intent,model } from './intent';
//const view = require('./view');

import {
  Cycle,
  withCycle,
  makeReactNativeDriver,
  CycleRoot,
  makeAsyncStorageDriver,
} from './cycle-react-native';

import {
  Card,
  CardStack,
  StackRouter,
  StackNavigator,
  addNavigationHelpers,
} from 'react-navigation';

class LibrarySelectScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: `Library Select`,
  });
  render() {
    const { params } = this.props.navigation.state;
    const selectedLibrary = this.props.screenProps.selectedLibrary;
    console.log(selectedLibrary)
    return (
      <LibrarySearchScene
        data={[
          {systemname:"埼玉県上尾市",description:"たちばな分館ほか",
           systemid:"Saitama_Ageo"},
          {systemname:"埼玉県嵐山町",description:"嵐山町立図書館ほか",
           systemid:"Saitama_Arashiyama"},
          {systemname:"埼玉県朝霞市",description:"内間木公民館ほか",
           systemid:"Saitama_Asaka"},
        ]}
      extraData={{selectedLibrary}}
      selector="libraries"
      />
      //        onPress={e=>console.log(e)}
    );
  }
}

class PrefSelectScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: `Setting`,
  });
  render() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    return (
      <PrefSearchScene
        onPress={e=>navigate("LibrarySelect",{pref:e})}
      />
    );
  }
}

class SearchScreen extends React.Component {
  static navigationOptions = {
    title: 'Book Search'
  };
  render() {
    const { navigate } = this.props.navigation;
    return(
      <SearchScene
        selector={"search"}
        {...this.props.screenProps}
        onPressSetting={()=>navigate('Chat',{user:'Aya'})}
        onPress={async ({item,index})=>{
            const url = searchedBooksStatus[item.isbn].reserveUrl
            if(url){
              let result = await WebBrowser.openBrowserAsync(url);
              console.log(result)
            }
          }}
      />
    )
  }
}

// https://github.com/react-community/react-navigation/issues/1232
// screenProps
const Navigator = StackNavigator({
  Home: {  screen: SearchScreen },
  Chat: {  screen: PrefSelectScreen },
  LibrarySelect: {  screen: LibrarySelectScreen },
});

function view(state$) {
  return state$.map((state) =>
  {
    return(
      <Navigator
        screenProps={state}
      />)
  })
}
//TODO:search history
//TODO:change top level props name
//TODO:set library_id
//TODO:clear search field
//TODO:set expo release-channel
//https://docs.expo.io/versions/latest/guides/release-channels.html

function main({RN, HTTP, AS}) {
  const actions = intent(RN, HTTP, AS);
  const state$ = model(actions);

  return {
    RN: view(state$.startWith("")),//view(model(intent(sources.DOM)))
    HTTP: actions.request$,
    AS: actions.searchHistory$.skip(1),
  };
}

run(main, {
  RN: makeReactNativeDriver(),
  HTTP: makeHTTPDriver(),
  AS: makeAsyncStorageDriver('CycleReactNativeEx')
});

//module.exports = __DEV__ && typeof __TEST__ == 'undefined' ? StorybookUI : CycleRoot;

console.log(Expo.Constants.isDevice)
//test:both OK
//dev:storybook:
//expo0:not storybook->testflight?
//expo1:storybook
module.exports = CycleRoot
//module.exports = StorybookUI
//module.exports = Expo.Constants.manifest.extra.enableStoryBook || (__DEV__ && typeof __TEST__ == 'undefined') ? StorybookUI : CycleRoot;
//module.exports = Expo.Constants.isDevice ? CycleRoot : StorybookUI
//module.exports = Expo.Constants.isDevice ? App : StorybookUI

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
