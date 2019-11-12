import React from 'react';

import {
  ActivityIndicator,
  Text,
  View,
  Animated,
  Image,
  Platform,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  FlatList,
} from 'react-native';


class CloseableView extends React.Component {
  constructor(props) {
    super(props);
    this._animated = new Animated.Value(0);
  }

  render() {
    let { closed, style } = this.props
    Animated.timing(
      this._animated,{
        toValue: closed ? 0 : 1,
        duration: 250,
      }
    ).start();
    return (
      <Animated.View
        style={[{
            opacity: this._animated,
            height: this._animated.interpolate({
              inputRange:[0,1],
              outputRange:[0,83],
              extrapolate:'clamp'
            }),
            overflow:"hidden"
          },style]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

module.exports = { CloseableView };
