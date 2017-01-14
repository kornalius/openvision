
export default class Snap extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'snap'
    this._desc = 'Snaps container boundaries to other containers.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/12/2017'
  }

  load (obj, options) {
    if (super.load(obj, options)) {
      obj._snapContainers = _.get(options, 'containers', [])
      obj._snapSides = _.get(options, 'sides', 'tlbrc')
      obj._snapDistance = _.get(options, 'distance', 8)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._snapContainers
      delete obj._snapSides
      delete obj._snapDistance
    }
  }

  get snapContainers () { return this._snapContainers }

  get snapSides () { return this._snapSides }
  set snapSides (value) { this._snapSides = value }

  get snapDistance () { return this._snapDistance }
  set snapDistance (value) { this._snapDistance = value }

  get snapLeft () { return this._snapSides.indexOf('l') }
  get snapTop () { return this._snapSides.indexOf('t') }
  get snapRight () { return this._snapSides.indexOf('r') }
  get snapBottom () { return this._snapSides.indexOf('b') }
  get snapCenter () { return this._snapSides.indexOf('c') }

  snap () {
    let x = this.x
    let y = this.y
    let d = this._snapDistance

    let containers = this._snapContainers
    let hor = _.sortBy(containers, 'x')
    let ver = _.sortBy(containers, 'y')
    let horCenter = _.sortBy(containers, c => c.x + c.width / 2)
    let verCenter = _.sortBy(containers, c => c.y + c.height / 2)

    if (this.snapLeft) {
      for (let r of hor) {
        if (x <= r.x + r.width + d && x > r.x + r.width) {
          x = r.x + 1
          break
        }
      }
    }

    if (this.snapRight) {
      for (let r of hor) {
        if (x >= r.x - d && x < r.x) {
          x = r.x - 1
          break
        }
      }
    }

    if (this.snapTop) {
      for (let r of ver) {
        if (y <= r.y + r.width + d && y > r.y + r.width) {
          y = r.y + 1
          break
        }
      }
    }

    if (this.snapBottom) {
      for (let r of ver) {
        if (y >= r.y - d && y < r.y) {
          y = r.y - 1
          break
        }
      }
    }

    if (this.snapCenter) {
      for (let r of horCenter) {
        let rx = r.x + r.width / 2
        if (x >= rx - d && x <= rx + d) {
          x = rx
          break
        }
      }

      for (let r of verCenter) {
        let ry = r.y + r.height / 2
        if (y >= ry - d && y <= ry + d) {
          y = ry
          break
        }
      }
    }

    this.x = x
    this.y = y

    return this.update()
  }

}
