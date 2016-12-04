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

  update (cb) {
    updates.add(this, cb)
    this.emit('update')
    this.updateTransform()
  }

  render () {
    this.emit('render')
  }

}

mixin(Display.prototype, Base.prototype)

export { Display }
