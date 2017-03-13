# ember-esri-loader

An [Ember addon](https://ember-cli.com/extending/) to allow lazy loading the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) in Ember applications.

[View it live](http://ember-esri-loader.surge.sh/).

## Installation

Once this addon is published, in your app's root folder run:

```shell
ember install ember-esri-loader
```

## Usage

### Lazy Loading the ArcGIS API for JavaScript

To lazy load the ArcGIS API for JavaScript the first time a user goes to the map's route, add the following to the route's controller:

```js
esriLoader: Ember.inject.service('esri-loader'),

// this will be called only the first time the route is loaded
init () {
  this._super(...arguments);
  // lazy load the JSAPI
  const esriLoader = this.get('esriLoader');
  // NOTE: to use the latest 4.x release don't pass any arguments to load()
  esriLoader.load({ url: 'https://js.arcgis.com/3.20' }).catch(err => {
    // do something with the error
  });
}
```

Then in a component in that route, you can create a map like this:

```js
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
```

## How It Works

This addon is an implementation of the ["Dedicated Loader Module" pattern](http://tomwayson.com/2016/11/27/using-the-arcgis-api-for-javascript-in-applications-built-with-webpack/) for [Ember](http://emberjs.com/). It is a mashup of the ideas from [angular2-esri-loader](https://github.com/tomwayson/angular2-esri-loader) and [ember-cli-amd](https://github.com/Esri/ember-cli-amd). Like angular2-esri-loader, it creates a service that exposes functions that wrap calls to load the ArcGIS API and it's modules in promises. However, in order to avoid global namespace collisions with [loader.js](https://github.com/ember-cli/loader.js)'s `require()` and `define()` this addon also has to <del>steal</del> borrow from ember-cli-amd the code that finds and replaces those terms with their pig-latin counterparts in the build output. However unlike ember-cli-amd, it does **not** inject the ArcGIS for JavaScript in the page, nor does it use the ArcGIS API's Dojo loader to load the entire app.

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
