import Ember from 'ember';

export default Ember.Controller.extend({
  esriLoader: Ember.inject.service('esri-loader'),

  // computed property to show the loaded state of the JSAPI
  jsapiLoaded: Ember.computed.alias('esriLoader.isLoaded')
});
