
# ember-esri-loader

An [Ember addon](https://ember-cli.com/extending/) that wraps the [esri-loader](https://github.com/Esri/esri-loader) library to allow lazy loading and preloading the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) in Ember applications.

![An example of preloading the ArcGIS API](/preload-jsapi-in-ember.gif)

[View it live](http://ember-esri-loader.surge.sh/).

See the [esri-loader README](https://github.com/Esri/esri-loader#why-is-this-needed) for more information on why this is needed.

Installation
------------------------------------------------------------------------------


In your app's root folder run:

```shell
npm install esri-loader
ember install ember-esri-loader
```

## Usage

### Loading Modules from the ArcGIS API for JavaScript

Here's an example of how you could load and use the latest 4.x `MapView` and `WebMap` classes in a component to create a map:

```js
// app/components/esri-map.js
export default Ember.Component.extend({
  layout,
  esriLoader: Ember.inject.service('esri-loader'),

  // once we have a DOM node to attach the map to...
  didInsertElement () {
    this._super(...arguments);
    // load the map modules
    this.get('esriLoader').loadModules(['esri/views/MapView', 'esri/WebMap']).then(modules => {
      if (this.get('isDestroyed') || this.get('isDestroying')) {
        return;
      }
      const [MapView, WebMap] = modules;
      // load the webmap from a portal item
      const webmap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
          id: this.itemId
        }
      });
      // Set the WebMap instance to the map property in a MapView.
      this._view = new MapView({
        map: webmap,
        container: this.elementId
      });
    });
  },

  // destroy the map view before this component is removed from the DOM
  willDestroyElement () {
    if (this._view) {
      this._view.container = null;
      delete this._view;
    }
  }
});
```

See the [esri-loader documentation on loading modules](https://github.com/Esri/esri-loader#loading-modules-from-the-arcgis-api-for-javascript) for more details.

### Loading Styles

Before you can use the ArcGIS API in your app, you'll need to load the styles. See the [esri-loader documentation on loading styles](https://github.com/Esri/esri-loader#loading-styles) for more details.

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

### esri-module-cache mixin

This addon also includes a mixin that can be help mitigate one of the primary pain points of using esri-loader: accessing modules is always asynchronous. That's fine for modules like `esri/map` where you expect to be using them in an asynchronous operation (like creating a map). However, it can be cumbersome when you just need something like a `new Graphic()` to add to that map.

Services or components that implement the `esri-module-cache` mixin can load all the modules they may need up front during an async operation (such as creating a map), and then use the mixin's `cacheModules()` function to store references to any of those modules so they don't have to be loaded again. Later the `getCachedModule()` and `newClassInstance()` functions can be used to synchronously access and use the modules that have already been loaded. For example:

```js
// map-service.js
import Service, { inject as service } from '@ember/service';
import EsriModuleCacheMixin from 'ember-esri-loader/mixins/esri-module-cache';

export default Service.extend(EsriModuleCacheMixin, {
  esriLoader: service('esri-loader'),
  loadMap (elemendId, options) {
    return thigs.get('esriLoader').loadModules([
      'esri/map',
      'esri/Graphic'
    ]).then(([Map, Graphic]) => {
      // cache graphic module later for synchronous use
      this.cacheModules({ Graphic });
      // create and return the map instance
      return new Map(elementId, options);
    });
  },
  // NOTE: this will throw an error if it is called before loadMap()
  newGraphic (...args) {
    return this.newClassInstance('Graphic', ...args);
  }
});
```

```js
// my-map/component.js
export default Component.extend({
  layout,
  mapService: service(),

  // once we have a DOM node to attach the map to...
  didInsertElement () {
    this._super(...arguments);
    // load the map
    this.get('mapService').loadMap(this.elementId, { basemap: 'gray' })
    .then(map => {
      this.map = map;
    })
  },
  actions: {
    addGraphic (x, y) {
      if (!this.map) {
        // can't call newGraphic() unles map has loaded
        // also no point in creating a gaphic if there's no map to add it to
        return;
      }
      const graphicJson = {
        geometry: {
          x,
          y,
          spatialReference: {
            wkid: 4326
          }
        },
        symbol: {
          color: [255, 0, 0, 128],
          size: 12,
          angle: 0,
          xoffset: 0,
          yoffset: 0,
          type: 'esriSMS',
          style: 'esriSMSSquare',
          outline: {
            color: [0, 0, 0, 255],
            width: 1,
            type: 'esriSLS',
            style: 'esriSLSSolid'
          }
        }
      };
      const graphic =
      this.get('mapService').newGraphic(graphicJson);
      this.map.graphics.add(graphic);
    }
  }
```

### Configuration

#### excludePaths

By default esri-loader will rename and replace all occurrences of `require()` and `define()` in your application's built JavaScript ([see below](#how-it-works)). In rare cases, you might need to exclude certain files from that process. For example, suppose you plan to host one or more AMD modules (perhaps a custom layer) in a folder under the public tree, and then [configure esri-loader to be able to load those as a package](https://github.com/Esri/esri-loader/#configuring-dojo). In that case you would add the following options when instantiating your application in ember-cli-build.js:

```js
  esriLoader: {
    excludePaths: ['path/to/amd/package/under/public']
  }
```

## How It Works

This addon is an implementation of the ["Dedicated Loader Module" pattern](http://tomwayson.com/2016/11/27/using-the-arcgis-api-for-javascript-in-applications-built-with-webpack/) for [Ember](http://emberjs.com/). It is a mashup of the ideas from [angular2-esri-loader](https://github.com/tomwayson/angular2-esri-loader) and [ember-cli-amd](https://github.com/Esri/ember-cli-amd). Like angular2-esri-loader, it creates a service that exposes functions that wrap calls to the [esri-loader](https://github.com/tomwayson/esri-loader) library to load the ArcGIS API and it's modules in promises. However, in order to avoid global namespace collisions with [loader.js](https://github.com/ember-cli/loader.js)'s `require()` and `define()` this addon uses [replace-require-and-define](https://github.com/Esri/replace-require-and-define/) to rename and replace those terms at build time. However unlike ember-cli-amd, it does **not** inject the ArcGIS for JavaScript in the page, nor does it use the ArcGIS API's Dojo loader to load the entire app.

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


### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`


### Running Tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Building

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

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
