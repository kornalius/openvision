
export default class Bar extends Plugin {

  constructor () {
    super()
    this.name = 'bar'
    this.desc = 'Container that has sections.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['control', 'flow']

    app.Bar = (options = {}) => {
      let b = new app.Rectangle(_.get(options, 'width', 0), _.get(options, 'height', 24))
      b.fill = _.get(options, 'fill', true)
      b.color = _.get(options, 'color', 0xb3b3b3)
      b.borderColor = _.get(options, 'borderColor', 0xFFFFFF)
      b.borderAlpha = _.get(options, 'borderAlpha', 1)
      b.borderSize = _.get(options, 'borderSize', 0.5)
      b.plug('bar', options)
      return b
    }
  }

  addSection (container) {
    this.$.addChild(container)
    this.$.update()
    return this
  }

  removeSection (container) {
    this.$.removeChild(container)
    this.$.update()
    return this
  }

}
