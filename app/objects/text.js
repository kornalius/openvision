import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'
import { SpriteMixin } from './sprite.js'


export let TextMixin = Mixin(superclass => class TextMixin extends superclass {

  constructor () {
    super(...arguments)
    this._lines = null
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
  }

})


export class Text extends mix(PIXI.Text).with(BaseMixin, PluginMixin, CommandMixin, ShortcutMixin, DisplayMixin, ContainerMixin, SpriteMixin, TextMixin) {}
