import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | map');

test('visiting /map', function(assert) {
  visit('/map');

  andThen(function() {
    assert.equal(currentURL(), '/map');
    // wait for the map to load
    waitForElement('.esri-view-root');
    andThen(function() {
      // validate the map DOM
      assert.equal(find('.esri-view-root').css('height'), '400px');
    });
  });
});
