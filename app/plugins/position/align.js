
export default class Align extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'align'
    this._desc = 'Allow aligning a container to specific areas of parent container.'
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

  alignTop () {
    if (this.parent) {
      this.y = 0
      this.update()
    }
    return this
  }

  alignBottom () {
    if (this.parent) {
      this.y = this.parent.height - this.height
      this.update()
    }
    return this
  }

  alignLeft () {
    if (this.parent) {
      this.x = 0
      this.update()
    }
    return this
  }

  alignRight () {
    if (this.parent) {
      this.x = this.parent.width - this.width
      this.update()
    }
    return this
  }

  alignTopLeft () {
    if (this.parent) {
      this.x = 0
      this.y = 0
      this.update()
    }
    return this
  }

  alignTopRight () {
    if (this.parent) {
      this.x = this.parent.width - this.width
      this.y = 0
      this.update()
    }
    return this
  }

  alignBottomLeft () {
    if (this.parent) {
      this.x = 0
      this.y = this.parent.height - this.height
      this.update()
    }
    return this
  }

  alignBottomRight () {
    if (this.parent) {
      this.x = this.parent.width - this.width
      this.y = this.parent.height - this.height
      this.update()
    }
    return this
  }

  centerVertical () {
    if (this.parent) {
      this.y = this.parent.height / 2 - this.height / 2
      this.update()
    }
    return this
  }

  centerHorizontal () {
    if (this.parent) {
      this.x = this.parent.width / 2 - this.width / 2
      this.update()
    }
    return this
  }

  center () {
    this.centerVertical()
    this.centerHorizontal()
    return this
  }

}
