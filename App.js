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

import { intent,model } from './intent';
//const view = require('./view');

import { createStore,combineReducers } from 'redux';
import { Provider,connect } from 'react-redux';

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
    title: `Chat with ${navigation.state.params.user}`,
  });
  render() {
    // The screen's current route is passed in to `props.navigation.state`:
    const { params } = this.props.navigation.state;
    return (
      <View>
        <Text>Chat with {params.user}</Text>
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };
  render() {
    const { navigate } = this.props.navigation;
    console.log(this.props)
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text onPress={()=>navigate('Chat',{user:'Aya'})}>HomeScreen?</Text>
        <Cycle.Text style={styles.button} selector="button">Increment</Cycle.Text>
      </View>
    )
  }
}

const Navigator = StackNavigator({
  Home: {  screen: CycleRoot },
  Chat: {  screen: CycleRoot },
});

// https://github.com/react-community/react-navigation/issues/1232
// screenProps
const My = StackNavigator({
  Home: {  screen: (props)=>
    {
      console.log(props)
      let { searchedBooks, searchedBooksStatus,
            booksLoadingState, selectedIndex } = props.screenProps
      const { navigate } = props.navigation;
      return(
        <View>
          <FAIcon
            name={"gear"} size={20}
            style={{alignSelf:"center"}}
            onPress={()=>navigate('Chat',{user:'Aya'})}
          />
          <SearchScene
            selector={"search"}
            showLoadingIcon={ booksLoadingState}
            selectedIndex={ selectedIndex }
            searchedBooksStatus={searchedBooksStatus}
            data={searchedBooks}
          />
        </View>
      )
    }
  },
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
    return(<My
             screenProps={screenProps}
           />)
  })
}
//TODO:change top level props name
//TODO:set library
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
