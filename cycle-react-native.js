import React from 'react';
import PropTypes from 'prop-types';
import Rx from 'rxjs/Rx';
import { TouchableOpacity, View, Text } from 'react-native';
import {adapt} from '@cycle/run/lib/adapt';

let handlers = {}

//https://facebook.github.io/react/docs/higher-order-components.html
function withCycle(WrappedComponent) {
  if(WrappedComponent.propTypes){
    functionNames = Object.keys(WrappedComponent.propTypes)
                          .filter((func)=>func.startsWith("on"))
    //["onLayout","onPress"]
  }
  function findHandler(selector, evType) {
    console.log(handlers,selector,evType)
    if (handlers[selector].hasOwnProperty(evType)) {
      return handlers[selector][evType].send
    }
  }

  class CycleComponent extends React.Component {
    constructor(props) {
      super(props);
      const { selector, ...passThroughProps } = props;
      this.injectedProp =
        functionNames.map(
          name => [name, findHandler(selector,name)])
                     .filter(([_, handler]) => !!handler)
                     .reduce((map, [name, handler]) => {
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
    payload:  PropTypes.any
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

  return function reactNativeDriver(vtree$){
    sink$ = Rx.Observable.from(vtree$).shareReplay();
    sink$.subscribe()
    return {
      select(selector){
        return {
          observable: Rx.Observable.empty(),
          events: function events(ev) {
            evType = "on" + ev.charAt(0).toUpperCase()+ev.slice(1);
            handlers[selector] = handlers[selector] || {};
            handlers[selector][evType] = handlers[selector][evType] || createHandler();
            return handlers[selector][evType];
          },
        }
      }
    }
  }
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

export {
  Cycle,
  withCycle,
  makeReactNativeDriver,
  CycleRoot,
}