'use strict';

const webpack = require('webpack');
// const config = require('./fixtures/basic/webpack.config.js');
// const config = require('./fixtures/basic/webpack.no-named.config.js');
// const config = require('./fixtures/big/webpack.config.js');
// const config = require('./fixtures/loaders/webpack.config.js');
// const config = require('./fixtures/multi/webpack.config.js');
// const config = require('./fixtures/nonstandard/webpack.config.js');
// const config = require('./fixtures/nonstandard/webpack.bad-rule.config.js');
const config = require('./fixtures/problems/webpack.config.js');

const compiler = webpack(config);

compiler.run((errors) => {
  if (errors) {
    console.log(errors); // eslint-disable-line
  }
});
