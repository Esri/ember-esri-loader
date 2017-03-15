import Ember from 'ember';

export default Ember.Route.extend({
  esriLoader: Ember.inject.service('esri-loader'),

  renderTemplate: function () {
    // render the template as normal
    this._super(...arguments);
    // then preload the JSAPI
    const esriLoader = this.get('esriLoader');
    esriLoader.load().then(() => {
      this.controller.set('jsapiLoaded', esriLoader.isLoaded());
    }, err => {
      // TODO: better way of showing error
      window.alert(err.message || err);
    });
  }
});
