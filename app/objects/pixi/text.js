import { BaseMixin } from '../base.js'
import { PluginMixin } from '../../plugin.js'
import { CommandMixin } from '../../command.js'
import { ShortcutMixin } from '../../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'
import { SpriteMixin } from './sprite.js'
import { DBMixin } from '../db.js'
import { Encoder, e, d } from '../../lib/encoder.js'


export let TextMixin = Mixin(superclass => class TextMixin extends superclass {

  constructor () {
    super(...arguments)
    this.smooth = false
  }

  get smooth () { return this._smooth }
  set smooth (value) {
    this._smooth = value

    let scaleMode = PIXI.SCALE_MODES.NORMAL
    let fontSmoothing = ''
    let webkitFontSmoothing = ''
    let imageSmoothingEnabled = true
    let canvasDisplay = ''

    if (this._smooth) {
      this.context.canvas.remove()
    }
    else {
      scaleMode = PIXI.SCALE_MODES.NEAREST
      fontSmoothing = 'never'
      webkitFontSmoothing = 'none'
      imageSmoothingEnabled = false
      canvasDisplay = 'hidden'
      document.body.appendChild(this.context.canvas)
    }

    this.texture.baseTexture.scaleMode = scaleMode
    this.context.canvas.style['font-smoothing'] = fontSmoothing
    this.context.canvas.style['-webkit-font-smoothing'] = webkitFontSmoothing
    this.context.imageSmoothingEnabled = imageSmoothingEnabled
    this.context.canvas.style.display = canvasDisplay

    this.update()
  }

  get charWidth () { return this.getTextWidth(' ') }

  get charHeight () {
    let p = this.determineFontProperties(this._style.font)
    return this._style.lineHeight || p.fontSize + this._style.strokeThickness
  }

  getTextWidth (s) {
    return this.context.measureText(s).width + (s.length - 1) * this._style.letterSpacing
  }

  updateText () {
    super.updateText()
    // this.updateTexture()
    // this.width += this.charWidth * this.resolution
    // this.updateTransform()
    return this.update()
  }

})


export class Text extends mix(PIXI.Text).with(BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin, DisplayMixin, ContainerMixin, SpriteMixin, TextMixin) {}


Encoder.register('Text', {
  inherit: 'Sprite',
  exceptions: ['texture'],

  encode: obj => {
    let doc = {}
    doc.text = e('text', obj, doc)
    doc.style = e('style', obj, doc)
    doc.resolution = e('resolution', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    if (obj) {
      obj.text = d('text', doc, obj)
      obj.style = d('style', doc, obj)
      obj.resolution = d('resolution', doc, obj)
    }
    else {
      obj = new Text(d('text', doc, obj), d('style', doc, obj), d('resolution', doc, obj))
    }
    return obj
  },
})
