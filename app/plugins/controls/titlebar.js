
export default class Titlebar extends Plugin {

  constructor () {
    super()
    this.name = 'titlebar'
    this.desc = 'Container is a window\'s title bar.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['bar', 'movable', 'font']
    this.properties = {
      title: { value: 'Untitled', options: 'title' },
    }
  }

  init ($, options = {}) {
    let w = $.eachParent(c => c.hasPlugin('window'))
    if (w) {
      $.__movable.target = w
    }
    this._titleText = new app.Text(this._title, $.__font.fontObject)
    $.addChild(this._titleText)
    this._titleText.plug('align').__align.center()
    this._titleText.plug('textedit')
  }

  destroy ($) {
    $.removeChild(this._titleText)
  }

}
