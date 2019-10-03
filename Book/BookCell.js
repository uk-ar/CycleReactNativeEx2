
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

function BookCell({ book, style, onPress, children, ...props }) {
  //title,author,thumbnail
  book.thumbnail = book.thumbnail || genTempThumbnail(book.isbn) || undefined
  // Image source cannot accept null
  const icon = book.bucket ?
               <FAIcon
                 name={itemsInfo[book.bucket].icon} size={20}
                 style={{
                   // marginRight: 5,
                   letterSpacing: 5,
                   color: itemsInfo[book.bucket].backgroundColor }}
               /> : null
  //console.log(book.thumbnail)
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
        {/* right high */}
        <View
          style={{
            flex:1,
            marginRight:10,
            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
            borderBottomWidth: StyleSheet.hairlineWidth,
            backgroundColor:"red",
          }}>
          <View style={{backgroundColor:"blue",width:190,
                        flexDirection:"row",alignItems:"center",//flex:1,
          }}>
            <View style={{backgroundColor:"yellow",height:40,width:100}}/>
            {/* <View style={{backgroundColor:"green",height:20,width:50}}/> */}
            <Text>foo</Text>
          </View>
          <View style={{flexDirection:"row",alignItems:"center"}}>
            {icon}
            <Text numberOfLines={2} ellipsizeMode={'middle'}
              style={[styles.bookTitle]}>
              {book.title}
            </Text>
          </View>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {book.author}
          </Text>
          { children }
          {/* <View style={{backgroundColor:"yellow",height:40,width:100}}/>
              <View style={{backgroundColor:"green",height:20,width:50}}/>
            */}
          {/* <View>
              <Text numberOfLines={1} ellipsizeMode={'middle'}
              style={[styles.bookTitle,{alignItems:"center"}]}>
              {icon}
              {book.title}
              </Text>
               */}
        </View>
      </View>
    </TouchableElement>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    //marginBottom: 2,
  },
  bookAuthor: {
    // color: '#999999',
    color: '#9E9E9E', // grey
    fontSize: 12,
  },
})

module.exports = { LibraryStatus, BookCell };
