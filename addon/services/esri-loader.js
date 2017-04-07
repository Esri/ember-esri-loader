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
/* global esriLoader: false */
import Ember from 'ember';

export default Ember.Service.extend({

  // emulate computed property isLoaded to indicate that the JSAPI been loaded
  unknownProperty (key) {
    if (key === 'isLoaded') {
      return esriLoader.isLoaded();
    }
  },

  // inject a script tag pointing to the JSAPI in the page
  // and return a promise once it's loaded
  load (options = {}) {
    // if already loading or loaded, return the existing promise
    if (this._loadPromise) {
      return this._loadPromise;
    }
    // otherwise create a promise that will resolve when the JSAPI is loaded
    this._loadPromise = new Ember.RSVP.Promise((resolve, reject) => {
      esriLoader.bootstrap(err => {
        if (err) {
          reject(err);
        } else {
          // notify any watchers of isLoaded copmuted property
          this.notifyPropertyChange('isLoaded');
          // let the caller know that the API has been successfully loaded
          // TODO: would there be something more useful to return here?
          resolve({ success: true });
        }
      }, options);
    });
    return this._loadPromise;
  },

  // require the modules and return a pomise that reolves them as an array
  loadModules (moduleNames) {
    // TODO: validate that moduleNames is an array w/ at least one string?
    // or just continue to let dojo throw "Cannot read property 'has' of undefined"?
    // TODO: we can probably delegate some or all of this logic to esriLoader.dojoRequire
    if (this.get('isLoaded')) {
      return this._loadModules(moduleNames);
    } else {
      if (this._loadPromise) {
        // load modules once finished loadng the JSAPI
        return this._loadPromise.then(Ember.run.bind(this, this._loadModules, moduleNames));
      } else {
        // not loaded or loading
        return Ember.RSVP.reject(new Error('The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.load()'));
      }
    }
  },

  // wrap esriLoader's dojoRequire in a promise
  _loadModules (moduleNames) {
    return new Ember.RSVP.Promise(resolve => {
      esriLoader.dojoRequire(moduleNames, (...modules) => {
        resolve(modules);
      });
    });
  }
});
