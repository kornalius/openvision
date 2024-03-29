
export default class List extends Plugin {

  constructor () {
    super()
    this.name = 'list'
    this.desc = 'Allow a container to act as a list.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['control', 'scrollable', 'flow', 'font']
    this.properties = {
      items: { value: [], update: this.updateItems },
    }

    app.List = (options = {}) => {
      let l = new app.Rectangle(_.get(options, 'width', 200), _.get(options, 'height', 150))
      l.color = _.get(options, 'color', 0x000000)
      l.borderColor = _.get(options, 'borderColor', 0xFFFFFF)
      l.borderAlpha = _.get(options, 'borderAlpha', 1)
      l.borderSize = _.get(options, 'borderSize', 0.5)
      l.plug('list', options)
      return l
    }
  }

  attach ($, options = {}) {
    this._flow = $.__flow.reflow.bind($.__flow)
    $.on('childrenchange', this._flow)
  }

  detach ($) {
    $.off('childrenchange', this._flow)
  }

  updateItems () {
    let $ = this.$

    $.off('childrenchange', this._flow)

    for (let c of _.clone($.children)) {
      if (!c.isMask) {
        $.removeChild(c)
        c.destroy()
      }
    }

    let f = $.__font

    for (let i of this.items) {
      $.addChild($t('text', i, { fontSize: f.size, fontFamily: f.name, fill: f.color }))
    }

    $.on('childrenchange', this._flow)

    this._flow()

    return this
  }

}
