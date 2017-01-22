
export default class Bar extends Plugin {

  constructor () {
    super()
    this.name = 'bar'
    this.desc = 'Container that has sections.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['control', 'layout']
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
