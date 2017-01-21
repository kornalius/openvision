
export default class Scrollable extends Plugin {

  constructor () {
    super()
    this.name = 'scrollable'
    this.desc = 'Allow container to be scrolled around.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse', 'keyboard']
    this.properties = {
      top: { value: 0, options: 'top', update: this.scroll },
      left: { value: 0, options: 'left', update: this.scroll },
      width: { value: 0, options: 'width', update: this.scroll },
      height: { value: 0, options: 'height', update: this.scroll },
      stepX: { value: 1, options: 'stepX', update: this.scroll },
      stepY: { value: 1, options: 'stepY', update: this.scroll },
    }
    this.listeners = {
      $scroll: this.onScroll,
    }
  }

  scroll () {
    for (let c of this.owner.children) {
      c.update()
    }
    return this.owner.update()
  }

  get scrollHorizontal () { return this._stepX > 0 }
  set scrollHorizontal (value) {
    this._stepX = value ? 1 : 0
  }

  get scrollVertical () { return this._stepY > 0 }
  set scrollVertical (value) {
    this._stepY = value ? 1 : 0
  }

  onScroll (detail) {
    // console.log(detail)
  }

}
