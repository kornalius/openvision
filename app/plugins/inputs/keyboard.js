
export default class extends Plugin {

  constructor () {
    super()
    this.name = 'keyboard'
    this.desc = 'Allow container to accept keyboard events.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['focusable']
  }

  init ($, options = {}) {
    $.tabIndex = 1

    this._onKeydown = this.onKeydown.bind(this)
    window.addEventListener('keydown', this._onKeydown, false)

    this._onKeyup = this.onKeyup.bind(this)
    window.addEventListener('keyup', this._onKeyup, false)
  }

  unload ($) {
    window.removeEventListener('keydown', this._onKeydown, false)
    window.removeEventListener('keyup', this._onKeyup, false)
  }

  onKeydown (e) {
    if (this.$.__focusable.focused) {
      // console.log('down', e)
    }
  }

  onKeyup (e) {
    if (this.$.__focusable.focused) {
      // console.log('up', e)
    }
  }

}
