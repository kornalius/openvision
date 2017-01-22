
export default class Align extends Plugin {

  constructor () {
    super()
    this.name = 'align'
    this.desc = 'Allow aligning a container to specific areas of parent container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
  }

  top () {
    let parent = this.$.parent
    if (parent) {
      this.$.y = 0
    }
    this.$.update()
    return this
  }

  bottom () {
    let parent = this.$.parent
    if (parent) {
      this.$.y = parent.height - this.$.height
    }
    this.$.update()
    return this
  }

  left () {
    let parent = this.$.parent
    if (parent) {
      this.$.x = 0
    }
    this.$.update()
    return this
  }

  right () {
    let parent = this.$.parent
    if (parent) {
      this.$.x = parent.width - this.$.width
    }
    this.$.update()
    return this
  }

  topLeft () {
    let parent = this.$.parent
    if (parent) {
      this.$.x = 0
      this.$.y = 0
    }
    this.$.update()
    return this
  }

  topRight () {
    let parent = this.$.parent
    if (parent) {
      this.$.x = parent.width - this.$.width
      this.$.y = 0
    }
    this.$.update()
    return this
  }

  bottomLeft () {
    let parent = this.$.parent
    if (parent) {
      this.$.x = 0
      this.$.y = parent.height - this.$.height
    }
    this.$.update()
    return this
  }

  bottomRight () {
    let parent = this.$.parent
    if (parent) {
      this.$.x = parent.width - this.$.width
      this.$.y = parent.height - this.$.height
    }
    this.$.update()
    return this
  }

  vcenter () {
    let parent = this.$.parent
    if (parent) {
      this.$.y = parent.height / 2 - this.$.height / 2
    }
    this.$.update()
    return this
  }

  hcenter () {
    let parent = this.$.parent
    if (parent) {
      this.$.x = parent.width / 2 - this.$.width / 2
    }
    this.$.update()
    return this
  }

  center () {
    this.vcenter()
    return this.hcenter()
  }

}
