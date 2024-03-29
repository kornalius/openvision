import { Container, Display, Sprite, Text } from './objects/objects.js'


export var currentOver = null


export class Screen extends Display {

  constructor (app, width = 640, height = 480, scale = 1) {
    super()

    this._app = app

    this._sprite = null
    this._texture = null
    this._canvas = null

    this._context = null
    this._imageData = null
    this._pixels = null

    this._force_update = false
    this._force_flip = false

    this._width = width
    this._height = height
    this._size = width * height
    this._scale = scale

    this._renderer = new PIXI.autoDetectRenderer(this._width * this._scale, this._height * this._scale, {})
    this._renderer.view.style.display = 'block'
    this._renderer.view.style.position = 'absolute'
    this._renderer.view.id = 'screen'
    document.body.style.overflow = 'hidden'
    document.body.appendChild(this._renderer.view)

    this._stage = new Container()

    let stage = this._stage

    stage.scale = new PIXI.Point(this._scale, this._scale)

    stage.interactive = true

    stage.on('mousedown', this.onMouseDown.bind(this))
    stage.on('rightdown', this.onMouseDown.bind(this))
    stage.on('touchstart', this.onMouseDown.bind(this))

    stage.on('mousemove', this.onMouseMove.bind(this))

    stage.on('mouseup', this.onMouseUp.bind(this))
    stage.on('touchend', this.onMouseUp.bind(this))
    stage.on('mouseupoutside', this.onMouseUp.bind(this))
    stage.on('touchendoutside', this.onMouseUp.bind(this))

    this._onScroll = this.onScroll.bind(this)
    this._renderer.view.addEventListener('wheel', this._onScroll, { capture: false, passive: true })

    this.resize()

    this._resize = this.resize.bind(this)
    window.addEventListener('resize', this.resize)

    this.test()
  }

  destroy () {
    if (this._sprite) {
      this._sprite.destroy()
    }

    if (this._texture) {
      this._texture.destroy()
      this._texture = null
    }

    if (this._canvas) {
      this._canvas.remove()
      this._canvas = null
    }

    this._renderer.view.removeEventListener('wheel', this._onScroll)
    window.removeEventListener('resize', this.resize)

    super.destroy()
  }

  resize () {
    if (this._renderer) {
      this._renderer.resize(this._width * this._scale, this._height * this._scale)

      if (this._sprite) {
        this._sprite.texture = null
      }

      if (this._texture) {
        this._texture.destroy()
        this._texture = null
      }

      if (this._canvas) {
        this._canvas.remove()
      }

      this._canvas = document.createElement('canvas')
      this._canvas.style.display = 'none'
      this._canvas.width = this._width
      this._canvas.height = this._height
      document.body.appendChild(this._canvas)

      this._texture = PIXI.Texture.fromCanvas(this._canvas, PIXI.SCALE_MODES.NEAREST)

      if (!this._sprite) {
        this._sprite = new PIXI.Sprite(this._texture)
      }
      else {
        this._sprite.texture = this._texture
      }

      this._context = this._canvas.getContext('2d', { alpha: true, antialias: false })

      this.clear()
    }

    return this
  }

  get app () { return this._app }

  get currentOver () { return currentOver }
  set currentOver (value) {
    if (currentOver !== value) {
      currentOver = value
    }
  }

  get scale () { return this._scale }
  set scale (value) {
    this._scale = value
    this.resize()
  }

  get width () { return this._width }
  set width (value) {
    this._width = value
    this.resize()
  }

  get height () { return this._height }
  set height (value) {
    this._height = value
    this.resize()
  }

  get stage () { return this._stage }
  get renderer () { return this._renderer }
  get view () { return this._renderer.view }

  get sprite () { return this._sprite }
  get texture () { return this._texture }
  get canvas () { return this._canvas }
  get context () { return this._context }

  get imageData () {
    if (!this._imageData) {
      this._imageData = this._context.getImageData(0, 0, this._width, this._height)
    }
    return this._imageData
  }

  get pixels () {
    if (!this._pixels) {
      this._pixels = new Uint32Array(this._imageData.data.buffer)
    }
    return this._pixels
  }

  get force_update () { return this._force_update }
  set force_update (value) { this._force_update = value }

  get force_flip () { return this._force_flip }
  set force_flip (value) { this._force_flip = value }

  tick (delta) {
    if (this._force_update) {
      this._force_update = false
      this._renderer.render(this._stage)
    }
    super.tick(delta)
  }

  center () {
    this._renderer.view.style.left = window.innerWidth * 0.5 - this._renderer.width * 0.5 + 'px'
    this._renderer.view.style.top = window.innerHeight * 0.5 - this._renderer.height * 0.5 + 'px'
    return this
  }

  rescale (width, height) {
    this.scale = Math.ceil(Math.min(width / this._renderer.width, height / this._renderer.height))
    this.emit('scale', { scale: this.scale })
    return this
  }

  refresh (flip = false) {
    this._force_update = true
    if (this._force_flip) {
      this.flip()
    }
    this.emit('refresh', { flip })
    return this
  }

  clear () {
    this._context.clearRect(0, 0, this._width, this._height)
    this.emit('clear')
    return this.refresh(true)
  }

  flip () {
    if (this._imageData) {
      this._context.putImageData(this._imageData, 0, 0)
      this._imageData = null
      this._pixels = null
    }
    this._force_flip = false
    this.emit('flip')
    return this
  }

  toIndex (x, y) { return y * this._width + x }

  fromIndex (i) {
    let y = Math.min(Math.trunc(i / this._width), this._height - 1)
    let x = i - y
    return { x, y }
  }

  loadTexture (filename) {
    let tex = PIXI.Texture.fromImage('./build/' + require('file?name=assets/[name].[ext]!./assets/' + filename), undefined, PIXI.SCALE_MODES.NEAREST)
    tex.on('update', () => this.refresh())
    return tex
  }

  test () {
  }

  onMouseDown (e) {
    // let info = app.mouseEvent(e)
  }

  onMouseMove (e) {
  }

  onMouseUp (e) {
  }

  onScroll (e) {
    let t = this.currentOver
    if (t && t.hasPlugin && t.hasPlugin('scrollable')) {
      let res = -120
      let deltaX = 0
      let deltaY = 0

      if (t.__scrollable.horizontal) {
        deltaX = e.wheelDeltaX * res
        if (deltaX <= res) {
          deltaX = -1
        }
        else if (deltaX > res) {
          deltaX = 1
        }
      }

      if (t.__scrollable.vertical) {
        deltaY = e.wheelDeltaY * res
        if (deltaY <= res) {
          deltaY = -1
        }
        else if (deltaY > res) {
          deltaY = 1
        }
      }

      if (t.__scrollable.horizontal || t.__scrollable.vertical) {
        t.emit('scroll', {
          delta: new PIXI.Point(deltaX, deltaY),
          wheelDelta: new PIXI.Point(e.wheelDeltaX, e.wheelDeltaY)
        })
      }
    }

    e.stopPropagation()

    return false
  }

}
