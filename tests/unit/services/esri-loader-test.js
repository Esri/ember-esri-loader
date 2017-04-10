import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import esriLoader from 'esri-loader';

moduleFor('service:esri-loader', 'Unit | Service | esri loader', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('isLoaded', function (assert) {
  let service = this.subject();
  const stub = this.stub(esriLoader, 'isLoaded');
  service.get('isLoaded');
  assert.ok(stub.calledOnce, 'isLoaded was called once');
});

test('load', function (assert) {
  assert.expect(1);
  let service = this.subject();
  const stub = this.stub(esriLoader, 'bootstrap', function (callback) {
    callback();
  });
  return service.load().then(() => {
    assert.ok(stub.calledOnce, 'bootstrap was called once');
  });
});

test('load with options', function (assert) {
  assert.expect(2);
  let service = this.subject();
  const options = {
    url: 'https://js.arcgis.com/3.20'
  };
  const stub = this.stub(esriLoader, 'bootstrap', function (callback, opts) {
    assert.equal(opts, options);
    callback();
  });
  return service.load(options).then(() => {
    assert.ok(stub.calledOnce, 'bootstrap was called once');
  });
});

test('load modules when API is loaded', function (assert) {
  assert.expect(2);
  let service = this.subject();
  const moduleNames = ['esri/map', 'esri/layers/VectorTileLayer'];
  const stub = this.stub(esriLoader, 'dojoRequire', function (modNames, callback) {
    assert.equal(modNames, moduleNames);
    callback();
  });
  // emulate loaded condition
  this.stub(esriLoader, 'isLoaded', function () {
    return true;
  });
  return service.loadModules(moduleNames).then(() => {
    assert.ok(stub.calledOnce, 'dojoRequire was called once');
  });
});

test('load modules when API is not loaded', function (assert) {
  assert.expect(1);
  let service = this.subject();
  const moduleNames = ['esri/map', 'esri/layers/VectorTileLayer'];
  this.stub(esriLoader, 'dojoRequire', function (modNames, callback) {
    callback();
  });
  // emulate not loaded condition
  this.stub(esriLoader, 'isLoaded', function () {
    return false;
  });
  return service.loadModules(moduleNames).catch(err => {
    assert.equal(err.message, 'The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.load()');
  });
});
