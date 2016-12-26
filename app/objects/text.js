import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'
import { Sprite, SpriteMixin } from './sprite.js'
import { DBMixin } from './db.js'
import { Encoder, e, d } from './encoder.js'


export let TextMixin = Mixin(superclass => class TextMixin extends superclass {

  constructor () {
    super(...arguments)
    this._lines = null
    this.smooth = false
  }

  get smooth () { return this._smooth }
  set smooth (value) {
    this._smooth = value
    if (this._smooth) {
      this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NORMAL
      this.context.canvas.style['font-smoothing'] = ''
      this.context.canvas.style['-webkit-font-smoothing'] = ''
      this.context.imageSmoothingEnabled = true
      this.context.canvas.style.display = ''
      this.context.canvas.remove()
    }
    else {
      this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
      this.context.canvas.style['font-smoothing'] = 'never'
      this.context.canvas.style['-webkit-font-smoothing'] = 'none'
      this.context.imageSmoothingEnabled = false
      this.context.canvas.style.display = 'hidden'
      document.body.appendChild(this.context.canvas)
    }
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

  get lines () {
    if (!this._lines) {
      let outputText = this._style.wordWrap ? this.wordWrap(this._text) : this._text
      this._lines = outputText.split(/(?:\r\n|\r|\n)/)
    }
    return this._lines
  }

  updateText () {
    super.updateText()
    this._lines = null
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
