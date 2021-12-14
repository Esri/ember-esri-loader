import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  @service esriLoader

  beforeModel() {
    // Preload the JS & CSS for the latest (4.x) version of the JSAPI
    this.esriLoader.loadScript({ css: true })
      .catch(err => {
        // TODO: better way of showing error
        window.alert(err.message || err);
      });
  }

}
