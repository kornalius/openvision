import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { ModeMixin } from '../mode.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { ContainerMixin } from './container.js'


export let GraphicsMixin = Mixin(superclass => class extends superclass {

})


export class Graphics extends mix(PIXI.Graphics).with(GraphicsMixin, ContainerMixin, BaseMixin, PluginMixin, ModeMixin, CommandMixin, ShortcutMixin) {}
