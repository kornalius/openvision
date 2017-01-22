// Based in part from Richard Davey, Phaser <http://www.photonstorm.com>

export default class Camera extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'camera'
    this._desc = 'Container is a camera that can be scrolled and scaled.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/15/2017'
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      let stage = app.stage
      obj._camera = {
        enabled: _.get(options, 'enabled', null),
        bounds: _.get(options, 'bounds', new PIXI.Rectangle(0, 0, stage.width, stage.height)),
        deadzone: _.get(options, 'deadzone', null),
        round: _.get(options, 'round', false),
        target: _.get(options, 'target', null),
        displayObject: _.get(options, 'displayObject', null),
        lerp: _.get(options, 'lerp', new PIXI.Point(1, 1)),
        targetPosition: new PIXI.Point(),
        atLimit: new PIXI.Point(),
        position: _.get(options, 'position', new PIXI.Point()),
        style: _.get(options, 'style', 'lock'),
      }
      obj.on('update', obj._onUpdateCamera)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._camera
      obj.off('update', obj._onUpdateCamera)
    }
  }

  get totalInCameraView () { return this._camera.totalInView }

  cameraFollow (target, style = 'lock', lerpX = 1, lerpY = 1) {
    let camera = this._camera

    camera.target = target
    camera.lerp.set(lerpX, lerpY)

    let helper

    switch (style) {
      case 'platformer':
        let w = this.width / 8
        let h = this.height / 3
        camera.deadzone = new PIXI.Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h)
        break
      case 'topdown':
        helper = Math.max(this.width, this.height) / 4
        camera.deadzone = new PIXI.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper)
        break
      case 'topdown_tight':
        helper = Math.max(this.width, this.height) / 8
        camera.deadzone = new PIXI.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper)
        break
      case 'lock':
        camera.deadzone = null
        break
      default:
        camera.deadzone = null
        break
    }

    return this
  }

  cameraUnfollow () {
    this._camera.target = null
    return this
  }

  focusCameraOn (displayObject) {
    this.moveTo(Math.round(displayObject.x - this.halfWidth), Math.round(displayObject.y - this.halfHeight))
    this.$.update()
    return this
  }

  focusCameraOnXY (x, y) {
    this.moveTo(Math.round(x - this.halfWidth), Math.round(y - this.halfHeight))
    this.$.update()
    return this
  }

  updateCameraTarget () {
    let camera = this._camera
    let targetPosition = camera.targetPosition
    let deadzone = camera.deadzone
    let lerp = camera.lerp

    targetPosition.x = this.x + camera.target.worldPosition.x
    targetPosition.y = this.y + camera.target.worldPosition.y

    if (camera.deadzone) {
      let edge = targetPosition.x - this.x
      if (edge < deadzone.x) {
        this.x = Math.linear(this.x, targetPosition.x - deadzone.x, lerp.x)
      }
      else if (edge > deadzone.right) {
        this.x = Math.linear(this.x, targetPosition.x - deadzone.right, lerp.x)
      }

      edge = targetPosition.y - this.y
      if (edge < deadzone.top) {
        this.y = Math.linear(this.y, targetPosition.y - deadzone.top, lerp.y)
      }
      else if (edge > deadzone.bottom) {
        this.y = Math.linear(this.y, targetPosition.y - deadzone.bottom, lerp.y)
      }
    }
    else {
      this.x = Math.linear(this.x, targetPosition.x - this.halfWidth, lerp.x)
      this.y = Math.linear(this.y, targetPosition.y - this.halfHeight, lerp.y)
    }

    camera.displayObject.position.x = -this.x
    camera.displayObject.position.y = -this.y
    camera.displayObject.update()

    this.$.update()
    return this
  }

  checkCameraBounds () {
    let camera = this._camera
    let atLimit = camera.atLimit
    let bounds = camera.bounds

    atLimit.x = false
    atLimit.y = false

    if (this.x <= bounds.x * this.scale.x) {
      atLimit.x = true
      this.x = bounds.x * this.scale.x
    }
    if (this.right >= bounds.right * this.scale.x) {
      atLimit.x = true
      this.x = bounds.right * this.scale.x - this.width
    }
    if (this.y <= bounds.top * this.scale.y) {
      atLimit.y = true
      this.y = bounds.top * this.scale.y
    }
    if (this.bottom >= bounds.bottom * this.scale.y) {
      atLimit.y = true
      this.y = bounds.bottom * this.scale.y - this.height
    }
  }

  resetCamera () {
    let camera = this._camera
    camera.target = null
    this.x = 0
    this.y = 0
  }

  _onUpdateCamera () {
    let camera = this._camera

    camera.totalInView = 0

    if (camera.bounds) {
      this.checkCameraBounds()
    }
    if (camera.roundPx) {
      this.floor()
    }

    camera.displayObject.position.x = -this.x
    camera.displayObject.position.y = -this.y
  }

}
