import { fs, dirs, path } from './utils.js'
import { mixin, unmixin } from './globals.js'
import { Meta, metaExceptions } from './meta.js'
import async from 'async'


export var plugins = {}

export class PluginMixin {

  plug (name, options = {}) {
    let p = plugins[name]
    if (p) {
      p.load(this, options)
    }
  }

  unplug (name) {
    let p = plugins[name]
    if (p) {
      p.unload(this)
    }
  }

}


export class Plugin extends PIXI.utils.EventEmitter {

  constructor () {
    super()
    this._loaded = []
  }

  destroy () {
    for (let o of this._loaded) {
      this.unload(o)
    }
    plugins[this.name] = undefined
  }

  get exceptions () { return _.concat(metaExceptions, ['destroy', 'loaded', 'load', 'unload']) }

  get loaded () { return this._loaded }

  get tags () { return _.concat([super.tags, 'plugin']) }

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


export var loadPlugins = done => {
  async.each(_.concat(dirs.cwd, dirs.app, dirs.user), (d, next) => {
    console.log('Scanning plugins', path.join(d, '/plugins') + '...')
    fs.traverseTree(path.join(d, '/plugins'),
      file => {
        if (path.extname(file) === '.js') {
          let p
          try {
            let P = require(file)
            p = new P()
          }
          catch (e) {
          }
          if (p instanceof Plugin) {
            plugins[p.name] = p
          }
        }
        return false
      },
      folder => { return true },
      () => { next() }
    )
  },
  () => done())
}


export var unloadPlugins = done => {
  let keys = _.keys(plugins)
  for (let k of keys) {
    plugins[k].destroy()
  }
  plugins = {}
}
