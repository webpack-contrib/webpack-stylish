'use strict';

const webpack = require('webpack');
const config = require('./fixtures/basic/webpack.multi.config.js');

const compiler = webpack(config);

compiler.run(() => {});
