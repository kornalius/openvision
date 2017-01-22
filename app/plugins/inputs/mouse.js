
export default class extends Plugin {

  constructor () {
    super()
    this.name = 'mouse'
    this.desc = 'Allow container to be interacted with the mouse.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive']
    this.properties = {
      $pressed: { value: {} },
    }
    this.listeners = {
      $mousedown: this.onMousedown,
      $mousemove: this.onMousemove,
      $mouseup: this.onMouseup,
      $mouseupoutside: this.onMouseup,
    }
  }

  onMousedown (e) {
    let info = app.mouseEvent(e)
    if (info.leftButton) {
      this.$._pressed.down = info
    }
  }

  onMousemove (e) {
  }

  onMouseup (e) {
    this.$._pressed = {}
  }

}
