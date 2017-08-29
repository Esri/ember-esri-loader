import { skip } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | index');

// NOTE: can't run more than one acceptance test w/ the way that
// we currently preload the JSAPI in the application route's renderTemplate() hook
// b/c it gets called twice and throws "The ArcGIS API for JavaScript is already loaded."
// and ember in it's infinite wisdom decides to fail the test even though the route does .catch() the error
// TODO: don't skip this test once we resolve the above issue
skip('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
    assert.equal(find('p strong span').text().substr(0, 4), 'Load', 'status should be either Loading... or Loaded');
  });
});
