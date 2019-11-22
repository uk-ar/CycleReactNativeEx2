import React from 'react';
import { TouchableOpacity,StyleSheet, Text, View,FlatList } from 'react-native';
import { makeHTTPDriver } from '@cycle/http';
import StorybookUI from './storybook';
import Expo from 'expo'
import Rx from 'rxjs/Rx';
import { SearchScene } from './components/SearchScene';
import { run } from '@cycle/rxjs-run';

import { intent,model } from './intent';
//const view = require('./view');

import {
  Cycle,
  withCycle,
  makeReactNativeDriver,
  CycleRoot,
} from './cycle-react-native';

function view(state$) {
  return state$.map(({searchedBooks, searchedBooksStatus, booksLoadingState}) =>{
    console.log({searchedBooks, searchedBooksStatus, booksLoadingState})
    return (
      <SearchScene
        selector={"search"}
        showLoadingIcon={ booksLoadingState}
        selectedIndex={1}
        rejects={[]}
        extraData={searchedBooksStatus}
        data={searchedBooks}
      />)
  });
}

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
module.exports = Expo.Constants.manifest.extra.enableStoryBook || (__DEV__ && typeof __TEST__ == 'undefined') ? StorybookUI : CycleRoot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
