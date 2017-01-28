
export default class List extends Plugin {

  constructor () {
    super()
    this.name = 'list'
    this.desc = 'Allow a container to act as a list.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['control', 'scrollable']
    this.properties = {
      layout: { value: 'v', options: true },
      maxWidth: { value: -1, options: true },
      maxHeight: { value: -1, options: true },
    }
    this.listeners = {
      $childrenchange: this.positionItems,
    }

    app.List = (options = {}) => {
      let l = new app.Rectangle(_.get(options, 'width', 200), _.get(options, 'height', 150))
      // l.fill = _.get(options, 'fill', false)
      l.color = _.get(options, 'color', 0x000000)
      l.borderColor = _.get(options, 'borderColor', 0xFFFFFF)
      l.borderAlpha = _.get(options, 'borderAlpha', 1)
      l.borderSize = _.get(options, 'borderSize', 0.5)
      l.plug('list', options)
      return l
    }
  }

  attach ($, options = {}) {
    this.positionItems()
  }

  detach ($) {
  }

  positionItems () {
    let horizontal = this.layout === 'h'
    let vertical = this.layout === 'v'

    let w = 0
    let h = 0
    for (let c of this.$.children) {
      if (!c.isMask) {
        if (horizontal && c.height > h) {
          h = c.height
        }
        else if (vertical && c.width > w) {
          w = c.width
        }
      }
    }

    let x = 0
    let y = 0
    let mw = this.maxWidth
    let mh = this.maxHeight
    for (let c of this.$.children) {
      if (!c.isMask) {
        if (horizontal) {
          let nx = x + c.width
          if (mw !== -1 && nx > mw) {
            x = nx = 0
            y += h
          }
          c.x = x
          c.y = y
          x = nx
        }
        else if (vertical) {
          let ny = y + c.height
          if (mh !== -1 && ny > mh) {
            x += w
            y = ny = 0
          }
          c.x = x
          c.y = y
          y = ny
        }
        c.update()
      }
    }

    if (this.$.hasPlugin('scrollable')) {
      if (horizontal) {
        this.$.__scrollable.width = x
        this.$.__scrollable.height = h
      }
      else if (vertical) {
        this.$.__scrollable.width = w
        this.$.__scrollable.height = y
      }
    }

    this.$.update()
    return this
  }

}
