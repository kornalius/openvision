
export default class Control extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'control'
    this._desc = 'Allow a container to act as a control.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/16/2017'
    this._deps = ['interactive', 'mouse', 'keyboard']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj.x = _.get(options, 'x', obj.x)
      obj.y = _.get(options, 'y', obj.y)
      obj.width = _.get(options, 'width', obj.width)
      obj.height = _.get(options, 'height', obj.height)
      obj.alpha = _.get(options, 'alpha', obj.alpha)
      obj.scale.x = _.get(options, 'scaleX', obj.scale.x)
      obj.scale.y = _.get(options, 'scaleY', obj.scale.y)
      obj.pivot.x = _.get(options, 'pivotX', obj.pivot.x)
      obj.pivot.y = _.get(options, 'pivotY', obj.pivot.y)
      obj.skew.x = _.get(options, 'skewX', obj.skew.x)
      obj.skew.y = _.get(options, 'skewY', obj.skew.y)
      obj.rotation = _.get(options, 'rotation', obj.rotation)
      obj.visible = _.get(options, 'visible', obj.visible)
      obj._splitters = {}
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      obj.removeAllSplitters()
      delete obj._splitters
    }
  }

  getSplitter (side = 'r') { return this._splitters[side] }

  addSplitter (side = 'r', size = 2, color = 0xFFFFFF) {
    let s = this.getSplitter(side)
    if (!s) {
      s = new app.Rectangle()
      s.color = color
      this.parent.addChild(s)
      s.plug('splitter', { side, size, container: this })
      s.update()
      this.update()
    }
    return this
  }

  removeSplitter (side = 'r') {
    let s = this.getSplitter(side)
    if (s) {
      this.removeChild(s)
      delete this._splitters[side]
      this.update()
    }
    return this
  }

  removeAllSplitters () {
    for (let side in this._splitters) {
      this.removeSplitter(side)
    }
    return this.update()
  }

}
