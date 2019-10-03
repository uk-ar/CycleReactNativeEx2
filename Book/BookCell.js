
import React from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
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
} from 'react-native';

import { itemsInfo, TouchableElement } from './common';

const LibraryStatusInfo = {
  rentable: {
    text:'貸出可',// 利用可
    style:{ color: '#4CAF50' }// Green
  },
  onLoan:{
    text:'貸出中',
    style:{ color: '#FFC107' } // amber
  },
  noCollection:{
    text:'蔵書なし',
    style:{ color: '#F44336' } // red
  },
  Loading:{
    text:'蔵書確認中',
    style:{}, // default
    indicator:true,
  }
}
const LibraryStatuses = {
  rentable: <LibraryStatus
              text='貸出可' style={{ color: '#4CAF50' /* green */ }} />,
  onLoan: <LibraryStatus
            text='貸出中' style={{ color: '#FFC107' /* amber */}} />,
  noCollection:<LibraryStatus
                 text='蔵書なし' style={{ color: '#F44336' /*red*/}} />,
  Loading:<LibraryStatus
            text='蔵書確認中' indicator={true} />,
}

class LibraryStatus extends React.PureComponent {
  render() {
    const { loading, style, text } = this.props
    const indicator = loading ?
                      <ActivityIndicator
                        size="small"
                        style={{ marginLeft: 5 }}
                      /> : null;
    return (
      <View style={styles.row}>
        <Text style={style}>
          {text}
        </Text>
        {indicator}
      </View>);
  }
}
//<LibraryStatus {...conv(libraryStatus)}/>

function conv(libraryStatus){
  if (libraryStatus.rentable) {
    LibraryStatus.rentable
  } else if (libraryStatus.exist) {
    LibraryStatus.onLoan
  } else if (libraryStatus.exist !== undefined) {
    LibraryStatus.noCollection
  } else {
    LibraryStatus.loading
  }
}

function genTempThumbnail(isbn) {
  return `http://www.hanmoto.com/bd/img/${isbn}.jpg`;
}

class Book extends React.PureComponent {
  render() {
    const { thumbnail, title, author, onPress, style } = this.props
    return (
      <TouchableElement
        onPress={onPress}
        style={style}
      >
        <View
          style={{flexDirection:"row",//backgroundColor:"red"
          }}
        >
          {/* left */}
          <Image
            source={{ uri: thumbnail }}
            resizeMode="contain"
            style={ styles.cellImage }
          />
          {/* right */}
          <View
            style={{
              flex:1,
              borderBottomColor: 'rgba(0, 0, 0, 0.1)',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}>
            {/* right high */}
            <View style={{flex:1}}>
              <Text numberOfLines={1} ellipsizeMode={'middle'}
                style={{flexDirection: 'row'}}>
                {icon}
                <Text style={styles.bookTitle} numberOfLines={1} >
                  {title}
                </Text>
              </Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>
                {author}
              </Text>
              { children }
            </View>
          </View>
        </View>
      </TouchableElement>
    );
  }
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

function BookCell({ book, style, onPress, children, ...props }) {
  //title,author,thumbnail
  book.thumbnail = book.thumbnail || genTempThumbnail(book.isbn) || undefined
  // Image source cannot accept null
  const icon = book.bucket ?
               icons[book.bucket] : null
  return (
    <TouchableElement
      onPress={onPress}
      style={style}
    >
      <View
        {...props}
        style={styles.row}
      >
        {/* left */}
        <Image
          source={{ uri: book.thumbnail }}
          resizeMode="contain"
          style={ styles.cellImage }
        />
        {/* right */}
        <View
          style={styles.border}>
          <View style={styles.rowCenter}>
            {icon}
            <Text style={styles.bookTitle} numberOfLines={2}>
              {book.title}
            </Text>
          </View>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {book.author}
          </Text>
          { children }
        </View>
      </View>
    </TouchableElement>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: "center"
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

module.exports = { LibraryStatus, BookCell };
