import Ember from 'ember';

export default Ember.Controller.extend({

  esriLoader: Ember.inject.service('esri-loader'),

  // this will be called only the first time the map route is loaded
  init () {
    this._super(...arguments);
    // set a property to show the loaded state of the JSAPI
    const esriLoader = this.get('esriLoader');
    this.set('jsapiLoaded', esriLoader.isLoaded());
    // lazy load the latest (4.x) version of the JSAPI
    esriLoader.load().then(() => {
      this.set('jsapiLoaded', esriLoader.isLoaded());
    }, err => {
      // TODO: better way of showing error
      window.alert(err.message || err);
    });
  }
});
