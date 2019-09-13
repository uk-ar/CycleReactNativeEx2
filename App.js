import React from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';

//NavigationStateUtils is deprecated since 0.43
//https://docs.expo.io/versions/latest/guides/routing-and-navigation.html
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

import run from '@cycle/rxjs-run'
//import Touchable from '@cycle/react-native/src/Touchable';
import PropTypes from 'prop-types';
import Rx from 'rxjs/Rx';

let handlers = {}

//https://facebook.github.io/react/docs/higher-order-components.html
function withCycle(WrappedComponent) {
  //actionTypes={}//{onLayout:"layout"}
  if(WrappedComponent.propTypes){
    //Object.getOwnPropertyNames( WrappedComponent.prototype ))
    functionNames = Object.keys(WrappedComponent.propTypes)
                          .filter((func)=>func.startsWith("on"))
    /* .forEach((key)=>
     *   actionTypes[key]=`${key.charAt(2).toLowerCase()}${key.slice(3)}`);*/
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
                       map[name] = handler
                       return map
                     }, {})//{}
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
    //payload: PropTypes.any
  }
  return CycleComponent;
}
Cycle = {
  Text: withCycle(Text)
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text onPress={()=>navigate('Chat',{user:'Aya'})}>HomeScreen?</Text>
        <Cycle.Text style={styles.button} selector="button">Increment</Cycle.Text>
      </View>
    )
    //</CycleRoot>
  }
}

Stack = StackNavigator({
  Home: {  screen: HomeScreen },
  Chat: {  screen: ChatScreen },
});

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

function main({RN}) {
  return {
    RN: RN.select('button').events('press')
          .do(args => console.log('foo0:', args))
          .map(ev => +1)
          .startWith(0)
          .scan((x,y) => x+y)
          .map(i =>
            <Stack/>
          ),
  };
}

run(main, {
  RN: makeReactNativeDriver()
});

export default CycleRoot

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
