
export default class Splitter extends Plugin {

  constructor () {
    super()
    this.name = 'splitter'
    this.desc = 'A splitter attach to a container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse']
    this.properties = {
      container: { value: null, set: this.setContainer },
      size: { value: 2, update: this.layout },
      side: { value: 'r', update: this.layout },
    }
    this.listeners = {
      $mousemove: this.onMousemove,
    }
  }

  attach ($, options = {}) {
    this._layout = this.layout.bind(this)
    if (this._container) {
      this._container.on('updatetransform', this._layout)
    }
    this.layout()
  }

  detach ($) {
    if (this._container) {
      this._container.off('updatetransform', this._layout)
    }
  }

  setContainer (value) {
    if (this._container) {
      this._container.off('updatetransform', this._layout)
    }
    this._container = value
    if (value) {
      this._container.on('updatetransform', this._layout)
    }
    this.layout()
  }

  layout () {
    let $ = this.$
    let c = this._container
    let size = this._size
    switch (this._side) {
      case 'l':
        $.x = c.x - size
        $.y = c.y
        $.width = size
        $.height = c.height
        $.defaultCursor = 'ew-resize'
        break
      case 'r':
        $.x = c.right
        $.y = c.y
        $.width = size
        $.height = c.height
        $.defaultCursor = 'ew-resize'
        break
      case 't':
        $.x = c.x
        $.y = c.y - size
        $.width = c.width
        $.height = size
        $.defaultCursor = 'ns-resize'
        break
      case 'b':
        $.x = c.x
        $.y = c.bottom
        $.width = c.width
        $.height = size
        $.defaultCursor = 'ns-resize'
        break
    }
    return $.update()
  }

  onMousemove (e) {
    let $ = this.$
    let info = app.mouseEvent(e)
    if (info.target === $) {
      if ($.pressed) {
        let x = info.sx - $.pressed.x
        let y = info.sy - $.pressed.y
        let c = this._container
        let old
        switch (this._side) {
          case 'l':
            old = c.right
            c.x = x
            c.right = old
            $.x = x
            break
          case 'r':
            c.right = x
            $.x = x
            break
          case 't':
            old = c.bottom
            c.y = y
            c.bottom = old
            $.y = y
            break
          case 'b':
            c.bottom = y
            $.y = y
            break
        }
        c.update()
        this.layout()
      }
    }
  }

}
