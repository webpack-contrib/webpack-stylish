'use strict';

/* eslint no-console: off */

require('loud-rejection')();

const path = require('path');
const assert = require('assert');
const execa = require('execa');
const strip = require('strip-ansi');

const binPath = path.resolve(__dirname, '../node_modules/.bin/webpack');
const t = (...args) => it(...args).timeout(5e3);

function x(config, then, errFn) {
  const args = [binPath, ['--config', config]];

  execa(...args)
    .then(then)
    .catch((error) => {
      if (errFn) {
        errFn(error);
      } else {
        console.log(error);
      }
    });
}

describe('webpack-stylish', () => {
  t('should report', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.config.js');

    x(configPath, (result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('\nwebpack v') === 0);
      done();
    });
  });

  t('should report: MutliCompiler', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.multi.config.js');

    x(configPath, (result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('\nwebpack v') === 0);
      done();
    });
  });

  t('should report: no NamedModulesPlugin', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.no-named.config.js');

    x(configPath, (result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('\nwebpack v') === 0);
      done();
    });
  });

  t('should report for loaders', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.loaders.config.js');

    x(configPath, (result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('\nwebpack v') === 0);
      assert(text.indexOf('180 B') > 0);
      assert(text.indexOf('html  index.html') > 0);
      assert(text.indexOf('85 kB    jpg') > 0);
      done();
    });
  });

  t('should report problems', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/basic/webpack.problems.config.js');

    x(configPath, () => {}, (result) => {
      const text = strip(result.stdout);
      assert(text.indexOf('\nwebpack v') === 0);
      assert(text.indexOf('✖ 3 problems (2 errors, 1 warning)') > 0);
      assert(text.indexOf('/problems.js') > 0);
      assert(text.indexOf('error    Module not found') > 0);
      assert(text.indexOf('warning  Critical dependency') > 0);
      assert(text.indexOf('/image.jpg') > 0);
      assert(text.indexOf('error  Module parse failed: Unexpected character') > 0);
      // assert that multiline errors are being reported correctly
      assert(text.replace(/[\n\s]+/g, '').indexOf('Sourcecodeomittedforthisbinaryfile') > 0);
      done();
    });
  });

  t('should report performance problems', (done) => {
    const configPath = path.resolve(__dirname, 'fixtures/big/webpack.config.js');

    x(configPath, (result) => {
      const text = strip(result.stdout);
      const spaceless = text.replace(/[\n\s]+/g, '');

      assert(text.indexOf('\nwebpack v') === 0);
      assert(text.indexOf('⚠  3 problems (0 errors, 3 warnings)') > 0);
      assert(spaceless.indexOf('Assets:./output.js') > 0);
      assert(spaceless.indexOf('Entrypoints:main(3.15MB)./output.js') > 0);
      assert(text.indexOf('require.ensure') > 0);
      done();
    });
  });
});
