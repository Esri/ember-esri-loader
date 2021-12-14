/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/require-tagless-components */
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({

  esriLoader: service('esri-loader'),

  // once we have a DOM node to attach the map to...
  didInsertElement () { /* eslint-disable-line ember/no-component-lifecycle-hooks */
    this._super(...arguments);
    // load the map modules
    this.esriLoader.loadModules(['esri/views/MapView', 'esri/WebMap']).then(modules => {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }
      const [MapView, WebMap] = modules;
      // load the webmap from a portal item
      const webmap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
          id: this.itemId
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
  willDestroyElement () { /* eslint-disable-line ember/no-component-lifecycle-hooks */
    this._super(...arguments);
    if (this._view) {
      this._view.container = null;
      delete this._view;
    }
  }
});
