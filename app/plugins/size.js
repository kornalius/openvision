
export default class Size extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'align'
    this._desc = 'Allow sizing a container to specific sizes of a parent container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/12/2017'
  }

  load (obj, options) {
    if (super.load(obj, options)) {
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
    }
  }

  maximize () {
    if (this.parent) {
      this.x = 0
      this.y = 0
      this.width = this.parent.width
      this.height = this.parent.height
      this.update()
    }
    return this
  }

  resizeToBottom () {
    if (this.parent) {
      this.height = this.parent.height - this.y
      this.update()
    }
    return this
  }

  resizeToRight () {
    if (this.parent) {
      this.width = this.parent.width - this.x
      this.update()
    }
    return this
  }

  resizeToFullWidth () {
    if (this.parent) {
      this.x = 0
      this.width = this.parent.width
      this.update()
    }
    return this
  }

  resizeToFullHeight () {
    if (this.parent) {
      this.y = 0
      this.height = this.parent.height
      this.update()
    }
    return this
  }

}
