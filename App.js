import React from 'react';
import { TouchableOpacity,StyleSheet, Text, View,FlatList } from 'react-native';
import run from '@cycle/rxjs-run'
import { makeHTTPDriver } from '@cycle/http';
import StorybookUI from './storybook';
import Expo from 'expo'

import { SearchScene } from './components/SearchScene';

//const intent = require('./intent');
//const model = require('./model');
//const view = require('./view');

import {
  Cycle,
  withCycle,
  makeReactNativeDriver,
  CycleRoot,
} from './cycle-react-native';

function main({RN, HTTP}) {
  //const actions = intent(RN, HTTP);
  //const state$ = model(actions);
  return {
    RN: RN.select('search').events('press')
          .do(args => console.log('foo0:', args))
          .startWith(0)
          .map(i =>
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
          ),
  };
}

run(main, {
  RN: makeReactNativeDriver(),
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
