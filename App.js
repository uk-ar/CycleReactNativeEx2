import React from 'react';
import { TouchableOpacity,StyleSheet, Text, View,FlatList } from 'react-native';
import { makeHTTPDriver } from '@cycle/http';
import StorybookUI from './storybook';
import Expo from 'expo'
import Rx from 'rxjs/Rx';
import { SearchScene } from './components/SearchScene';
import { run } from '@cycle/rxjs-run';

const intent = require('./intent');
const model = require('./model');
//const view = require('./view');

import {
  Cycle,
  withCycle,
  makeReactNativeDriver,
  CycleRoot,
} from './cycle-react-native';

function view(state$) {
  return state$.map(({weight, height, bmi}) =>
    <SearchScene
      selector={"search"}
      showLoadingIcon={true}
      selectedIndex={1}
      rejects={[]}
      data={[{
          isbn:'9784834032147',
          title:'guri & gura',
          author:'author foo',
          thumbnail:'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
          bucket:"liked",
          status:"rentable",
        }]}
    />
  );
}

function main({RN, HTTP}) {
  console.log(HTTP)
  const actions = intent(RN, HTTP);
  const state$ = model(actions);
  //state$.map((e)=>console.log(e))//.subscribe()
  //view(state$.startWith("")).subscribe()
  return {
    //view(state$.startWith("")).subscribe()
    RN: view(state$.startWith("")),//view(model(intent(sources.DOM)))
    HTTP: actions.requestSearchedBooks$//request$
  };
}

//const RNDriver = makeReactNativeDriver('CycleReactNativeEx');
run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  //sink$ => RNDriver(sink$, RxJSAdapter),
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
