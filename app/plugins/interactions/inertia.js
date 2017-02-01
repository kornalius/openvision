// part of this code is based in part on Taye Adeyemi, Interact.js <https://github.com/taye/interact.js>


export default class Snapper extends Plugin {

  constructor () {
    super()
    this.name = 'inertia'
    this.desc = 'Provides inertia when release mouse button.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      enabled: { value: true },
      resistance: { value: 10 },
      minSpeed: { value: 100 },
      endSpeed: { value: 10 },
      smoothEndDuration: { value: 300 },
      active: { value: null, options: false },
      smoothEnd: { value: true, options: false },
      xe: { value: 0, options: false },
      ye: { value: 0, options: false },
      px: { value: 0, options: false },
      py: { value: 0, options: false },
      sx: { value: 0, options: false },
      sy: { value: 0, options: false },
      dx: { value: 0, options: false },
      dy: { value: 0, options: false },
      t0: { value: 0, options: false },
      v0: { value: 0, options: false },
      x0: { value: 0, options: false },
      y0: { value: 0, options: false },
      t1: { value: 0, options: false },
      v1: { value: 0, options: false },
      x1: { value: 0, options: false },
      y1: { value: 0, options: false },
      lambda_v0: { value: 0, options: false },
      one_ve_v0: { value: 0, options: false },
      i: { value: null, options: false },
    }
    this.listeners = {
      $mousedown: this.onMousedown,
      $mouseup: this.onMouseup,
    }
  }

  _calculateInertia (e) {
    let info = app.mouseEvent(e)

    let lambda = this._resistance
    let inertiaDur = -Math.log(this._endSpeed / this._v) / lambda

    this._x0 = this._px
    this._y0 = this._py
    this._t0 = info.time / 1000
    this._sx = 0
    this._sy = 0

    this._modifiedXe = this._xe = (this._x0 - inertiaDur) / lambda
    this._modifiedYe = this._ye = (this._y0 - inertiaDur) / lambda
    this._te = inertiaDur

    this._lambda_v0 = lambda / this._v0
    this._one_ve_v0 = 1 - this._endSpeed / this._v0
  }

  cancelInertia () {
    app.raf.cancel(this._i)
    this._interval = 0
    this._active = null
  }

  hypot (x, y) { return Math.sqrt(x * x + y * y) }

  _inertiaInterval () {
    let lambda = this._resistance
    let t = app.now / 1000 - this._t0

    if (t < this._te) {
      let progress = 1 - (Math.exp(-lambda * t) - this._lambda_v0) / this._one_ve_v0

      if (this._modifiedXe === this._xe && this._modifiedYe === this._ye) {
        this._sx = this._xe * progress
        this._sy = this._ye * progress
      }
      else {
        let quadPoint = utils.getQuadraticCurvePoint(0, 0, this._xe, this._ye, this._modifiedXe, this._modifiedYe, progress)
        this._sx = quadPoint.x
        this._sy = quadPoint.y
      }

      this.exec()

      this._i = app.raf.request(this.boundInertiaFrame)
    }
    else {
      this._sx = this._modifiedXe
      this._sy = this._modifiedYe

      this.exec()

      this.end(this._startEvent)

      this._active = null
    }
  }

  smoothEndFrame () {
    if (this._active) {
      this._x += this._sx
      this._y += this._sy
    }

    let t = app.now - this._t0
    let duration = this._smoothEndDuration

    if (t < duration) {
      this._sx = utils.easeOutQuad(t, 0, this._xe, duration)
      this._sy = utils.easeOutQuad(t, 0, this._ye, duration)

      this.pointerMove(this._startEvent, this._startEvent)

      this._i = app.raf.request(this.boundSmoothEndFrame)
    }
    else {
      this._sx = this._xe
      this._sy = this._ye

      this.pointerMove(this._startEvent, this._startEvent)

      this.end(this._startEvent)

      this._smoothEnd = false
      this._active = null
    }
  }

  onMousedown (e) {
    let info = app.mouseEvent(e)
    if (this._active === info.target) {
      this.cancelInertia()
    }
    if (info.leftButton) {
      this._t0 = app.now
      this._x0 = info.sx
      this._y0 = info.sy
      this._v = 0
      this._vx = 0
      this._vy = 0
    }
  }

  onMouseup (e) {
    let info = app.mouseEvent(e)
    if (info.leftButton) {
      if (this._enabled && this._active === info.target) {
        let now = app.now
        let vel = this._v
        let inertia = now - this._t0 < 50 && vel > this._minSpeed && vel > this._endSpeed
        let smoothEnd = !inertia

        if (!(inertia || smoothEnd)) {
          return
        }

        this._active = info.target
        this._t1 = now

        if (inertia) {
          this._x1 = info.sx
          this._y1 = info.sy

          this._dx = this._x1 - this._x0
          this._dy = this._y1 - this._y0

          let dt = Math.max((this._t1 - this._t0) / 1000, 0.001)
          this._v = this.hypot(this._x0, this._y0) / dt
          this._vx = this._x0 / dt
          this._vy = this._y0 / dt

          this._calculateInertia(e)
        }
        else {
          this._smoothEnd = true
          this._xe = modifierResult.dx
          this._ye = modifierResult.dy

          this._sx = 0
          this._sy = 0

          this._interval = setInterval(() => {
          })
        }
      }
    }
  }
}
