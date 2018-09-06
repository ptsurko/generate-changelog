'use strict';

var Bluebird = require('bluebird');
var CP       = Bluebird.promisifyAll(require('child_process'));

var SEPARATOR      = '===END===';

/**
 * Get all commits from the last tag (or the first commit if no tags).
 * @param {Object} options - calculation options
 * @returns {Promise<Array<Object>>} array of parsed commit objects
 */
exports.getCommits = function (options) {
  options = options || {};
  return new Bluebird(function (resolve) {
    if (options.tag) {
      return resolve(options.tag);
    }
    return resolve(CP.execAsync('git describe --tags --abbrev=0'));
  })
  .catch(function () {
    return '';
  })
  .then(function (tag) {
    tag = tag.toString().trim();
    var revisions;

    if (tag.indexOf('..') !== -1) {
      revisions = tag;
    } else {
      revisions = tag ? tag + '..HEAD' : '';
    }

    return CP.execAsync(
      'git log --pretty=format:%s --no-merges ' + revisions,
      {
        maxBuffer: Number.MAX_SAFE_INTEGER
      }
    );
  })
  .catch(function () {
    throw new Error('no commits found');
  })
  .then(function (gitLogOutput) {
    if (!gitLogOutput) {
      return []
    }

    return gitLogOutput.split('\n').filter(Boolean);
  })
};
