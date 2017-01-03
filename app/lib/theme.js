import { Base } from '../objects/base.js'


export class Theme extends Base {

  constructor (options = {}) {
    super(options)
  }

}

export class Themes extends Base {

  constructor (options = {}) {
    super()

    this._list = []
  }

  get list () { return this._list }

  get length () { return this._list.length }

  clear () {
    this._list = []
    return this
  }

}
