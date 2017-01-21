
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
    this.owner.addChild(container)
    return this.owner.update()
  }

  removeSection (container) {
    this.owner.removeChild(container)
    return this.owner.update()
  }

}
