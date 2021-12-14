/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/require-tagless-components */
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/scene-view';

export default Component.extend({
  layout,

  classNames: ['scene-view'],

  esriLoader: service('esri-loader'),

  // once we have a DOM node to attach the map to...
  didInsertElement () { /* eslint-disable-line ember/no-component-lifecycle-hooks */
    this._super(...arguments);
    // load the esri modules
    this.esriLoader.loadModules(['esri/views/SceneView', 'esri/Map']).then(modules => {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }
      const [SceneView, Map] = modules;
      // create a new scene view
      this._view = new SceneView({
        // An instance of Map or WebScene
        map: new Map({
          basemap: 'hybrid',
          ground: 'world-elevation',
        }),
        // The id of a DOM element (may also be an actual DOM element)
        container: this.elementId,
        camera: {
          position: [7.654, 45.919, 5184],
          tilt: 80
        }
      });
      this._view.when(() => {
        // TOOD: wire up elevation checkbox
        // this._view.map.ground.layers.forEach(layer => {
        //   layer.visible = false;
        // });
      })
      .otherwise((err) => {
        // A rejected view indicates a fatal error making it unable to display,
        // this usually means that WebGL is not available, or too old.
        /* eslint-disable no-console */
        console.error("SceneView rejected:", err);
        /* eslint-enable no-console */
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
