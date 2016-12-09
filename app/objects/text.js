import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { ModeMixin } from '../mode.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'
import { SpriteMixin } from './sprite.js'


export let TextMixin = Mixin(superclass => class extends superclass {

})


export class Text extends mix(PIXI.Text).with(BaseMixin, PluginMixin, ModeMixin, CommandMixin, ShortcutMixin, DisplayMixin, ContainerMixin, SpriteMixin, TextMixin) {}
