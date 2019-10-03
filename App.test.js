import React from 'react';
import App from './App';

import renderer from 'react-test-renderer';
import initStoryshots from '@storybook/addon-storyshots';

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});

initStoryshots();
