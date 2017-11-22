import React from 'react';
import { Animated,Text,View } from 'react-native';
import { ButtonGroup, SearchBar } from 'react-native-elements';
import materialColor from 'material-colors';
import { BookList, BookCell,LibraryStatus,icons,Book,libraryStatuses} from './Book/BookCell';

import PropTypes from 'prop-types';
import { withCycle } from '../cycle-react-native';

@withCycle
class SearchScene extends React.Component {
  static propTypes = {
    onChangeText:PropTypes.func,
    onClearText:PropTypes.func,
    onChangeFilter:PropTypes.func,
    onPress:PropTypes.func,
  }
  render () {
    let { onChangeText,onClearText,onChangeFilter,onPress,
          showLoadingIcon,selectedIndex,rejects,data,extraData
    } = this.props
    return (
      <View>
        <SearchBar
          containerStyle={{
            backgroundColor: materialColor.grey['50']
          }}
          inputStyle={{
            backgroundColor: materialColor.grey['200']
          }}
          lightTheme
          showLoadingIcon={showLoadingIcon}
          onChangeText={onChangeText}
          onClearText={onClearText}
          placeholder='Type Here...' />
        <ButtonGroup
          onPress={onChangeFilter}
          selectedIndex={selectedIndex}
          buttons={['全て', '蔵書あり', '貸出可']}
          containerStyle={{height: 30}}/>
        <BookList
          rejects={rejects}
          onPress={onPress}
          data={data}
          extraData={extraData}
        />
      </View>
    )
  }
}

module.exports = { SearchScene };
