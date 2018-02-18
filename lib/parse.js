'use strict';

const plur = require('plur');

const totals = { errors: 0, warnings: 0 };

module.exports = {
  assets(stats) {
    const result = [];

    //   ['49.1 kB', 'main', './output.js', 'emitted'],

    for (const asset of stats.assets) {
      const assetFile = (asset.name || '').toString();
      let name = asset.chunkNames.join(', ');

      // some loaders populate chunkNames
      if (!name) {
        const matches = assetFile.match(/\.[\w]+$/);
        name = matches.length > 0 ? matches[0].substring(1) : '<unknown>';
      }

      result.push([
        asset.size,
        name,
        assetFile,
        [asset.emitted ? 'emitted' : '']
      ]);
    }

    return result;
  },

  files(stats) {
    const assets = module.exports.assets(stats);
    const modules = module.exports.modules(stats);
    let result = [].concat(module.exports.header(), modules);

    if (assets.length) {
      result = result.concat(
        [['', '', '', '']],
        module.exports.header('asset'),
        assets);
    }

    return result;
  },

  footer(state) {
    if (state.instances > 1) {
      totals.time = state.time;
    }
    return totals;
  },

  header(type) {
    return [['size', 'name', type || 'module', 'status']];
  },

  hidden(stats) {
    const result = [];
    const assets = stats.filteredAssets;
    const modules = stats.filteredModules;

    if (assets > 0) {
      result.push(`${assets} ${plur('asset', assets)}`);
    }

    if (modules > 0) {
      result.push(`${modules} ${plur('module', modules)}`);
    }

    return result.length ? `(${result.join(', ')} hidden)` : '';
  },

  modules(stats) {
    const result = [];
    const { status } = module.exports;

    for (const module of stats.modules) {
      const row = [
        module.size,
        module.id.toString(),
        (module.name || module.identifier).toString(),
        status(module)
      ];

      result.push(row);
    }

    return result;
  },

  problems(stats) {
    const probs = {};
    const rePosition = /((\d+):(\d+))(-\d+)/;

    // TODO: clean and combine these loops

    for (const error of stats.errors) {
      const lines = error.split('\n');
      const [file] = lines;
      const position = lines[lines.length - 1];
      const message = lines.slice(1, lines.length - 1).join(' ');
      const problem = probs[file] || { errors: [], warnings: [] };
      const [,, line, column] = position.match(rePosition);
      const item = { message, line, column };

      problem.errors.push(item);

      for (const module of stats.modules) {
        // manually update the error count. something is broken in webpack
        if (file === module.id || file === module.name || file === module.identifier) {
          module.errors += 1;
        }
      }

      probs[file] = problem;
      totals.errors += 1;
    }

    // because someone thought it was a good idea to reverse the order of data
    // in warning messages versus error messages
    for (const warning of stats.warnings) {
      const lines = warning.split('\n');
      const [file, message] = lines;
      const problem = probs[file] || { errors: [], warnings: [] };
      const [,, line, column] = message.match(rePosition) || [0, 0, 0, 0];
      const item = { message: message.replace(rePosition, '').trim(), line, column };

      problem.warnings.push(item);

      for (const module of stats.modules) {
        // manually update the error count. something is broken in webpack
        if (file === module.id || file === module.name || file === module.identifier) {
          module.warnings += 1;
        }
      }

      probs[file] = problem;
      totals.warnings += 1;
    }

    return probs;
  },

  status(module) {
    const result = [];

    if (module.cacheable === false) {
      result.push('no-cache');
    }

    if (module.optional) {
      result.push('optional');
    }

    if (module.built) {
      result.push('built');
    }

    if (module.prefetched) {
      result.push('prefetch');
    }

    if (module.failed) {
      result.push('failed');
    }

    if (module.warnings) {
      result.push('warning');
    }

    if (module.errors) {
      result.push('error');
    }

    return result;
  }
};
