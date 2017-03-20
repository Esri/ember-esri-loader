import Ember from 'ember';

export default Ember.Route.extend({
  esriLoader: Ember.inject.service('esri-loader'),

  renderTemplate: function () {
    // render the template as normal
    this._super(...arguments);
    // then preload the latest (4.x) version of the JSAPI
    this.get('esriLoader').load().catch(err => {
      // TODO: better way of showing error
      window.alert(err.message || err);
    });
  }
});
