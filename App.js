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

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Text onPress={()=>navigate('Chat',{user:'Aya'})}>HomeScreen?</Text>
          <Text style={styles.button} selector="button">Increment</Text>
        </View>
    )
          //</CycleRoot>
  }
}

Stack = StackNavigator({
  Home: {  screen: HomeScreen },
  Chat: {  screen: ChatScreen },
});

import run from '@cycle/rxjs-run'
//import Touchable from '@cycle/react-native/src/Touchable';
import PropTypes from 'prop-types';
import Rx from 'rxjs/Rx';

function makeReactNativeDriver(){
  return function reactNativeDriver(vtree$){
    sink$ = Rx.Observable.from(vtree$).shareReplay();
    sink$.subscribe()
    return {
      select(){
        return Rx.Observable.empty();
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
    return(
      this.state.vtree
    )
  }
}

function main({RN}) {
  return {
    RN: RN.select('button')//.events('press')
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
