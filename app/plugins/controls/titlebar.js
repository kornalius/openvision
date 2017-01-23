
export default class Titlebar extends Plugin {

  constructor () {
    super()
    this.name = 'titlebar'
    this.desc = 'Container is a window\'s title bar.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['bar', 'movable']
    this.properties = {
      title: { value: 'Untitled', options: 'title' },
    }
  }

  init ($, options = {}) {
    let w = $.eachParent(c => c.hasPlugin('window'))
    if (w) {
      $.__movable.target = w
    }
    this._titleText = new app.Text(this._title, { font: '20px "Glass TTY VT220"', fill: 0xFFFFFF })
    $.addChild(this._titleText)
    this._titleText.plug('align').__align.center()
  }

  destroy ($) {
    $.removeChild(this._titleText)
  }

}
