import React from 'react';
import PropTypes from 'prop-types';
import Rx from 'rxjs/Rx';
import { AsyncStorage,TouchableOpacity, View, Text } from 'react-native';
//import {adapt} from '@cycle/run/lib/adapt';
//import RxJSAdapter from '@cycle/rxjs-adapter';
import {adapt} from '@cycle/run/lib/adapt';

let handlers = {}

//https://facebook.github.io/react/docs/higher-order-components.html
function withCycle(WrappedComponent) {
  if(!WrappedComponent.propTypes){
    console.error("PropTypes is not set")
  }

  function findHandler(selector, evType) {
    if (!selector || !handlers[selector]){
      return null
    }
    if (handlers[selector].hasOwnProperty(evType)) {
      return handlers[selector][evType].send
    }
  }

  class CycleComponent extends React.Component {
    constructor(props) {
      super(props);
      const { selector, ...passThroughProps } = props;
      if(!selector) {
        console.error("The prop `selector` is not set")
      }

      const functionNames =
        Object.keys(WrappedComponent.propTypes)
              .filter((func)=>func.startsWith("on"))
      //["onLayout","onPress"]
      //console.log(WrappedComponent,functionNames)

      //used in render
      this.injectedProp =
        functionNames.map(
          name => [name, findHandler(selector,name)])
                     .filter(([_, handler]) => !!handler)
                     .reduce((map, [name, handler]) => {
                       //console.log(WrappedComponent,selector,name)
                       map[name] = this.props.payload === undefined ?
                                   handler :
                                   (...args) => handler(this.props.payload)
                       return map
                     }, {})//{"onPress":func}
    }

    render() {
      const { selector, ...passThroughProps } = this.props;
      return <WrappedComponent {...this.injectedProp} {...passThroughProps} />;
    }
  }
  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }
  CycleComponent.displayName = `CycleComponent(${getDisplayName(WrappedComponent)})`;
  CycleComponent.propTypes = {
    selector: PropTypes.string.isRequired,
    payload:  PropTypes.any//for ListItem onPress
  }
  return CycleComponent;
}

function makeReactNativeDriver(){
  function createHandler() {
    const handler = new Rx.Subject();
    handler.send = function sendIntoSubject(args) {
      handler.next(args)
    }
    return handler;
  }

  function reactNativeDriver(vtree$){
    //console.log(vtree$)
    sink$ = Rx.Observable.from(vtree$).shareReplay();
    //sink$ = vtree$.shareReplay();
    sink$
      //.do(args => console.log('rn:', args))
      .subscribe()
    return {
      select(selector){
        return {
          observable: Rx.Observable.empty(),
          events: function events(ev) {
            evType = "on" + ev.charAt(0).toUpperCase()+ev.slice(1);
            handlers[selector] = handlers[selector] || {};
            handlers[selector][evType] = handlers[selector][evType] || createHandler();
            return adapt(handlers[selector][evType]);
            //return handlers[selector][evType];
          },
        }
      }
    }
  }
  //reactNativeDriver.streamAdapter = RxJSAdapter;
  return reactNativeDriver;
}
class CycleRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {vtree: <View/>};
  }
  componentWillMount() {
    sink$.subscribe((vtree) => this.setState({vtree: vtree}))
  }
  render() {
    //console.log(handlers)
    return(
      this.state.vtree
    )
  }
}

Cycle = {
  Text: withCycle(Text),
  TouchableOpacity: withCycle(TouchableOpacity)
}

function makeAsyncStorageDriver(key) {
  function AsyncStorageDriver(outgoing$) {
    Rx.Observable
      .from(outgoing$)
      .flatMap((value)=>
        AsyncStorage.setItem(key,
                             JSON.stringify(value)))
      .subscribe()

    incoming$ = Rx.Observable
                  .fromPromise(AsyncStorage.getItem(key))
                  .map(e=>JSON.parse(e))
                  .merge(outgoing$);

    return adapt(incoming$);
  }

  return AsyncStorageDriver;
}

export {
  Cycle,
  withCycle,
  makeReactNativeDriver,
  CycleRoot,
  makeAsyncStorageDriver,
}
