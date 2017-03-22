import Ember from 'ember';
import layout from '../templates/components/scene-view';

export default Ember.Component.extend({
  layout,

  classNames: ['scene-view'],

  esriLoader: Ember.inject.service('esri-loader'),

  // once we have a DOM node to attach the map to...
  didInsertElement () {
    this._super(...arguments);
    // load the esri modules
    this.get('esriLoader').loadModules(['esri/views/SceneView', 'esri/Map']).then(modules => {
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
      this._view.then(() => {
        // TOOD: wire up elevation checkbox
        // this._view.map.ground.layers.forEach(layer => {
        //   layer.visible = false;
        // });
      })
      .otherwise((err) => {
        // A rejected view indicates a fatal error making it unable to display,
        // this usually means that WebGL is not available, or too old.
        console.error("SceneView rejected:", err);
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
