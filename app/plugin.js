import { fs, dirs, path } from './utils.js'
import { mixin, unmixin } from './globals.js'
import { Meta, metaProperties, extractMetaFromOptions } from './meta.js'


export var plugins = {}


export class Plugin extends PIXI.utils.EventEmitter {

  constructor (options = {}) {
    super()
    extractMetaFromOptions(this, options)
    this._loaded = []
  }

  destroy () {
    for (let o of this._loaded) {
      this.unload(o)
    }
    plugins[this.name] = undefined
  }

  get exceptions () { return _.concat(metaProperties, ['destroy', 'loaded', 'load', 'unload', 'exceptions']) }

  get loaded () { return this._loaded }

  get tags () { return _.concat(this._tags, 'plugin') }

  load (obj, options = {}) {
    if (!obj.__plugins) {
      obj.__plugins = []
    }
    mixin(obj.constructor.prototype, this.exceptions, this.constructor.prototype)
    this._loaded.push(obj)
    obj.__plugins.push(this)
  }

  unload (obj) {
    _.pull(this._loaded, obj)
    if (_.isArray(obj.__plugins)) {
      unmixin(obj.constructor.prototype, this.exceptions, this.constructor.prototype)
      _.pull(obj.__plugins, this)
      if (_.isEmpty(obj.__plugins)) {
        obj.__plugins = undefined
      }
    }
  }

}

mixin(Plugin.prototype, Meta.prototype)


export class PluginMixin {

  plug (name, options = {}) {
    if (_.isObject(name)) {
      options = name
      name = _.get(options, 'name')
    }
    let p = plugins[name]
    if (p) {
      p.load(this, _.extend(options, { name }))
    }
  }

  unplug (name) {
    let p = plugins[name]
    if (p) {
      p.unload(this)
    }
  }

}


export var loadPlugins = () => {
  let walker = d => {
    return new Promise((resolve, reject) => {
      console.log('Scanning plugins', path.join(d, '/plugins') + '...')
      fs.walk(path.join(d, '/plugins'), { fs }).then(files => {
        for (let file of files) {
          if (!file.stats.isDirectory() && path.extname(file.path) === '.js') {
            console.log('    loading', path.basename(file.path) + '...')
            System.import(file.path).then(m => {
              console.log(new m.default())
              resolve()
            })
          }
        }
      })
      .catch(resolve)
    })
  }

  let promises = []
  for (let d of _.concat(dirs.cwd, dirs.app, dirs.user)) {
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
