import React from 'react';
import { Text } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from './Button';
import { CenterLeftView, CenterView } from './CenterView';

import { BookCell } from '../../Book';

storiesOf('Book', module)
  .addDecorator(getStory => <CenterLeftView>{getStory()}</CenterLeftView>)
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
        libraryStatus: {
          exist: false,
          rentable: false,
          reserveUrl: '',
        },
        isbn: '9784834032147',
        active: true,
      }}
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
