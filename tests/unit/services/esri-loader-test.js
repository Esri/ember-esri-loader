import { moduleFor, test } from 'ember-qunit';

moduleFor('service:esri-loader', 'Unit | Service | esri loader', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// NOTE: for now not testing load() or loadModules() when loaded
// hoping to be able to use esri-loader library, see:
// https://github.com/ArcGIS/ember-esri-loader/issues/13
// in which case those tests should be covered in that repo
test('when has not yet been loaded', function(assert) {
  assert.expect(2);
  let service = this.subject();
  assert.notOk(service.get('isLoaded'), 'isLoaded should be false');
  // try loading modules before JSAPI is loaded - this should fail
  return service.loadModules(['esri/map', 'esri/layers/VectorTileLayer']).then(() => {}, err => {
    assert.equal(err.message, 'The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.load()');
  });
});
