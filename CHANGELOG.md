# ember-esri-loader Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

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
