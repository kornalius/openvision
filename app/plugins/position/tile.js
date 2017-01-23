
export default class Tile extends Plugin {

  constructor () {
    super()
    this.name = 'tile'
    this.desc = 'Allow layouting a container to specific areas of parent container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      layout: { value: 'h', options: 'layout' },
      zones: { value: 3, options: 'zones' },
    }
    this.listeners = {
      $childrenchange: this.exec,
    }
  }

  get isHorizontal () { return this._layout === 'h' }

  get isVertical () { return this._layout === 'v' }

  top () {
    let $ = this.$
    let parent = $.parent
    if (parent) {
      $.width = parent.width
      $.height = parent.height / this._zones
      $.x = 0
      $.y = 0
    }
    return $.update()
  }

  bottom () {
    let $ = this.$
    let parent = $.parent
    if (parent) {
      $.width = parent.width
      $.height = parent.height / this._zones
      $.x = 0
      $.y = parent.height - $.height
    }
    return $.update()
  }

  left () {
    let $ = this.$
    let parent = $.parent
    if (parent) {
      $.width = parent.width / this._zones
      $.height = parent.height
      $.x = 0
      $.y = 0
    }
    return $.update()
  }

  right () {
    let $ = this.$
    let parent = $.parent
    if (parent) {
      $.width = parent.width / this._zones
      $.height = parent.height
      $.x = parent.width - $.width
      $.y = 0
    }
    return $.update()
  }

  topLeft () {
    let $ = this.$
    let parent = $.parent
    if (parent) {
      $.width = parent.width / this._zones
      $.height = parent.height / this._zones
      $.x = 0
      $.y = 0
    }
    return $.update()
  }

  topRight () {
    let $ = this.$
    let parent = $.parent
    if (parent) {
      $.width = parent.width / this._zones
      $.height = parent.height / this._zones
      $.x = parent.width - $.width
      $.y = 0
    }
    return $.update()
  }

  bottomLeft () {
    let $ = this.$
    let parent = $.parent
    if (parent) {
      $.width = parent.width / this._zones
      $.height = parent.height / this._zones
      $.x = 0
      $.y = parent.height - $.height
    }
    return $.update()
  }

  bottomRight () {
    let $ = this.$
    let parent = $.parent
    if (parent) {
      $.width = parent.width / this._zones
      $.height = parent.height / this._zones
      $.x = parent.width - $.width
      $.y = parent.height - $.height
    }
    return $.update()
  }

  center () {
    let $ = this.$
    let parent = $.parent
    if (parent) {
      $.width = parent.width / this._zones
      $.height = parent.height / this._zones
      $.x = parent.width / 2 - $.width / 2
      $.y = parent.height / 2 - $.height / 2
    }
    return $.update()
  }

  exec () {
    let $ = this.$
    let parent = $.parent
    if (parent) {
      if (this.isHorizontal) {
        let x = 0
        let w = parent.width / $.children.count
        let h = parent.height
        for (let c of $.children) {
          c.x = x += w
          c.y = 0
          c.width = w
          c.height = h
          c.update()
        }
      }
      else if (this.isVertical) {
        let y = 0
        let w = parent.width
        let h = parent.height / $.children.count
        for (let c of $.children) {
          c.x = 0
          c.y = y += h
          c.width = w
          c.height = h
          c.update()
        }
      }
    }
    return $.update()
  }

}
