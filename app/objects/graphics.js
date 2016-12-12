import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { ModeMixin } from '../mode.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'


export let GraphicsMixin = Mixin(superclass => class GraphicsMixin extends superclass {

})


export class Graphics extends mix(PIXI.Graphics).with(GraphicsMixin, DisplayMixin, ContainerMixin, BaseMixin, PluginMixin, ModeMixin, CommandMixin, ShortcutMixin) {}
