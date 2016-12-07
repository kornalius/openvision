import { fs, dirs, path } from './utils.js'
import { Plugin, plugins } from './plugin.js'
import { Mixin } from 'mixwith'


export var modes = {}


export class Mode extends Plugin {

  constructor (options = {}) {
    super(options)
    this._plugins = []
  }

  destroy () {
    for (let o of this._loaded) {
      this.unload(o)
    }
    modes[this.name] = undefined
  }

  get tags () {
    let tags = _.pull(_.clone(super.tags), 'plugin')
    tags.push('mode')
    for (let plug of this._plugins) {
      let p = plugins[plug.name]
      if (p) {
        tags = _.concat(tags, p.tags)
      }
    }
    return tags
  }

  get plugins () { return this._plugins }

  plug (name, options = {}) {
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


export let ModeMixin = Mixin(superclass => class extends superclass {

  use (name, options = {}) {
    if (_.isObject(name)) {
      options = name
      name = _.get(options, 'name')
    }
    let m = modes[name]
    if (m) {
      m.load(this, _.extend(options, { name }))
    }
  }

  unuse (name) {
    let m = modes[name]
    if (m) {
      m.unload(this)
    }
  }

})


export var loadModes = () => {
  let walker = d => {
    return new Promise((resolve, reject) => {
      console.log('Scanning modes', path.join(d, '/modes') + '...')

      fs.walk(path.join(d, '/modes'), { fs })
        .then(files => {
          for (let file of files) {
            if (!file.stats.isDirectory() && path.extname(file.path) === '.js') {
              console.log('    loading', path.basename(file.path) + '...')

              System.import(file.path).then(m => {
                let p = new m.default()
                modes[p.name] = p
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


export var unloadModes = () => {
  return new Promise((resolve, reject) => {
    let keys = _.keys(modes)
    for (let k of keys) {
      modes[k].destroy()
    }
    modes = {}
    resolve()
  })
}
