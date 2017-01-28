
export default class Layout extends Plugin {

  constructor () {
    super()
    this.name = 'layout'
    this.desc = 'Allow automating layouting children of a container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      enabled: { value: true, options: 'enabled', update: this.exec },
      dir: { value: true, options: 'dir', update: this.exec },
      size: { value: true, options: 'size', update: this.exec },
      wrap: { value: true, options: 'wrap', update: this.exec },
      align: { value: true, options: 'align', update: this.exec },
    }
  }

  attach ($, options) {
    this.exec()
  }

  get isHorizontal () { return this._dir === 'h' }

  get isVertical () { return this._dir === 'v' }

  create (dir = 'h', size = 0, align = 0, wrap = false) {
    this.dir = dir
    this.size = size
    this.align = align
    this.wrap = wrap
    return this.exec()
  }

  exec () {
    let x = 0
    let y = 0

    if (this.enabled) {
      for (var c of this.$.children) {
        c.x = x
        c.y = y

        if (c.layout && c.layout.enabled) {
          let size = c.layout.size

          if (this.isHorizontal && size > 0) {
          }
          else if (this.isVertical && size > 0) {
          }

          c.update()
        }

        if (this.isHorizontal) {
          x += c.width
        }
        else if (this.isVertical) {
          y += c.height
        }
      }
    }

    this.$.update()
    return this
  }

}
