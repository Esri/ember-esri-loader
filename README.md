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

### Loading Modules from the ArcGIS API for JavaScript

Here's an example of how you could load and use the 3.x `Map` and `VectorTileLayer` classes in a component to create a map:

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
    // options are only needed b/c we're not using the latest 4.x version of the API
    const options = {
      url: 'https://js.arcgis.com/3.20compact'
    };
    // load the map modules
    this.get('esriLoader').loadModules(['esri/map', 'esri/layers/VectorTileLayer'], options)
    .then(modules => {
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

#### Lazy Loading the ArcGIS API for JavaScript

The above code will lazy load the ArcGIS API for JavaScript the first time `loadModules()` is called. This means users of your application won't need to wait for the ArcGIS API to download until it is need.

### Pre-loading the ArcGIS API for JavaScript

Alternatively, if you have good reason to believe that the user is going to transition to a map route, you may want to start pre-loading the ArcGIS API as soon as possible w/o blocking template rendering. You can add the following to the application route:

```js
// app/routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({
  esriLoader: Ember.inject.service('esri-loader'),

  renderTemplate: function () {
    // render the template as normal
    this._super(...arguments);
    // then preload the JSAPI
    // NOTE: to use the latest 4.x release don't pass any arguments to loadScript()
    this.get('esriLoader').loadScript()
    .catch(err => {
      // do something with the error
    });
  }
});
```

Now you can use `loadModules()` in components to [create maps](https://github.com/Esri/ember-esri-loader/blob/master/tests/dummy/app/components/web-map.js) or [3D scenes](https://github.com/Esri/ember-esri-loader/blob/master/tests/dummy/app/components/scene-view.js). Also, if you need to, you can [use `isLoaded()` anywhere in your application to find out whether or not the ArcGIS API has finished loading](https://github.com/Esri/ember-esri-loader/blob/master/tests/dummy/app/controllers/application.js).

## How It Works

This addon is an implementation of the ["Dedicated Loader Module" pattern](http://tomwayson.com/2016/11/27/using-the-arcgis-api-for-javascript-in-applications-built-with-webpack/) for [Ember](http://emberjs.com/). It is a mashup of the ideas from [angular2-esri-loader](https://github.com/tomwayson/angular2-esri-loader) and [ember-cli-amd](https://github.com/Esri/ember-cli-amd). Like angular2-esri-loader, it creates a service that exposes functions that wrap calls to the [esri-loader](https://github.com/tomwayson/esri-loader) library to load the ArcGIS API and it's modules in promises. However, in order to avoid global namespace collisions with [loader.js](https://github.com/ember-cli/loader.js)'s `require()` and `define()` this addon also has to <del>steal</del> borrow from ember-cli-amd the code that finds and replaces those terms with their pig-latin counterparts in the build output. However unlike ember-cli-amd, it does **not** inject the ArcGIS for JavaScript in the page, nor does it use the ArcGIS API's Dojo loader to load the entire app.

### Limitations

You cannot use ES2015 module syntax for ArcGIS API modules (i.e. `import Map from 'esri/map';`) with this addon. If you do not feel that your application would benefit from lazy-loading
the ArcGIS API, and you'd prefer the cleaner abstraction of being able to use
`import` statements, you can use [ember-cli-amd](https://emberobserver.com/addons/ember-cli-amd).

Using this addon to load ArcGIS API for JavaScript v4.x modules in tests run in PhantomJS [may cause global errors](https://github.com/Esri/ember-esri-loader/pull/28#issue-253837905). Those errors did not happen when running the same tests in Chrome or FireFox.

Also, this addon cannot be used in an [Ember twiddle](https://ember-twiddle.com/).

## Examples

In addition to ArcGIS Online applications such as [ArcGIS Hub](https://hub.arcgis.com/), the following open source applications use this addon:

[MyStreet](https://github.com/Esri/MyStreet) - A municipality viewer that allows users to input an address and receive information based on that location uses this addon to lazy load v3.x of the ArcGIS API only when an app uses a map.

The [dummy application for this addon](http://ember-esri-loader.surge.sh/) demonstrates how to pre-load v4.x of the ArcGIS API.

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
