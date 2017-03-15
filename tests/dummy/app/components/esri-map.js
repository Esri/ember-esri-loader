import Ember from 'ember';
import layout from '../templates/components/esri-map';

export default Ember.Component.extend({
  layout,

  esriLoader: Ember.inject.service('esri-loader'),

  // once we have a DOM node to attach the map to...
  didInsertElement () {
    this._super(...arguments);
    // load the map modules
    this.get('esriLoader').loadModules(['esri/views/MapView', 'esri/WebMap']).then(modules => {
      const [MapView, WebMap] = modules;
      // load the webmap from a portal item
      const webmap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
          id: "f2e9b762544945f390ca4ac3671cfa72"
        }
      });
      // Set the WebMap instance to the map property in a MapView.
      this._view = new MapView({
        map: webmap,
        container: this.elementId
      });
    });
  },

  // destroy the map before this component is removed from the DOM
  willDestroyElement () {
    if (this._view) {
      delete this._view;
    }
  }
});
