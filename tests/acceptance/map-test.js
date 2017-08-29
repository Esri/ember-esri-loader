import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | map');

test('visiting /map', function(assert) {
  visit('/map');

  andThen(function() {
    assert.equal(currentURL(), '/map');
    // TODO: write an async helper to wait for the map to load
    // and then validate the map DOM
    // assert.equal(find('.esri-view-root').length, 1);
  });
});
