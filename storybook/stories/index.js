import React from 'react';
import { StyleSheet,FlatList,TouchableOpacity,Animated,Text,View } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Constants, WebBrowser } from 'expo';
import { ButtonGroup, SearchBar } from 'react-native-elements';
import materialColor from 'material-colors';

import { CenterLeftView, CenterView } from './CenterView';
import { CloseableView } from '../../components/CloseableView';
import { CycleRoot } from '../../cycle-react-native';
import { itemsInfo, TouchableElement } from '../../components/common';
import { SearchScene,SearchHistory } from '../../components/SearchScene';
import { LibrarySearchScene, Library, LibraryList,PrefSearchScene } from '../../components/LibrarySearchScene';

import { BookList, BookCell,LibraryStatus,icons,Book,libraryStatuses} from '../../components/BookCell';
import FAIcon from 'react-native-vector-icons/FontAwesome';

storiesOf('LibraryStatus', module)
  .addDecorator(getStory => <CenterLeftView>{getStory()}</CenterLeftView>)
  .add('with text and color', () => (
    <LibraryStatus text="foo" style={{color:"red"}} />
  ))
  .add('with loading', () => (
    <LibraryStatus text="bar" style={{color:"blue"}} loading={true}/>
  ))

storiesOf('Book', module)
  .addDecorator(getStory => <CenterLeftView>{getStory()}</CenterLeftView>)
  .add('with thumbnail', () => (
    <Book
      thumbnail={'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200'}
    />
  ))
  .add('with full book', () => (
    <Book
      onPress={action('clicked-bookcell')}
      title='guri & gura & can I handle long long long title?'
      author='author foo'
      isbn='9784834032147'
      reserveUrl='http://api.calil.jp/reserve?id=af299d780fe86cf8b116dfda4725dc0f'
      icon={icons["done"]}
      thumbnail={'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200'}
    />
  ))
  .add('with short title', () => (
    <Book
      onPress={action('clicked-bookcell')}
      isbn='9784834032147'
      title='guri & gura'
      author='author foo'
      thumbnail={'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200'}
      icon={icons["liked"]}
      status={libraryStatuses["rentable"]}
    />
  ))


class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? "red" : "black";
    //this._onPress avoid changeing props in TouchableOpacity
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={{ color: textColor }}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
class MultiSelectList extends React.PureComponent {
  state = {selected: (new Map(): Map<string, boolean>)};

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
    />
  );

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
storiesOf('FlatList', module)
  .addDecorator(getStory => <CenterLeftView>{getStory()}</CenterLeftView>)
  .add('with three', () => (
    <MultiSelectList
      data={[{id: 'a',title:"foo"},
             {id: 'b',title:"bar"},
             {id: 'c',title:"baz"}]}
    />
  ))
storiesOf('BookList', module)
  .addDecorator(getStory => <CenterLeftView>{getStory()}</CenterLeftView>)
  .add('with one', () => (
    <BookList
      data={[{
          isbn:'9784834032147',
          title:'guri & gura',
          author:'author foo',
          thumbnail:'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200'}]}
    />
  ))
  .add('with two', () => (
    <BookList
      data={[{
          isbn:'9784834032147',
          title:'guri & gura',
          author:'author foo',
          thumbnail:'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200'
        },{
          title: 'はじめてのABCえほん',
          author: '仲田利津子/黒田昌代',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7472/9784828867472.jpg?_ex=200x200',
          isbn: '9784828867472',
          }
        ]}
    />
  ))
  .add('with many', () => (
    <BookList
      extraData={{
        9784834032147:{
          status:"rentable"
        },
        9784828867472:{
          status:"onLoan"
        },
        9784834000825:{
          status:"noCollection"
        },
        9784834014655:{
          status:"Loading"
        }
      }}
      data={[{
          isbn:'9784834032147',
          title:'guri & gura',
          author:'author foo',
          thumbnail:'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
          bucket:"liked",
        },{
          isbn: '9784828867472',
          title: 'はじめてのABCえほん',
          author: '仲田利津子/黒田昌代',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7472/9784828867472.jpg?_ex=200x200',
          bucket:"done",
        },{
          title: 'ぐりとぐら(複数蔵書)',
          author: '中川李枝子/大村百合子',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0825/9784834000825.jpg?_ex=200x200',
          isbn: '9784834000825',
          bucket:"borrowed",
          reserveUrl: 'http://api.calil.jp/reserve?id=af299d780fe86cf8b116dfda4725dc0f',
        },{
          title: 'ぐりとぐらの1ねんかん(単一蔵書)',
          author: '中川李枝子/山脇百合子（絵本作家）',
          isbn: '9784834014655',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4655/9784834014655.jpg?_ex=200x200',
          reserveUrl: 'https://www.amazon.co.jp/dp/4834014657',
          bucket:"search",
        },{
          title: 'IA／UXプラクティス',
          author: '坂本貴史',
          isbn: '9784862463241',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
        },{
          title: 'IA／UXプラクティス',
          author: '坂本貴史',
          isbn: '9784862463242',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
        },{
          title: 'IA／UXプラクティス',
          author: '坂本貴史',
          isbn: '9784862463243',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
        },{
          title: 'IA／UXプラクティス',
          author: '坂本貴史',
          isbn: '9784862463244',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
        }
        ]}
    />
  ))

storiesOf('Browser', module)
  .add('with full book', () => (
    <Book
      onPress={async (isbn,url)=>{
          //https://docs.expo.io/versions/latest/sdk/webbrowser.html
          let result = await WebBrowser.openBrowserAsync(url);
          this.setState({ result });
        }}
      title='ぐりとぐら(複数蔵書)'
      author='中川李枝子/大村百合子'
      thumbnail='http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0825/9784834000825.jpg?_ex=200x200'
      isbn='4834000826'
      reserveUrl='https://www.amazon.co.jp/dp/4834000826'
      icon={icons["done"]}
    />
  ))

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { index:0 }
  }
  render(){
    return (
      <View>
        <Text style={{alignSelf:"center"}} onPress={()=>{
            this.setState({index:this.state.index + 1})
          }}>
            pressMe
        </Text>
        {this.props.children(this.state.index)}
      </View>
    )
  }
}

storiesOf('Closeable', module)
  //.addDecorator(getStory => <CenterLeftView>{getStory(10)}</CenterLeftView>)
  .add('with open and close', () => (
    <Counter>
      {(i)=>{
         return (
           <View>
             <CloseableView closed={ i % 2 ? true : false }>
               <View style={{
                 height:50, backgroundColor:"red", //flex:1
               }}/>
             </CloseableView>
           </View>
         )
       }}
    </Counter>
  ))



class Filter extends React.Component {
  constructor () {
    super()
    this.state = {
      selectedIndex: 2
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }

  render () {
    //const buttons = ['新しい', '古い', 'タイトル','著者名']
    const buttons = ['全て', '蔵書あり', '貸出可']
    //const buttons = ['New', 'Old', 'Title','Author']
    const { selectedIndex } = this.state

    return (
      <ButtonGroup
      onPress={this.updateIndex}
      selectedIndex={selectedIndex}
      buttons={buttons}
      containerStyle={{height: 30}}
      />
    )
  }
}

storiesOf('Filter', module)
//.addDecorator(getStory => <CenterLeftView>{getStory(10)}</CenterLeftView>)
  .add('with 3 items no state', () => (
    <ButtonGroup
      selectedIndex={0}
      buttons={['全て', '蔵書あり', '貸出可']}
      containerStyle={{height: 30}}
    />
  ))
  .add('with 3 items', () => (
    <Filter />
  ))
  .add('with open and close', () => (
    <Counter>
      {(i)=>{
         r = ["rentable","onLoan","noCollection"]
         return (
           <BookList
             extraData={{
               9784834032147:{
                 status:"rentable"
               },
               9784828867472:{
                 status:"onLoan"
               },
               9784834000825:{
                 status:"noCollection"
               },
               9784834014655:{
                 status:"Loading"
               }
             }}
             rejects={[r[i % 3]]}
             data={[{
                 isbn:'9784834032147',
                 title:'guri & gura',
                 author:'author foo',
                 thumbnail:'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
                 bucket:"liked",
                 status:"rentable",
               },{
                 isbn: '9784828867472',
                 title: 'はじめてのABCえほん',
                 author: '仲田利津子/黒田昌代',
                 thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7472/9784828867472.jpg?_ex=200x200',
                 bucket:"done",
                 status:"onLoan"
               },{
                 title: 'ぐりとぐら(複数蔵書)',
                 author: '中川李枝子/大村百合子',
                 thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0825/9784834000825.jpg?_ex=200x200',
                 isbn: '9784834000825',
                 bucket:"borrowed",
                 reserveUrl: 'http://api.calil.jp/reserve?id=af299d780fe86cf8b116dfda4725dc0f',
                 status:"noCollection"
               },{
                 title: 'ぐりとぐらの1ねんかん(単一蔵書)',
                 author: '中川李枝子/山脇百合子（絵本作家）',
                 isbn: '9784834014655',
                 thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4655/9784834014655.jpg?_ex=200x200',
                 reserveUrl: 'https://www.amazon.co.jp/dp/4834014657',
                 bucket:"search",
                 status:"Loading"
               },{
                 title: 'IA／UXプラクティス',
                 author: '坂本貴史',
                 isbn: '9784862463241',
                 thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
               }]}
           />
         )
       }}
    </Counter>
  ))

storiesOf('Main', module)
  .add('cycle', () => (
    <CycleRoot/>
  ))

storiesOf('SearchBar', module)
  .add('with loading', () => (
    <SearchBar
      lightTheme
      showLoadingIcon
      onChangeText={action('text-change')}
      onClearText={action('text-clear')}
      placeholder='Type Here...' />
  ))

storiesOf('SearchScene', module)
  .add('with plane', () => (
    <View>
      <SearchBar
        containerStyle={{
          backgroundColor: materialColor.grey['50']
        }}
        inputStyle={{
          backgroundColor: materialColor.grey['200']
        }}
        lightTheme
        showLoadingIcon
        onChangeText={action('text-change')}
        onClearText={action('text-clear')}
        placeholder='Type Here...' />
      <ButtonGroup
        onPress={action('filter-change')}
        selectedIndex={0}
        buttons={['全て', '蔵書あり', '貸出可']}
        containerStyle={{height: 30}}/>
      <BookList
        rejects={[]}
        onPress={action('book-press')}
        data={[{
            isbn:'9784834032147',
            title:'guri & gura',
            author:'author foo',
            thumbnail:'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
          }]}
      />
    </View>
  ))
  .add('with no items', () => (
    <SearchScene
      selector={"main"}
      onChangeText={action('text-change')}
      onClearText={action('text-clear')}
      onChangeFilter={action('filter-change')}
      onPress={action('book-press')}
      onPressSetting={action('book-press-setting')}
      onSubmitEditing={()=>console.log("su")}
      showLoadingIcon={true}
      selectedIndex={1}
      rejects={[]}
      searchHistory={[
        {query:"foo"},
        {query:"bar"},
      ]}
      data={null}
    />
  ))
  .add('with class', () => (
    <SearchScene
      selector={"main"}
      onChangeText={action('text-change')}
      onClearText={action('text-clear')}
      onChangeFilter={action('filter-change')}
      onPress={action('book-press')}
      onPressSetting={action('book-press-setting')}
      showLoadingIcon={true}
      selectedIndex={0}
      defaultText={"foo"}
      searchedBooksStatus={{
          9784834032147:{
            status:"rentable"
          },
          9784828867472:{
            status:"onLoan"
          },
          9784834000825:{
            status:"noCollection"
          },
          9784834014655:{
            status:"Loading"
          }
        }}
      searchedBooks={[{
          isbn:'9784834032147',
          title:'guri & gura',
          author:'author foo',
          thumbnail:'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
          bucket:"liked",
        }]}
    />
  ))
  .add('with many', () => (
    <SearchScene
      selector={"main"}
      onChangeText={action('text-change')}
      onClearText={action('text-clear')}
      onChangeFilter={action('filter-change')}
      onPress={action('book-press')}
      onPressSetting={action('book-press-setting')}
      showLoadingIcon={true}
      selectedIndex={0}
      rejects={[]}
      defaultText={"foo"}
      searchedBooks={[{
          isbn:'9784834032147',
          title:'guri & gura',
          author:'author foo',
          thumbnail:'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
          bucket:"liked",
        },{
          isbn: '9784828867472',
          title: 'はじめてのABCえほん',
          author: '仲田利津子/黒田昌代',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7472/9784828867472.jpg?_ex=200x200',
          bucket:"done",
        },{
          title: 'ぐりとぐら(複数蔵書)',
          author: '中川李枝子/大村百合子',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0825/9784834000825.jpg?_ex=200x200',
          isbn: '9784834000825',
          bucket:"borrowed",
          reserveUrl: 'http://api.calil.jp/reserve?id=af299d780fe86cf8b116dfda4725dc0f',
        },{
          title: 'ぐりとぐらの1ねんかん(単一蔵書)',
          author: '中川李枝子/山脇百合子（絵本作家）',
          isbn: '9784834014655',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4655/9784834014655.jpg?_ex=200x200',
          reserveUrl: 'https://www.amazon.co.jp/dp/4834014657',
          bucket:"search",
        },{
          title: 'IA／UXプラクティス',
          author: '坂本貴史',
          isbn: '9784862463241',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
        },{
          title: 'IA／UXプラクティス',
          author: '坂本貴史',
          isbn: '9784862463242',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
        },{
          title: 'IA／UXプラクティス',
          author: '坂本貴史',
          isbn: '9784862463243',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
        },{
          title: 'IA／UXプラクティス',
          author: '坂本貴史',
          isbn: '9784862463244',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
        }
        ]}
    />
  ))

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
  title: {//bookTitle
    fontSize: 16,
    fontWeight: '500',
    //flex:1,
    //marginBottom: 2,
  },
  subtitle: {//bookAuther
    // color: '#999999',
    color: '#9E9E9E', // grey
    fontSize: 12,
  },
})

storiesOf('Library', module)
  .add('with plane', () => (
    <Library
      title="foo"
      subtitle="bar"
    />
  ))

storiesOf('LibraryList', module)
  .add('with plane', () => (
    <LibraryList
      data={[
        {title:"foo",subtitle:"bar"},
        {title:"baz",subtitle:"bal"},
      ]}
    />
  ))
storiesOf('LibrarySearchScene', module)
  .add('with plane', () => (
    <LibrarySearchScene
      data={[
        {systemname:"埼玉県上尾市",description:"たちばな分館ほか",
         systemid:"Saitama_Ageo"},
        {systemname:"埼玉県嵐山町",description:"嵐山町立図書館ほか",
         systemid:"Saitama_Arashiyama"},
        {systemname:"埼玉県朝霞市",description:"内間木公民館ほか",
         systemid:"Saitama_Asaka"},
      ]}
      extraData={{selectedLibrary:"Saitama_Asaka"}}
      onPress={action('onPress')}
    />
  ))

storiesOf('PrefSearchScene', module)
                         .add('with plane', () => (
                           <PrefSearchScene
                             onPress={action('onPress')}
                           />
                         ))

storiesOf('SearchHistory', module)
  .add('with plane', () => (
    <SearchHistory
      onPress={action('search-history-press')}
      data={[
        {query:"foo"},
        {query:"bar"},
      ]}
    />
  ))
