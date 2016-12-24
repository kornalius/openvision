import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'
import { DBMixin } from './db.js'
import { Encoder } from './encoder.js'


export let SpriteMixin = Mixin(superclass => class SpriteMixin extends superclass {

  static serialization (obj) {
    let s = super.serialization(obj)
    return {
      args: [],
      properties: _.extend({}, s.properties, {
        anchor: { type: PIXI.Point, value: obj && obj.anchor },
        tint: { type: Number, value: obj && obj.tint },
        blendMode: { type: Number, value: obj && obj.blendMode },
        width: { type: Number, value: obj && obj.width },
        height: { type: Number, value: obj && obj.height },
        shader: { type: PIXI.Shader, value: obj && obj.shader },
        texture: { type: PIXI.Texture, value: obj && obj.texture },
      }),
      exceptions: [].concat(s.exceptions),
    }
  }

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
    obj = obj || new Sprite(Encoder.decode(doc.texture))
    obj.anchor = doc.anchor
    obj.tint = doc.tint
    obj.blendMode = doc.blendMode
    obj.width = doc.width
    obj.height = doc.height
    obj.shader = doc.shader
    obj.texture = doc.texture
    return obj
  },
})
