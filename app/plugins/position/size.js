
export default class Size extends Plugin {

  constructor () {
    super()
    this.name = 'align'
    this.desc = 'Allow sizing a container to specific sizes of a parent container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
  }

  maximize () {
    let owner = this.owner
    if (owner.parent) {
      owner.x = 0
      owner.y = 0
      owner.width = owner.parent.width
      owner.height = owner.parent.height
      owner.update()
    }
    return owner
  }

  bottom () {
    let owner = this.owner
    if (owner.parent) {
      owner.height = owner.parent.height - owner.y
      owner.update()
    }
    return owner
  }

  right () {
    let owner = this.owner
    if (owner.parent) {
      owner.width = owner.parent.width - owner.x
      owner.update()
    }
    return owner
  }

  fillWidth () {
    let owner = this.owner
    if (owner.parent) {
      owner.x = 0
      owner.width = owner.parent.width
      owner.update()
    }
    return owner
  }

  fillHeight () {
    let owner = this.owner
    if (owner.parent) {
      owner.y = 0
      owner.height = owner.parent.height
      owner.update()
    }
    return owner
  }

}
