import { fs, dirs, path } from './utils.js'
import { Plugin, PluginMixin, plugins } from './plugin.js'

export var modes = {}

export class ModeMixin extends PluginMixin {

  use (name, options = {}) {
    let m = modes[name]
    if (m) {
      m.load(this, options)
    }
  }

  unuse (name) {
    let m = modes[name]
    if (m) {
      m.unload(this)
    }
  }

}

export class Mode extends Plugin {

  constructor () {
    super(...arguments)
    this._plugins = []
  }

  destroy () {
    modes[this.name] = undefined
  }

  get tags () { return ['mode', this.name] }

  get plugins () { return this._plugins }

  plug (name, options) {
    this._plugins.push({ name, options })
  }

  unplug (name) {
    _.pullAllBy(this._plugins, [name], 'name')
  }

  load (obj, options = {}, pluginsOptions = {}) {
    if (!obj.__modes) {
      obj.__modes = []
    }
    this._loaded.push(obj)
    obj.__modes.push(this)
    for (let i = 0; i < this._plugins.length; i++) {
      let pp = this._plugins[i]
      let p = plugins[pp.name]
      if (p) {
        p.load(obj, _.extend({}, pluginsOptions[pp.name] || {}, pp.options))
      }
    }
  }

  unload (obj) {
    _.pull(this._loaded, obj)
    if (_.isArray(obj.__modes)) {
      for (let i = this._plugins.length - 1; i >= 0; i--) {
        let pp = this._plugins[i]
        let p = plugins[pp.name]
        if (p) {
          p.unload(obj)
        }
      }
      _.pull(obj.__modes, this)
      if (_.isEmpty(obj.__modes)) {
        obj.__modes = undefined
      }
    }
  }

}

export var loadModes = done => {
  fs.traverseTree(dirs.cwd,
    file => {
      if (path.extname(file) === '.js') {
        let m
        try {
          let M = require(file)
          m = new M()
        }
        catch (e) {
        }
        if (m instanceof Mode) {
          modes[m.name] = m
        }
        return m instanceof Mode
      }
      return false
    },
    folder => {},
    () => { done() }
  )
}

export var unloadModes = done => {
  let keys = _.keys(modes)
  for (let k of keys) {
    modes[k].destroy()
  }
  modes = {}
}
