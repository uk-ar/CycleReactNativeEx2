import React from 'react';
import { Text,View } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from './Button';
import { CenterLeftView, CenterView } from './CenterView';

import { BookCell,LibraryStatus } from '../../Book';

storiesOf('LibraryStatus', module)
  .add('with text and color', () => (
    <LibraryStatus text="foo" style={{color:"red"}} />
  ))
  .add('with loading', () => (
    <LibraryStatus text="bar" style={{color:"blue"}} loading={true}/>
  ))

storiesOf('Book', module)
  .add('with isbn', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        //title: 'guri & gura',
        isbn: '9784834032147',
      }}
    />
  ))
  .add('with thumbnail', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
      }}
    />
  ))
  .add('with book', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        title: 'guri & gura & can I handle long long long title?', author: '',
        thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
        author: 'author foo',
        isbn: '9784834032147',
        active: true,
      }}
    />
  ))
  .add('with short title', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        title: 'guri & gura', author: 'author baz',
        thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
        author: 'author foo',
        bucket: 'liked',
        isbn: '9784834032147',
        active: true,
      }}
    >
      {/* <LibraryStatus text="bar" style={{color:"blue"}} loading={true}/> */}
      <LibraryStatus text="bar" style={{color:"blue"}} loading={false}/>
    </BookCell>
  ))
  .add('with library status', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        title: 'guri & gura & can I handle long long long title?', author: '',
        thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
        author: 'author foo',
        bucket: 'liked',
        libraryStatus: {
          exist: false,
          rentable: false,
          reserveUrl: '',
        },
        isbn: '9784834032147',
        active: true,
      }}
    >
      {/* <LibraryStatus text="bar" style={{color:"blue"}} loading={true}/> */}
      <LibraryStatus text="bar" style={{color:"blue"}} loading={false}/>
    </BookCell>
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
