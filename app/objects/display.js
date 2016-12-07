import { BaseMixin } from './base.js'
import { updates } from '../updates.js'
import { mix, Mixin } from 'mixwith'


export let DisplayMixin = Mixin(superclass => class extends superclass {

  destroy () {
    if (updates) {
      updates.remove(this)
    }
    this.emit('destroy')
    super.destroy()
  }

  update (options = {}) {
    updates.add(this, options)
    this.emit('update')
    this.updateTransform()
  }

})


export class Display extends mix(PIXI.DisplayObject).with(DisplayMixin, BaseMixin) {}
