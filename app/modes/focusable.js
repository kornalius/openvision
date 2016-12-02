import { Mode } from '../mode.js'

export let focused = null

export class Focusable extends Mode {

  get name () { return 'focusable' }
  get desc () { return 'Allow terminal to be focused with mouse and tab key.' }
  get author () { return 'Alain Deschenes' }
  get version () { return '1.0.0' }
  get date () { return '11/21/16' }

  load (term, options) {
    super.load(term, options)

    term._defaults.focus = _.get(options, 'focus', {
      width: 2,
      offset: 3,
      fg: term.palette.cyan,
      alpha: 0.75,
    })
    term._tabIndex = _.get(options, 'tabIndex', -1)
    term._focusStyle = _.get(options, 'focus', term.defaults.focus)

    term.on('layers.create', () => {
      this._focusLayer = new PIXI.Graphics()
      this._focusLayer.cacheAsBitmap = true
      this._container.addChild(this._focusLayer)
    })

    term.on('layers.update', () => {
      let b = this._focusLayer
      if (b) {
        let s = this._focusStyle
        b.clear()
        b.lineStyle(s.width, s.fg, s.alpha)
        let w = s.width * 0.5
        b.drawRect(w - s.offset, w - s.offset, Math.ceil(this.rectInPixel.width - w + s.offset * 2), Math.ceil(this.rectInPixel.height - w + s.offset * 2))
        // b.cacheAsBitmap = false
        // b.cacheAsBitmap = true
        b.visible = this.focused
      }
    })

    term.on('layers.remove', () => {
      if (this._focusLayer) {
        this._removeLayer(this._focusLayer)
        this._focusLayer = null
      }
    })

    term.on('mouse.down', () => {
      this.focus()
    })
  }

  unload (term) {
    term._defaults.focus = undefined
    term._tabIndex = undefined
    term._focusStyle = undefined

    super.unload(term)
  }

  get focused () { return focused === this }

  get focusable () { return this._tabIndex !== -1 }

  get tabIndex () { return this._tabIndex }
  set tabIndex (value) {
    if (this._tabIndex !== value) {
      this._tabIndex = value
      this.update()
      if (this.focused && value === -1) {
        this.focusPrev()
      }
    }
  }

  focusableChildren (gt = -1) {
    let l = []
    for (let t of this._children) {
      if (t.tabIndex > gt) {
        l.push(t)
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
    this.each(t => {
      if (t.tabIndex <= l && t !== this) {
        t.focus()
        return t.focused
      }
      return false
    })
    return this
  }

  focusNext () {
    let l = this._tabIndex
    this.each(t => {
      if (t.tabIndex >= l && t !== this) {
        t.focus()
        return t.focused
      }
      return false
    })
    return this
  }

}
