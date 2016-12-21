import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'
import { DBMixin } from './db.js'


export let GraphicsMixin = Mixin(superclass => class GraphicsMixin extends superclass {

})


export class Graphics extends mix(PIXI.Graphics).with(GraphicsMixin, DBMixin, DisplayMixin, ContainerMixin, BaseMixin, PluginMixin, CommandMixin, ShortcutMixin) {}
