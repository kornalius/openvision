import { Range } from './range.js'
import { Encoder, e, d } from './encoder.js'
import { Emitter } from '../event.js'


export const PATCH_INSERT = 'i'
export const PATCH_DELETE = 'd'


export class Patch extends Range {

  constructor (parent, options = {}) {
    super(options)

    this._parent = parent
    this._action = _.get(options, 'action', PATCH_INSERT)
    this._value = _.get(options, 'value', null)
  }

  get action () { return this._action }
  set action (value) { this._action = value }

  get value () { return this._value }
  set value (value) { this._value = value }

  get invert () {
    let action
    let start = this.start
    let end = this.end
    let value = this.value

    switch (this._action) {
      case PATCH_INSERT:
        action = PATCH_DELETE
        break
      case PATCH_DELETE:
        action = PATCH_INSERT
        break
    }

    return new this.constructor({ action, start, end, value })
  }

  apply (obj) {
    return this
  }

}


export class Patches extends Emitter {

  constructor (options = {}) {
    super()

    this._list = []
  }

  get list () { return this._list }

  get length () { return this._list.length }

  add (action, start, end, value) {
    let a = action
    if (!(action instanceof Patch)) {
      a = new Patch(this, { action, start, end, value })
    }
    this._list.push(a)
    return this
  }

  remove (patch) {
    _.pull(this._list, patch)
    return this
  }

  clear () {
    this._list = []
    return this
  }

  apply (obj) {
    return this
  }

}


Encoder.register('Patches', {
  inherit: 'Ranges',

  encode: obj => {
    let doc = {}
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Patches()
    return obj
  },
})


Encoder.register('Patch', {
  inherit: 'Range',

  encode: obj => {
    let doc = {}
    e('action', obj, doc)
    e('value', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Patch()
    d('action', doc, obj)
    d('value', doc, obj)
    return obj
  },
})
