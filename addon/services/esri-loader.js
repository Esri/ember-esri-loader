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

/* eslint-disable ember/no-classic-classes */

import { run } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import Service from '@ember/service';
import esriLoader from 'esri-loader';

export default Service.extend({

  init () {
    this._super(...arguments);
    // have esriLoader use Ember's RSVP promise
    esriLoader.utils.Promise = EmberPromise;
  },

  // emulate computed property isLoaded to indicate that the JSAPI been loaded
  unknownProperty (key) {
    if (key === 'isLoaded') {
      return esriLoader.isLoaded();
    }
  },

  // inject a script tag pointing to the JSAPI in the page
  // and return a promise once it's loaded
  loadScript (options) {
    return esriLoader.loadScript(options)
    .then(script => {
      // have to wrap this async side effect in Ember.run() so tests don't fail
      // may be able to remove this once we can have esriLoader use RSVP.Promise
      run(() => {
        // update the isLoaded computed property
        this.notifyPropertyChange('isLoaded');
        return script;
      });
    });
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
