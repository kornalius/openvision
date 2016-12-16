import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { ModeMixin } from '../mode.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'


export let ContainerMixin = Mixin(superclass => class ContainerMixin extends superclass {

  constructor () {
    super(...arguments)
    this.onMouseOverBounded = this.onMouseOver.bind(this)
    this.onMouseOutBounded = this.onMouseOut.bind(this)
    this.on('mouseover', this.onMouseOverBounded)
    this.on('mouseout', this.onMouseOverBounded)
  }

  destroy () {
    this.off('mouseover', this.onMouseOverBounded)
    this.off('mouseout', this.onMouseOverBounded)
    super.destroy()
  }

  onMouseOver (e) {
    app.screen.currentOver = this
  }

  onMouseOut (e) {
    app.screen.currentOver = null
  }

})


export class Container extends mix(PIXI.Container).with(BaseMixin, PluginMixin, ModeMixin, CommandMixin, ShortcutMixin, ContainerMixin, DisplayMixin) {}
