import { resolve } from 'rsvp';
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

test('loadScript', function (assert) {
  assert.expect(2);
  let service = this.subject();
  const stub = this.stub(esriLoader, 'loadScript').callsFake(function (options) {
    assert.notOk(options, 'should not pass options');
    return resolve();
  });
  return service.loadScript().then(() => {
    assert.ok(stub.calledOnce, 'loadScript was called once');
  });
});

test('loadScript with options', function (assert) {
  assert.expect(2);
  let service = this.subject();
  const options = {
    url: 'https://js.arcgis.com/3.20'
  };
  const stub = this.stub(esriLoader, 'loadScript').callsFake(function (opts) {
    assert.equal(opts, options, 'should have passed in options');
    return resolve();
  });
  return service.loadScript(options).then(() => {
    assert.ok(stub.calledOnce, 'bootstrap was called once');
  });
});

test('loadModules', function (assert) {
  assert.expect(3);
  let service = this.subject();
  const moduleNames = ['esri/map', 'esri/layers/VectorTileLayer'];
  const stub = this.stub(esriLoader, 'loadModules').callsFake(function (modNames, opts) {
    assert.equal(modNames, moduleNames, 'should pass same modules names');
    assert.notOk(opts, 'should not pass options');
    return resolve();
  });
  return service.loadModules(moduleNames).then(() => {
    assert.ok(stub.calledOnce, 'loadModules was called once');
  });
});

test('loadModules with options', function (assert) {
  assert.expect(3);
  let service = this.subject();
  const moduleNames = ['esri/map', 'esri/layers/VectorTileLayer'];
  const options = {
    url: 'https://js.arcgis.com/3.20'
  };
  const stub = this.stub(esriLoader, 'loadModules').callsFake(function (modNames, opts) {
    assert.equal(modNames, moduleNames, 'should pass same modules names');
    assert.equal(opts, options, 'should have passed in options');
    return resolve();
  });
  return service.loadModules(moduleNames, options).then(() => {
    assert.ok(stub.calledOnce, 'loadModules was called once');
  });
});

test('loadCss', function (assert) {
  assert.expect(2);
  let service = this.subject();
  const url = 'https://js.arcgis.com/4.7/esri/css/main.css';
  const stub = this.stub(esriLoader, 'loadCss').callsFake(function (cssUrl) {
    assert.equal(cssUrl, url, 'should pass same url');
    return resolve();
  });
  return service.loadCss(url).then(() => {
    assert.ok(stub.calledOnce, 'loadCss was called once');
  });
});
