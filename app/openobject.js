import { updates } from './updates.js'

class OpenObject extends PIXI.DisplayObject {

  tick (delta) {
    // this.emit('tick', { delta })
    return this
  }

  destroy () {
    if (updates) {
      updates.remove(this)
    }
    this.emit('destroy')
    super.destroy()
  }

  async (fn, args, delay) {
    if (_.isNumber(args)) {
      delay = args
      args = []
    }
    if (!_.isArray(args)) {
      args = [args]
    }
    setTimeout(() => {
      fn.call(this, ...args)
    }, delay || 1)
  }

  __detail (d) {
    return _.extend({ time: performance.now(), defaultPrevented: false }, d || {})
  }

  emit (name, detail) {
    let d = this.__detail(detail)
    // super.emit(name, d)
    return d
  }

}

export { OpenObject }
