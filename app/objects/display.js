import { Base } from './base.js'
import { mixin } from '../globals.js'
import { updates } from '../updates.js'

class Display extends PIXI.DisplayObject {

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

}

mixin(Display.prototype, Base.prototype)

export { Display }
