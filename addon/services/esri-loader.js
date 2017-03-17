import Ember from 'ember';

export default Ember.Service.extend({

  // emulate computed property isLoaded to indicate that the JSAPI been loaded
  unknownProperty (key) {
    if (key === 'isLoaded') {
      return !!window.__dojoRequire;
    }
  },

  // inject a script tag pointing to the JSAPI in the page
  // and return a promise once it's loaded
  load (options = {}) {
    // if already loading or loaded, return the existing promise
    if (this._loadPromise) {
      return this._loadPromise;
    }
    // if loaded by other means (i.e. pre-existing script tag on the page)
    if (this.get('isLoaded')) {
      // TODO: check if same version of the JSAPI, then resolve like
      // this._loadPromise = Ember.RSVP.resolve({ previouslyLoaded: true });
      // return this._loadPromise;
      // otherwise reject w/ error saying that a different version has been loaded
      return Ember.RSVP.reject(new Error('The ArcGIS API for JavaScript is already loaded.'));
    }
    // otherwise create a promise that will resolve when the JSAPI is loaded
    this._loadPromise = new Ember.RSVP.Promise((resolve, reject) => {
      // create a script object whose source points to the API
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = options.url || 'https://js.arcgis.com/4.3';
      // once the script is loaded...
      script.onload = () => {
        // notify any watchers of isLoaded copmuted property
        this.notifyPropertyChange('isLoaded');
        // let the caller know that the API has been successfully loaded
        // TODO: would there be something more useful to return here?
        resolve({ success: true });
      };
      // reject on script error
      script.onerror = () => {
        reject(new Error(`Error while attempting to load ${script.src}`));
      };
      // load the script
      document.body.appendChild(script);
    });
    return this._loadPromise;
  },

  // require the modules and return a pomise that reolves them as an array
  loadModules (moduleNames) {
    // TODO: validate that moduleNames is an array w/ at least one string?
    // or just continue to let dojo throw "Cannot read property 'has' of undefined"?
    if (this.get('isLoaded')) {
      return this._loadModules(moduleNames);
    } else {
      if (this._loadPromise) {
        // load modules once finished loadng the JSAPI
        return this._loadPromise.then(() => {
          return this._loadModules(moduleNames);
        });
      } else {
        // not loaded or loading
        return Ember.RSVP.reject(new Error('The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.load()'));
      }
    }
  },

  // require the modules and return a pomise that reolves them as an array
  _loadModules (moduleNames) {
    return new Ember.RSVP.Promise(resolve => {
      // NOTE: this function name will be replaced at build time
      window.__dojoRequire(moduleNames, (...modules) => {
        resolve(modules);
      });
    });
  }
});
