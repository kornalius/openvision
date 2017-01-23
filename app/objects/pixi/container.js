import { BaseMixin } from '../base.js'
import { EmitterMixin } from '../../event.js'
import { PluginMixin } from '../../plugin.js'
import { CommandMixin } from '../../command.js'
import { ShortcutMixin } from '../../shortcut.js'
import { DisplayMixin } from './display.js'
import { DBMixin } from '../db.js'
import { jsonquery } from '../../utils.js'
import { Encoder, e, d } from '../../lib/encoder.js'


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

  onChildrenChange () {
    return this.emit('childrenchange', ...arguments)
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
    return this
  }

  eachParent (fn) {
    let p = this.parent
    while (p) {
      if (fn(p)) {
        return p
      }
      p = p.parent
    }
    return null
  }

  q (expr) { return jsonquery(expr, { data: this.root, parent: this.parent, source: this.children, allowRegexp: true }).value }

})


export class Container extends mix(PIXI.Container).with(EmitterMixin, BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin, DisplayMixin, ContainerMixin) {}


Encoder.register('Container', {
  inherit: 'Display',

  encode: obj => {
    let doc = {
      children: new Array(obj.children.length)
    }
    for (let i = 0; i < obj.children.length; i++) {
      doc.children[i] = e(obj.children[i], obj, doc)
    }
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Container()
    for (let c of doc.children) {
      obj.addChild(d(c, doc, obj))
    }
    return obj
  },
})
