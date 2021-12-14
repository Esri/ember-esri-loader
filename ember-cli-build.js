'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    autoImport: {
      // ember-esri-loader loads esri-loader with a script tag to prevent it from being rewritten to replace "require"
      // and "define" in the build pipeline.  We need to exclude it from ember-auto-import so that we don't pull it
      // back into the build pipeline when we import it ourselves.
      exclude: [ 'esri-loader' ],
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
