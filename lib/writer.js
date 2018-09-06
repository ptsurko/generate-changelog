'use strict';

/**
 * Generate the markdown for the changelog.
 * @param {String} version - the new version affiliated to this changelog
 * @param {Array<Object>} commits - array of parsed commit objects
 * @param {Object} options - generation options
 * @param {Boolean} options.patch - whether it should be a patch changelog
 * @param {Boolean} options.minor - whether it should be a minor changelog
 * @param {Boolean} options.major - whether it should be a major changelog
 * @param {String} options.repoUrl - repo URL that will be used when linking commits
 * @returns {Promise<String>} the \n separated changelog string
 */
exports.markdown = function (version, commits, options) {
  var content = [];
  var date = new Date().toJSON().slice(0, 10);
  var heading;

  if (options.major) {
    heading = '##';
  } else if (options.minor) {
    heading = '###';
  } else {
    heading = '####';
  }

  if (version) {
    heading += ' ' + version + ' (' + date + ')';
  } else {
    heading += ' ' + date;
  }

  content.push(heading);
  content.push('');

  commits.forEach(function (commit) {
    content.push(' * ' + commit);
    content.push('');
  });

  return content.join('\n');
};
