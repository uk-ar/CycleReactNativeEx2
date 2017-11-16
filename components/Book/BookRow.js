import React from 'react';

import {
  View,
  Text,
  ListView,
  ScrollView,
  findNodeHandle,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { SwipeableRow6, SwipeableRow3, SwipeableRow4, SwipeableRow5 } from './SwipeableRow';
import { genActions2, Action, Action2 } from './Action';
import emptyFunction from 'fbjs/lib/emptyFunction';
import Stylish from 'react-native-stylish';

const { width: WIDTH } = Dimensions.get('window');

class BookRow1 extends React.Component {
  constructor(props) {
    super(props);
    // console.log("const",props)
  }
  render() {
    const { bucket, ...props } = this.props;
    // console.log("br1 rend",this.props)
    return (
      <SwipeableRow3
        {...props}
        {...genActions2(bucket)}
      />
    );
  }
}

// for target bucket handling
class BookRow2 extends React.Component {
  constructor(props) {
    super(props);
    this.target = null;
  }
  render() {
    const { bucket, onCloseStart, onCloseEnd, close } = this.props;
    const { leftActions, rightActions } = genActions2(bucket);
    // console.log("row",close)
    return (
      <SwipeableRow4
        close={close}
        onCloseStart={() => {
          const { onCloseStart } = this.props;
            // console.log("close start",this.target,rowData,this.props)
          onCloseStart(this.target);// ,rowData,sectionID,rowID, highlightRow
        }}
        onCloseEnd={() => {
          const { onCloseEnd } = this.props;
            // console.log("close end",this.target,this.props)
          onCloseEnd(this.target);// ,rowData,sectionID,rowID, highlightRow
        }}
        renderLeftAction={(i, indexLock) => {
            // i,indexLock->next bucket
            // const { left, icon, text, backgroundColor, target } = this.props
            // console.log("left",leftActions[i],indexLock)
            // don't update target when indexLock
          if (!indexLock && leftActions[i]) {
            this.target = leftActions[i].target;
          }
          return (
            <Action2
              index={i} left
              bucket={bucket}
              indexLock={indexLock}
            />
          );
        }}
        renderRightAction={(i, indexLock) => {
            // don't update target when indexLock
            // console.log("i,index:", i, indexLock)
          if (!indexLock && rightActions[i]) {
            this.target = rightActions[i].target;
          }
          return (<Action2
            index={i} left={false}
            bucket={bucket}
            indexLock={indexLock}
          />);
        }}
      >
        {this.props.children}
      </SwipeableRow4>
    );
  }
}

// for target bucket handling
class BookRow3 extends React.Component {
  constructor(props) {
    super(props);
    this.target = null;
  }
  render() {
    const { bucket, onCloseStart, onCloseEnd, close, ...props } = this.props;
    const { leftActions, rightActions } = genActions2(bucket);
    // console.log("la:",leftActions,rightActions)
    // onResponderMove
    //      <SwipeableRow5
    return (
      <SwipeableRow6
        {...props}
        close={close}
        onCloseStart={() => {
          const { onCloseStart } = this.props;
            // console.log("close start",this.target,rowData,this.props)
          onCloseStart(this.target);// ,rowData,sectionID,rowID, highlightRow
        }}
        onCloseEnd={() => {
          const { onCloseEnd } = this.props;
            // console.log("close end",this.target,this.props)
          onCloseEnd(this.target);// ,rowData,sectionID,rowID, highlightRow
          }}
        renderLeftAction={(i, indexLock) => {
            // i,indexLock->next bucket
            // don't update target when indexLock
            //console.log("i:",i,indexLock)
            //console.log("left")
          if (!indexLock && leftActions[i]) {
            this.target = leftActions[i].target;
          }
            // Stylish.View is heavy?
            // animationConfig={{duration:100}}
            return (
            <View
              style={{
                flex: 1,
                justifyContent: 'center', // vertical Center
                /* backgroundColor: leftActions[i] &&
                    leftActions[i].backgroundColor, */
              }}
            >
              <Action
                {...leftActions[i]}
                style={[
                  leftActions[i].style,
                  indexLock && { width: WIDTH + 100 }
                ]}
                      />
            </View>
          );
        }}
        renderRightAction={(i, indexLock) => {
            // don't update target when indexLock
          if (!indexLock && rightActions[i]) {
            this.target = rightActions[i].target;
          }
            //console.log("right")
          return (
            <Stylish.View
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: rightActions[i].backgroundColor,
              }}
            >
              <Action
                {...rightActions[i]}
                style={[
                  rightActions[i].style,
                  indexLock && { width: WIDTH + 100 }
                ]}
              />
            </Stylish.View>
          );
        }}
      >
        {this.props.children}
      </SwipeableRow6>
    );
  }
}

BookRow3.propTypes = {
  ...View.propTypes,
  onCloseStart: React.PropTypes.func.isRequired,
  onCloseEnd: React.PropTypes.func.isRequired,
  close: React.PropTypes.bool.isRequired,
  bucket: React.PropTypes.string.isRequired,
};

BookRow3.defaultProps = {
  ...View.defaultProps,
  onCloseStart: emptyFunction,
  onCloseEnd: emptyFunction,
  close: false,
  //bucket: null,
};

module.exports = { BookRow1, BookRow2, BookRow3 };
