
export default class Layout extends Plugin {

  constructor () {
    super()
    this.name = 'layout'
    this.desc = 'Allow automating layouting children of a container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = []
    this.properties = {
      enabled: { value: true, options: true, update: this.layout },
      dir: { value: 'v', options: true, update: this.layout },
      size: { value: true, options: true, update: this.layout },
      wrap: { value: { width: Number.MAX_SAFE_INTEGER, height: 180, padding: 8 }, options: true, update: this.layout },
      align: { value: true, options: true, update: this.layout },
    }
  }

  attach ($, options) {
    this.layout()
  }

  get horizontal () { return this.dir === 'h' }

  get vertical () { return this.dir === 'v' }

  create (dir = 'h', size = 0, align = 0, wrap) {
    this._dir = dir
    this._size = size
    this._align = align
    this._wrap = wrap
    return this.layout()
  }

  layout () {
    if (this.enabled) {
      let $ = this.$

      let topPadding = $.topPadding
      let leftPadding = $.leftPadding

      let horizontal = this.horizontal
      let vertical = this.vertical

      let x = leftPadding
      let y = topPadding

      let wrapWidth = _.get(this, 'wrap.width', Number.MAX_SAFE_INTEGER)
      let wrapHeight = _.get(this, 'wrap.height', Number.MAX_SAFE_INTEGER)
      let wrapPadding = _.get(this, 'wrap.padding', 0)

      let group = []

      debugger;

      let nx
      let ny
      let w
      let h
      for (let c of $.children) {
        if (!c.isMask) {
          if (vertical) {
            ny = y + c.height
            if (wrapHeight !== -1 && ny > wrapHeight) {
              w = 0
              for (let gc of group) {
                if (!gc.isMask && gc.width > w) {
                  w = gc.width
                }
              }
              x += w + wrapPadding
              y = topPadding
              ny = y + c.height
              group = []
            }
            y = ny
          }

          else if (horizontal) {
            nx = x + c.width
            if (wrapWidth !== -1 && nx > wrapWidth) {
              h = 0
              for (let gc of group) {
                if (!gc.isMask && gc.height > h) {
                  h = gc.height
                }
              }
              x = leftPadding
              nx = x + c.width
              y += h + wrapPadding
              group = []
            }
            x = nx
          }

          group.push(c)

          c.x = x
          c.y = y
          c.update()
        }
      }

      $.update()
    }

    return this
  }

}
