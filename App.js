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

Stack = StackNavigator({
  Home: {  screen: HomeScreen },
  Chat: {  screen: ChatScreen },
});

const defaultGetStateForAction = Stack.router.getStateForAction;
console.log(Stack.router)
Stack.router.getStateForAction = (action, state) => {
  console.log(action, state)
  return defaultGetStateForAction(action, state);
};

const AppNavigator = StackNavigator({
  Home: {  screen: HomeScreen },
  Chat: {  screen: ChatScreen },
});
const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Home'));
reducer = (state=initialState,action)=>{
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
}
const navReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);

  console.log(nextState,state,action)
  //{index:0,routes:Array(1)},{index:0,routes:Array(1)},{type:"@@redux/INIT"}
  //{index:1,routes:Array(2)},{index:0,routes:Array(1)},{type:"Navigation/NAVIGATE",routeName:"Chat",params:{...}}
  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};
const appReducer = combineReducers({
  nav: navReducer,
});
//redux
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {state: initialState};
  }
  render() {
    console.log(this.props)

    return (
      <AppNavigator
        navigation={addNavigationHelpers({
            //callback when navigated
            //{type:"Navigation/NAVIGATE",routeName:"Chat",params:{user:"Aya"}
            //dispatch: (action)=>console.log(action),
            //dispatch: this.props.dispatch,
            dispatch: (action)=>{
              const state = this.state.state
              const nextState = AppNavigator
                .router.getStateForAction(action, state);
              console.log(nextState,state,action)
              this.setState({state:nextState || state})
            },
            //state: this.props.nav,//{index:0,routes:Array(1)}
            state: this.state.state,//{index:0,routes:Array(1)}
            //state:
        })}
      />
    )
  }
}

//custom navigator
class MyNavigator extends React.Component {
  static router = StackRouter({
    Home: { screen: HomeScreen },
    Chat: { screen: ChatScreen },
  }, {
    initialRouteName: 'Home',
  })
  render() {
    console.log(this.props)
    const { state, dispatch } = this.props.navigation;
    const { routes, index } = state;

    // Figure out what to render based on the navigation state and the router:
    const Component = MyRouter.getComponentForState(state);

    // The state of the active child screen can be found at routes[index]
    let childNavigation = { dispatch, state: routes[index] };
    // If we want, we can also tinker with the dispatch function here, to limit
    // or augment our children's actions

    // Assuming our children want the convenience of calling .navigate() and so on,
    // we should call addNavigationHelpers to augment our navigation prop:
    childNavigation = addNavigationHelpers(childNavigation);

    return <Component navigation={childNavigation} />;
  }
}

const MyRouter = StackRouter({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
})
const MyApp = ({ navigation }) => {
  console.log(navigation)
  return (
    <Card router={MyRouter} navigation={navigation} />
)};
MyApp.router = MyRouter;

const Navigator = StackNavigator({
  Home: {  screen: CycleRoot },
  Chat: {  screen: CycleRoot },
});

// https://github.com/react-community/react-navigation/issues/1232
// screenProps
const My = StackNavigator({
  //Home: {  screen: HomeScreen },
  Home: {  screen: (props)=>
    {
      screenProps=JSON.parse(props.screenProps)
      return(
        <SearchScene
          selector={"search"}
          {...screenProps}
        />)
    }
  },
  Chat: {  screen: ChatScreen },
});
// custom view and router
// https://snack.expo.io/H1Hciz3Wb
const Nav = ({ dispatch, navigationState }) => (
    <StackNavigator
      navigation={addNavigationHelpers({
        dispatch: dispatch,
        state: navigationState,
      })}
  screenProps={"foo"}
    />
);

const App1 = Nav({
  Home: {  screen: HomeScreen },
});


function view(state$) {
  return state$.map(({ searchedBooks, searchedBooksStatus,
                       booksLoadingState, selectedIndex }) =>
  {
    //console.log({searchedBooks, searchedBooksStatus, booksLoadingState})
    //return(<Stack />)
    // https://github.com/react-community/react-navigation/issues/740#issuecomment-288231202
    console.log("v:",searchedBooks)
    return(<App/>)
    //return(<Nav/>)
    //return(<App1/>)
    screenProps = JSON.stringify({searchedBooks,searchedBooksStatus,
                                  booksLoadingState, selectedIndex})
    return(<My
             screenProps={screenProps}
           />)
    return(
      <View style={{paddingTop:Expo.Constants.statusBarHeight}}>
        <FAIcon
          name={"gear"} size={20}
          style={{alignSelf:"center"}}
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
    return(<App/>)
    return(<Stack
             navigation={
               {state: (action,state)=>{
               console.log(action,state)
               defaultGetStateForAction(action, state);
             }}}/>)
    return(<Stack
             navigation={addNavigationHelpers({
                 /* dispatch: (a)=>{
                     console.log(a)
                     }, */
               state: (action,state)=>{
                   console.log(action,state)
                   defaultGetStateForAction(action, state);
                 },
               })}/>)
    return(<Stack showLoadingIcon={ booksLoadingState}/>)

  });
}

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
//module.exports = CycleRoot
//module.exports = Navigator
//module.exports = Root
module.exports = App
//module.exports = StorybookUI
//module.exports = Expo.Constants.manifest.extra.enableStoryBook || (__DEV__ && typeof __TEST__ == 'undefined') ? StorybookUI : CycleRoot;
//module.exports = Expo.Constants.isDevice ? CycleRoot : StorybookUI
//module.exports = Expo.Constants.isDevice ? App : StorybookUI
//module.exports = MyNavigator
//module.exports = MyApp


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
