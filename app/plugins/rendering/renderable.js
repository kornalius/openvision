
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'renderable'
    this._desc = 'Allow to customize the rendering of a container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/13/2016'
  }

  load (obj, options = {}) {
    super.load(obj, options)
  }

  unload (obj) {
    super.unload(obj)
  }

  render () {

  }

}
