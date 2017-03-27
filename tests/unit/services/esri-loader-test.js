import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

moduleFor('service:esri-loader', 'Unit | Service | esri loader', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  beforeEach () {
    // remove previously stubbed require function
    // NOTE: this could cause problems if used w/ other tests
    // that actually call laod() w/o stubbing the function (i.e. acceptance tests)
    // but it prevents the "not yet loaded" test from causing failures
    delete window.__dojoRequire;
  }
});

// that can be mutated outside of this test, like in an acceptance test
test('when has not yet been loaded', function(assert) {
  assert.expect(2);
  let service = this.subject();
  // NOTE: this could fail if used w/ other tests that actually call laod()
  assert.notOk(service.get('isLoaded'), 'isLoaded should be false');
  // try loading modules before JSAPI is loaded - this should fail
  // NOTE: if actually loaded this can cause tests to hang
  return service.loadModules(['esri/map', 'esri/layers/VectorTileLayer']).then(() => {}, err => {
    assert.equal(err.message, 'The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.load()');
  });
});

// NOTE: hoping to be able to use esri-loader library, see:
// https://github.com/ArcGIS/ember-esri-loader/issues/13
// in which case most of the tests below should be covered in that repo

test('load', function(assert) {
  const done = assert.async();
  assert.expect(2);
  let service = this.subject();
  const stub = this.stub(document.body, 'appendChild', (el) => {
    el.onload();
  });
  service.load();
  assert.ok(stub.calledOnce, 'appendChild was called once');
  assert.equal(stub.getCall(0).args[0].src, 'https://js.arcgis.com/4.3');
  done();
});

test('load other version', function(assert) {
  const done = assert.async();
  assert.expect(2);
  let service = this.subject();
  const stub = this.stub(document.body, 'appendChild', (el) => {
    el.onload();
  });
  service.load({
    url: 'https://js.arcgis.com/3.20'
  });
  assert.ok(stub.calledOnce, 'appendChild was called once');
  assert.equal(stub.getCall(0).args[0].src, 'https://js.arcgis.com/3.20');
  done();
});

test('load modules', function(assert) {
  const done = assert.async();
  assert.expect(1);
  let service = this.subject();
  const moduleNames = ['esri/map', 'esri/layers/VectorTileLayer'];
  window.__dojoRequire = function (names, callback) {
    assert.equal(names, moduleNames, '__dojoRequire called w/ correct args');
    callback();
  };
  service.loadModules(moduleNames);
  done();
});
