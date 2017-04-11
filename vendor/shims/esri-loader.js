(function() {
  /* global self, define */
  function vendorModule() {
    'use strict';

    return { 'default': self['esriLoader'] };
  }

  define('esri-loader', [], vendorModule);
})();
