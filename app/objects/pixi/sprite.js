import { BaseMixin } from '../base.js'
import { EmitterMixin } from '../../event.js'
import { PluginMixin } from '../../plugin.js'
import { CommandMixin } from '../../command.js'
import { ShortcutMixin } from '../../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'
import { DBMixin } from '../db.js'
import { Encoder, e, d } from '../../lib/encoder.js'


export let SpriteMixin = Mixin(superclass => class SpriteMixin extends superclass {

})


export class Sprite extends mix(PIXI.Sprite).with(EmitterMixin, BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin, DisplayMixin, ContainerMixin, SpriteMixin) {}


Encoder.register('Sprite', {
  inherit: 'Container',

  encode: obj => {
    let doc = {}
    doc.width = e('width', obj, doc)
    doc.height = e('height', obj, doc)
    doc.anchor = e('anchor', obj, doc)
    doc.tint = e('tint', obj, doc)
    doc.blendMode = e('blendMode', obj, doc)
    doc.shader = e('shader', obj, doc)
    doc.texture = e('texture', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    if (obj) {
      // obj.texture = d('texture', doc, obj)
    }
    else {
      obj = new Sprite(d('texture', doc, obj))
    }
    obj.width = d('width', doc, obj)
    obj.height = d('height', doc, obj)
    obj.anchor = d('anchor', doc, obj)
    obj.tint = d('tint', doc, obj)
    obj.blendMode = d('blendMode', doc, obj)
    obj.shader = d('shader', doc, obj)
    return obj
  },
})
