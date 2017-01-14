
export default class Scrollable extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'scrollable'
    this._desc = 'Allow container to be scrolled around.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/07/2017'
    this._deps = ['interactive', 'mouse', 'keyboard']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._scrollTop = _.get(options, 'scrollTop', 0)
      obj._scrollLeft = _.get(options, 'scrollLeft', 0)
      obj._scrollWidth = _.get(options, 'scrollWidth', 0)
      obj._scrollHeight = _.get(options, 'scrollHeight', 0)
      obj._scrollStepX = _.get(options, 'scrollStepX', 1)
      obj._scrollStepY = _.get(options, 'scrollStepY', 1)
      obj.on('scroll', this.onScroll)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._scrollTop
      delete obj._scrollLeft
      delete obj._scrollWidth
      delete obj._scrollHeight
      delete obj._scrollStepX
      delete obj._scrollStepY
      obj.off('scroll', this.onScroll)
    }
  }

  scroll () {
    for (let c of this.children) {
      c.update()
    }
    this.update()
  }

  get scrollHorizontal () { return this._scrollStepX > 0 }
  set scrollHorizontal (value) {
    this._scrollStepX = value ? 1 : 0
  }

  get scrollVertical () { return this._scrollStepY > 0 }
  set scrollVertical (value) {
    this._scrollStepY = value ? 1 : 0
  }

  get scrollTop () { return this._scrollTop }
  set scrollTop (value) {
    this._scrollTop = _.clamp(value, 0, this._scrollHeight)
    this.scroll()
  }

  get scrollLeft () { return this._scrollLeft }
  set scrollLeft (value) {
    this._scrollLeft = _.clamp(value, 0, this._scrollWidth)
    this.scroll()
  }

  get scrollWidth () { return this._scrollWidth }
  set scrollWidth (value) {
    this._scrollWidth = value
    this._scrollLeft = _.clamp(value, 0, this._scrollWidth)
    this.scroll()
  }

  get scrollHeight () { return this._scrollHeight }
  set scrollHeight (value) {
    this._scrollHeight = value
    this._scrollTop = _.clamp(value, 0, this._scrollHeight)
    this.scroll()
  }

  get scrollStepX () { return this._scrollStepX }
  set scrollStepX (value) {
    this._scrollStepX = _.clamp(value, 0, this._scrollWidth)
    this.scroll()
  }

  get scrollStepY () { return this._scrollStepY }
  set scrollStepY (value) {
    this._scrollStepY = _.clamp(value, 0, this._scrollHeight)
    this.scroll()
  }

  onScroll (detail) {
    // console.log(detail)
  }

}
