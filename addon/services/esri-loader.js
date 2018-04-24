/*
  Copyright 2017 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import Ember from 'ember';
import esriLoader from 'esri-loader';

export default Ember.Service.extend({

  init () {
    this._super(...arguments);
    // have esriLoader use Ember's RSVP promise
    esriLoader.utils.Promise = Ember.RSVP.Promise;
  },

  // emulate computed property isLoaded to indicate that the JSAPI been loaded
  unknownProperty (key) {
    if (key === 'isLoaded') {
      return esriLoader.isLoaded();
    }
  },

  loadScript (options) {
    return esriLoader.loadScript(options)
    .then(script => {
      // have to wrap this async side effect in Ember.run() so tests don't fail
      // may be able to remove this once we can have esriLoader use RSVP.Promise
      Ember.run(() => {
        // update the isLoaded computed property
        this.notifyPropertyChange('isLoaded');
        return script;
      });
    });
  },

  // inject a script tag pointing to the JSAPI in the page
  // and return a promise once it's loaded
  load (options = {}) {
    Ember.deprecate('esriLoader.load() will be removed at the next breaking version. Use esriLoader.loadScript() instead.', false, {
      id: 'ember-esri-loader.load',
      until: '10.0.0'
    });
    return this.loadScript(options);
  },

  // require the modules and return a pomise that reolves them as an array
  loadModules (moduleNames, options) {
    return esriLoader.loadModules(moduleNames, options);
  },

  // inject a css stylesheet into the page
  loadCss (...args) {
    return esriLoader.loadCss(...args);
  }
});
