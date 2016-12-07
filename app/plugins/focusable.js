import { Plugin } from '../plugin.js'


export let focused = null


export class Focusable extends Plugin {

  get name () { return 'focusable' }
  get desc () { return 'Allow container to be focused with mouse and tab key.' }
  get author () { return 'Alain Deschenes' }
  get version () { return '1.0.0' }
  get date () { return '12/04/2016' }

  load (obj, options) {
    super.load(obj, options)

    obj._tabIndex = _.get(options, 'tabIndex', -1)

    // obj.on('layers.create', () => {
    //   this._focusLayer = new PIXI.Graphics()
    //   this._focusLayer.cacheAsBitmap = true
    //   this._container.addChild(this._focusLayer)
    // })

    // obj.on('layers.update', () => {
    //   let b = this._focusLayer
    //   if (b) {
    //     let s = this._focusStyle
    //     b.clear()
    //     b.lineStyle(s.width, s.fg, s.alpha)
    //     let w = s.width * 0.5
    //     b.drawRect(w - s.offset, w - s.offset, Math.ceil(this.rectInPixel.width - w + s.offset * 2), Math.ceil(this.rectInPixel.height - w + s.offset * 2))
    //     // b.cacheAsBitmap = false
    //     // b.cacheAsBitmap = true
    //     b.visible = this.focused
    //   }
    // })

    // obj.on('layers.remove', () => {
    //   if (this._focusLayer) {
    //     this._removeLayer(this._focusLayer)
    //     this._focusLayer = null
    //   }
    // })

    obj.on('mouse.down', () => {
      this.focus()
    })
  }

  unload (obj) {
    obj._tabIndex = undefined
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

}
