
export default class Window extends Plugin {

  constructor () {
    super()
    this.name = 'window'
    this.desc = 'Allow a container to act as a window.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['control']
  }

  init ($, options = {}) {
    this._titlebar = new app.Rectangle($.width, 24)
    this._titlebar.color = 0xffcc66
    $.addChild(this._titlebar)
    this._titlebar.plug('titlebar', { title: options.title || 'Untitled' })
  }

  destroy ($) {
    $.removeChild(this._titlebar)
  }

}
