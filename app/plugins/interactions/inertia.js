// part of this code is based in part on Taye Adeyemi, Interact.js <https://github.com/taye/interact.js>


export default class Snapper extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'inertia'
    this._desc = 'Provides inertia when release mouse button.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/11/2017'
  }

  load (obj, options) {
    if (super.load(obj, options)) {
      obj._inertia = {
        enabled: _.get(options, 'enabled', true),
        resistance: _.get(options, 'resistance', 10),
        minSpeed: _.get(options, 'minSpeed', 100),
        endSpeed: _.get(options, 'endSpeed', 10),
        active: null,
        smoothEnd: true,
        smoothEndDuration: _.get(options, 'smoothEndDuration', 300),
        xe: 0,
        ye: 0,
        px: 0,
        py: 0,
        sx: 0,
        sy: 0,
        dx: 0,
        dy: 0,
        t0: 0,
        v0: 0,
        x0: 0,
        y0: 0,
        t1: 0,
        v1: 0,
        x1: 0,
        y1: 0,
        lambda_v0: 0,
        one_ve_v0: 0,
        i: null,
      }
      obj.on('mousedown', obj.onInertiaMousedown)
      obj.on('mouseup', obj.onInertiaMouseup)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._inertia
      obj.off('mousedown', obj.onInertiaMousedown)
      obj.off('mouseup', obj.onInertiaMouseup)
    }
  }

  _calculateInertia (e) {
    let i = this._inertia
    let info = app.mouseEvent(e)

    let lambda = i.resistance
    let inertiaDur = -Math.log(i.endSpeed / i.v) / lambda

    i.x0 = i.px
    i.y0 = i.py
    i.t0 = info.time / 1000
    i.sx = 0
    i.sy = 0

    i.modifiedXe = i.xe = (i.x0 - inertiaDur) / lambda
    i.modifiedYe = i.ye = (i.y0 - inertiaDur) / lambda
    i.te = inertiaDur

    i.lambda_v0 = lambda / i.v0
    i.one_ve_v0 = 1 - i.endSpeed / i.v0
  }

  cancelInertia () {
    let i = this._inertia
    app.raf.cancel(i.i)
    i.interval = 0
    i.active = null
  }

  hypot (x, y) { return Math.sqrt(x * x + y * y) }

  onInertiaMousedown (e) {
    let i = this._inertia
    let info = app.mouseEvent(e)
    if (i.active === info.target) {
      this.cancelInertia()
    }
    if (info.leftButton) {
      i.t0 = app.now
      i.x0 = info.sx
      i.y0 = info.sy
      i.v = 0
      i.vx = 0
      i.vy = 0
    }
  }

  onInertiaMouseup (e) {
    let i = this._inertia
    let info = app.mouseEvent(e)
    if (info.leftButton) {
      if (i.enabled && i.active === info.target) {
        let now = app.now
        let vel = i.v
        let inertia = now - i.t0 < 50 && vel > i.minSpeed && vel > i.endSpeed
        let smoothEnd = !inertia

        if (!(inertia || smoothEnd)) {
          return
        }

        i.active = info.target
        i.t1 = now

        if (inertia) {
          i.x1 = info.sx
          i.y1 = info.sy

          i.dx = i.x1 - i.x0
          i.dy = i.y1 - i.y0

          let dt = Math.max((i.t1 - i.t0) / 1000, 0.001)
          i.v = this.hypot(i.x0, i.y0) / dt
          i.vx = i.x0 / dt
          i.vy = i.y0 / dt

          this._calculateInertia(e)
        }
        else {
          i.smoothEnd = true
          i.xe = modifierResult.dx
          i.ye = modifierResult.dy

          i.sx = 0
          i.sy = 0

          i.interval = setInterval(() => {

          })
        }
      }
    }
  }

  _inertiaInterval () {
    let i = this._inertia
    let lambda = i.resistance
    let t = app.now / 1000 - i.t0

    if (t < i.te) {
      let progress = 1 - (Math.exp(-lambda * t) - i.lambda_v0) / i.one_ve_v0

      if (i.modifiedXe === i.xe && i.modifiedYe === i.ye) {
        i.sx = i.xe * progress
        i.sy = i.ye * progress
      }
      else {
        let quadPoint = utils.getQuadraticCurvePoint(0, 0, i.xe, i.ye, i.modifiedXe, i.modifiedYe, progress)
        i.sx = quadPoint.x
        i.sy = quadPoint.y
      }

      this.doMove()

      i.i = app.raf.request(this.boundInertiaFrame)
    }
    else {
      i.sx = i.modifiedXe
      i.sy = i.modifiedYe

      this.doMove()

      this.end(i.startEvent)

      i.active = null
    }
  }

  smoothEndFrame () {
    let i = this._inertia

    if (i.active) {
      i.x += i.sx
      i.y += i.sy
    }

    let t = app.now - i.t0
    let duration = i.smoothEndDuration

    if (t < duration) {
      i.sx = utils.easeOutQuad(t, 0, i.xe, duration)
      i.sy = utils.easeOutQuad(t, 0, i.ye, duration)

      this.pointerMove(i.startEvent, i.startEvent)

      i.i = app.raf.request(this.boundSmoothEndFrame)
    }
    else {
      i.sx = i.xe
      i.sy = i.ye

      this.pointerMove(i.startEvent, i.startEvent)

      this.end(i.startEvent)

      i.smoothEnd = false
      i.active = null
    }
  }

}
