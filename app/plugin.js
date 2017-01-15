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

  destroy () {
    for (let o of this.__loaded) {
      this.unload(o)
    }
    plugins[this.name] = undefined
  }

  get loaded () { return this.__loaded }

  get tags () { return _.concat(this._tags, this._name, 'plugin') }

  get prototypeNames () {
    let pluginProps = Object.getOwnPropertyNames(Object.getPrototypeOf(new Plugin()))
    return _.filter(Object.getOwnPropertyNames(Object.getPrototypeOf(this)), k => !_.includes(pluginProps, k))
  }

  canLoad (obj) {
    let pn = this.name

    if (_.get(obj, '__plugins.' + pn)) {
      if (loadLevel === 0) {
        console.error('Plugin', pn, 'already loaded')
      }
      return false
    }

    for (let k of this.prototypeNames) {
      if (_.get(this.interface, k + '.declared', false) && _.isUndefined(obj[k])) {
        console.error('Missing interface declaration ' + k)
        return false
      }
    }

    return true
  }

  load (obj, options = {}) {
    console.log(_.repeat('  ', loadLevel) + 'Loading', this.name)

    if (!this.canLoad(obj)) {
      return false
    }

    loadLevel++

    obj.__plugins = _.get(obj, '__plugins', {})

    let proto = obj.__plugin_proto
    if (!proto) {
      proto = obj.__plugin_proto = Object.create({})

      let ee = PIXI.utils.EventEmitter

      let c = Object.getPrototypeOf(this)
      c = Object.getPrototypeOf(c)
      while (c && c.constructor !== ee) {
        for (let k of Object.getOwnPropertyNames(c)) {
          if (k !== 'constructor' && Object.hasOwnProperty(c, k)) {
            Object.defineProperty(proto, k, Object.getOwnPropertyDescriptor(c, k))
          }
        }
        c = Object.getPrototypeOf(c)
      }

      let oPrototype = Object.getPrototypeOf(obj)
      Object.setPrototypeOf(proto, oPrototype)
      Object.setPrototypeOf(obj, proto)
    }

    let p = this.constructor.prototype
    for (let k of this.prototypeNames) {
      if (!_.get(this.interface, k + '.declared', false) && !_.get(this.interface, k + '.exclude', false)) {
        if (!proto.hasOwnProperty(k) || _.get(this.interface, k + '.override', false)) {
          Object.defineProperty(proto, k, Object.getOwnPropertyDescriptor(p, k))
        }
      }
    }

    obj.__plugins[this.name] = _.get(obj, '__plugins.' + this.name, proto)

    for (let n of this.dependencies) {
      let p = plugins[n]
      if (p && p.canLoad(obj)) {
        p.load(obj)
      }
    }

    for (let n of this._requires) {
      let p = plugins[n]
      if (p && p.canLoad(obj)) {
        p.load(obj)
      }
    }

    this.__loaded.push(obj)

    loadLevel--

    return true
  }

  canUnload (obj) {
    let pn = this.name
    let __plugins = obj.__plugins || {}

    if (!__plugins[pn]) {
      if (loadLevel === 0) {
        console.error('Plugin', pn, 'not loaded')
      }
      return false
    }

    for (let k in __plugins) {
      let p = plugins[k]
      if (p && p.__plugin !== this) {
        if (_.includes(p.dependencies, pn)) {
          if (loadLevel === 0) {
            console.error(pn, 'is a dependency of plugin', k)
          }
          return false
        }
        else if (_.includes(p._requires, pn)) {
          if (loadLevel === 0) {
            console.error(pn, 'is required by plugin', k)
          }
          return false
        }
      }
    }

    return true
  }

  unload (obj) {
    console.log(_.repeat('  ', loadLevel) + 'Unloading', this.name)

    if (!this.canUnload(obj)) {
      return false
    }

    loadLevel++

    let proto = obj.__plugin_proto

    for (let k of this.prototypeNames) {
      delete proto[k]
    }

    delete obj.__plugins[this.name]

    for (let n of this._requires) {
      let p = plugins[n]
      if (p && p.canUnload(obj)) {
        p.unload(obj)
      }
    }

    for (let n of this._deps) {
      let p = plugins[n]
      if (p && p.canUnload(obj)) {
        p.unload(obj)
      }
    }

    _.remove(this.__loaded, obj)

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
      plugins[k].destroy()
    }
    plugins = {}
    resolve()
  })
}
