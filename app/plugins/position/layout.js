
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
      size: { value: { width: 0, height: 0 }, options: true, update: this.layout },
      wrap: { value: 180, options: true, update: this.layout },
      align: { value: undefined, options: true, update: this.layout },
      grow: { value: { width: 0, height: 0 }, options: true, update: this.layout },
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

      let leftPadding = $.leftPadding
      let topPadding = $.topPadding
      let rightPadding = $.rightPadding
      let bottomPadding = $.bottomPadding

      let horizontal = this.horizontal

      let maxWidth = $.maxWidth
      let maxHeight = $.maxHeight

      // sort by children order
      let children = _.sortBy(_.filter($.children, c => !c.isMask), '__layout.order')

      // resize children with .size
      for (let c of children) {
        let sz = _.get(c, '__layout.size.width')
        if (_.isNumber(sz)) {
          c.width = $.relWidth(sz)
        }
        sz = _.get(c, '__layout.size.height')
        if (_.isNumber(sz)) {
          c.height = $.relHeight(sz)
        }
      }

      // get remaining space
      let widthLeft = $.innerWidth
      let heightLeft = $.innerHeight
      for (let c of children) {
        widthLeft -= c.width
        heightLeft -= c.height
      }

      // shrink children when container not wrapping
      if (horizontal && widthLeft < 0 && !this.wrap) {
        let to_shink = _.filter(children, c => _.get(c, '__layout.shrink.width') || _.get(c, '__layout.shrink.height'))
        let distWidth = widthLeft / _.reduce(to_shink, (sum, c) => sum + _.get(c, '__layout.shrink.width'))
        let distHeight = heightLeft / _.reduce(to_shink, (sum, c) => sum + _.get(c, '__layout.shrink.height'))
        for (let c of to_shink) {
          let sz = distWidth * _.get(c, '__layout.grow.width', 0)
          c.width = sz
          widthLeft -= sz

          sz = distHeight * _.get(c, '__layout.grow.height', 0)
          c.height = sz
          heightLeft -= sz
        }
      }

      // grow children
      let to_grow = _.filter(children, c => _.get(c, '__layout.grow.width') || _.get(c, '__layout.grow.height'))
      let distWidth = widthLeft / _.reduce(to_grow, (sum, c) => sum + _.get(c, '__layout.grow.width'))
      let distHeight = heightLeft / _.reduce(to_grow, (sum, c) => sum + _.get(c, '__layout.grow.height'))
      for (let c of to_grow) {
        let sz = distWidth * _.get(c, '__layout.grow.width', 0)
        c.width = sz
        widthLeft -= sz

        sz = distHeight * _.get(c, '__layout.grow.height', 0)
        c.height = sz
        heightLeft -= sz
      }

      // distribute space left to children
      let to_dist = _.filter(children, c => !_.includes(to_grow, c))
      distWidth = widthLeft / to_dist.length
      distHeight = heightLeft / to_dist.length
      for (let c of to_dist) {
        c.width += distWidth
        c.height += distHeight
      }

      // align children

      // group children by align
      let start_group = _.filter(children, c => _.get(c, '__layout.align', 'start') === 'start')
      let center_group = _.filter(children, c => _.get(c, '__layout.align') === 'center')
      let end_group = _.filter(children, c => _.get(c, '__layout.align') === 'end')

      // start group
      let cur = horizontal ? leftPadding : topPadding
      for (let c of start_group) {
        if (horizontal) {
          c.x = cur
          cur += c.width
        }
        else {
          c.y = cur
          cur += c.height
        }
      }

      // center group
      cur = (horizontal ? $.innerWidth : $.innerHeight) / 2
      cur -= _.reduce(center_group, (sum, c) => sum + (horizontal ? c.width : c.height)) / 2
      for (let c of center_group) {
        if (horizontal) {
          c.x = cur
          cur += c.width
        }
        else {
          c.y = cur
          cur += c.height
        }
      }

      // end group
      cur = horizontal ? rightPadding : bottomPadding
      for (let c of end_group) {
        if (horizontal) {
          c.x = cur - c.width
          cur = c.x
        }
        else {
          c.y = cur - c.height
          cur = c.y
        }
      }

      // position children
      let x = leftPadding
      let y = topPadding
      let wrap = $.parent.relWidth(this.wrap || Number.MAX_SAFE_INTEGER)
      let group = []
      let nx
      let ny
      for (let c of $.children) {
        if (!c.isMask) {
          if (c.hasPlugin('layout')) {
            c.__layout.layout()
          }

          if (horizontal) {
            nx = x + c.width
            if (nx > wrap) {
              x = leftPadding
              y += app.maxChildrenHeight(group)
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
              x += app.maxChildrenWidth(group)
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
    }

    return this
  }

}
