
export default class Size extends Plugin {

  constructor () {
    super()
    this.name = 'align'
    this.desc = 'Allow sizing a container to specific sizes of a parent container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
  }

  maximize () {
    let $ = this.$
    if ($.parent) {
      $.x = 0
      $.y = 0
      $.width = $.parent.width
      $.height = $.parent.height
      $.update()
    }
    return $
  }

  bottom () {
    let $ = this.$
    if ($.parent) {
      $.height = $.parent.height - $.y
      $.update()
    }
    return $
  }

  right () {
    let $ = this.$
    if ($.parent) {
      $.width = $.parent.width - $.x
      $.update()
    }
    return $
  }

  fillWidth () {
    let $ = this.$
    if ($.parent) {
      $.x = 0
      $.width = $.parent.width
      $.update()
    }
    return $
  }

  fillHeight () {
    let $ = this.$
    if ($.parent) {
      $.y = 0
      $.height = $.parent.height
      $.update()
    }
    return $
  }

}
