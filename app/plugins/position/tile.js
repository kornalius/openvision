
export default class Tile extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'align'
    this._desc = 'Allow layouting a container to specific areas of parent container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/13/2017'
  }

  load (obj, options) {
    if (super.load(obj, options)) {
      obj._tileLayout = _.get(options, 'layout', 'h')
      obj._zones = _.get(options, 'zones', 3)
      this.on('childrenchange', this.retile)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._tileLayout
      delete obj._zones
      this.off('childrenchange', this.retile)
    }
  }

  isHorizontalTile () { return this._tileLayout === 'h' }
  isVerticalTile () { return this._tileLayout === 'v' }

  tileTop () {
    if (this.parent) {
      this.width = this.parent.width
      this.height = this.parent.height / this._zones
      this.x = 0
      this.y = 0
      this.update()
    }
    return this
  }

  tileBottom () {
    if (this.parent) {
      this.width = this.parent.width
      this.height = this.parent.height / this._zones
      this.x = 0
      this.y = this.parent.height - this.height
      this.update()
    }
    return this
  }

  tileLeft () {
    if (this.parent) {
      this.width = this.parent.width / this._zones
      this.height = this.parent.height
      this.x = 0
      this.y = 0
      this.update()
    }
    return this
  }

  tileRight () {
    if (this.parent) {
      this.width = this.parent.width / this._zones
      this.height = this.parent.height
      this.x = this.parent.width - this.width
      this.y = 0
      this.update()
    }
    return this
  }

  tileTopLeft () {
    if (this.parent) {
      this.width = this.parent.width / this._zones
      this.height = this.parent.height / this._zones
      this.x = 0
      this.y = 0
      this.update()
    }
    return this
  }

  tileTopRight () {
    if (this.parent) {
      this.width = this.parent.width / this._zones
      this.height = this.parent.height / this._zones
      this.x = this.parent.width - this.width
      this.y = 0
      this.update()
    }
    return this
  }

  tileBottomLeft () {
    if (this.parent) {
      this.width = this.parent.width / this._zones
      this.height = this.parent.height / this._zones
      this.x = 0
      this.y = this.parent.height - this.height
      this.update()
    }
    return this
  }

  tileBottomRight () {
    if (this.parent) {
      this.width = this.parent.width / this._zones
      this.height = this.parent.height / this._zones
      this.x = this.parent.width - this.width
      this.y = this.parent.height - this.height
      this.update()
    }
    return this
  }

  tileCenter () {
    if (this.parent) {
      this.width = this.parent.width / this._zones
      this.height = this.parent.height / this._zones
      this.x = this.parent.width / 2 - this.width / 2
      this.y = this.parent.height / 2 - this.height / 2
      this.update()
    }
    return this
  }

  retile () {
    let parent = this.parent
    if (parent) {
      if (this.isHorizontalTile) {
        let x = 0
        let w = parent.width / this.children.count
        let h = parent.height
        for (let c of this.children) {
          c.x = x
          c.y = 0
          c.width = w
          c.height = h
          c.update()
          x += w
        }
      }
      else if (this.isVerticalTile) {
        let y = 0
        let w = parent.width
        let h = parent.height / this.children.count
        for (let c of this.children) {
          c.x = 0
          c.y = y
          c.width = w
          c.height = h
          c.update()
          y += h
        }
      }
      this.update()
    }
    return this
  }

}
