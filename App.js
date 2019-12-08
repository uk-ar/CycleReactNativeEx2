import React from 'react';
import {
  StatusBar,TouchableOpacity,StyleSheet, Text, View,FlatList,Button
} from 'react-native';
import { makeHTTPDriver } from '@cycle/http';
import StorybookUI from './storybook';
import Expo from 'expo'
import Rx from 'rxjs/Rx';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { SearchScene } from './components/SearchScene';
import { run } from '@cycle/rxjs-run';
import { Constants, WebBrowser } from 'expo';

import { intent,model } from './intent';
//const view = require('./view');

import {
  Cycle,
  withCycle,
  makeReactNativeDriver,
  CycleRoot,
} from './cycle-react-native';

import {
  Card,
  CardStack,
  StackRouter,
  StackNavigator,
  addNavigationHelpers,
} from 'react-navigation';

class ChatScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: `Setting`,
  });
  render() {
    const { params } = this.props.navigation.state;
    return (
      <View>
        <Text>Hello world</Text>
      </View>
    );
  }
}

class SearchScreen extends React.Component {
  static navigationOptions = {
    title: 'Search'
  };
  render() {
    const { navigate } = this.props.navigation;
    const { searchedBooks, searchedBooksStatus,
            booksLoadingState, selectedIndex } = this.props.screenProps

    return(
      <SearchScene
        selector={"search"}
        showLoadingIcon={ booksLoadingState}
        selectedIndex={ selectedIndex }
        searchedBooksStatus={searchedBooksStatus}
        onPressSetting={()=>navigate('Chat',{user:'Aya'})}
        onPress={async ({item,index})=>{
            const url = searchedBooksStatus[item.isbn].reserveUrl
            if(url){
              let result = await WebBrowser.openBrowserAsync(url);
              console.log(result)
            }
          }}
        data={searchedBooks}
      />
    )
  }
}

// https://github.com/react-community/react-navigation/issues/1232
// screenProps
const Navigator = StackNavigator({
  Home: {  screen: SearchScreen },
  Chat: {  screen: ChatScreen },
});

function view(state$) {
  return state$.map(({ searchedBooks, searchedBooksStatus,
                       booksLoadingState, selectedIndex }) =>
  {
    //console.log({searchedBooks, searchedBooksStatus, booksLoadingState})
    console.log("v:",searchedBooks)
    screenProps = {searchedBooks,searchedBooksStatus,
                   booksLoadingState, selectedIndex}
    return(<Navigator
             screenProps={screenProps}
           />)
  })
}
//TODO:search history
//TODO:change top level props name
//TODO:set library_id
//TODO:clear search field
//TODO:set expo release-channel
//https://docs.expo.io/versions/latest/guides/release-channels.html

function main({RN, HTTP}) {
  const actions = intent(RN, HTTP);
  const state$ = model(actions);
  return {
    RN: view(state$.startWith("")),//view(model(intent(sources.DOM)))
    HTTP: actions.request$
  };
}

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeHTTPDriver()
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
