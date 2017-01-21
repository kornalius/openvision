
export default class Tile extends Plugin {

  constructor () {
    super()
    this.name = 'align'
    this.desc = 'Allow layouting a container to specific areas of parent container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      layout: { value: 'h', options: 'layout' },
      zones: { value: 3, options: 'zones' },
    }
    this.listeners = {
      $childrenchange: this.exec,
    }
  }

  get isHorizontal () { return this._layout === 'h' }

  get isVertical () { return this._layout === 'v' }

  top () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.width = parent.width
      owner.height = parent.height / this._zones
      owner.x = 0
      owner.y = 0
    }
    return owner.update()
  }

  bottom () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.width = parent.width
      owner.height = parent.height / this._zones
      owner.x = 0
      owner.y = parent.height - owner.height
    }
    return owner.update()
  }

  left () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.width = parent.width / this._zones
      owner.height = parent.height
      owner.x = 0
      owner.y = 0
    }
    return owner.update()
  }

  right () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.width = parent.width / this._zones
      owner.height = parent.height
      owner.x = parent.width - owner.width
      owner.y = 0
    }
    return owner.update()
  }

  topLeft () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.width = parent.width / this._zones
      owner.height = parent.height / this._zones
      owner.x = 0
      owner.y = 0
    }
    return owner.update()
  }

  topRight () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.width = parent.width / this._zones
      owner.height = parent.height / this._zones
      owner.x = parent.width - owner.width
      owner.y = 0
    }
    return owner.update()
  }

  bottomLeft () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.width = parent.width / this._zones
      owner.height = parent.height / this._zones
      owner.x = 0
      owner.y = parent.height - owner.height
    }
    return owner.update()
  }

  bottomRight () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.width = parent.width / this._zones
      owner.height = parent.height / this._zones
      owner.x = parent.width - owner.width
      owner.y = parent.height - owner.height
    }
    return owner.update()
  }

  center () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      owner.width = parent.width / this._zones
      owner.height = parent.height / this._zones
      owner.x = parent.width / 2 - owner.width / 2
      owner.y = parent.height / 2 - owner.height / 2
    }
    return owner.update()
  }

  exec () {
    let owner = this.owner
    let parent = owner.parent
    if (parent) {
      if (this.isHorizontal) {
        let x = 0
        let w = parent.width / owner.children.count
        let h = parent.height
        for (let c of owner.children) {
          c.x = x += w
          c.y = 0
          c.width = w
          c.height = h
          c.update()
        }
      }
      else if (this.isVertical) {
        let y = 0
        let w = parent.width
        let h = parent.height / owner.children.count
        for (let c of owner.children) {
          c.x = 0
          c.y = y += h
          c.width = w
          c.height = h
          c.update()
        }
      }
    }
    return owner.update()
  }

}
