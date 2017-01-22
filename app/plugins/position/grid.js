
export default class Grid extends Plugin {

  constructor () {
    super()
    this.name = 'grid'
    this.desc = 'Align a container to a grid.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      width: { value: 8, options: 'width' },
      height: { value: 8, options: 'height' },
    }
  }

  exec () {
    this.$.x = Math.trunc(this.$.x / this.width)
    this.$.y = Math.trunc(this.$.y / this.height)
    this.$.update()
    return this
  }

}
