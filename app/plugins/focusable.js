export let focused = null


export let C = class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'focusable'
    this._desc = 'Allow container to be focused with mouse and tab key.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/04/2016'
  }

  load (obj, options) {
    super.load(obj, options)
    obj._tabIndex = _.get(options, 'tabIndex', -1)
    obj.on('mousedown', () => { this.focus() })
  }

  unload (obj) {
    obj.off('mouse.down')
    delete obj._tabIndex
    super.unload(obj)
  }

}


export let M = Mixin(superclass => class extends superclass {

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
    if (!this.emit('blur').defaultPrevented) {
      focused = null
    }
    return this
  }

  focus () {
    if (this.focusable && !this.emit('focus').defaultPrevented) {
      if (focused) {
        focused.blur()
      }
      focused = this // eslint-disable-line consistent-this
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

})
