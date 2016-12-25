import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'
import { DBMixin } from './db.js'
import { Encoder } from './encoder.js'


export let SpriteMixin = Mixin(superclass => class SpriteMixin extends superclass {

})


export class Sprite extends mix(PIXI.Sprite).with(BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin, DisplayMixin, ContainerMixin, SpriteMixin) {}


Encoder.register('Sprite', {
  inherit: 'Container',

  encode: obj => {
    let doc = {
      anchor: obj.anchor,
      tint: obj.tint,
      blendMode: obj.blendMode,
      width: obj.width,
      height: obj.height,
      shader: obj.shader,
      texture: obj.texture,
    }
    return doc
  },

  decode: (doc, obj) => {
    let d = Encoder.decode(doc)
    if (obj) {
      obj.texture = d.texture
    }
    else {
      obj = new Sprite(d.texture)
    }
    obj.anchor = d.anchor
    obj.tint = d.tint
    obj.blendMode = d.blendMode
    obj.width = d.width
    obj.height = d.height
    obj.shader = d.shader
    return obj
  },
})
