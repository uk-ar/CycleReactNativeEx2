import React from 'react';
import { TouchableOpacity,StyleSheet, Text, View,FlatList } from 'react-native';
import run from '@cycle/rxjs-run'

import {
  Cycle,
  withCycle,
  makeReactNativeDriver,
  CycleRoot,
} from './cycle-react-native';

function main({RN}) {
  return {
    RN: RN.select('button').events('press')
          .do(args => console.log('foo0:', args))
          .map(ev => +1)
          .startWith(0)
          .scan((x,y) => x+y)
          .map(i =>
            <FlatList
            data={[{key: 'a'}, {key: 'b'},{key: 'c'}]}
              renderItem={({item}) =>
                <Cycle.TouchableOpacity selector="button" payload={item}>
                  <View>
                    <Text style={{  }}>
                                {//this.props.title
                                 //onPress={()=>console.log("press")}
                      }
                      {item.key}
                    </Text>
                  </View>
                </Cycle.TouchableOpacity>}
            />
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
