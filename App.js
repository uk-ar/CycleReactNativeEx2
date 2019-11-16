import React from 'react';
import { TouchableOpacity,StyleSheet, Text, View,FlatList } from 'react-native';
import run from '@cycle/rxjs-run'
import { makeHTTPDriver } from '@cycle/http';
import StorybookUI from './storybook';
import Expo from 'expo'

import { SearchScene } from './components/SearchScene';


import {
  Cycle,
  withCycle,
  makeReactNativeDriver,
  CycleRoot,
} from './cycle-react-native';

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? "red" : "black";
    //this._onPress avoid changeing props in TouchableOpacity
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={{ color: textColor }}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class MultiSelectList extends React.PureComponent {
  state = {selected: (new Map(): Map<string, boolean>)};

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
    />
  );

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
function main({RN, HTTP}) {
  return {
    RN: RN.select('button').events('press')
          .do(args => console.log('foo0:', args))
          .map(ev => +1)
          .startWith(0)
          .scan((x,y) => x+y)
          .map(i =>
            <SearchScene
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
