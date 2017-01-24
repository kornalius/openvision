
export default class Window extends Plugin {

  constructor () {
    super()
    this.name = 'window'
    this.desc = 'Allow a container to act as a window.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['control']

    app.Window = (options = {}) => {
      let w = new app.Rectangle(_.get(options, 'width', 200), _.get(options, 'height', 150))
      w.color = _.get(options, 'color', 0xb3b3b3)
      w.alpha = _.get(options, 'alpha', 1)
      w.borderColor = _.get(options, 'borderColor', 0xFFFFFF)
      w.borderAlpha = _.get(options, 'borderAlpha', 1)
      w.borderSize = _.get(options, 'borderSize', 0.5)
      w.plug('window', { title: _.get(options, 'title', '') })
      return w
    }
  }

  init ($, options = {}) {
    this._titlebar = new app.Rectangle($.width, 24)
    this._titlebar.color = 0xffcc66
    this._titlebar.alpha = 1 + (1.0 - $.alpha)
    $.addChild(this._titlebar)
    this._titlebar.plug('titlebar', { title: options.title || 'Untitled', font: { color: 0x333333 } })
  }

  destroy ($) {
    $.removeChild(this._titlebar)
  }

}
