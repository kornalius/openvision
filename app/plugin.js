import { fs, dirs, path } from './utils.js'
import { MetaMixin, extractMetaFromOptions } from './meta.js'


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


export class Plugin extends mix(PIXI.utils.EventEmitter).with(MetaMixin) {

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

  get propertyNames () {
    let pluginProps = Object.getOwnPropertyNames(Object.getPrototypeOf(new Plugin()))
    return _.filter(Object.getOwnPropertyNames(Object.getPrototypeOf(this)), k => !_.includes(pluginProps, k))
  }

  load (obj, options = {}) {
    if (this.containers.length && !_.includes(this.containers, obj.constructor.name)) {
      console.error('Container', obj, 'must be', this.containers)
      return
    }

    for (let i = this.deps.length - 1; i >= 0; i--) {
      let d = this.deps[i]
      let _name = ''
      let _options = {}
      if (_.isString(d)) {
        _name = d
      }
      else if (_.isObject(d)) {
        _name = d.name
        _options = d.options
      }
      let p = plugins[_name]
      if (p && !obj['__' + _name]) {
        p.load(obj, _options)
      }
    }

    for (let k of this.propertyNames) {
      let d = Object.getOwnPropertyDescriptor(obj, k)
      if (!d && _.get(this.interface, k + '.declared', false)) {
        console.error('Missing interface declaration ' + k)
        return
      }
    }

    let pn = '__' + this.name
    if (!_.has(obj, pn)) {
      obj[pn] = {}
    }

    for (let k of this.propertyNames) {
      if (!_.get(this.interface, k + '.declared', false) && !_.get(this.interface, k + '.exclude', false)) {
        let d = Object.getOwnPropertyDescriptor(obj, k)
        if (d) {
          Object.defineProperty(obj[pn], k, d)
        }
        d = Object.getOwnPropertyDescriptor(this.constructor.prototype, k)
        Object.defineProperty(obj, k, d)
      }
    }

    this.__loaded.push(obj)
  }

  unload (obj) {
    _.pull(this.__loaded, obj)
    let pn = '__' + this.name
    if (_.has(obj, pn)) {
      for (let k of this.propertyNames) {
        delete obj[k]
        if (obj[pn][k]) {
          let d = Object.getOwnPropertyDescriptor(obj[pn], k)
          Object.defineProperty(obj, k, d)
        }
      }
      delete obj[pn]
    }
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
    if (p && !this['__' + name]) {
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
    if (p && this['__' + name]) {
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
