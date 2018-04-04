import React from "react";
import FAIcon from "react-native-vector-icons/FontAwesome";
import materialColor from "material-colors";
import { Constants, WebBrowser } from "expo";
import emptyFunction from "fbjs/lib/emptyFunction";

import {
  ActivityIndicator,
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  FlatList,
  Button,
} from "react-native";

import { itemsInfo, TouchableElement } from "./common";
import { CloseableView } from "./CloseableView";

class LibraryStatus extends React.PureComponent {
  render() {
    const { loading, style, text } = this.props;
    const indicator = loading ? (
      <ActivityIndicator size="small" style={{ marginLeft: 5 }} />
    ) : null;
    return (
      <View style={styles.rowCenter}>
        <Text style={style}>{text}</Text>
        {indicator}
      </View>
    );
  }
}

const libraryStatuses = {
  rentable: (
    <LibraryStatus text="貸出可" style={{ color: "#4CAF50" /* green */ }} />
  ),
  onLoan: (
    <LibraryStatus text="貸出中" style={{ color: "#FFC107" /* amber */ }} />
  ),
  noCollection: (
    <LibraryStatus text="蔵書なし" style={{ color: "#F44336" /*red*/ }} />
  ),
  Loading: <LibraryStatus text="蔵書確認中" loading={true} />,
};

function conv(libraryStatus) {
  if (libraryStatus.rentable) {
    LibraryStatusComp.rentable;
  } else if (libraryStatus.exist) {
    LibraryStatusComp.onLoan;
  } else if (libraryStatus.exist !== undefined) {
    LibraryStatusComp.noCollection;
  } else {
    LibraryStatusComp.loading;
  }
}

function genTempThumbnail(isbn) {
  return `http://www.hanmoto.com/bd/img/${isbn}.jpg`;
}

const icons = Object.keys(itemsInfo).reduce((acc, key) => {
  acc[key] = (
    <FAIcon
      name={itemsInfo[key].icon}
      size={20}
      style={{
        marginRight: 10,
        //letterSpacing: 5,
        color: itemsInfo[key].backgroundColor,
      }}
    />
  );
  return acc;
}, {});
class BookDetail extends React.PureComponent {
  static defaultProps = {
    onChangeText: emptyFunction,
  };
  _onPress = () => {
    this.props.onPress(this.props.isbn, this.props.reserveUrl);
  };
  render() {
    const {
      thumbnail,
      title,
      author,
      onPress,
      style,
      icon,
      status,
      isbn,
      reserveUrl,
    } = this.props;
    console.log(this.props);
    return (
      <View style={{ alignItems: "flex-start" }}>
        {/* middle */}
        <Button
          onPress={this._onPress}
          title={author}
          accessibilityLabel={author}
        />
        <Text style={styles.bookTitle} numberOfLines={2}>
          {title}
        </Text>
        {/* left */}
        <Image
          source={{ uri: thumbnail }}
          resizeMode="contain"
          style={styles.cellImage}
        />
        {status}
        {/* right */}
        <View
          style={{
            //border
            justifyContent: "center",
            borderColor: "rgba(0, 0, 0, 0.1)", //0.1
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderTopWidth: StyleSheet.hairlineWidth,
          }}
        >
          <View
            style={{
              backgroundColor: materialColor.grey["200"], //"black",
              borderRadius: 20,
              margin: 10,
            }}
          >
            <Button
              onPress={this._onPress}
              title="借りる"
              accessibilityLabel="借りる"
            />
          </View>
        </View>
      </View>
    );
  }
}
class Book extends React.PureComponent {
  static defaultProps = {
    onChangeText: emptyFunction,
    onDetail: emptyFunction,
  };
  _onPress = () => {
    this.props.onPress(this.props.isbn, this.props.reserveUrl);
  };
  _onDetail = () => {
    this.props.onDetail(this.props);
  };
  render() {
    const {
      thumbnail,
      title,
      author,
      onPress,
      style,
      icon,
      status,
      isbn,
      reserveUrl,
    } = this.props;
    return (
      <TouchableElement onPress={this._onDetail}>
        <View style={styles.cell}>
          {/* left */}
          <Image
            source={{ uri: thumbnail }}
            resizeMode="contain"
            style={styles.cellImage}
          />
          {/* middle */}
          <View
            style={{
              flex: 1,
              //border
              justifyContent: "center",
              borderColor: "rgba(0, 0, 0, 0.1)", //0.1
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderTopWidth: StyleSheet.hairlineWidth,
            }}
          >
            <Text style={styles.bookTitle} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {author}
            </Text>
            {status}
          </View>
          {/* right */}
          <View
            style={{
              //border
              justifyContent: "center",
              borderColor: "rgba(0, 0, 0, 0.1)", //0.1
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderTopWidth: StyleSheet.hairlineWidth,
            }}
          >
            <View
              style={{
                backgroundColor: materialColor.grey["200"], //"black",
                borderRadius: 20,
                margin: 10,
              }}
            >
              <Button
                onPress={this._onPress}
                title="借りる"
                accessibilityLabel="借りる"
              />
            </View>
          </View>
        </View>
      </TouchableElement>
    );
  }
}
class CloseableBook extends React.PureComponent {
  render() {
    //console.log("re book")
    const { closed, ...rest } = this.props;
    return (
      <CloseableView closed={closed}>
        <Book {...rest} />
      </CloseableView>
    );
  }
}

class BookList extends React.PureComponent {
  _keyExtractor = (book, index) => book.isbn;
  static defaultProps = {
    onPress: emptyFunction,
  };
  _renderItem = ({ item, index }) => {
    //closed = this.props.rejects && this.props.rejects.includes(item.status)
    extraData = this.props.extraData || {};
    library =
      extraData && extraData[item.isbn]
        ? extraData[item.isbn]
        : extraData ? { status: "Loading" } : {};
    rejects = extraData.rejects || [];
    closed = rejects.includes(library.status);
    return (
      <CloseableBook
        onPress={(isbn, url) => this.props.onPress({ item, index })}
        onDetail={this.props.onDetail}
        isbn={item.isbn}
        title={item.title}
        author={item.author}
        thumbnail={item.thumbnail}
        icon={icons[item.bucket]}
        reserveUrl={library.reserveUrl}
        status={libraryStatuses[library.status]}
        closed={closed}
      />
    );
  };
  _renderFooter = () => {
    if (!this.props.booksPagingState) {
      return null;
    }
    return (
      <View
        style={{
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator style={{ height: 64 }} animating size="large" />
      </View>
    );
  };
  render() {
    if (this.props.data.length == 0) {
      <Text>本が見つかりません</Text>;
    }
    return (
      //        extraData={this.state}
      <FlatList
        data={this.props.data}
        extraData={this.props.extraData}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        onEndReached={this.props.onEndReached}
        ListFooterComponent={this._renderFooter}
      />
    );
  }
}

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
    alignItems: "stretch",
    backgroundColor: materialColor.grey["50"], //for TouchableElement
  },
  cellImage: {
    backgroundColor: "#dddddd", // grey
    height: 64, // PixelRatio 2
    margin: 10,
    //padding: 10,
    width: 64, //cellWidth,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "500",
    //flex: 1
    //marginBottom: 2,
  },
  bookAuthor: {
    // color: '#999999',
    color: "#9E9E9E", // grey
    fontSize: 12,
  },
});

module.exports = {
  LibraryStatus,
  Book,
  icons,
  libraryStatuses,
  BookList,
  BookDetail,
};
