import { fs, dirs, path } from './utils.js'
import { MetaMixin, extractMetaFromOptions } from './meta.js'


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

  load (obj, options = {}) {
    if (!obj.__plugins) {
      obj.__plugins = []
    }
    let C = class extends mix(obj.constructor).with(this.__Mixin) {}
    C.__old_proto = Object.getPrototypeOf(obj)
    C.prototype.name = this.__MixinName
    Object.setPrototypeOf(obj, C.prototype)
    this.__loaded.push(obj)
    obj.__plugins.push(this)
  }

  unload (obj) {
    _.pull(this.__loaded, obj)
    if (_.isArray(obj.__plugins)) {
      let proto = Object.getPrototypeOf(obj)
      if (proto.__old_proto) {
        Object.setPrototypeOf(obj, proto.__old_proto)
      }
      _.pull(obj.__plugins, this)
      if (_.isEmpty(obj.__plugins)) {
        delete obj.__plugins
      }
    }
  }

}


export let PluginMixin = Mixin(superclass => class extends superclass {

  plug (name, options = {}) {
    if (_.isObject(name)) {
      options = name
      name = _.get(options, 'name')
    }
    let p = plugins[name]
    if (p && !_.includes(this.__plugins, p)) {
      p.load(this, _.extend(options, { name }))
      return this
    }
    return null
  }

  unplug (name) {
    let p = plugins[name]
    if (p && _.includes(this.__plugins, p)) {
      p.unload(this)
      return this
    }
    return null
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
                let C = _.find(m, (v, k) => k.endsWith('Class'))
                let M = _.find(m, (v, k) => k.endsWith('Mixin'))
                if (C && M) {
                  let p = new C()
                  console.log(m);
                  p.__ClassName = _.findKey(m, v => v === C)
                  p.__MixinName = _.findKey(m, v => v === M)
                  p.__Mixin = M
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
