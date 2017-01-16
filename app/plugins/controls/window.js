
export default class Window extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'window'
    this._desc = 'Allow a container to act as a window.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/15/2017'
    this._deps = ['control', 'titlebar']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._window = {
        title: _.get(options, 'title', 'Untitled'),
      }
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._window
    }
  }

}
