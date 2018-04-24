import Mixin from '@ember/object/mixin';

export default Mixin.create({
  moduleNotLoadedErrorMessage: 'The module has not yet been loaded',

  init () {
    this._super(...arguments);
    // initialize modules to an empty hash
    this._modules = {};
  },
  // when a map is loaded other modules are added to _modules
  // so that they can be used synchonously later
  cacheModules (moduleHash) {
    this._modules = Object.assign(this._modules, moduleHash);
  },
  // get a module that has already been cached
  getCachedModule (moduleName) {
    const module = this._modules[moduleName];
    if (!module) {
      // the module has not been loaded yet
      throw new Error(`${this.get('moduleNotLoadedErrorMessage')}: ${moduleName}`);
    }
    return module;
  },
  // synchonously create a new instance of an esri class
  // that has already been dynamically loaded and cached
  newClassInstance (className, ...args) {
    const Constructor = this.getCachedModule(className);
    // return a new instance
    return new Constructor(...args);
  }
});
