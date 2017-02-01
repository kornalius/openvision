
export default class Grid extends Plugin {

  constructor () {
    super()
    this.name = 'grid'
    this.desc = 'Align a container to a grid.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      width: { value: 8 },
      height: { value: 8 },
    }
    this.listeners = {
      $move: this.exec,
    }
  }

  exec () {
    let $ = this.$
    $.x = Math.trunc($.x / this.width)
    $.y = Math.trunc($.y / this.height)
    $.update()
    return this
  }

}
