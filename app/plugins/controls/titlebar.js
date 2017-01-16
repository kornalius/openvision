
export default class Titlebar extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'titlebar'
    this._desc = 'Container is a window\'s title bar.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/15/2017'
    this._deps = ['bar']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._titlebar = {
        title: _.get(options, 'title', 'Untitled'),
      }
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._titlebar
    }
  }

}
