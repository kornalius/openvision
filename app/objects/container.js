import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { ModeMixin } from '../mode.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'


export let ContainerMixin = Mixin(superclass => class ContainerMixin extends superclass {

})


export class Container extends mix(PIXI.Container).with(BaseMixin, PluginMixin, ModeMixin, CommandMixin, ShortcutMixin, ContainerMixin, DisplayMixin) {}
