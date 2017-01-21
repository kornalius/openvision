
export default class Snap extends Plugin {

  constructor () {
    super()
    this.name = 'snap'
    this.desc = 'Snaps container boundaries to other containers.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      containers: { value: [], options: 'containers' },
      sides: { value: 'tlbrc', options: 'sides' },
      distance: { value: 8, options: 'distance' },
    }
  }

  get left () { return this._sides.indexOf('l') }

  get top () { return this._sides.indexOf('t') }

  get right () { return this._sides.indexOf('r') }

  get bottom () { return this._sides.indexOf('b') }

  get center () { return this._sides.indexOf('c') }

  exec () {
    let owner = this.owner
    let x = owner.x
    let y = owner.y
    let d = this._distance

    let containers = this._containers
    let hor = _.sortBy(containers, 'x')
    let ver = _.sortBy(containers, 'y')
    let horCenter = _.sortBy(containers, c => c.x + c.width / 2)
    let verCenter = _.sortBy(containers, c => c.y + c.height / 2)

    if (this.left) {
      for (let r of hor) {
        if (x <= r.x + r.width + d && x > r.x + r.width) {
          x = r.x + 1
          break
        }
      }
    }

    if (this.right) {
      for (let r of hor) {
        if (x >= r.x - d && x < r.x) {
          x = r.x - 1
          break
        }
      }
    }

    if (this.top) {
      for (let r of ver) {
        if (y <= r.y + r.width + d && y > r.y + r.width) {
          y = r.y + 1
          break
        }
      }
    }

    if (this.bottom) {
      for (let r of ver) {
        if (y >= r.y - d && y < r.y) {
          y = r.y - 1
          break
        }
      }
    }

    if (this.center) {
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

    owner.x = x
    owner.y = y

    return owner.update()
  }

}
