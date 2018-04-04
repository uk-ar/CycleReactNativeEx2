import React from "react";
import {
  Animated,
  Text,
  View,
  FlatList,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { ButtonGroup, SearchBar } from "react-native-elements";
import materialColor from "material-colors";
import {
  BookList,
  BookCell,
  LibraryStatus,
  icons,
  Book,
  libraryStatuses,
  BookDetail,
} from "./BookCell";
import { WebBrowser } from "expo";
import { TouchableElement } from "./common";
import FAIcon from "react-native-vector-icons/FontAwesome";
import emptyFunction from "fbjs/lib/emptyFunction";

import PropTypes from "prop-types";
import { withCycle } from "../cycle-react-native";
import { createStackNavigator, StackNavigator } from "react-navigation";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  cell: {
    flexDirection: "row",
    backgroundColor: materialColor.grey["50"], //for TouchableElement
  },
  border: {
    flex: 1,
    //marginRight:10,
    padding: 5,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    //borderTopWidth: StyleSheet.hairlineWidth
  },
});

class SearchHistory extends React.PureComponent {
  _keyExtractor = (item, index) => item.query;
  static defaultProps = {
    onPress: emptyFunction,
  };
  _renderItem = ({ item, index }) => {
    const { onPress } = this.props;
    return (
      <TouchableElement
        onPress={() => {
          onPress(item);
          // https://github.com/facebook/react-native/issues/15618
          // To fix first touch
          Keyboard.dismiss();
        }}
      >
        <View style={[styles.cell, styles.border]}>
          <FAIcon
            name={"search"}
            size={16}
            style={{
              alignSelf: "center",
              margin: 5,
            }}
          />
          <Text
            style={{
              alignSelf: "center",
              margin: 5,
            }}
          >
            {item.query}
          </Text>
        </View>
      </TouchableElement>
    );
  };
  _renderHeader = () => {
    return (
      <View>
        <Text
          style={{
            margin: 5,
          }}
        >
          履歴
        </Text>
      </View>
    );
  };
  render() {
    return (
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        data={this.props.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListHeaderComponent={this._renderHeader}
      />
    );
  }
}

@withCycle
class SearchScene extends React.Component {
  static propTypes = {
    onChangeText: PropTypes.func,
    onClearText: PropTypes.func,
    onChangeFilter: PropTypes.func,
    onPress: PropTypes.func,
    onEndReached: PropTypes.func,
    onPressSetting: PropTypes.func,
    onSubmitEditing: PropTypes.func,
  };
  static defaultProps = {
    onChangeText: emptyFunction,
  };
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.defaultText,
    };
  }
  _onChangeText = text => {
    this.props.onChangeText(text);
    this.setState({ text });
    //TODO:clear searchedBooks
  };
  _onPressHistory = ({ query }) => {
    this.props.onChangeText(query);
    this.props.onSubmitEditing();
    this.setState({ text: query });
  };
  render() {
    const {
      onChangeText,
      onClearText,
      onChangeFilter,
      onPress,
      onEndReached,
      onPressSetting,
      onSubmitEditing,
      onDetail,
      booksPagingState,
      booksLoadingState,
      searchedBooks,
      selectedIndex,
      searchedBooksStatus,
      searchHistory,
      defaultText,
    } = this.props;
    rejects = [[], ["noCollection"], ["noCollection", "onLoan"]];
    extraData = {
      ...searchedBooksStatus,
      rejects: rejects[selectedIndex],
    }; //学習漫画
    list = this.state.text ? (
      <BookList
        onPress={onPress}
        onEndReached={onEndReached}
        onDetail={onDetail}
        data={searchedBooks}
        extraData={extraData}
        booksPagingState={booksPagingState}
      />
    ) : (
      <SearchHistory onPress={this._onPressHistory} data={searchHistory} />
    );
    //Change TextInput value
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <SearchBar
            containerStyle={{
              backgroundColor: materialColor.grey["50"],
              flex: 1,
            }}
            inputStyle={{
              backgroundColor: materialColor.grey["200"],
            }}
            value={this.state.text}
            lightTheme
            showLoadingIcon={booksLoadingState}
            onChangeText={this._onChangeText}
            onSubmitEditing={onSubmitEditing}
            placeholder="Type Here..."
          />
          <FAIcon
            name={"gear"}
            size={20}
            style={{ alignSelf: "center", padding: 10 }}
            onPress={onPressSetting}
          />
        </View>
        <ButtonGroup
          onPress={onChangeFilter}
          selectedIndex={selectedIndex}
          buttons={["全て", "蔵書あり", "貸出可"]}
          containerStyle={{ height: 30 }}
        />
        {list}
      </View>
    );
  }
}

//https://reactnavigation.org/docs/connecting-navigation-prop.html
class SearchScreen extends React.Component {
  static navigationOptions = {
    //title: 'Book Search'
    title: "本を探す",
  };
  render() {
    console.log(this.props);
    const { navigate } = this.props.navigation;
    const { searchedBooksStatus } = this.props.screenProps;
    return (
      <SearchScene
        selector={"search"}
        {...this.props.screenProps}
        onPressSetting={
          () => navigate("SelectLibrary")
          //navigate('DrawerOpen')
        }
        onDetail={book => {
          console.log("foo", book);
          navigate("Details", book);
        }}
        onPress={async ({ item, index }) => {
          console.log(item, index, item.isbn, searchedBooksStatus[item.isbn]);
          const url = searchedBooksStatus[item.isbn].reserveUrl;
          if (url) {
            let result = await WebBrowser.openBrowserAsync(url);
            console.log(result);
          }
        }}
      />
    );
  }
}

class DetailScreen extends React.Component {
  render() {
    console.log(this.props);
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    const book = params ? params : {};
    return <BookDetail selector={"detail"} {...book} />;
  }
}

const Stack = StackNavigator(
  {
    Home: {
      screen: SearchScreen,
    },
    Details: {
      screen: DetailScreen,
    },
  },
  {
    initialRouteName: "Home",
  },
);

module.exports = { SearchScene, SearchHistory, Stack, SearchScreen };
