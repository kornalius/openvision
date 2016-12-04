import { fs, dirs, path } from './utils.js'

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
    plugins[this.name] = undefined
  }

  get loaded () { return this._loaded }

  get name () { return '' }

  get tags () { return ['plugin', this.name] }

  get desc () { return '' }

  get author () { return '' }

  get version () { return '1.0.0' }

  get date () { return '' }

  load (obj, options = {}) {
    if (!obj.__plugins) {
      obj.__plugins = []
    }
    this._loaded.push(obj)
    obj.__plugins.push(this)
  }

  unload (obj) {
    _.pull(this._loaded, obj)
    if (_.isArray(obj.__plugins)) {
      _.pull(obj.__plugins, this)
      if (_.isEmpty(obj.__plugins)) {
        obj.__plugins = undefined
      }
    }
  }

}

export var loadPlugins = done => {
  fs.traverseTree(dirs.cwd,
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
    folder => {},
    () => { done() }
  )
}

export var unloadPlugins = done => {
  let keys = _.keys(plugins)
  for (let k of keys) {
    plugins[k].destroy()
  }
  plugins = {}
}
