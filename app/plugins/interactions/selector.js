
export default class Selector extends Plugin {

  constructor () {
    super()
    this.name = 'selector'
    this.desc = 'Allow child containers to be selectable.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse', 'keyboard']
    this.properties = {
      enabled: { value: true, options: 'enabled' },
      selectables: { value: [], options: 'selectables' },
    }
  }

  add (obj) {
    if (!_.includes(this._selectables, obj)) {
      this._selectables.push(obj)
      obj._selector = this
    }
    return this
  }

  remove (obj) {
    _.pull(this._selectables, obj)
    return this
  }

  canSelect (obj) {
    return this._enabled && _.includes(this._selectables, obj) && obj.canSelect
  }

  isSelected (obj) {
    return this.canSelect(obj) && obj.selected
  }

  select (obj) {
    if (this.canSelect(obj)) {
      obj.select()
    }
    return this
  }

  unselect (obj) {
    if (this.canSelect(obj)) {
      obj.unselect()
    }
    return this
  }

  toggle (obj) {
    if (this.canSelect(obj)) {
      if (this.isSelected(obj)) {
        obj.unselect()
      }
      else {
        obj.select()
      }
    }
    return this
  }

  setSelected (obj, value) {
    if (this.canSelect(obj)) {
      obj.selected = value
    }
    return this
  }

}
