
export default class Movable extends Plugin {

  constructor () {
    super()
    this.name = 'movable'
    this.desc = 'Allow container to be moved around with the mouse.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse', 'keyboard']
    this.listeners = {
      $mousemove: this.onMousemove,
    }
  }

  onMousemove (e) {
    let $ = this.$
    let info = app.mouseEvent(e)
    if (info.target === $) {
      if ($._pressed.down) {
        let x = info.sx - $._pressed.down.x
        let y = info.sy - $._pressed.down.y
        if ($.x !== x) {
          $.x = x
          $.update()
        }
        if ($.y !== y) {
          $.y = y
          $.update()
        }
      }
    }
  }

}
