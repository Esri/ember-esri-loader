import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | map');

test('visiting /map', function(assert) {
  visit('/map');

  andThen(function() {
    assert.equal(currentURL(), '/map');
    // wait for the map to load
    /* eslint-disable no-undef */
    waitForElement('.esri-view-root');
    /* eslint-enable no-undef */
    andThen(function() {
      // validate the map DOM
      assert.equal(find('.esri-view-root').css('height'), '400px');
    });
  });
});
