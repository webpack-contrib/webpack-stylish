'use strict';

const chalk = require('chalk');
const parse = require('./lib/parse');
const style = require('./lib/style');

module.exports = class StylishReporter {
  constructor() {
    this.rendered = {
      header: false
    };

    this.state = { active: 0, instances: 0, time: 0 };
  }

  apply(compiler) {
    const { rendered, state } = this;

    state.active += 1;
    state.instances += 1;

    function render(stats) {
      const opts = {
        context: '/Users/powella/code/webpack-stylish/test/fixture',
        cached: false,
        cachedAssets: false,
        exclude: ['node_modules', 'bower_components', 'components']
      };

      const json = stats.toJson(opts, true);
      state.time += json.time;

      // errors and warnings go first, to make sure the counts are correct for modules
      const problems = style.problems(parse.problems(json));
      const files = style.files(parse.files(json), compiler.options);
      const hidden = style.hidden(parse.hidden(json));
      const hash = style.hash(json, files, hidden);

      const { version } = json;
      const log = [];

      if (!rendered.header) {
        rendered.header = true;
        log.push(chalk.cyan(`webpack v${version}\n`));
      }

      log.push(hash);
      log.push(problems);

      state.active -= 1;

      if (state.active === 0) {
        const footer = style.footer(parse.footer(state));
        rendered.footer = true;
        log.push(footer);
      }

      console.log(log.join('\n')); // eslint-disable-line no-console
    }

    compiler.options.stats = 'none';

    if (compiler.hooks) {
      compiler.hooks.done.tap('webpack-stylish', render);
    } else {
      compiler.plugin('done', render);
    }
  }
};
