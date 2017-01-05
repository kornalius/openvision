import { Base } from '../objects/base.js'
import { DB, sysDB, usrDB } from '../objects/db.js'
import { Encoder, e, d } from './encoder.js'


export class Settings extends Base {

  constructor (options = {}) {
    super(options)

    this._name = _.get(options, 'name', _.uniqueId('settings'))
    this._inherit = _.get(options, 'inherit')
    this._data = {}
  }

  get name () { return this._name }
  set name (value) { this._name = value }

  get data () { return this._data }
  set data (value) { this._data = value }

  get inherit () { return this._inherit }
  set inherit (value) { this._inherit = value }

  has (path) { return !_.isUndefined(this.get(path)) }

  hasOwn (path) { return !_.isUndefined(_.get(this._data, path)) }

  get (path, _default) {
    let v = _.get(this._data, path, _default)
    if (_.isUndefined(v) && this._inherit) {
      v = this._inherit.get(path, _default)
    }
    return v
  }

  set (path, value) {
    _.set(this._data, path, value)
    return this.save()
  }

  load () {
    return super.load(this._name)
  }

  save () {
    return super.save(this._name)
  }

}


Encoder.register('Settings', {

  encode: obj => {
    let doc = {}
    e('name', obj, doc)
    e('data', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Settings()
    d('name', doc, obj)
    d('data', doc, obj)
    return obj
  },
})


export var sysSettings = null
export var usrSettings = null

DB.get(sysDB, 'settings')
  .then(doc => {
    sysSettings = Encoder.decode(doc)
  })
  .catch(err => {
    sysSettings = new Settings({ name: 'settings' })
  })

// DB.get(usrDB, 'settings')
  // .then(doc => {
    // usrSettings = Encoder.decode(doc)
    // usrSettings._inherit = sysSettings
  // })
  // .catch(err => {
    // usrSettings = new Settings({ name: 'settings' })
  // })
