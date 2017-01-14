
export default class Collapsable extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'collapsable'
    this._desc = 'Allow container to be collapsed or expanded.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/13/2017'
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._collapsed = {
        enabled: _.get(options, 'enabled', true),
        dir: _.get(options, 'dir', 'r'),
        size: _.get(options, 'size', 0),
        active: _.get(options, 'active', false),
      }
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._collapsed
    }
  }

  get isCollapsed () { return this._collapsed.active }
  get isExpanded () { return !this._collapsed.active }

  collapse () {
    if (this.isExpanded) {
      switch (this._collapsed.dir) {
        case 'l':
          this._collapsed.active = true
          this._collapsed._oldWidth = this.width
          this.x = this.right - this._collapsed.size
          this.width = this._collapsed.size
          return this.update()
        case 'r':
          this._collapsed.active = true
          this._collapsed._oldWidth = this.width
          this.width = this._collapsed.size
          return this.update()
        case 't':
          this._collapsed.active = true
          this._collapsed._oldHeight = this.height
          this.height = this._collapsed.size
          return this.update()
        case 'b':
          this._collapsed.active = true
          this._collapsed._oldHeight = this.height
          this.y = this.bottom - this._collapsed.size
          this.height = this._collapsed.size
          return this.update()
      }
    }
    return this
  }

  expand () {
    if (this.isCollapsed) {
      switch (this._collapsed.dir) {
        case 'l':
          this._collapsed.active = false
          this._collapsed._oldWidth = this.width
          this.x -= this._collapsed._oldWidth
          this.width = this._collapsed._oldWidth
          return this.update()
        case 'r':
          this._collapsed.active = false
          this.width = this._collapsed._oldWidth
          return this.update()
        case 't':
          this._collapsed.active = false
          this.height = this._collapsed._oldHeight
          return this.update()
        case 'b':
          this._collapsed.active = false
          this.y -= this._collapsed._oldHeight
          this.height = this._collapsed._oldHeight
          return this.update()
      }
    }
    return this
  }

  collapseToggle () {
    return this.isCollapsed ? this.expand() : this.collapse()
  }

}
