import React from 'react';
import { Text,View } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from './Button';
import { CenterLeftView, CenterView } from './CenterView';

import { BookList, BookCell,LibraryStatus,icons,Book,libraryStatuses} from '../../Book/BookCell';

storiesOf('LibraryStatus', module)
  .add('with text and color', () => (
    <LibraryStatus text="foo" style={{color:"red"}} />
  ))
  .add('with loading', () => (
    <LibraryStatus text="bar" style={{color:"blue"}} loading={true}/>
  ))

storiesOf('Book', module)
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
          title: 'はじめてのABCえほん',
          author: '仲田利津子/黒田昌代',
          thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7472/9784828867472.jpg?_ex=200x200',
          isbn: '9784828867472',
        }
        ]}
    />
  ))

storiesOf('Button', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('with text', () => (
    <Button onPress={action('clicked-text')}>
      <Text>Hello Button</Text>
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onPress={action('clicked-emoji')}>
      <Text>😀 😎 👍 💯</Text>
    </Button>
  ));
