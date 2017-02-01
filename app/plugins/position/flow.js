
export default class Flow extends Plugin {

  constructor () {
    super()
    this.name = 'flow'
    this.desc = 'Position children of a container in a specific direction.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = []
    this.properties = {
      dir: { value: 'v', update: this.reflow },
      wrap: { value: 180, update: this.reflow },
    }
  }

  attach ($, options) {
    this.reflow()
  }

  get horizontal () { return this.dir === 'h' }

  get vertical () { return this.dir === 'v' }

  reflow () {
    let $ = this.$

    let leftPadding = $.leftPadding
    let topPadding = $.topPadding

    let horizontal = this.horizontal

    // position children
    let x = leftPadding
    let y = topPadding
    let wrap = $.relWidth(this.wrap || Number.MAX_SAFE_INTEGER)
    let group = []
    let nx
    let ny
    for (let c of $.children) {
      if (!c.isMask) {
        if (c.hasPlugin('flow')) {
          c.__flow.reflow()
        }

        if (horizontal) {
          nx = x + c.width
          if (nx > wrap) {
            x = leftPadding
            y += app.maxChildrenHeight(group).height
            nx = x + c.width
            group = []
          }
          c.x = x
          c.y = y
          x = nx
        }

        else {
          ny = y + c.height
          if (ny > wrap) {
            x += app.maxChildrenWidth(group).width
            y = topPadding
            ny = y + c.height
            group = []
          }
          c.x = x
          c.y = y
          y = ny
        }

        group.push(c)

        c.update()
      }
    }

    $.update()

    return this
  }

}
