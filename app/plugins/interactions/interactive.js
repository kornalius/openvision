
export default class Interactive extends Plugin {

  constructor () {
    super()
    this.name = 'interactive'
    this.desc = 'Allow container to be interacted with the mouse or touch.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.nolink = true
  }

  init ($, options = {}) {
    $.interactive = true
    $.buttonMode = true
    this._oldDefaultCursor = $.defaultCursor
    $.defaultCursor = 'default'
  }

  destroy ($) {
    $.interactive = false
    $.buttonMode = false
    $.defaultCursor = this._oldDefaultCursor
  }

}
