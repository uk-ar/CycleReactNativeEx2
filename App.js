import React from 'react';
import { TouchableOpacity,StyleSheet, Text, View,FlatList } from 'react-native';
import { makeHTTPDriver } from '@cycle/http';
import StorybookUI from './storybook';
import Expo from 'expo'
import Rx from 'rxjs/Rx';
import { SearchScene } from './components/SearchScene';
import { run } from '@cycle/rxjs-run';
//import RxAdapter from '@cycle/rx-adapter';

//const intent = require('./intent');
//const model = require('./model');
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
  //const actions = intent(RN, HTTP);
  //const state$ = model(actions);
  //state$.map((e)=>console.log(e))//.subscribe()
  //view(state$.startWith("")).subscribe()
  s1$ = RN.select('search').events('press').shareReplay()
  s2$ = RN.select('search').events('changeText').shareReplay()

  const c1$ = Rx.Observable
                    .combineLatest(
                      s1$,
                      s2$,
                      (a,b)=>[a,b]
                    )
                .do(args => console.log('c1:', args))
                //.subscribe()
  return {
    /* "@cycle/run": "3.4.0",
     * "@cycle/rxjs-run": "7.3.0",
     */
    //view(state$.startWith("")).subscribe()
    RN: c1$//.state1$//.//state1$//RN.select('search').events('press').startWith(0)//
          .startWith(0)
          //.do(args => console.log('foo0:', args))
          .map(({weight, height, bmi}) =>
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
          )
    //RN: view(state$.startWith(""))//view(actions.press$.startWith(""))//state$)
  };
}

//const RNDriver = makeReactNativeDriver('CycleReactNativeEx');
run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  //sink$ => RNDriver(sink$, RxJSAdapter),
  //HTTP: makeHTTPDriver()
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
