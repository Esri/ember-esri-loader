/* eslint-disable ember/no-classic-classes */
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  esriLoader: service('esri-loader'),

  // computed property to show the loaded state of the JSAPI
  jsapiLoaded: alias('esriLoader.isLoaded')
});
