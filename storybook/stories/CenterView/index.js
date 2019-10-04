import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const CenterView =
  props =>
    <View style={styles.main}>
      {props.children}
    </View>;

const CenterLeftView =
  props =>
    <View style={styles.left}>
      {props.children}
    </View>;

CenterView.propTypes = {
  children: PropTypes.node.isRequired,
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  }
})
module.exports = { CenterView,CenterLeftView };
