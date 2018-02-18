'use strict';

const path = require('path');
const webpack = require('webpack');
const StylishReporter = require('../../../index');

const stylish = new StylishReporter();

module.exports = [{
  context: __dirname,
  entry: './entry.js',
  output: {
    filename: 'client.js',
    path: path.join(__dirname, '/dist/client'),
    publicPath: '/static/'
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    stylish
  ],
  stats: 'none'
}, {
  context: __dirname,
  entry: './server.js',
  output: {
    filename: 'server.js',
    path: path.join(__dirname, '/dist/server')
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    stylish
  ],
  stats: 'none'
}];
