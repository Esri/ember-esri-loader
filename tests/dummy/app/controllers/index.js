import Ember from 'ember';

export default Ember.Controller.extend({
  esriLoader: Ember.inject.service('esri-loader'),

  init () {
    this._super(...arguments);
    // set a property to show the loaded state of the JSAPI
    const esriLoader = this.get('esriLoader');
    this.set('jsapiLoaded', esriLoader.isLoaded());
  }
});
