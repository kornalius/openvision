
export default class Movable extends Plugin {

  constructor () {
    super()
    this.name = 'movable'
    this.desc = 'Allow container to be moved around with the mouse.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse', 'keyboard']
    this.properties = {
      target: { value: null, options: 'target' },
    }
    this.listeners = {
      $mousemove: this.onMousemove,
    }
  }

  onMousemove (e) {
    let $ = this.$
    let info = app.mouseEvent(e)
    if (info.target === $) {
      if ($.pressed) {
        let x = info.sx - $.pressed.x
        let y = info.sy - $.pressed.y
        let t = this.target || $
        if (t.x !== x) {
          t.x = x
          t.update()
        }
        if (t.y !== y) {
          t.y = y
          t.update()
        }
      }
    }
  }

}
