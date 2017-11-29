import React from 'react';
import App from './App';

import renderer from 'react-test-renderer';
import initStoryshots from '@storybook/addon-storyshots';

it('renders without crashing', () => {
  // TODO:fix workaround
  // https://github.com/facebook/react-native/pull/17017
  //const rendered = renderer.create(<App />).toJSON();
  //expect(rendered).toBeTruthy();
});

initStoryshots();
