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
const ReplaceRequireAndDefine = require('./lib/replace-require-and-define-filter');
var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);

    // Note: this function is only called once even if using ember build --watch or ember serve
    // This is the entry point for this addon. We will collect the options from the ember-cli-build.js
    // This addon can use an 'esriLoader' options in the ember-cli-build.js file

    // Merge the default options
    const options = app.options;
    const esriLoader = options && options.esriLoader;
    const excludePaths = ['assets/esri-loader'].concat(esriLoader ? esriLoader.excludePaths : []);
    app.options.esriLoader = Object.assign(
      {},
      app.options.esriLoader,
      { excludePaths }
    );

    // support "import esriLoader from 'esri-loader';" syntax
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
    if (type === 'head-footer') {
      var fileName = config.environment === 'production' ? 'esri-loader.min.js' : 'esri-loader.js';
      return '<script src="' + (config.rootURL || '') + 'assets/' + fileName + '"></script>';
    }
  },

  // find and replace "require" and "define" in the vendor and app scripts
  postprocessTree(type, tree) {
    // TODO: remove this?
    if (!this.app.options.esriLoader) {
      return tree;
    }

    if (type !== 'all') {
      return tree;
    }

    // Note: this function will be called once during the continuous build. 
    // However, the tree returned will be directly manipulated by the continuous build.
    
    return new ReplaceRequireAndDefine(this.app, tree);
  }
};
