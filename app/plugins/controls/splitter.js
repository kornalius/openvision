
export default class Splitter extends Plugin {

  constructor () {
    super()
    this.name = 'splitter'
    this.desc = 'A splitter attached to a container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse']
    this.properties = {
      container: { value: null, options: 'container', set: this.setContainer },
      size: { value: 2, options: 'size', update: this.layout },
      side: { value: 'r', options: 'side', update: this.layout },
    }
    this.listeners = {
      $mousemove: this.onMousemove,
    }
  }

  init (owner, options = {}) {
    this._layout = this.layout.bind(this)
    if (this._container) {
      this._container.on('updatetransform', this._layout)
    }
    this.layout()
  }

  destroy (owner) {
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
    let owner = this.owner
    let c = this._container
    let size = this._size
    switch (this._side) {
      case 'l':
        owner.x = c.x - size
        owner.y = c.y
        owner.width = size
        owner.height = c.height
        owner.defaultCursor = 'ew-resize'
        break
      case 'r':
        owner.x = c.right
        owner.y = c.y
        owner.width = size
        owner.height = c.height
        owner.defaultCursor = 'ew-resize'
        break
      case 't':
        owner.x = c.x
        owner.y = c.y - size
        owner.width = c.width
        owner.height = size
        owner.defaultCursor = 'ns-resize'
        break
      case 'b':
        owner.x = c.x
        owner.y = c.bottom
        owner.width = c.width
        owner.height = size
        owner.defaultCursor = 'ns-resize'
        break
    }
    return owner.update()
  }

  onMousemove (e) {
    let owner = this.owner
    let info = app.mouseEvent(e)
    if (info.target === owner) {
      if (owner._pressed.down) {
        let x = info.sx - owner._pressed.down.x
        let y = info.sy - owner._pressed.down.y
        let c = this._container
        let old
        switch (this._side) {
          case 'l':
            old = c.right
            c.x = x
            c.right = old
            owner.x = x
            break
          case 'r':
            c.right = x
            owner.x = x
            break
          case 't':
            old = c.bottom
            c.y = y
            c.bottom = old
            owner.y = y
            break
          case 'b':
            c.bottom = y
            owner.y = y
            break
        }
        c.update()
        this.layout()
      }
    }
  }

}
