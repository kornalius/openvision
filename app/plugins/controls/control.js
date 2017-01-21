
export default class Control extends Plugin {

  constructor () {
    super()
    this.name = 'control'
    this.desc = 'Allow a container to act as a control.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse', 'keyboard']
    this.properties = {
      splitters: { value: [] },
    }
  }

  init (owner, options = {}) {
    owner.x = _.get(options, 'x', owner.x)
    owner.y = _.get(options, 'y', owner.y)
    owner.width = _.get(options, 'width', owner.width)
    owner.height = _.get(options, 'height', owner.height)
    owner.alpha = _.get(options, 'alpha', owner.alpha)
    owner.scale.x = _.get(options, 'scaleX', owner.scale.x)
    owner.scale.y = _.get(options, 'scaleY', owner.scale.y)
    owner.pivot.x = _.get(options, 'pivotX', owner.pivot.x)
    owner.pivot.y = _.get(options, 'pivotY', owner.pivot.y)
    owner.skew.x = _.get(options, 'skewX', owner.skew.x)
    owner.skew.y = _.get(options, 'skewY', owner.skew.y)
    owner.rotation = _.get(options, 'rotation', owner.rotation)
    owner.visible = _.get(options, 'visible', owner.visible)
    owner.update()
  }

  destroy (owner) {
    this.clear()
  }

  get (side = 'r') { return this._splitters[side] }

  add (side = 'r', size = 2, color = 0xFFFFFF) {
    let s = this.get(side)
    if (!s) {
      s = new app.Rectangle()
      s.color = color
      this.owner.parent.addChild(s)
      s.plug('splitter', { side, size, container: this })
      s.update()
    }
    return this.owner.update()
  }

  remove (side = 'r') {
    let s = this.get(side)
    if (s) {
      this.owner.parent.removeChild(s)
      delete this._splitters[side]
    }
    return this.owner.update()
  }

  clear () {
    for (let side in this._splitters) {
      this.remove(side)
    }
    return this.owner.update()
  }

}
