
export default class Splitter extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'splitter'
    this._desc = 'A splitter attached to a container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/16/2017'
    this._deps = ['interactive', 'mouse']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._splitter = {
        side: _.get(options, 'side', 'r'),
        size: _.get(options, 'size', 2),
        container: _.get(options, 'container'),
      }
      obj._layoutSplitterBound = obj.layoutSplitter.bind(obj)
      obj.on('mousemove', obj.onMouseMoveSplitter)
      if (obj.splitterContainer) {
        obj.splitterContainer.on('updatetransform', obj._layoutSplitterBound)
      }
      obj.layoutSplitter()
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._splitter
      obj.off('mousemove', obj.onMouseMoveSplitter)
      if (obj.splitterContainer) {
        obj.splitterContainer.off('updatetransform', obj._layoutSplitterBound)
      }
      delete obj._layoutSplitterBound
    }
  }

  get splitterContainer () { return this._splitter.container }
  set splitterContainer (value) {
    if (this._splitter.container) {
      this._splitter.container.off('updatetransform', this._layoutSplitterBound)
    }
    this._splitter.container = value
    if (value) {
      this._splitter.container.on('updatetransform', this._layoutSplitterBound)
    }
    this.layoutSplitter()
  }

  get splitterSide () { return this._splitter.side }
  set splitterSide (value) {
    this._splitter.side = value
    this.layoutSplitter()
  }

  get splitterSize () { return this._splitter.size }
  set splitterSize (value) {
    this._splitter.size = value
    this.layoutSplitter()
  }

  layoutSplitter () {
    let c = this._splitter.container
    let size = this._splitter.size
    switch (this._splitter.side) {
      case 'l':
        this.x = c.x - size
        this.y = c.y
        this.width = size
        this.height = c.height
        this.defaultCursor = 'ew-resize'
        break
      case 'r':
        this.x = c.right
        this.y = c.y
        this.width = size
        this.height = c.height
        this.defaultCursor = 'ew-resize'
        break
      case 't':
        this.x = c.x
        this.y = c.y - size
        this.width = c.width
        this.height = size
        this.defaultCursor = 'ns-resize'
        break
      case 'b':
        this.x = c.x
        this.y = c.bottom
        this.width = c.width
        this.height = size
        this.defaultCursor = 'ns-resize'
        break
    }
    return this.update()
  }

  onMouseMoveSplitter (e) {
    let info = app.mouseEvent(e)
    if (info.target === this) {
      if (this._pressed.down) {
        let x = info.sx - this._pressed.down.x
        let y = info.sy - this._pressed.down.y
        let c = this._splitter.container
        let old
        switch (this._splitter.side) {
          case 'l':
            old = c.right
            c.x = x
            c.right = old
            this.x = x
            break
          case 'r':
            c.right = x
            this.x = x
            break
          case 't':
            old = c.bottom
            c.y = y
            c.bottom = old
            this.y = y
            break
          case 'b':
            c.bottom = y
            this.y = y
            break
        }
        c.update()
        this.layoutSplitter()
      }
    }
  }

}
