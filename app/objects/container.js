import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'
import { DBMixin } from './db.js'
import { jsonquery } from '../utils.js'


export let ContainerMixin = Mixin(superclass => class ContainerMixin extends superclass {

  constructor () {
    super(...arguments)
    this.on('mouseover', this.onMouseOver)
    this.on('mouseout', this.onMouseOver)
  }

  destroy () {
    this.off('mouseover', this.onMouseOver)
    this.off('mouseout', this.onMouseOver)
    super.destroy()
  }

  onMouseOver (e) {
    app.screen.currentOver = this
  }

  onMouseOut (e) {
    app.screen.currentOver = null
  }

  get root () {
    let p = this.parent
    while (p && p.parent) {
      p = p.parent
    }
    return p
  }

  each (fn, deep = false) {
    for (let c of this.children) {
      if (deep) {
        c.each(fn, deep)
      }
      fn(c)
    }
  }

  q (expr) { return jsonquery(expr, { data: this.root, parent: this.parent, source: this.children, allowRegexp: true }).value }

})


export class Container extends mix(PIXI.Container).with(BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin, ContainerMixin, DisplayMixin) {}
