import React from 'react';
import { Animated,Text,View } from 'react-native';
import { ButtonGroup, SearchBar } from 'react-native-elements';
import materialColor from 'material-colors';
import { BookList, BookCell,LibraryStatus,icons,Book,libraryStatuses} from './Book/BookCell';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import PropTypes from 'prop-types';
import { withCycle } from '../cycle-react-native';

@withCycle
class SearchScene extends React.Component {
  static propTypes = {
    onChangeText:PropTypes.func,
    onClearText:PropTypes.func,
    onChangeFilter:PropTypes.func,
    onPress:PropTypes.func,
    onEndReached:PropTypes.func,
    onPressSetting:PropTypes.func
  }
  render () {
    let { onChangeText,onClearText,onChangeFilter,onPress,onEndReached,
          onPressSetting,
          showLoadingIcon,selectedIndex,data,searchedBooksStatus,
    } = this.props
    rejects = [[],["noCollection"],["noCollection","onLoan"]]
    extraData = {
      ...searchedBooksStatus,
      rejects:rejects[selectedIndex]
    }//学習漫画
    return (
      <View>
        <View style={{flexDirection:"row"}}>
          <SearchBar
            containerStyle={{
              backgroundColor: materialColor.grey['50'],
              flex:1
            }}
            inputStyle={{
              backgroundColor: materialColor.grey['200']
            }}
            lightTheme
            showLoadingIcon={showLoadingIcon}
            onChangeText={onChangeText}
            placeholder='Type Here...' />
          <FAIcon
            name={"gear"} size={20}
            style={{alignSelf:"center",padding:10}}
            onPress={onPressSetting}
          />
        </View>
        <ButtonGroup
          onPress={onChangeFilter}
          selectedIndex={selectedIndex}
          buttons={['全て', '蔵書あり', '貸出可']}
          containerStyle={{height: 30}}/>
        <BookList
          onPress={onPress}
          onEndReached={onEndReached}
          data={data}
          extraData={extraData}
        />
      </View>
    )
  }
}

module.exports = { SearchScene };
