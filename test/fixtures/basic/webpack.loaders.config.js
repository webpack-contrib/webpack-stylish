'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylishReporter = require('../../../index');

module.exports = {
  // mode: 'development',
  context: __dirname,
  devtool: 'source-map',
  entry: './loader-entry.js',
  output: {
    filename: './output.js',
    path: path.join(__dirname, '/dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Fixture'
    }),
    new StylishReporter()
  ],
  stats: 'none',
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  }
};
