
export default class Grid extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'grid'
    this._desc = 'Align a container to a grid.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/12/2017'
  }

  load (obj, options) {
    if (super.load(obj, options)) {
      obj._gridWidth = _.get(options, 'gridWidth', 8)
      obj._gridHeight = _.get(options, 'gridHeight', 8)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._gridWidth
      delete obj._gridHeight
    }
  }

  get gridWidth () { return this._gridWidth }
  set gridWidth (value) { this._gridWidth = value }

  get gridHeight () { return this._gridHeight }
  set gridHeight (value) { this._gridHeight = value }

  alignToGrid () {
    this.x = Math.trunc(this.x / this._gridWidth)
    this.y = Math.trunc(this.y / this._gridHeight)
    return this.update()
  }

}
