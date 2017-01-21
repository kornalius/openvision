
export default class Selectable extends Plugin {

  constructor () {
    super()
    this.name = 'selectable'
    this.desc = 'Allow container to be selected.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse', 'keyboard']
    this.properties = {
      enabled: { value: true, options: 'enabled' },
      selector: { value: null, options: 'selector' },
      selected: { value: false, options: 'selected' },
    }
    this.listeners = {
      'selected-changed': this.dispatchEvent,
    }
  }

  get canSelect () { return this._enabled && !_.isNil(this._selector) }

  dispatchEvent () {
    this.emit(this._selected ? 'select' : 'unselect')
  }

  toggle () {
    this.selected = !this._selected
  }

}
