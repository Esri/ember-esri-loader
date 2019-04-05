# ember-esri-loader Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Fixed
- always inject esri-loader script in head so it is before vendor.js

## 2.8.0
### Added
- bump esri-loader to 2.8.0 to get support for `version` & `css:true`

## 2.7.0
### Added
- bump esri-loader to 2.7.0 to get support for `insertCssBefore`

## 2.6.1
### Fixed
- handle case when rootURL is not defined in environment

## 2.6.0
### Added
- bump esri-loader to 2.6 to default to JSAPI 4.10

## 2.5.1
### Changed
- use ~ instead of ^ for the esri-loader dependency

## 2.5.0
### Added
- during build, we check for lazy engines, and if present, apply the transforms to those files as well.
### Changed
- upgrade to ember 3.4
- use ^ instead of ~ for the esri-loader dependency

## 2.4.0

### Added
- bump esri-loader to 2.5 to default to JSAPI 4.9 (thanks [@NindroidX](https://github.com/NindroidX)!)

## 2.3.0

### Added
- bump esri-loader to 2.3 to default to JSAPI 4.7
- add esri-module-cache mixin

### Changed
- use yarn
- remove deprecated dependencies

## 2.2.0

### Added
- bump to esri-loader@2.2.0

### Fixed
- don't inject esri-loader.js into test page 2x

### Changed
- update to ember 2.18

## 2.1.0

### Added
- bump to esri-loader@2.1.0 and expose loadCss()

### Changed
- update to ember 2.12

## 2.0.1

### Fixed
- updated regex so it works w/ ember-bootstrap [#48](https://github.com/Esri/ember-esri-loader/issues/48)

### Changed
- added Examples section to README

## 2.0.0

### Breaking
- bump esri-loader to 2.0.0

## 0.3.0

### Added
- bump esri-loader to default to JSAPI 4.6

### Fixed
- bump esri-loader to fix bugs w/ sever-side rendering and preloading 3.x

## 0.2.4

### Fixed
- fix ember-cli-coverage bug

## 0.2.3

### Fixed
- bump esri-loader to fix sourcemap error in production builds

### Changed
- include all esri-loader umd output in public tree

## 0.2.2

### Fixed
- bump to latest esri-loader and fix file not found build error

## 0.2.1

### Fixed
- find/replace require/define before integrity SHAs are generated

## 0.2.0

### Added
- `loadModules()` can now lazy load the ArcGIS API

### Changed
- bumped ersi-loader to 1.5.0 for the promise-based API and defaulting to the latest JSAPI (v.4.5)

## 0.1.4

### Fixed
- bug where production builds of Ember 2.14.2 apps did not work at all

## 0.1.3

### Fixed
- errors caused by calling `load()` in multiple acceptance tests

### Changed
- added acceptance tests

## 0.1.2

### Changed
- bumped ersi-loader to 1.1.0 to default to latest JSAPI (v4.4)

## 0.1.1

### Fixed
- actually use esri-loader library

## 0.1.0

### Added
- Initial release
