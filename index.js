/*
  Copyright 2017 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/* eslint-env node */
'use strict';
var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var stringReplace = require('broccoli-string-replace');


module.exports = {
  name: require('./package').name,

  // support "import esriLoader from 'esri-loader';" syntax
  included() {
    this._super.included.apply(this, arguments);
    this.import('vendor/shims/esri-loader.js');
  },

  // copy UMD builds of esri-loader to public tree
  // as a peer to vendor and app scripts
  treeForPublic(publicTree) {
    var esriLoaderTree = new Funnel(path.dirname(require.resolve('esri-loader')), {
      files: ['esri-loader.js', 'esri-loader.js.map', 'esri-loader.min.js', 'esri-loader.min.js.map'],
      destDir: 'assets'
    });
    if (!publicTree) {
      return esriLoaderTree;
    }
    return new MergeTrees([publicTree, esriLoaderTree]);
  },

  // inject esri-loader script tag instead of importing into vendor.js
  // so that it is not subject to the find and replace below
  contentFor (type, config) {
    var env = config.environment;
    var isTest = config.environment === 'test';
    if ((type === 'body-footer' && !isTest) || (type === 'test-head-footer' && isTest)) {
      var fileName = env === 'production' ? 'esri-loader.min.js' : 'esri-loader.js';
      return '<script src="' + (config.rootURL || '') + 'assets/' + fileName + '"></script>';
    }
  },


  // find and replace "require" and "define" in the vendor and app scripts
  postprocessTree: function (type, tree) {
    if (type !== 'all') {
      return tree;
    }

    let lazyEngines = this.app.project.addons.filter((addon) => {
      return (addon.lazyLoading && addon.lazyLoading.enabled === true);
    });

    var engineFilesToAdd = [];
    if (lazyEngines.length) {
      // console.info(`Application includes ${lazyEngines.length} lazy-loading engines...`);
      var engineBase = 'engines-dist';
      engineFilesToAdd = lazyEngines.reduce((acc, engine) => {
        // console.info(`  ember-esri-loader will process the "${engine.options.name}"  engine...`)
        acc.push(`${engineBase}/${engine.options.name}/assets/engine-vendor.js`);
        acc.push(`${engineBase}/${engine.options.name}/assets/engine.js`);
        return acc;
      }, [])
    }

    var outputPaths = this.app.options.outputPaths;

    // Create the string replace patterns for the various application files
    // We will replace require and define function call by their pig-latin version
    var data = {
      files: [
        new RegExp(path.parse(outputPaths.app.js).name + '(.*js)'),
        new RegExp(path.parse(outputPaths.vendor.js).name + '(.*js)'),
        new RegExp(path.parse(outputPaths.tests.js).name + '(.*js)'),
        'tests/index.html',
        new RegExp(path.parse(outputPaths.testSupport.js.testSupport).name + '(.*js)')
      ],
      patterns: [{
        match: /([^A-Za-z0-9_#']|^|["])define(?=\W|["]|$)/g,
        replacement: '$1efineday'
      }, {
        match: /(\W|^|["])require(?=\W|["]|$)/g,
        replacement: '$1equireray'
      }]
    };
    // include the engine files...
    data.files = data.files.concat(engineFilesToAdd);

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
