'use strict';

const path = require('path');
const webpack = require('webpack');
const StylishReporter = require('../../../index');

module.exports = {
  // mode: 'development',x
  context: path.resolve(__dirname),
  devtool: 'source-map',
  entry: './entry.js',
  output: {
    filename: './output.js',
    path: path.resolve(__dirname)
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new StylishReporter()
  ],
  stats: 'none'
};
