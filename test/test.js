'use strict';

const path = require('path');
const assert = require('assert');
const execa = require('execa');
const strip = require('strip-ansi');

describe('webpack-stylish', () => {
  const binPath = path.resolve(__dirname, '../node_modules/.bin/webpack');

  it('should report', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.config.js');

    execa(binPath, ['--config', configPath]).then((result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('webpack v') === 0);
      done();
    });
  });

  it('should report: MutliCompiler', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.multi.config.js');

    execa(binPath, ['--config', configPath]).then((result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('webpack v') === 0);
      done();
    });
  });

  it('should report: no NamedModulesPlugin', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.no-named.config.js');

    execa(binPath, ['--config', configPath]).then((result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('webpack v') === 0);
      done();
    });
  });
});
