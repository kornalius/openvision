
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
      let $ = this.$
      switch (this._dir) {
        case 'l':
          this._active = true
          this._oldWidth = $.width
          $.x = $.right - this._size
          $.width = this._size
          this.$.update()
          break
        case 'r':
          this._active = true
          this._oldWidth = $.width
          $.width = this._size
          this.$.update()
          break
        case 't':
          this._active = true
          this._oldHeight = $.height
          $.height = this._size
          this.$.update()
          break
        case 'b':
          this._active = true
          this._oldHeight = $.height
          $.y = this.bottom - this._size
          $.height = this._size
          this.$.update()
          break
      }
    }
    return this
  }

  expand () {
    if (this.isCollapsed) {
      let $ = this.$
      switch (this._dir) {
        case 'l':
          this._active = false
          this._oldWidth = $.width
          $.x -= this._oldWidth
          $.width = this._oldWidth
          this.$.update()
          break
        case 'r':
          this._active = false
          $.width = this._oldWidth
          this.$.update()
          break
        case 't':
          this._active = false
          $.height = this._oldHeight
          this.$.update()
          break
        case 'b':
          this._active = false
          $.y -= this._oldHeight
          $.height = this._oldHeight
          this.$.update()
          break
      }
    }
    return this
  }

  toggle () {
    return this.isCollapsed ? this.expand() : this.collapse()
  }

}
