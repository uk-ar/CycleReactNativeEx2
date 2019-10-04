import React from 'react';
import { Text,View } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

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
      onPress={action('clicked-bookcell')}
      thumbnail={'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200'}
    />
  ))
  .add('with full book', () => (
    <Book
      onPress={action('clicked-bookcell')}
      title='guri & gura & can I handle long long long title?'
      author='author foo'
      isbn='9784834032147'
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
  .add('with three', () => (
    <BookList
      data={[{
          isbn:'9784834032147',
          title:'guri & gura',
          author:'author foo',
          thumbnail:'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200'
        },{
          isbn: '9784828867472',
          title: 'はじめてのABCえほん',
          author: '仲田利津子/黒田昌代',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7472/9784828867472.jpg?_ex=200x200',
        },{
          title: 'ぐりとぐら(複数蔵書)',
          author: '中川李枝子/大村百合子',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0825/9784834000825.jpg?_ex=200x200',
          isbn: '9784834000825',
          reserveUrl: 'http://api.calil.jp/reserve?id=af299d780fe86cf8b116dfda4725dc0f',
        },{
          title: 'ぐりとぐらの1ねんかん(単一蔵書)',
          author: '中川李枝子/山脇百合子（絵本作家）',
          isbn: '9784834014655',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4655/9784834014655.jpg?_ex=200x200',
          reserveUrl: 'https://library.city.fuchu.tokyo.jp/licsxp-opac/WOpacTifTilListToTifTilDetailAction.do?tilcod=1009710046217'
        },{
          title: 'IA／UXプラクティス',
          author: '坂本貴史',
          isbn: '9784862463241',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3241/9784862463241.jpg?_ex=200x200',
        }]}
    />
  ))
