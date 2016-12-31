import { Range, RectRange } from './range.js'


export const INSERT = 'i'
export const DELETE = 'd'


export class Patch extends Range {

  constructor (parent, options = {}) {
    super(options)

    this._parent = parent
    this._action = _.get(options, 'action', INSERT)
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
      case INSERT:
        action = DELETE
        break
      case DELETE:
        action = INSERT
        break
    }

    return new this.constructor({ action, start, end, value })
  }

  apply (obj) {
    return this
  }

}


export class RectPatch extends RectRange {

  constructor (parent, options = {}) {
    super(options)

    this._parent = parent
    this._action = _.get(options, 'action', INSERT)
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
      case INSERT:
        action = DELETE
        break
      case DELETE:
        action = INSERT
        break
    }

    return new this.constructor({ action, start, end, value })
  }

  apply (obj) {
    return this
  }

}


export class Patches extends PIXI.utils.EventEmitter {

  constructor (options = {}) {
    super()

    this._list = []
  }

  get list () { return this._list }

  get length () { return this._list.length }

  add (action, start, end, value) {
    let a = action
    if (!(action instanceof Patch) && !(action instanceof RectPatch)) {
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
