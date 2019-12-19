import React from 'react';
import {
  Animated,Text,View,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { ButtonGroup, SearchBar } from 'react-native-elements';
import materialColor from 'material-colors';
import { BookList, BookCell,LibraryStatus,icons,Book,libraryStatuses} from './Book/BookCell';
import { TouchableElement } from './Book/common';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import emptyFunction from 'fbjs/lib/emptyFunction'

import PropTypes from 'prop-types';
import { withCycle } from '../cycle-react-native';
import { List, ListItem } from 'react-native-elements'

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
    //marginRight:10,
    padding:5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    //borderTopWidth: StyleSheet.hairlineWidth
  },
})

class Library extends React.PureComponent {
  static defaultProps = {
    onPress:emptyFunction
  }
  render() {
    const { title, subtitle, onPress, style } =
      this.props
    return (
      <TouchableElement
        onPress={onPress}
        style={style}>
        <View style={styles.cell}>
          {/* left */}
          <FAIcon
            name={"building-o"} size={20}
            style={{
              alignSelf:"center",
              margin: 10,
            }}
          />
          {/* right */}
          <View style={styles.border}>
            <Text style={styles.title} numberOfLines={2}>
              { title }
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              { subtitle }
            </Text>
          </View>
        </View>
      </TouchableElement>
    );
  }
}

class LibraryList extends React.PureComponent {
  _keyExtractor = (item, index) => item.systemid;
  static defaultProps = {
    onPress: emptyFunction,
    extraData: {}
  }
  _renderItem = ({item,index}) => {
    selected = (this.props.extraData.selectedLibrary == item.systemid)
    console.log(this.props.extraData,item.systemid)
    //materialColor.grey['50'],//for TouchableElement
    selectedColor = materialColor.blue['500']
    return (
      //"business","account balance","domain","location city"
      <ListItem
        key={index}
        title={item.systemname}
        titleStyle={selected ? {color:selectedColor} : undefined}
        subtitle={item.description}
        onPress={()=>
          // must be closure
          this.props.onPress(item.systemid)}
        rightIcon={selected ? {name: "done",color:selectedColor} : <View /> }
        leftIcon={{name: "business"}}
      />
    );}
  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        extraData ={this.props.extraData}
      />
    );
  }
}

class LibrarySearchScene extends React.Component {
  render() {
    const {onChangeText,data} = this.props
    return (
      <View>
        <LibraryList
          onPress={(e)=>console.log("hello",e)}
          data={this.props.data}
          extraData={this.props.extraData}
        />
      </View>
    )
  }
}

class PrefSearchScene extends React.PureComponent {
  _keyExtractor = (item, index) => item.title;
  static defaultProps = {
    onPress: emptyFunction
  }
  _renderItem = ({item,index}) => {
    //TODO:add number of libraries to subtitle
    return (
      <ListItem
        key={index}
        title={item.title}
        onPress={()=>this.props.onPress(item.title)}
        leftIcon={{name: "business"}}
      />
    );}
  render() {
    return (
      <FlatList
        data={pref}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

const pref = [
  {
    "title": "北海道",
  },
  {
    "title": "青森県",
  },
  {
    "title": "岩手県",
  },
  {
    "title": "宮城県",
  },
  {
    "title": "秋田県",
  },
  {
    "title": "山形県",
  },
  {
    "title": "福島県",
  },
  {
    "title": "茨城県",
  },
  {
    "title": "栃木県",
  },
  {
    "title": "群馬県",
  },
  {
    "title": "埼玉県",
  },
  {
    "title": "千葉県",
  },
  {
    "title": "東京都",
  },
  {
    "title": "神奈川県",
  },
  {
    "title": "新潟県",
  },
  {
    "title": "富山県",
  },
  {
    "title": "石川県",
  },
  {
    "title": "福井県",
  },
  {
    "title": "山梨県",
  },
  {
    "title": "長野県",
  },
  {
    "title": "岐阜県",
  },
  {
    "title": "静岡県",
  },
  {
    "title": "愛知県",
  },
  {
    "title": "三重県",
  },
  {
    "title": "滋賀県",
  },
  {
    "title": "京都府",
  },
  {
    "title": "大阪府",
  },
  {
    "title": "兵庫県",
  },
  {
    "title": "奈良県",
  },
  {
    "title": "和歌山県",
  },
  {
    "title": "鳥取県",
  },
  {
    "title": "島根県",
  },
  {
    "title": "岡山県",
  },
  {
    "title": "広島県",
  },
  {
    "title": "山口県",
  },
  {
    "title": "徳島県",
  },
  {
    "title": "香川県",
  },
  {
    "title": "愛媛県",
  },
  {
    "title": "高知県",
  },
  {
    "title": "福岡県",
  },
  {
    "title": "佐賀県",
  },
  {
    "title": "長崎県",
  },
  {
    "title": "熊本県",
  },
  {
    "title": "大分県",
  },
  {
    "title": "宮崎県",
  },
  {
    "title": "鹿児島県",
  },
  {
    "title": "沖縄県",
  }
]

module.exports = { LibrarySearchScene, Library, LibraryList,PrefSearchScene };
