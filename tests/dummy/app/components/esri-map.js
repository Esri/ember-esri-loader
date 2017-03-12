import Ember from 'ember';
import layout from '../templates/components/esri-map';

export default Ember.Component.extend({
  layout,

  esriLoader: Ember.inject.service('esri-loader'),

  init () {
    this._super(...arguments);
    // lazy load the JSAPI
    this.get('esriLoader').load({ url: '//js.arcgis.com/3.20' }).then(() => {
      Ember.run.scheduleOnce('afterRender', this, '_createMap');
    }, err => {
      // TODO: better way of showing error
      window.alert(err.message || err);
    });
  },

  _createMap() {
    // load the map modules
    this.get('esriLoader').loadModules(['esri/map', 'esri/layers/VectorTileLayer']).then(modules => {
      const [Map, VectorTileLayer] = modules;
      // create a map at this DOM node
      this._map = new Map(this.elementId, {
        center: [2.3508, 48.8567], // longitude, latitude
        zoom: 11
      });
      //The URL referenced in the constructor may point to a style url JSON (as in this sample)
      //or directly to a vector tile service
      var vtlayer = new VectorTileLayer("https://www.arcgis.com/sharing/rest/content/items/bf79e422e9454565ae0cbe9553cf6471/resources/styles/root.json");
      this._map.addLayer(vtlayer);
    });
  }
});
