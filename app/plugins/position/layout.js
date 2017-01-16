
export default class Layout extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'layout'
    this._desc = 'Allow automating layouting children of a container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/16/2017'
  }

  load (obj, options) {
    if (super.load(obj, options)) {
      obj._layout = {
        enabled: _.get(options, 'enabled', true),
        dir: _.get(options, 'dir', 'h'),
        size: _.get(options, 'size', 0),
        wrap: _.get(options, 'wrap', false),
        align: _.get(options, 'align', 0),
      }
      obj.relayout()
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._layout
    }
  }

  get isLayoutEnabled () { return this._layout.enabled }
  get isHorizontalLayout () { return this._layout.dir === 'h' }
  get isVerticalLayout () { return this._layout.dir === 'v' }

  get layoutDir () { return this._layout.dir }
  set layoutDir (value) {
    this._layout.dir = value
    this.relayout()
  }

  get layoutSize () { return this._layout.size }
  set layoutSize (value) {
    this._layout.size = value
    this.relayout()
  }

  get layoutWrap () { return this._layout.wrap }
  set layoutWrap (value) {
    this._layout.wrap = value
    this.relayout()
  }

  get layoutAlign () { return this._layout.align }
  set layoutAlign (value) {
    this._layout.align = value
    this.relayout()
  }

  layout (dir = 'h', size = 0, align = 0, wrap = false) {
    this._layout.dir = dir
    this._layout.size = size
    this._layout.align = align
    this._layout.wrap = wrap
    return this.relayout()
  }

  relayout () {
    let x = 0
    let y = 0

    for (var c of this.children) {
      if (c.isLayoutEnabled) {
        c.x = x
        c.y = y

        let size = c.layoutSize

        if (this.isHorizontalLayout) {
          if (size > 0) {
          }
          x += c.width
        }
        else if (this.isVerticalLayout) {
          if (size > 0) {
          }
          y += c.height
        }

        c.update()
      }
    }
    return this.update()
  }

}
