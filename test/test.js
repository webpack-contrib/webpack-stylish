'use strict';

/* eslint no-console: off */

require('loud-rejection')();

const path = require('path');
const assert = require('assert');
const execa = require('execa');
const strip = require('strip-ansi');

const binPath = path.resolve(__dirname, '../node_modules/.bin/webpack');
const t = (...args) => it(...args).timeout(5e3);

function x(config, then) {
  const args = [binPath, ['--config', config]];

  execa(...args)
    .catch((error) => { console.log(error); })
    .then(then);
}

describe('webpack-stylish', () => {
  t('should report', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.config.js');

    x(configPath, (result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('webpack v') === 0);
      done();
    });
  });

  t('should report: MutliCompiler', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.multi.config.js');

    x(configPath, (result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('webpack v') === 0);
      done();
    });
  });

  t('should report: no NamedModulesPlugin', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.no-named.config.js');

    x(configPath, (result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('webpack v') === 0);
      done();
    });
  });

  t('should report for loaders', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.loaders.config.js');

    x(configPath, (result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('webpack v') === 0);
      assert(text.indexOf('180 B') > 0);
      assert(text.indexOf('html  index.html') > 0);
      assert(text.indexOf('85 kB    jpg') > 0);
      done();
    });
  });
});
