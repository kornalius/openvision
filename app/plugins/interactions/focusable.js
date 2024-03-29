export let focused = null


export default class Focusable extends Plugin {

  constructor () {
    super()
    this.name = 'focusable'
    this.desc = 'Allow container to be focused with mouse and tab key.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse', 'keyboard']
    this.properties = {
      enabled: { value: true, set: this.setEnabled },
      index: { value: 1, update: true },
    }
    this.listeners = {
      $mousedown: this.focus,
    }
  }

  attach ($, options) {
    this._onKeydown = this.onKeydown.bind(this)
    window.addEventListener('keydown', this._onKeydown, false)
  }

  detach ($) {
    window.removeEventListener('keydown', this._onKeydown, false)
  }

  get focused () { return focused === this.$ }

  setEnabled (value) {
    if (this._enabled !== value) {
      this._enabled = value
      if (focused && value === false) {
        this.focusPrev()
      }
    }
  }

  get focusableChildren () {
    let l = []
    for (let c of this.$.parent.children) {
      let f = c.__focusable
      if (f && f.enabled) {
        l.push(c)
      }
    }
    return _.sortBy(l, 'focusable.index')
  }

  blur () {
    focused = null
    if (this.$.__focusrect) {
      this.$.__focusrect.hide()
    }
    this.$.emit('blur')
    return this
  }

  focus (e) {
    if (this._enabled) {
      if (focused && focused.__focusable) {
        focused.__focusable.blur()
      }
      focused = this.$
      if (this.$.__focusrect) {
        this.$.__focusrect.show()
      }
      this.$.emit('focus')
    }
    if (e) {
      e.stopPropagation()
    }
    return this
  }

  focusPrev () {
    let l = this._index
    for (let c of this.focusableChildren) {
      let f = c.__focusable
      if (f && f.enabled && f.index <= l && c !== this.$) {
        f.focus()
        return c
      }
    }
    return this
  }

  focusNext () {
    let l = this._index
    for (let c of this.focusableChildren) {
      let f = c.__focusable
      if (f && f.enabled && f.index >= l && c !== this.$) {
        f.focus()
        return c
      }
    }
    return this
  }

  onKeydown (e) {
    if (this.focused) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          this.focusPrev()
        }
        else {
          this.focusNext()
        }
        e.stopImmediatePropagation()
      }
    }
  }

}
