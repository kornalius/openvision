import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DisplayMixin } from './display.js'
import { ContainerMixin } from './container.js'
import { DBMixin } from './db.js'
import { serialize_rect, serialize_point, deserialize_rect, deserialize_point } from '../utils.js'

export let SpriteMixin = Mixin(superclass => class SpriteMixin extends superclass {

  deserialize (doc) {
    this.anchor = deserialize_point(doc.anchor)
    this.tint = doc.tint
    this.blendMode = doc.blendMode
    this.width = doc.width
    this.height = doc.height
    this.shader = doc.shader
    if (doc.texture) {
      this.texture = PIXI.Texture(doc.texture.baseTexture, deserialize_rect(doc.texture.frame), deserialize_rect(doc.texture.crop), deserialize_rect(doc.texture.trim), doc.texture.rotate)
    }
  }

  serialize () {
    return _.extend({}, super.serialize(), {
      anchor: serialize_point(this.anchor),
      tint: this.tint,
      blendMode: this.blendMode,
      width: this.width,
      height: this.height,
      shader: this.shader,
      texture: this.texture ? {
        baseTexture: this.texture.baseTexture.uid,
        frame: serialize_rect(this.texture.frame),
        crop: serialize_rect(this.texture.crop),
        trim: serialize_rect(this.texture.trim),
        rotate: this.texture.rotate,
      } : undefined,
    })
  }

})


export class Sprite extends mix(PIXI.Sprite).with(BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin, DisplayMixin, ContainerMixin, SpriteMixin) {}
