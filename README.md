# ember-esri-loader

An [Ember addon](https://ember-cli.com/extending/) that wraps the [esri-loader](https://github.com/Esri/esri-loader) library to allow lazy loading and preloading the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) in Ember applications.

![An example of preloading the ArcGIS API](/preload-jsapi-in-ember.gif)

[View it live](http://ember-esri-loader.surge.sh/).

See the [esri-loader README](https://github.com/Esri/esri-loader#why-is-this-needed) for more information on why this is needed.

## Installation

In your app's root folder run:

```shell
ember install ember-esri-loader
```

## Usage

### Loading Styles

Before you can use the ArcGIS API in your app, you'll need to load the styles, for example by adding an import to your app's style sheet:

```css
/* app/styles/app.css */

/* esri styles */
@import url('https://js.arcgis.com/3.20/esri/css/esri.css');
```

### Pre-loading the ArcGIS API for JavaScript

If you have good reason to believe that the user is going to transition to a map route, you may want to start pre-loading the ArcGIS API as soon as possible w/o blocking template rendering. You can add the following to the application route:

```js
// app/routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({
  esriLoader: Ember.inject.service('esri-loader'),

  renderTemplate: function () {
    // render the template as normal
    this._super(...arguments);
    // then preload the JSAPI
    // NOTE: to use the latest 4.x release don't pass any arguments to load()
    this.get('esriLoader').load().catch(err => {
      // do something with the error
    });
  }
});
```

### Lazy Loading the ArcGIS API for JavaScript

Alternatively you can lazy load the ArcGIS API for JavaScript the first time a user goes to the map's route. One way would be to add the following to the route's controller:

```js
// app/controllers/map.js
import Ember from 'ember';

export default Ember.Controller.extend({
  esriLoader: Ember.inject.service('esri-loader'),

  // this will be called only the first time the route is loaded
  init () {
    this._super(...arguments);
    // lazy load the JSAPI
    const esriLoader = this.get('esriLoader');
    // NOTE: to use a version other than the latest  4.x release
    // pass the url in the options argument to load()
    esriLoader.load({ url: 'https://js.arcgis.com/3.20compact' }).catch(err => {
      // do something with the error
    });
  }
});
```

### Loading Modules from the ArcGIS API for JavaScript

Once you've loaded the API (typically in a route or controller), you can then load modules. Here's an example of how you could load and use the 3.x `Map` and `VectorTileLayer` classes in a component to create a map:

```js
// app/components/esri-map.js
import Ember from 'ember';
import layout from '../templates/components/esri-map';

export default Ember.Component.extend({
  layout,
  esriLoader: Ember.inject.service('esri-loader'),

  // once we have a DOM node to attach the map to...
  didInsertElement () {
    this._super(...arguments);
    // load the map modules
    this.get('esriLoader').loadModules(['esri/map', 'esri/layers/VectorTileLayer']).then(modules => {
      const [Map, VectorTileLayer] = modules;
      // create a map at the DOM node
      this._map = new Map(this.elementId, {
        center: [2.3508, 48.8567], // longitude, latitude
        zoom: 11
      });
      // add a layer
      var vtlayer = new VectorTileLayer('https://www.arcgis.com/sharing/rest/content/items/bf79e422e9454565ae0cbe9553cf6471/resources/styles/root.json');
      this._map.addLayer(vtlayer);
    });
  },

  // destroy the map before this component is removed from the DOM
  willDestroyElement () {
    if (this._map) {
      this._map.destroy();
      delete this._map;
    }
  }
});
```

## How It Works

This addon is an implementation of the ["Dedicated Loader Module" pattern](http://tomwayson.com/2016/11/27/using-the-arcgis-api-for-javascript-in-applications-built-with-webpack/) for [Ember](http://emberjs.com/). It is a mashup of the ideas from [angular2-esri-loader](https://github.com/tomwayson/angular2-esri-loader) and [ember-cli-amd](https://github.com/Esri/ember-cli-amd). Like angular2-esri-loader, it creates a service that exposes functions that wrap calls to the [esri-loader](https://github.com/tomwayson/esri-loader) library to load the ArcGIS API and it's modules in promises. However, in order to avoid global namespace collisions with [loader.js](https://github.com/ember-cli/loader.js)'s `require()` and `define()` this addon also has to <del>steal</del> borrow from ember-cli-amd the code that finds and replaces those terms with their pig-latin counterparts in the build output. However unlike ember-cli-amd, it does **not** inject the ArcGIS for JavaScript in the page, nor does it use the ArcGIS API's Dojo loader to load the entire app.

### Limitations

You cannot use ES2015 module syntax for ArcGIS API modules (i.e. `import Map from 'esri/map';`) with this addon. If you do not feel that your application would benefit from lazy-loading
the ArcGIS API, and you'd prefer the cleaner abstraction of being able to use
`import` statements, you can use [ember-cli-amd](https://emberobserver.com/addons/ember-cli-amd).

Also, this addon cannot be used in an [Ember twiddle](https://ember-twiddle.com/).

## Development Instructions

### Fork, Clone, and Install

* fork and clone the repository
* `cd ember-esri-loader`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## Issues

Find a bug or want to request a new feature?  Please let us know by [submitting an issue](https://github.com/Esri/ember-esri-loader/issues/).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
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

A copy of the license is available in the repository's [license.txt]( ./license.txt) file.
