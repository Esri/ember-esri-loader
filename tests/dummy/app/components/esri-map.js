import Ember from 'ember';
import layout from '../templates/components/esri-map';

export default Ember.Component.extend({
  layout,

  isLoaded: false,

  init () {
    this._super(...arguments);
    if (!this.isLoaded) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//js.arcgis.com/3.20';
      // once the script is loaded...
      script.onload = () => {
          // we can now use Dojo's require() to load esri and dojo AMD modules
          // var dojoRequire = window['require'];
          // let the caller know that the API has been successfully loaded
          // and as a convenience, return the require function
          // in case they want to use it directly
          this.isLoaded = true;
          Ember.run.scheduleOnce('afterRender', this, '_createMap');
      };
      // load the script
      document.body.appendChild(script);
    } else {
      Ember.run.scheduleOnce('afterRender', this, '_createMap');
    }
  },

  _createMap() {
    // console.log('I am here', require);
    window['dojoRequire'](['esri/map'], (Map) => {
      this._map = new Map(this.elementId, {
        basemap: 'gray'
      });
    });
  }
});
