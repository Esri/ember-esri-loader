import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('waitForElement', function(app, selector, context, interval=300) {
  return new Ember.Test.promise(function (resolve) {
    // inform the test framework that there is an async operation in progress,
    // so it shouldn't consider the test complete
    Ember.Test.adapter.asyncStart();
    let intervalId = window.setInterval(function () {
      let $el = find(selector, context);
      if ($el.length > 0) {
        Ember.run (function () {
          // stop this loop and resolve the promise
          window.clearInterval(intervalId);
          resolve();
        });
        // inform the test framework that this async operation is complete
        Ember.Test.adapter.asyncEnd();
      }
    }, interval);
  });
});
