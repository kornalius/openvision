
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

  attach ($, options = {}) {
    $.x = _.get(options, 'x', $.x)
    $.y = _.get(options, 'y', $.y)
    if (!($ instanceof PIXI.Text)) {
      $.width = _.get(options, 'width', $.width)
      $.height = _.get(options, 'height', $.height)
    }
    $.alpha = _.get(options, 'alpha', $.alpha)
    $.scale.x = _.get(options, 'scaleX', $.scale.x)
    $.scale.y = _.get(options, 'scaleY', $.scale.y)
    $.pivot.x = _.get(options, 'pivotX', $.pivot.x)
    $.pivot.y = _.get(options, 'pivotY', $.pivot.y)
    $.skew.x = _.get(options, 'skewX', $.skew.x)
    $.skew.y = _.get(options, 'skewY', $.skew.y)
    $.rotation = _.get(options, 'rotation', $.rotation)
    $.visible = _.get(options, 'visible', $.visible)

    $.update()
  }

  detach ($) {
    this.clearSplitters()
  }

  getSplitter (side = 'r') { return this._splitters[side] }

  addSplitter (side = 'r', size = 2, color = 0xFFFFFF) {
    let s = this.getSplitter(side)
    if (!s) {
      s = new app.Rectangle()
      s.color = color
      this.$.parent.addChild(s)
      s.plug('splitter', { side, size, container: this })
      s.update()
    }
    this.$.update()
    return this
  }

  removeSplitter (side = 'r') {
    let s = this.getSplitter(side)
    if (s) {
      this.$.parent.removeChild(s)
      delete this._splitters[side]
    }
    this.$.update()
    return this
  }

  clearSplitters () {
    for (let side in this._splitters) {
      this.remove(side)
    }
    this.$.update()
    return this
  }

}
