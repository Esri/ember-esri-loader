/* eslint-disable ember/no-new-mixins */
/* eslint-disable ember/no-mixins */
import EmberObject from '@ember/object';
import EsriModuleCacheMixin from 'ember-esri-loader/mixins/esri-module-cache';
import { module, test } from 'qunit';
import sinon from 'sinon';


module('Unit | Mixin | esri module cache', function(hooks) {

  hooks.afterEach(function() {
    sinon.restore()
  })
  
  test('when the module has not yet been cached', function(assert) {
    let EsriModuleCacheObject = EmberObject.extend(EsriModuleCacheMixin);
    let subject = EsriModuleCacheObject.create();
    assert.throws(function () {
      subject.getCachedModule('arcgisUtils');
    }, /The module has not yet been loaded: arcgisUtils/, 'it should throw default error message');
    // override the default message
    subject.set('moduleNotLoadedErrorMessage', 'I no haz');
    assert.throws(function () {
      subject.getCachedModule('arcgisUtils');
    }, /I no haz: arcgisUtils/, 'it should throw default error message');
  });

  test('can instantiate class if modules have loaded', function (assert) {
    const sfs = {
      color: [0, 0, 0, 64],
      outline: {
        color: [0, 0, 0, 255],
        width: 1,
        type: 'esriSLS',
        style: 'esriSLSSolid'
      },
      type: 'esriSFS',
      style: 'esriSFSSolid'
    };
    let EsriModuleCacheObject = EmberObject.extend(EsriModuleCacheMixin);
    let subject = EsriModuleCacheObject.create();
    let SimpleFillSymbol = sinon.spy();
    // emulate loading the symbol modules
    subject.cacheModules({
      SimpleFillSymbol
    });
    subject.newClassInstance('SimpleFillSymbol', sfs);
    assert.ok(SimpleFillSymbol.calledWith(sfs), 'called SimpleFillSymbol constructor with the symbol JSON');
  });
});
