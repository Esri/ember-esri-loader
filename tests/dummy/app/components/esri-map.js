import Ember from 'ember';
import layout from '../templates/components/esri-map';

export default Ember.Component.extend({
  layout,

  esriLoader: Ember.inject.service('esri-loader'),

  // once we have a DOM node to attach the map to...
  didInsertElement () {
    this._super(...arguments);
    // load the map modules
    this.get('esriLoader').loadModules(['esri/map', 'esri/layers/VectorTileLayer']).then(modules => {
      const [Map, VectorTileLayer] = modules;
      // create a map at the DOM node
      this._map = new Map(this.elementId, {
        center: [2.3508, 48.8567], // longitude, latitude
        zoom: 11
      });
      // add a layer
      var vtlayer = new VectorTileLayer("https://www.arcgis.com/sharing/rest/content/items/bf79e422e9454565ae0cbe9553cf6471/resources/styles/root.json");
      this._map.addLayer(vtlayer);
    });
  }
});
