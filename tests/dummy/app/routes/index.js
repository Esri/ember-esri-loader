import Ember from 'ember';

export default Ember.Route.extend({
  esriLoader: Ember.inject.service('esri-loader'),

  setupController: function (controller) {
    this._super(...arguments);
    // set a property to show the loaded state of the JSAPI
    const esriLoader = this.get('esriLoader');
    controller.set('jsapiLoaded', esriLoader.isLoaded());
  },
});
