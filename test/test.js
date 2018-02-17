'use strict';

const path = require('path');
const assert = require('assert');
const execa = require('execa');
const strip = require('strip-ansi');

describe('webpack-stylish', () => {
  it('should report', (done) => {
    const binPath = path.resolve(__dirname, '../node_modules/.bin/webpack');
    const configPath = path.resolve(__dirname, 'fixture/webpack.config.js');

    execa(binPath, ['--config', configPath]).then((result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('webpack v') === 0);
      done();
    });
  });
});
