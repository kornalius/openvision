export let focused = null


export default class Focusable extends Plugin {

  constructor () {
    super()
    this.name = 'focusable'
    this.desc = 'Allow container to be focused with mouse and tab key.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse', 'keyboard', 'focusrect']
    this.properties = {
      enabled: { value: true, options: 'enabled' },
      index: { value: -1, options: 'index' },
    }
    this.listeners = {
      $mousedown: this.focus,
    }
  }

  init (owner, options) {
    this._onKeydown = this.onKeydown.bind(this)
    window.addEventListener('keydown', this._onKeydown, false)
  }

  destroy (owner) {
    window.removeEventListener('keydown', this._onKeydown, false)
  }

  get focused () { return focused === this.owner }

  setIndex (value) {
    if (this._index !== value) {
      this._index = value
      if (this.focused && value === -1) {
        this.focusPrev()
      }
    }
  }

  get focusableChildren () {
    let l = []
    for (let c of this.children) {
      let f = c.focusable
      if (f && f.enabled) {
        l.push(c)
      }
    }
    return _.sortBy(l, 'focusable.index')
  }

  blur () {
    focused = null
    let owner = this.owner
    owner.focusrect.hide()
    owner.emit('blur')
    return owner
  }

  focus () {
    let owner = this.owner
    if (this._enabled) {
      if (focused) {
        focused.focusable.blur()
      }
      focused = owner
      owner.focusrect.show()
      owner.emit('focus')
    }
    return owner
  }

  focusPrev () {
    let owner = this.owner
    let l = this._index
    for (let c of this.focusableChildren) {
      let f = c.focusable
      if (f && f.enabled && f.index <= l && c !== owner) {
        f.focus()
        return c
      }
    }
    return owner
  }

  focusNext () {
    let owner = this.owner
    let l = this._index
    for (let c of this.focusableChildren) {
      let f = c.focusable
      if (f && f.enabled && f.index >= l && c !== owner) {
        f.focus()
        return c
      }
    }
    return owner
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
      }
    }
  }

}
