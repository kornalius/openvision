import { fs, dirs, path } from './utils.js'
import { MetaMixin, extractMetaFromOptions } from './meta.js'
import { EmitterMixin } from './event.js'


System.defaultJSExtensions = true

System.config({
  transpiler: 'plugin-babel',

  map: {
    'plugin-babel': 'build/systemjs-plugin-babel/plugin-babel.js',
    'systemjs-babel-build': 'build/systemjs-plugin-babel/systemjs-babel-browser.js',
    'app-plugins': 'build/plugins',
    'user-plugins': path.join(dirs.user, '/plugins'),
  },
})


export var plugins = {}
var loadLevel = 0

class EmptyClass {}

export class Plugin extends mix(EmptyClass).with(EmitterMixin, MetaMixin) {

  constructor (options = {}) {
    super(...arguments)
    extractMetaFromOptions(this, options)
    this.__loaded = []
  }

  deconstructor () {
    for (let o of this.__loaded) {
      this.unload(o)
    }
    plugins[this.name] = undefined
  }

  get loaded () { return this.__loaded }

  get tags () { return _.concat(this._tags, this._name, 'plugin') }

  get _prototypeMethods () {
    let pluginProps = Object.getOwnPropertyNames(Plugin.prototype)
    return _.filter(Object.getOwnPropertyNames(Object.getPrototypeOf(this)), k => !_.includes(pluginProps, k))
  }

  _showErrors () {
    return loadLevel === 0
  }

  _showMessages () {
    return true
  }

  plugins (owner) { return _.get(owner, '__plugins', { __order: [] }) }

  isPluginLoaded (owner, name) { return !_.isUndefined(this.plugins(owner)[name]) }

  canLoad (owner) {
    let pn = this.name

    if (this.isPluginLoaded(owner, pn)) {
      if (this._showErrors()) {
        console.error('Plugin', pn, 'already loaded')
      }
      return false
    }

    return true
  }

  _createProperty (obj, name, get, set, value) {
    if (value) {
      Object.defineProperty(obj, name, {
        configurable: true,
        enumerable: true,
        value,
      })
    }
    else {
      Object.defineProperty(obj, name, {
        configurable: true,
        enumerable: true,
        get,
        set,
      })
    }
  }

  _createProto () {
    return {
      // holds plugin's instance property names to be created
      __props: {},

      // holds owner's instance events
      __listeners: {},

      // holds owner's instance property names to be created
      __ownerProps: {},

      // holds owner's instance events
      __ownerListeners: {},
    }
  }

  // create properties on proto or owner instance
  _createProperties (proto, owner, options) {
    let _properties = this.properties

    for (let k in _properties) {
      let v = _properties[k]

      // check if must be added to owner's or plugin's instance
      let ownerProp = false
      if (k.startsWith('$')) {
        k = k.substring(1)
        ownerProp = true
      }

      // get default value or options arg value
      let value = v.options ? _.get(options, v.options, v.value) : v.value

      // property declaration
      if (!_.isUndefined(value)) {
        // private property name
        let name = '_' + k

        // should the owner's instance call the update() method after the setter
        let update = v.update

        let p = ownerProp ? owner : proto
        let props = ownerProp ? '__ownerProps' : '__props'

        proto[props][name] = value

        // create getter and setter
        this._createProperty(p, k,
          v.get || function () { return this[name] },
          v.set || function (value) {
            if (value !== this[name]) {
              this[name] = value
              if (_.isFunction(update)) {
                update.call(this)
              }
              else {
                this.owner.update()
              }
            }
          }
        )
      }
    }
  }

  // create listeners on proto or owner instance
  _createListeners (proto, plugin, owner, options) {
    let _listeners = this.listeners

    for (let k in _listeners) {
      let fn = _listeners[k]
      let bounded = fn.bind(plugin)
      let listenersName = '__listeners'

      // check if must be added to owner's or plugin's instance
      if (k.startsWith('$')) {
        k = k.substring(1)
        listenersName = '__ownerListeners'
      }

      proto[listenersName][k] = bounded
    }
  }

  // copy plugin's methods to proto
  _createMethods (proto, owner, options) {
    let origProto = this.constructor.prototype

    for (let k of this._prototypeMethods) {
      Object.defineProperty(proto, k, Object.getOwnPropertyDescriptor(origProto, k))
    }
  }

  // create plugin and owner instances properties
  _createInstanceProperties (proto, plugin, owner, options) {
    // plugin instance properties
    let ip = proto.__props
    for (let k in ip) {
      plugin[k] = ip[k]
    }

    // owner instance properties
    let op = proto.__ownerProps
    for (let k in op) {
      owner[k] = op[k]
    }
  }

  // create plugin and owner instances listeners
  _createInstanceListeners (proto, plugin, owner, options) {
    // plugin instance listeners
    let ie = proto.__listeners
    for (let k in ie) {
      plugin.on(k, ie[k])
    }

    // owner instance listeners
    let oe = proto.__ownerListeners
    for (let k in oe) {
      owner.on(k, oe[k])
    }
  }

  // set a getter on the owner's instance to access the plugin instance directly
  _createPluginGetter (plugin, owner, name) {
    if (!this.nolink) {
      this._createProperty(owner, name, undefined, undefined, plugin)
    }
  }

  // override other plugins instance methods
  _createOverrides (proto, plugin, owner, options) {
    let overrides = this.overrides

    for (let name in overrides) {
      let ownerPlugin = owner.__plugins[name]
      if (plugins[name] && plugin) {
        for (let k in overrides[name]) {
          let getter
          let setter
          let value
          let v = overrides[name][k]

          if (_.isFunction(v.get)) {
            getter = v.get.bind(plugin)
          }
          if (_.isFunction(v.set)) {
            setter = v.set.bind(plugin)
          }
          if (_.isFunction(v)) {
            value = v.bind(plugin)
          }

          this._createProperty(ownerPlugin, k, getter, setter, value)
        }
      }
      else if (this._showMessages()) {
        console.error('Cannot apply overrides to', name, ', the plugin is either not loaded or does not exists')
      }
    }
  }

  load (owner, options = {}) {
    let pn = this.name

    if (this._showMessages()) {
      console.log(_.repeat('  ', loadLevel) + 'Loading', pn)
    }

    if (!this.canLoad(owner)) {
      return false
    }

    loadLevel++

    // get or create the __plugins property from owner's instance
    let __plugins = owner.__plugins = this.plugins(owner)

    // new plugin prototype
    let proto = this._createProto()

    this._createProperties(proto, owner, options)

    this._createMethods(proto, owner, options)

    // create new plugin instance
    let plugin = Object.create(proto, {})
    plugin.owner = owner

    // assign plugin instance into the owner's instance loaded plugins
    __plugins[pn] = plugin

    // add plugin name to owner's instance plugins load order
    __plugins.__order.push(pn)

    this._createListeners(proto, plugin, owner, options)

    this._createInstanceProperties(proto, plugin, owner, options)

    this._createInstanceListeners(proto, plugin, owner, options)

    this._createPluginGetter(plugin, owner, pn)

    // load plugin dependencies
    for (let n of this.dependencies) {
      let p = plugins[n]
      if (p && p.canLoad(owner)) {
        p.load(owner, options)
      }
    }

    this._createOverrides(proto, plugin, owner, options)

    // import plugins
    for (let n of this.imports) {
      let p = plugins[n]
      if (p && p.canLoad(owner)) {
        p.load(owner, options)
      }
    }

    // tell this plugin instance that it's been loaded into owner instance
    this.__loaded.push(owner)

    // call new instance init method
    if (_.isFunction(plugin.init)) {
      plugin.init(owner, options)
    }

    loadLevel--

    return true
  }

  canUnload (owner) {
    let pn = this.name
    let __plugins = this.plugins(owner)

    if (!__plugins[pn]) {
      if (this._showErrors()) {
        console.error('Plugin', pn, 'not loaded')
      }
      return false
    }

    for (let k in __plugins) {
      let p = __plugins[k]
      if (p && !(p instanceof this.constructor.prototype)) {
        if (_.includes(p.dependencies, pn)) {
          if (this._showErrors()) {
            console.error(pn, 'is a dependency of plugin', k)
          }
          return false
        }
        else if (_.includes(p.imports, pn)) {
          if (this._showErrors()) {
            console.error(pn, 'is required by plugin', k)
          }
          return false
        }
      }
    }

    return true
  }

  unload (owner) {
    let pn = this.name

    if (this._showMessages()) {
      console.log(_.repeat('  ', loadLevel) + 'Unloading', pn)
    }

    if (!this.canUnload(owner)) {
      return false
    }

    loadLevel++

    let __plugins = this.plugins(owner)
    let plugin = __plugins[pn]

    // call plugin instance destroy method
    if (_.isFunction(plugin.destroy)) {
      plugin.destroy(owner)
    }

    // delete owner's instance properties created by the plugin
    for (let k of plugin.__ownerProps) {
      delete owner[k]
    }

    // delete owner's instance overrides created by the plugin
    let overrides = this.overrides
    for (let name in overrides) {
      let oplugin = owner.__plugins[name]
      if (plugins[name] && oplugin) {
        for (let k in overrides[name]) {
          this._createProperty(oplugin, k, undefined, undefined, undefined)
        }
      }
    }

    // cancel plugin's instance events
    let ie = plugin.__listeners
    for (let k in ie) {
      plugin.off(k, ie[k])
    }

    // cancel owner's instance events
    let oe = plugin.__ownerListeners
    for (let k in oe) {
      owner.off(k, oe[k])
    }

    // delete the plugin from the owner's instance plugins list
    delete __plugins[pn]

    // remove the plugin name from the owner's instance plugins load order list
    _.remove(__plugins.__order, pn)

    // delete the plugin getter from the owner's instance
    delete owner[pn]

    // unload imported plugins
    for (let n of this.imports.reverse()) {
      let p = plugins[n]
      if (p && p.canUnload(owner)) {
        p.unload(owner)
      }
    }

    // try to unload plugin's dependencies
    for (let n of this.dependencies.reverse()) {
      let p = plugins[n]
      if (p && p.canUnload(owner)) {
        p.unload(owner)
      }
    }

    // remove the owner from the plugin's loaded list
    _.remove(this.__loaded, owner)

    loadLevel--

    return true
  }

}


export let PluginMixin = Mixin(superclass => class PluginMixin extends superclass {

  plug (name, options = {}) {
    if (_.isArray(name)) {
      for (let n of name) {
        this.plug(n, options)
      }
      return this
    }

    if (_.isObject(name)) {
      options = name
      name = _.get(options, 'name')
    }

    let p = plugins[name]
    if (p) {
      p.load(this, _.extend(options, { name }))
    }

    return this
  }

  unplug (name) {
    if (_.isArray(name)) {
      for (let n of name) {
        this.unplug(n)
      }
      return this
    }

    let p = plugins[name]
    if (p) {
      p.unload(this)
    }

    return this
  }

})


export var loadPlugins = (extraPaths = []) => {
  let walker = d => {
    return new Promise((resolve, reject) => {
      console.log('Scanning plugins', path.join(d, '/plugins') + '...')

      fs.walk(path.join(d, '/plugins'), { fs })
        .then(files => {
          for (let file of files) {
            if (!file.stats.isDirectory() && path.extname(file.path) === '.js') {
              console.log('    loading', path.basename(file.path) + '...')

              System.import(file.path).then(m => {
                if (m.default) {
                  let p = new m.default()
                  plugins[p.name] = p
                  resolve()
                }
                else {
                  reject(new Error('Could not find Class and/or Mixin exports in ' + file.path))
                }
              })
            }
          }
        })
        .catch(resolve)
    })
  }

  let promises = []
  for (let d of _.concat(path.join(dirs.cwd, '/build'), dirs.app, dirs.user, extraPaths)) {
    promises.push(walker(d))
  }

  return Promise.all(promises)
}


export var unloadPlugins = () => {
  return new Promise((resolve, reject) => {
    let keys = _.keys(plugins)
    for (let k of keys) {
      plugins[k].deconstructor()
    }
    plugins = {}
    resolve()
  })
}
