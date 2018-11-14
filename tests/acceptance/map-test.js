import { currentURL, visit, waitFor, find } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | map', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /map', async function(assert) {
    await visit('/map');

    assert.equal(currentURL(), '/map');
    // wait for the map to load

    await waitFor('.esri-view-root');
    // validate the map DOM
    let mapEl = find('.esri-view-root');

    assert.equal(window.getComputedStyle(mapEl).height, '400px');
  });
});
