import React from 'react';
import { Animated,Text,View } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Constants, WebBrowser } from 'expo';
import { ButtonGroup, SearchBar } from 'react-native-elements';
import materialColor from 'material-colors';

import { CenterLeftView, CenterView } from './CenterView';
import { CloseableView } from '../../CloseableView';
import { CycleRoot } from '../../cycle-react-native';

import { BookList, BookCell,LibraryStatus,icons,Book,libraryStatuses} from '../../Book/BookCell';

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
  .add('with all', () => (
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
        selectedIndex={0}
        buttons={['全て', '蔵書あり', '貸出可']}
        containerStyle={{height: 30}}/>
      <BookList
        rejects={[]}
        data={[{
            isbn:'9784834032147',
            title:'guri & gura',
            author:'author foo',
            thumbnail:'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
            bucket:"liked",
            status:"rentable",
          }]}
      />
    </View>
  ))
