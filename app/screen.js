import { Display, Sprite, Text } from './objects/objects.js'

export default class Screen extends Display {

  constructor (main, width = 640, height = 480, scale = 1) {
    super()

    this._main = main

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
    this._renderer.view.style.position = 'absolute'
    this._renderer.view.style.cursor = 'none'
    this._renderer.view.id = 'screen'
    document.body.appendChild(this._renderer.view)

    this._stage = new PIXI.Container()
    this._stage.scale = new PIXI.Point(this._scale, this._scale)

    this.on('resize', this.resize.bind(this))

    this._renderer.view.addEventListener('wheel', this.onScroll.bind(this), false)

    this.resize()

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

  get main () { return this._main }

  get currentOver () { return this._main.currentOver }
  set currentOver (value) { this._main.currentOver = value }

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
    if (!this.emit('rescale', { width, height }).defaultPrevented) {
      this.scale = Math.ceil(Math.min(width / this._renderer.width, height / this._renderer.height))
    }
    return this
  }

  refresh (flip = false) {
    this._force_update = true
    if (this._force_flip) {
      this.flip()
    }
    this.emit('refresh', { flip })
  }

  clear () {
    this._context.clearRect(0, 0, this._width, this._height)
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
    let t = new Sprite(this.loadTexture('test.png'))
    this._stage.addChild(t)

    let text = new Text('This is a pixi text', { font: '20px "Glass TTY VT220"', fill: 0xFFFFFF })
    text.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
    text.context.canvas.style['font-smoothing'] = 'never'
    text.context.canvas.style['-webkit-font-smoothing'] = 'none'
    text.context.imageSmoothingEnabled = false
    text.context.canvas.style.display = 'hidden'
    document.body.appendChild(text.context.canvas)
    text.updateText()
    this._stage.addChild(text)
    this.refresh()
  }

  onScroll (e) {
    let t = this.currentOver
    if (t && t.scrollable) {
      let res = -120
      let deltaX = 0
      let deltaY = 0

      if (t.scrollable.x) {
        deltaX = e.wheelDeltaX * res
        if (deltaX <= res) {
          deltaX = -1
        }
        else if (deltaX > res) {
          deltaX = 1
        }
      }

      if (t.scrollable.y) {
        deltaY = e.wheelDeltaY * res
        if (deltaY <= res) {
          deltaY = -1
        }
        else if (deltaY > res) {
          deltaY = 1
        }
      }

      if (!e.detail) {
        e.detail = {}
      }
      e.detail.scroll = new PIXI.Point(deltaX, deltaY)
      t.onScroll(e)
    }

    e.stopPropagation()

    return false
  }

}
