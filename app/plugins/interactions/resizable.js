
export default class Resizable extends Plugin {

  constructor () {
    super()
    this.name = 'resizable'
    this.desc = 'Allow container to be resized with the mouse.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse', 'keyboard']
  }

}
