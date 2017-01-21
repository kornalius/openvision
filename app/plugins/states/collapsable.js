
export default class Collapsable extends Plugin {

  constructor () {
    super()
    this.name = 'collapsable'
    this.desc = 'Allow container to be collapsed or expanded.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      enabled: { value: true, options: 'enabled' },
      dir: { value: 'h', options: 'dir' },
      size: { value: 0, options: 'size' },
      active: { value: false, options: 'active' },
    }
  }

  get isCollapsed () { return this._active }

  get isExpanded () { return !this._active }

  collapse () {
    if (this.isExpanded) {
      let owner = this.owner
      switch (this._dir) {
        case 'l':
          this._active = true
          this._oldWidth = owner.width
          owner.x = owner.right - this._size
          owner.width = this._size
          return this.owner.update()
        case 'r':
          this._active = true
          this._oldWidth = owner.width
          owner.width = this._size
          return this.owner.update()
        case 't':
          this._active = true
          this._oldHeight = owner.height
          owner.height = this._size
          return this.owner.update()
        case 'b':
          this._active = true
          this._oldHeight = owner.height
          owner.y = this.bottom - this._size
          owner.height = this._size
          return this.owner.update()
      }
    }
    return this.owner
  }

  expand () {
    if (this.isCollapsed) {
      let owner = this.owner
      switch (this._dir) {
        case 'l':
          this._active = false
          this._oldWidth = owner.width
          owner.x -= this._oldWidth
          owner.width = this._oldWidth
          return this.owner.update()
        case 'r':
          this._active = false
          owner.width = this._oldWidth
          return this.owner.update()
        case 't':
          this._active = false
          owner.height = this._oldHeight
          return this.owner.update()
        case 'b':
          this._active = false
          owner.y -= this._oldHeight
          owner.height = this._oldHeight
          return this.owner.update()
      }
    }
    return this.owner
  }

  toggle () {
    return this.isCollapsed ? this.expand() : this.collapse()
  }

}
