'use strict';

const webpack = require('webpack');
const config = require('./fixture/webpack.multi.config.js');

const compiler = webpack(config);

compiler.run(() => {});
