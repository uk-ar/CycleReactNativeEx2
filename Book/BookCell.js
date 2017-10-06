
import React from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import materialColor from 'material-colors';
import { Constants, WebBrowser } from 'expo';

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
} from 'react-native';

import { itemsInfo, TouchableElement } from './common';

class LibraryStatus extends React.PureComponent {
  render() {
    const { loading, style, text } = this.props
    const indicator = loading ?
                      <ActivityIndicator
                        size="small"
                        style={{ marginLeft: 5 }}
                      /> : null;
    return (
      <View style={styles.rowCenter}>
        <Text style={style}>
          {text}
        </Text>
        {indicator}
      </View>);
  }
}

const libraryStatuses = {
  rentable: <LibraryStatus
              text='貸出可' style={{ color: '#4CAF50' /* green */ }} />,
  onLoan: <LibraryStatus
            text='貸出中' style={{ color: '#FFC107' /* amber */}} />,
  noCollection: <LibraryStatus
                  text='蔵書なし' style={{ color: '#F44336' /*red*/}} />,
  Loading: <LibraryStatus
             text='蔵書確認中' loading={true} />,
}

function conv(libraryStatus){
  if (libraryStatus.rentable) {
    LibraryStatusComp.rentable
  } else if (libraryStatus.exist) {
    LibraryStatusComp.onLoan
  } else if (libraryStatus.exist !== undefined) {
    LibraryStatusComp.noCollection
  } else {
    LibraryStatusComp.loading
  }
}

function genTempThumbnail(isbn) {
  return `http://www.hanmoto.com/bd/img/${isbn}.jpg`;
}

const icons = Object.keys(itemsInfo).reduce((acc,key)=> {
  acc[key] = (
    <FAIcon
      name={itemsInfo[key].icon} size={20}
      style={{
        marginRight: 10,
        //letterSpacing: 5,
        color: itemsInfo[key].backgroundColor }}
    />)
  return acc;
},{});

class Book extends React.PureComponent {
  _onPress = () => {
    this.props.onPress && this.props.onPress(this.props.isbn,this.props.reserveUrl);
  };
  render() {
    const { thumbnail, title, author, onPress, style, icon, status, isbn,reserveUrl } =
      this.props
    return (
      <TouchableElement
        onPress={this._onPress}
        style={style}>
        <View style={styles.cell}>
          {/* left */}
          <Image
            source={{ uri: thumbnail }}
            resizeMode="contain"
            style={ styles.cellImage }/>
          {/* right */}
          <View
            style={styles.border}>
            <View style={styles.rowCenter}>
              { icon }
              <Text style={styles.bookTitle} numberOfLines={2}>
                { title }
              </Text>
            </View>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {author}
            </Text>
            { status }
          </View>
        </View>
      </TouchableElement>
    );
  }
}

class BookList extends React.PureComponent {
  _keyExtractor = (book, index) => book.isbn;
  _onPress = async (isbn,url) =>{
    //https://docs.expo.io/versions/latest/sdk/webbrowser.html
    let result = await WebBrowser.openBrowserAsync(url);
    this.setState({ result });
  }
  _renderItem = ({item,index}) => {
    return (
      <Book
        onPress={this._onPress}
        isbn={item.isbn}
        title={item.title}
        author={item.author}
        thumbnail={item.thumbnail}
        reserveUrl={item.reserveUrl}
        icon={icons[item.bucket]}
        status={libraryStatuses[item.status]}
      />
    );}
  constructor(props) {
    super(props);
  }
  render() {
    return (
      //        extraData={this.state}
      <FlatList
        data={this.props.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: "center"
  },
  cell: {
    flexDirection: 'row',
    backgroundColor: materialColor.grey['50'],//for TouchableElement
  },
  border:{
    flex:1,
    marginRight:10,
    padding:5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  cellImage: {
    backgroundColor: '#dddddd', // grey
    height: 64, // PixelRatio 2
    margin: 10,
    width: 64//cellWidth,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex:1,
    //marginBottom: 2,
  },
  bookAuthor: {
    // color: '#999999',
    color: '#9E9E9E', // grey
    fontSize: 12,
  },
})

module.exports = { LibraryStatus, Book, icons, libraryStatuses,BookList };
