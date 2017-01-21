
export default class Align extends Plugin {

  constructor () {
    super()
    this.name = 'align'
    this.desc = 'Allow aligning a container to specific areas of parent container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
  }

  top () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.y = 0
    }
    return owner.update()
  }

  bottom () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.y = parent.height - owner.height
    }
    return owner.update()
  }

  left () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.x = 0
    }
    return owner.update()
  }

  right () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.x = parent.width - owner.width
    }
    return owner.update()
  }

  topLeft () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.x = 0
      owner.y = 0
    }
    return owner.update()
  }

  topRight () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.x = parent.width - owner.width
      owner.y = 0
    }
    return owner.update()
  }

  bottomLeft () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.x = 0
      owner.y = parent.height - owner.height
    }
    return owner.update()
  }

  bottomRight () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.x = parent.width - owner.width
      owner.y = parent.height - owner.height
    }
    return owner.update()
  }

  vcenter () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.y = parent.height / 2 - owner.height / 2
    }
    return owner.update()
  }

  hcenter () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.x = parent.width / 2 - owner.width / 2
    }
    return owner.update()
  }

  center () {
    this.vcenter()
    return this.hcenter()
  }

}
