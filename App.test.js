import React from "react";

//https://github.com/react-community/react-navigation/pull/1320#issuecomment-309535212
Date.now = jest.fn(() => 0);
const App = require("./App").default;

import renderer from "react-test-renderer";
import initStoryshots from "@storybook/addon-storyshots";

it("renders without crashing", () => {
  // TODO:fix workaround
  // https://github.com/facebook/react-native/pull/17017
  //const rendered = renderer.create(<App />).toJSON();
  //expect(rendered).toBeTruthy();
});

initStoryshots({
  configPath: "src/storybook",
});
