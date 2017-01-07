export let focused = null


export default class Focusable extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'focusable'
    this._desc = 'Allow container to be focused with mouse and tab key.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.2'
    this._date = '01/07/2017'
    this._deps = ['interactive', 'mouse', 'keyboard']
  }

  load (obj, options) {
    if (super.load(obj, options)) {
      obj._tabIndex = _.get(options, 'tabIndex', -1)
      obj._focusable = _.get(options, 'focusable', true)
      obj.on('mousedown', obj.focus)
      obj._onKeydownFocusable = obj.onKeydownFocusable.bind(obj)
      window.addEventListener('keydown', obj._onKeydownFocusable, false)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      window.removeEventListener('keydown', obj._onKeydownFocusable, false)
      delete obj._tabIndex
      delete obj._focusable
      delete obj._onKeydownFocusable
      obj.off('mousedown', obj.focus)
    }
  }

  get focused () { return focused === this }

  get focusable () { return this._focusable }
  set focusable (value) { this._focusable = value }

  get tabIndex () { return this._tabIndex }
  set tabIndex (value) {
    if (this._tabIndex !== value) {
      this._tabIndex = value
      if (this.focused && value === -1) {
        this.focusPrev()
      }
    }
  }

  get focusableChildren () {
    let l = []
    for (let c of this.children) {
      if (c.focusable) {
        l.push(c)
      }
    }
    return _.sortBy(l, 'tabIndex')
  }

  blur () {
    focused = null
    this.emit('blur')
    return this
  }

  focus () {
    if (this.focusable) {
      if (focused) {
        focused.blur()
      }
      focused = this // eslint-disable-line consistent-this
      this.emit('focus')
    }
    return this
  }

  focusPrev () {
    let l = this._tabIndex
    for (let c of this.focusableChildren) {
      if (c.tabIndex <= l && c !== this) {
        c.focus()
        return c.focused
      }
      return false
    }
    return this
  }

  focusNext () {
    let l = this._tabIndex
    for (let c of this.focusableChildren) {
      if (c.tabIndex >= l && c !== this) {
        c.focus()
        return c.focused
      }
      return false
    }
    return this
  }

  onKeydownFocusable (e) {
    if (this.focused) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          this.focusPrev()
        }
        else {
          this.focusNext()
        }
      }
    }
  }

}
