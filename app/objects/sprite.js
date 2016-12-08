import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { ModeMixin } from '../mode.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { ContainerMixin } from './container.js'


export let SpriteMixin = Mixin(superclass => class extends superclass {

})


export class Sprite extends mix(PIXI.Sprite).with(BaseMixin, PluginMixin, ModeMixin, CommandMixin, ShortcutMixin, ContainerMixin, SpriteMixin) {}
