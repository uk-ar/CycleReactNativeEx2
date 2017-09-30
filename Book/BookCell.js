
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
  TouchableNativeFeedback,
} from 'react-native';

import { itemsInfo,TouchableElement } from './common';

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
  }
}
function LibraryStatus({ libraryStatus = {}, ...props }) {
  let text;
  let style;
  if (!libraryStatus){
    return (
      <View style={styles.row}>
        <Text>
          蔵書確認中
        </Text>
        <ActivityIndicator
          size="small"
          style={{ marginLeft: 5 }}
        />
      </View>)
  }
  // http://www.google.com/design/spec/style/color.html#color-color-palette
  if (libraryStatus.rentable) {
    text, style = LibraryStatus.rentable
  } else if (libraryStatus.exist) {
    text, style = LibraryStatus.onLoan
  } else if (libraryStatus.exist !== undefined) {
    text, style = LibraryStatus.noCollection
  }
  return (
    <View style={styles.row}>
      <Text style={style}>
        {text}
      </Text>
    </View>
  );
}

function genTempThumbnail(isbn) {
  return `http://www.hanmoto.com/bd/img/${isbn}.jpg`;
}

function BookCell({ book, style, onPress, children, ...props }) {
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
  console.log(book.thumbnail)
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
          style={{
            flexDirection: 'column',
            //flex:1,
            margin: 10,
            marginBottom: 0,
          }}>
          {/* right high */}
          <View
            style={{
              flex: 1,
              //flexDirection: 'row',
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'middle'}
              style={[styles.row]}
            >
              {icon}
              <Text style={styles.bookTitle} numberOfLines={1}>
                {book.title}
              </Text>
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {book.author}
            </Text>
            {children}
          </View>
          {/* right high */}
          {/* separator */}
          <View
            style={{
              // right low
              height: StyleSheet.hairlineWidth,
              //flex:1,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}/>
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
})

module.exports = { LibraryStatus, BookCell };
