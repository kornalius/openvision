
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'editable'
    this._desc = 'Allow container to be editable.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.1'
    this._date = '12/31/2016'
    this._deps = ['readonly']
  }

  load (obj, options = {}) {
    super.load(obj, options)
  }

  unload (obj) {
    super.unload(obj)
  }

}
