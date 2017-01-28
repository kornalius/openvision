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

  plugins ($) { return _.get($, '__plugins', { __order: [] }) }

  isPluginLoaded ($, name) { return !_.isUndefined(this.plugins($)[name]) }

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

  _getPropertyInfos (k, options) {
    let _properties = this.properties
    let v = _properties[k]

    // check if must be added to owner's or plugin's instance
    let ownerProp = false
    if (k.startsWith('$')) {
      k = k.substring(1)
      ownerProp = true
    }

    // get default value or options arg value
    let vo = v.options
    if (_.isBoolean(vo)) {
      vo = vo === true ? k : undefined
    }
    let value = vo ? _.get(options, this.name + '.' + vo) : undefined
    if (_.isUndefined(value)) {
      value = _.get(options, vo, v.value)
    }

    return { name: k, ownerProp, value }
  }

  _assignOptions ($, options) {
    let _properties = this.properties
    for (let k in _properties) {
      let { value, name } = this._getPropertyInfos(k, options)
      if (!_.isUndefined(value)) {
        $['_' + name] = value
      }
    }
  }

  // create properties on proto or $ instance
  _createProperties (proto, $, options) {
    let _properties = this.properties

    for (let k in _properties) {
      let v = _properties[k]

      let { name, ownerProp, value } = this._getPropertyInfos(k, options)

      // property declaration
      if (!_.isUndefined(value)) {
        // private property name
        let privateName = '_' + name

        // should the owner's instance call the update() method after the setter
        let update = v.update

        let p = ownerProp ? $ : proto
        let props = ownerProp ? '__ownerProps' : '__props'

        proto[props][privateName] = value

        let setter = function (value) {
          if (value !== this[privateName]) {
            this[privateName] = value
          }
        }

        if (update) {
          if (_.isFunction(update)) {
            setter = function (value) {
              if (value !== this[privateName]) {
                this[privateName] = value
                update.call(this)
              }
            }
          }
          else {
            setter = function (value) {
              if (value !== this[privateName]) {
                this[privateName] = value
                if (this.$) {
                  this.$.update()
                }
                else {
                  this.update()
                }
              }
            }
          }
        }

        // create getter and setter
        this._createProperty(p, name,
          v.get || function () { return this[privateName] },
          v.set || setter
        )
      }
    }
  }

  // create listeners on proto or $ instance
  _createListeners (proto, plugin, $, options) {
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
  _createMethods (proto, $, options) {
    let origProto = this.constructor.prototype

    for (let k of this._prototypeMethods) {
      Object.defineProperty(proto, k, Object.getOwnPropertyDescriptor(origProto, k))
    }
  }

  // create plugin and $ instances properties
  _createInstanceProperties (proto, plugin, $, options) {
    // plugin instance properties
    let ip = proto.__props
    for (let k in ip) {
      plugin[k] = ip[k]
    }

    // $ instance properties
    let op = proto.__ownerProps
    for (let k in op) {
      $[k] = op[k]
    }
  }

  // create plugin and $ instances listeners
  _createInstanceListeners (proto, plugin, $, options) {
    // plugin instance listeners
    let ie = proto.__listeners
    for (let k in ie) {
      plugin.on(k, ie[k])
    }

    // $ instance listeners
    let oe = proto.__ownerListeners
    for (let k in oe) {
      $.on(k, oe[k])
    }
  }

  // set a getter on the owner's instance to access the plugin instance directly
  _createPluginGetter (plugin, $, name) {
    if (!this.nolink) {
      this._createProperty($, '__' + name, undefined, undefined, plugin)
    }
  }

  // override other plugins instance methods
  _createOverrides (proto, plugin, $, options) {
    let overrides = this.overrides

    for (let name in overrides) {
      let ownerPlugin = $.__plugins[name]
      if (plugins[name] && ownerPlugin) {
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

  canLoad ($) { return !this.isPluginLoaded($, this.name) }

  load ($, options = {}) {
    let name = this.name

    // if (this._showMessages()) {
      // console.log(_.repeat('  ', loadLevel) + 'Loading', name)
    // }

    if (!this.canLoad($)) {
      this._assignOptions($, options)
      return false
    }

    loadLevel++

    // get or create the __plugins property from owner's instance
    let __plugins = $.__plugins = this.plugins($)

    // new plugin prototype
    let proto = this._createProto()

    this._createProperties(proto, $, options)

    this._createMethods(proto, $, options)

    // create new plugin instance
    let plugin = Object.create(proto, {})
    plugin.$ = $

    // assign plugin instance into the owner's instance loaded plugins
    __plugins[name] = plugin

    // add plugin name to owner's instance plugins load order
    __plugins.__order.push(name)

    this._createListeners(proto, plugin, $, options)

    this._createInstanceProperties(proto, plugin, $, options)

    this._createInstanceListeners(proto, plugin, $, options)

    this._createPluginGetter(plugin, $, name)

    // load plugin dependencies
    for (let n of this.dependencies) {
      let p = plugins[n]
      if (p && p.canLoad($)) {
        p.load($, options)
      }
    }

    this._createOverrides(proto, plugin, $, options)

    // tell this plugin instance that it's been loaded into $ instance
    this.__loaded.push($)

    // call new instance attach method
    if (_.isFunction(plugin.attach)) {
      plugin.attach($, options)
    }

    loadLevel--

    return true
  }

  canUnload ($) {
    let name = this.name
    let __plugins = this.plugins($)

    if (!__plugins[name]) {
      if (this._showErrors()) {
        console.error('Plugin', name, 'not loaded')
      }
      return false
    }

    for (let k in __plugins) {
      let p = __plugins[k]
      if (p && !(p instanceof this.constructor.prototype)) {
        if (_.includes(p.dependencies, name)) {
          if (this._showErrors()) {
            console.error(name, 'is a dependency of plugin', k)
          }
          return false
        }
      }
    }

    return true
  }

  unload ($) {
    let name = this.name

    // if (this._showMessages()) {
      // console.log(_.repeat('  ', loadLevel) + 'Unloading', name)
    // }

    if (!this.canUnload($)) {
      return false
    }

    loadLevel++

    let __plugins = this.plugins($)
    let plugin = __plugins[name]

    // call plugin instance detach method
    if (_.isFunction(plugin.detach)) {
      plugin.detach($)
    }

    // delete owner's instance properties created by the plugin
    for (let k of plugin.__ownerProps) {
      delete $[k]
    }

    // delete owner's instance overrides created by the plugin
    let overrides = this.overrides
    for (let name in overrides) {
      let oplugin = $.__plugins[name]
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
      $.off(k, oe[k])
    }

    // delete the plugin from the owner's instance plugins list
    delete __plugins[name]

    // remove the plugin name from the owner's instance plugins load order list
    _.remove(__plugins.__order, name)

    // delete the plugin getter from the owner's instance
    delete $[name]

    // try to unload plugin's dependencies
    for (let n of this.dependencies.reverse()) {
      let p = plugins[n]
      if (p && p.canUnload($)) {
        p.unload($)
      }
    }

    // remove the $ from the plugin's loaded list
    _.remove(this.__loaded, $)

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
      name = _.get(options, '__name')
    }

    let p = plugins[name]
    if (p) {
      p.load(this, _.extend(options, { __name: name }))
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

  hasPlugin (name) { return !_.isUndefined(_.get(this, '__plugins.' + name)) }

})


export var loadPlugins = (extraPaths = []) => {
  let walker = d => {
    return new Promise((resolve, reject) => {
      console.log('Scanning plugins', path.join(d, '/plugins') + '...')

      fs.walk(path.join(d, '/plugins'), { fs })
        .then(files => {
          for (let file of files) {
            if (!file.stats.isDirectory() && path.extname(file.path) === '.js') {
              console.log('  loading', path.basename(file.path) + '...')

              System.import(file.path).then(m => {
                if (m.default) {
                  let p = new m.default()
                  if (plugins[p.name]) {
                    console.error('Plugin', p.name, 'already loaded in', file.path)
                  }
                  else {
                    plugins[p.name] = p
                  }
                  resolve()
                }
                else {
                  console.error('Could not find Class and/or Mixin exports in', file.path)
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
