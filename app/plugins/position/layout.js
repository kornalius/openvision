
export default class Layout extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'align'
    this._desc = 'Allow automating layouting children of a container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/13/2017'
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

  relayout () {
    let x = 0
    let y = 0

    for (var c of this.children) {
      if (c.isLayoutEnabled) {
        c.x = x
        c.y = y

        let size = _.get(c, '_layout.size', 0)

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
      }
    }
  }

}
