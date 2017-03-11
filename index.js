/* jshint node: true */
'use strict';
var path = require('path');
var stringReplace = require('broccoli-string-replace');

module.exports = {
  name: 'ember-esri-loader',

  // if (!this.app.options.amd)
  //   return tree;
  postprocessTree: function (type, tree) {
    if (type !== 'all')
      return tree;

    var outputPaths = this.app.options.outputPaths;

    // Create the string replace patterns for the various application files
    // We will replace require and define function call by their pig-latin version
    var data = {
      files: [
        new RegExp(path.parse(outputPaths.app.js).name + '(.*js)'),
        new RegExp(path.parse(outputPaths.vendor.js).name + '(.*js)'),
        new RegExp(path.parse(outputPaths.tests.js).name + '(.*js)'),
        new RegExp(path.parse(outputPaths.testSupport.js.testSupport).name + '(.*js)')
      ],
      patterns: [{
        match: /([^A-Za-z0-9_#]|^|["])define(\W|["]|$)/g,
        replacement: '$1efineday$2'
      }, {
        match: /(\W|^|["])require(\W|["]|$)/g,
        replacement: '$1equireray$2'
      }, {
        match: /(\W|^|["])dojoRequire(\W|["]|$)/g,
        replacement: '$1require$2'
      }]
    };
    var dataTree = stringReplace(tree, data);

    // Special case for the test loader that is doing some funky stuff with require
    // We basically decided to pig latin all require cases.
    var testLoader = {
      files: [
        new RegExp(path.parse(outputPaths.testSupport.js.testLoader).name + '(.*js)')
      ],
      patterns: [{
        match: /(\W|^|["])define(\W|["]|$)/g,
        replacement: '$1efineday$2'
      }, {
        match: /require([.])/g,
        replacement: 'equireray.'
      }, {
        match: /require([(])/g,
        replacement: 'equireray('
      }, {
        match: /require([ ])/g,
        replacement: 'equireray '
      }, {
        match: /requirejs([.])/g,
        replacement: 'equireray.'
      }]
    };

    return stringReplace(dataTree, testLoader);
  }
};
