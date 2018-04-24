import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  esriLoader: service('esri-loader'),

  renderTemplate: function () {
    // render the template as normal
    this._super(...arguments);
    // then preload the latest (4.x) version of the JSAPI
    this.get('esriLoader').loadScript()
    .catch(err => {
      // TODO: better way of showing error
      window.alert(err.message || err);
    });
  }
});
