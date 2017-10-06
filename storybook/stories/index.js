import React from 'react';
import { Animated,Text,View } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Constants, WebBrowser } from 'expo';

import { CenterLeftView, CenterView } from './CenterView';

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
        <Text onPress={()=>{
            this.setState({index:this.state.index + 1})
          }}>
          pressMe
        </Text>
        {this.props.children(this.state.index)}
      </View>
    )
  }
}

class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
  }

  render() {
    let { i } = this.props
    let { fadeAnim } = this.state;
    Animated.timing(
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: i,                   // Animate to opacity: 1 (opaque)
        duration: 1000,              // Make it take a while
      }
    ).start();                        // Starts the animation

    return (
      <Animated.View
        style={{
          width: 250, height: 50, backgroundColor: 'powderblue',
          opacity: fadeAnim,         // Bind opacity to animated value
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

storiesOf('Closable', module)
  .addDecorator(getStory => <CenterLeftView>{getStory(10)}</CenterLeftView>)
  .add('open0', () => (
    <Counter>
      {(i)=>{
         a = new Animated.Value(i)
         return (
         <View>
           <Text>count {i%2}</Text>
           <View style={[{
               height:50,width:50,
             },i%2==0?{backgroundColor:"red",opacity:1}:{backgroundColor:"yellow",opacity:0.5}]}
           />
         </View>
       )}}
    </Counter>
  ))
  .add('open', () => (
    <Counter>
      {(i)=>{
         return (
           <FadeInView i={i%2}/>
         )
       }}
    </Counter>
  ))
/* .add('open', () => (
 *   <Counter>
 *     {(i)=>{
 *        return(
 *          <FadeInView i={i} />
 *        )
 *      }}
 *   </Counter>
 * ))*/
