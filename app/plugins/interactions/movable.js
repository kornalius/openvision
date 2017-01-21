
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
    let owner = this.owner
    let info = app.mouseEvent(e)
    if (info.target === owner) {
      if (owner._pressed.down) {
        let x = info.sx - owner._pressed.down.x
        let y = info.sy - owner._pressed.down.y
        if (owner.x !== x) {
          owner.x = x
          owner.update()
        }
        if (owner.y !== y) {
          owner.y = y
          owner.update()
        }
      }
    }
  }

}
