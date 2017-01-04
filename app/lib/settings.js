import { Base } from '../objects/base.js'
import { Encoder, e, d } from './encoder.js'


export class Settings extends Base {

  constructor (options = {}) {
    super(options)

    this._name = _.get(options, 'name', _.uniqueId('settings'))
    this._inherit = _.get(options, 'inherit')
    this._data = {}
  }

  get inherit () { return this._inherit }

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
    return this
  }

  load () {
    return super.load(this._name)
  }

  save () {
    return super.save(this._name)
  }

}

export var systemSettings = new Settings({ name: '_system' })


Encoder.register('Settings', {

  encode: obj => {
    let doc = {}
    e('_name', obj, doc)
    e('_inherit', obj, doc)
    e('_data', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Settings()
    d('_name', doc, obj)
    d('_inherit', doc, obj)
    d('_data', doc, obj)
    return obj
  },
})
