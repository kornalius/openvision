export let focused = null


export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'focusable'
    this._desc = 'Allow container to be focused with mouse and tab key.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/04/2016'
    this._deps = ['interactive', 'mouse', 'keyboard']
  }

  load (obj, options) {
    super.load(obj, options)
    obj._tabIndex = _.get(options, 'tabIndex', -1)
    obj.on('mousedown', obj.focus)
    obj._onKeyDownFocusable = obj.onKeyDownFocusable.bind(obj)
    window.addEventListener('keydown', obj._onKeyDownFocusable, false)
  }

  unload (obj) {
    window.removeEventListener('keydown', obj._onKeyDownFocusable, false)
    delete obj._tabIndex
    delete obj._onKeyDownFocusable
    obj.off('mousedown', obj.focus)
    super.unload(obj)
  }

  get focused () { return focused === this }

  get focusable () { return this._tabIndex !== -1 }

  get tabIndex () { return this._tabIndex }
  set tabIndex (value) {
    if (this._tabIndex !== value) {
      this._tabIndex = value
      // this.update()
      if (this.focused && value === -1) {
        this.focusPrev()
      }
    }
  }

  focusableChildren (gt = -1) {
    let l = []
    for (let c of this.children) {
      if (_.isNumber(c.tabIndex) && c.tabIndex > gt) {
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
    for (let c of this.children) {
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
    for (let c of this.children) {
      if (c.tabIndex >= l && c !== this) {
        c.focus()
        return c.focused
      }
      return false
    }
    return this
  }

  onKeyDownFocusable (e) {
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